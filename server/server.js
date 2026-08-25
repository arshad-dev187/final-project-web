import 'dotenv/config';
import express from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/*
|--------------------------------------------------------------------------
| Environment
|--------------------------------------------------------------------------
*/

const rootEnv = path.resolve(__dirname, '../.env');

if (!process.env.DB_NAME) {
  const dotenv = await import('dotenv');
  dotenv.config({ path: rootEnv });
}

const app = express();

const port = Number(process.env.PORT) || 5000;

const clientUrl =
  process.env.CLIENT_URL ||
  'https://green-ground-cafe.vercel.app';

const TAX_RATE = 0;

/*
|--------------------------------------------------------------------------
| Upload directory
|--------------------------------------------------------------------------
*/

const uploadDir = path.join(__dirname, 'uploads');

fs.mkdirSync(uploadDir, {
  recursive: true
});

/*
|--------------------------------------------------------------------------
| Environment validation
|--------------------------------------------------------------------------
*/

const requiredProductionEnv = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET'
];

if (process.env.NODE_ENV === 'production') {
  const missing = requiredProductionEnv.filter(
    (key) => !process.env[key]
  );

  if (missing.length > 0) {
    console.error(
      `Missing required production environment variables: ${missing.join(', ')}`
    );

    process.exit(1);
  }
}

/*
|--------------------------------------------------------------------------
| MySQL connection pool
|--------------------------------------------------------------------------
*/

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'green_grounds_cafe',
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true
};

/*
 * Only enable SSL when explicitly requested.
 *
 * This is useful because local XAMPP/MySQL normally does not use SSL,
 * while many cloud MySQL providers do.
 */
if (
  process.env.DB_SSL === 'true' ||
  process.env.NODE_ENV === 'production'
) {
  dbConfig.ssl = {
    rejectUnauthorized: false
  };
}

const pool = mysql.createPool(dbConfig);

/*
|--------------------------------------------------------------------------
| Database startup check
|--------------------------------------------------------------------------
*/

try {
  console.log('Connecting to MySQL...');
  console.log(`Database host: ${dbConfig.host}`);
  console.log(`Database port: ${dbConfig.port}`);
  console.log(`Database name: ${dbConfig.database}`);
  console.log(`Database user: ${dbConfig.user}`);

  await pool.query('SELECT 1');

  console.log('MySQL database connection successful.');
} catch (error) {
  console.error('========================================');
  console.error('MYSQL CONNECTION FAILED');
  console.error('========================================');
  console.error('Message:', error.message);
  console.error('Code:', error.code);
  console.error('Errno:', error.errno);
  console.error('SQL State:', error.sqlState);
  console.error('========================================');

  process.exit(1);
}

/*
|--------------------------------------------------------------------------
| Reviews table
|--------------------------------------------------------------------------
*/

try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      customer_name VARCHAR(120) NOT NULL,
      rating TINYINT UNSIGNED NOT NULL,
      review_text TEXT NOT NULL,
      status ENUM('pending','approved') NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_reviews_status (status),
      INDEX idx_reviews_created (created_at)
    )
  `);

  console.log('Reviews table checked successfully.');
} catch (error) {
  console.error('Failed to initialize reviews table.');
  console.error(error);
  process.exit(1);
}

/*
|--------------------------------------------------------------------------
| Security middleware
|--------------------------------------------------------------------------
*/

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin'
    },

    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),

        'img-src': [
          "'self'",
          'data:',
          'blob:',
          clientUrl,
          'https://green-ground-cafe.vercel.app'
        ]
      }
    }
  })
);

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

const allowedOrigins = [
  'https://green-ground-cafe.vercel.app',
  clientUrl,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      /*
       * Requests without an Origin header can be allowed.
       *
       * For this project, unknown browser origins are also allowed so
       * deployment does not get blocked by CORS. Authentication still
       * requires the HTTP-only cookie.
       */
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(null, true);
    },

    credentials: true
  })
);

/*
|--------------------------------------------------------------------------
| Body / cookies / uploads
|--------------------------------------------------------------------------
*/

app.use(
  express.json({
    limit: '1mb'
  })
);

app.use(cookieParser());

app.use(
  '/uploads',
  express.static(uploadDir)
);

app.use(
  '/api/auth/login',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true
  })
);

/*
|--------------------------------------------------------------------------
| Multer
|--------------------------------------------------------------------------
*/

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,

    filename: (_req, file, cb) => {
      cb(
        null,
        `${crypto.randomUUID()}${path
          .extname(file.originalname)
          .toLowerCase()}`
      );
    }
  }),

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new multer.MulterError(
          'LIMIT_UNEXPECTED_FILE',
          'image'
        )
      );
    }

    cb(null, true);
  }
});

const reviewUpload = upload.fields([
  {
    name: 'reviewer_image',
    maxCount: 1
  },
  {
    name: 'review_image',
    maxCount: 1
  }
]);

const complaintUpload = upload.single('image');

/*
|--------------------------------------------------------------------------
| File helpers
|--------------------------------------------------------------------------
*/

const removeUploaded = (filePath) => {
  if (!filePath) return;

  const filename = path.basename(filePath);
  const target = path.join(uploadDir, filename);

  if (
    target.startsWith(uploadDir) &&
    fs.existsSync(target)
  ) {
    try {
      fs.unlinkSync(target);
    } catch (error) {
      console.error(
        'Failed to remove uploaded file:',
        error.message
      );
    }
  }
};

/*
|--------------------------------------------------------------------------
| Validation schemas
|--------------------------------------------------------------------------
*/

const optField = (schema) =>
  z.preprocess(
    (v) =>
      v === '' ||
      v === null ||
      v === undefined
        ? undefined
        : v,
    schema.optional()
  );

const productSchema = z
  .object({
    name: z.string().trim().min(2).max(140),

    description: z
      .string()
      .trim()
      .min(5),

    price: z.coerce.number().positive(),

    discount_price: optField(
      z.coerce.number().nonnegative()
    ),

    category_id: z.coerce
      .number()
      .int()
      .positive(),

    available: z.coerce
      .boolean()
      .default(true),

    featured: z.coerce
      .boolean()
      .default(false),

    serving_size: optField(
      z.string().trim().max(80)
    ),

    calories: optField(
      z.coerce.number().int().nonnegative()
    ),

    protein: optField(
      z.coerce.number().nonnegative()
    ),

    carbohydrates: optField(
      z.coerce.number().nonnegative()
    ),

    fat: optField(
      z.coerce.number().nonnegative()
    ),

    sugar: optField(
      z.coerce.number().nonnegative()
    ),

    sodium: optField(
      z.coerce.number().int().nonnegative()
    )
  })
  .refine(
    (data) =>
      data.discount_price === undefined ||
      data.discount_price < data.price,
    {
      message:
        'Discounted price must be lower than the regular price.'
    }
  );

const dbValue = (value) =>
  value === undefined ? null : value;

const categorySchema = z.object({
  name: z.string().trim().min(2).max(80),

  description: z
    .string()
    .trim()
    .max(255)
    .optional()
    .default('')
});

const teamSchema = z.object({
  name: z.string().trim().min(2),
  role: z.string().trim().min(2),
  bio: z.string().trim().min(5)
});

const gallerySchema = z.object({
  title: z.string().trim().min(2),

  description: z
    .string()
    .trim()
    .max(255)
    .optional()
    .default('')
});

const messageSchema = z.object({
  name: z.string().trim().min(2),

  email: z.string().email(),

  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .default(''),

  subject: z.string().trim().min(2),

  message: z
    .string()
    .trim()
    .min(10)
});

const complaintSchema = z.object({
  customer_name: z
    .string()
    .trim()
    .min(2)
    .max(120),

  email: optField(
    z.string().email()
  ),

  phone: optField(
    z.string().trim().max(40)
  ),

  category: z.enum([
    'Food / Product',
    'Service',
    'Staff',
    'Order',
    'Cleanliness',
    'Other'
  ]),

  message: z
    .string()
    .trim()
    .min(5)
});

const complaintAdminSchema = z.object({
  status: z.enum([
    'pending',
    'in_progress',
    'resolved',
    'rejected'
  ]),

  admin_note: optField(
    z.string().trim().max(2000)
  )
});

const reviewSchema = z.object({
  customer_name: z
    .string()
    .trim()
    .min(2)
    .max(120),

  rating: z.coerce
    .number()
    .int()
    .min(1)
    .max(5),

  review_text: z
    .string()
    .trim()
    .min(5),

  product_id: optField(
    z.coerce.number().int().positive()
  )
});

const adminReviewSchema =
  reviewSchema.extend({
    status: z.enum([
      'pending',
      'approved'
    ]).default('pending')
  });

const addonSchema = z.object({
  name: z.string().trim().min(1).max(80),

  price: z.coerce
    .number()
    .nonnegative(),

  available: z.coerce
    .boolean()
    .default(true)
});

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const sendError = (
  res,
  status,
  message
) =>
  res
    .status(status)
    .json({ message });

const asyncRoute =
  (handler) =>
  (req, res, next) =>
    Promise.resolve(
      handler(req, res, next)
    ).catch(next);

const signToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email
    },
    process.env.JWT_SECRET || 'secret',
    {
      expiresIn: '2h'
    }
  );

const requireAuth = (
  req,
  res,
  next
) => {
  try {
    const token =
      req.cookies.admin_token;

    if (!token) {
      return sendError(
        res,
        401,
        'Authentication required.'
      );
    }

    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    );

    next();
  } catch {
    return sendError(
      res,
      401,
      'Session expired.'
    );
  }
};

const parseBody = (
  schema,
  req,
  res
) => {
  const result =
    schema.safeParse(req.body);

  if (!result.success) {
    console.error(
      'Validation error:',
      result.error.issues
    );

    sendError(
      res,
      400,
      'Please check the submitted fields.'
    );

    return null;
  }

  return result.data;
};

const imagePath = (req) =>
  req.file
    ? `/uploads/${req.file.filename}`
    : null;

const ensureCategory = async (
  categoryId
) => {
  const [rows] =
    await pool.query(
      'SELECT id FROM categories WHERE id = ? LIMIT 1',
      [categoryId]
    );

  return Boolean(rows[0]);
};

/*
|--------------------------------------------------------------------------
| Health
|--------------------------------------------------------------------------
*/

app.get(
  '/api/health',
  (_req, res) =>
    res.json({
      status: 'ok'
    })
);

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

app.post(
  '/api/auth/login',
  asyncRoute(async (req, res) => {
    const body = z
      .object({
        email: z.string().email(),
        password: z.string().min(1)
      })
      .safeParse(req.body);

    if (!body.success) {
      return sendError(
        res,
        400,
        'Enter a valid email and password.'
      );
    }

    const [rows] =
      await pool.query(
        'SELECT id, name, email, password, role FROM users WHERE email = ? LIMIT 1',
        [body.data.email]
      );

    if (
      !rows[0] ||
      !(await bcrypt.compare(
        body.data.password,
        rows[0].password
      ))
    ) {
      return sendError(
        res,
        401,
        'Invalid login credentials.'
      );
    }

    const {
      password,
      ...safeUser
    } = rows[0];

    res.cookie(
      'admin_token',
      signToken(safeUser),
      {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge:
          2 * 60 * 60 * 1000,
        path: '/'
      }
    );

    res.json({
      user: safeUser
    });
  })
);

app.post(
  '/api/auth/logout',
  (_req, res) => {
    res.clearCookie(
      'admin_token',
      {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        path: '/'
      }
    );

    res.json({
      message: 'Logged out.'
    });
  }
);

app.get(
  '/api/auth/me',
  requireAuth,
  asyncRoute(async (req, res) => {
    const [rows] =
      await pool.query(
        'SELECT id, name, email, role FROM users WHERE id = ?',
        [req.user.id]
      );

    if (!rows[0]) {
      return sendError(
        res,
        401,
        'Session expired.'
      );
    }

    res.json({
      user: rows[0]
    });
  })
);

/*
|--------------------------------------------------------------------------
| Categories
|--------------------------------------------------------------------------
*/

app.get(
  '/api/categories',
  asyncRoute(async (_req, res) => {
    const [rows] =
      await pool.query(
        'SELECT * FROM categories ORDER BY name'
      );

    res.json(rows);
  })
);

app.post(
  '/api/categories',
  requireAuth,
  asyncRoute(async (req, res) => {
    const data = parseBody(
      categorySchema,
      req,
      res
    );

    if (!data) return;

    const [result] =
      await pool.query(
        'INSERT INTO categories (name, description) VALUES (?, ?)',
        [
          data.name,
          data.description
        ]
      );

    res.status(201).json({
      id: result.insertId,
      ...data
    });
  })
);

app.put(
  '/api/categories/:id',
  requireAuth,
  asyncRoute(async (req, res) => {
    const data = parseBody(
      categorySchema,
      req,
      res
    );

    if (!data) return;

    await pool.query(
      'UPDATE categories SET name = ?, description = ? WHERE id = ?',
      [
        data.name,
        data.description,
        req.params.id
      ]
    );

    res.json(data);
  })
);

app.delete(
  '/api/categories/:id',
  requireAuth,
  asyncRoute(async (req, res) => {
    await pool.query(
      'DELETE FROM categories WHERE id = ?',
      [req.params.id]
    );

    res.json({
      message: 'Category deleted.'
    });
  })
);

/*
|--------------------------------------------------------------------------
| Products
|--------------------------------------------------------------------------
*/

app.get(
  '/api/products',
  asyncRoute(async (req, res) => {
    const params = [];

    let sql =
      'SELECT p.*, c.name AS category_name FROM products p JOIN categories c ON c.id = p.category_id WHERE 1=1';

    if (req.query.category) {
      sql +=
        ' AND p.category_id = ?';

      params.push(
        req.query.category
      );
    }

    if (
      req.query.featured ===
      'true'
    ) {
      sql +=
        ' AND p.featured = 1';
    }

    sql +=
      req.query.sort ===
      'price-asc'
        ? ' ORDER BY p.price ASC'
        : req.query.sort ===
          'price-desc'
        ? ' ORDER BY p.price DESC'
        : ' ORDER BY p.created_at DESC';

    const [rows] =
      await pool.query(
        sql,
        params
      );

    res.json(rows);
  })
);

app.get(
  '/api/products/:id',
  asyncRoute(async (req, res) => {
    const [rows] =
      await pool.query(
        'SELECT p.*, c.name AS category_name FROM products p JOIN categories c ON c.id = p.category_id WHERE p.id = ?',
        [req.params.id]
      );

    if (!rows[0]) {
      return sendError(
        res,
        404,
        'Product not found.'
      );
    }

    res.json(rows[0]);
  })
);

app.post(
  '/api/products',
  requireAuth,
  upload.single('image'),
  asyncRoute(async (req, res) => {
    const data = parseBody(
      productSchema,
      req,
      res
    );

    if (!data) return;

    if (
      !(await ensureCategory(
        data.category_id
      ))
    ) {
      return sendError(
        res,
        400,
        'The selected category does not exist.'
      );
    }

    const [result] =
      await pool.query(
        `INSERT INTO products
        (
          category_id,
          name,
          description,
          price,
          discount_price,
          image,
          available,
          featured,
          serving_size,
          calories,
          protein,
          carbohydrates,
          fat,
          sugar,
          sodium
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.category_id,
          data.name,
          data.description,
          data.price,
          dbValue(
            data.discount_price
          ),
          imagePath(req),
          data.available,
          data.featured,
          dbValue(
            data.serving_size
          ),
          dbValue(data.calories),
          dbValue(data.protein),
          dbValue(
            data.carbohydrates
          ),
          dbValue(data.fat),
          dbValue(data.sugar),
          dbValue(data.sodium)
        ]
      );

    const [rows] =
      await pool.query(
        'SELECT p.*, c.name AS category_name FROM products p JOIN categories c ON c.id = p.category_id WHERE p.id = ?',
        [result.insertId]
      );

    res.status(201).json(
      rows[0]
    );
  })
);

app.put(
  '/api/products/:id',
  requireAuth,
  upload.single('image'),
  asyncRoute(async (req, res) => {
    const data = parseBody(
      productSchema,
      req,
      res
    );

    if (!data) return;

    if (
      !(await ensureCategory(
        data.category_id
      ))
    ) {
      return sendError(
        res,
        400,
        'The selected category does not exist.'
      );
    }

    const image =
      imagePath(req);

    const sql = image
      ? `UPDATE products
         SET category_id=?,
             name=?,
             description=?,
             price=?,
             discount_price=?,
             image=?,
             available=?,
             featured=?,
             serving_size=?,
             calories=?,
             protein=?,
             carbohydrates=?,
             fat=?,
             sugar=?,
             sodium=?
         WHERE id=?`
      : `UPDATE products
         SET category_id=?,
             name=?,
             description=?,
             price=?,
             discount_price=?,
             available=?,
             featured=?,
             serving_size=?,
             calories=?,
             protein=?,
             carbohydrates=?,
             fat=?,
             sugar=?,
             sodium=?
         WHERE id=?`;

    const values = image
      ? [
          data.category_id,
          data.name,
          data.description,
          data.price,
          dbValue(
            data.discount_price
          ),
          image,
          data.available,
          data.featured,
          dbValue(
            data.serving_size
          ),
          dbValue(data.calories),
          dbValue(data.protein),
          dbValue(
            data.carbohydrates
          ),
          dbValue(data.fat),
          dbValue(data.sugar),
          dbValue(data.sodium),
          req.params.id
        ]
      : [
          data.category_id,
          data.name,
          data.description,
          data.price,
          dbValue(
            data.discount_price
          ),
          data.available,
          data.featured,
          dbValue(
            data.serving_size
          ),
          dbValue(data.calories),
          dbValue(data.protein),
          dbValue(
            data.carbohydrates
          ),
          dbValue(data.fat),
          dbValue(data.sugar),
          dbValue(data.sodium),
          req.params.id
        ];

    const [result] =
      await pool.query(
        sql,
        values
      );

    if (!result.affectedRows) {
      return sendError(
        res,
        404,
        'Product not found.'
      );
    }

    const [rows] =
      await pool.query(
        'SELECT p.*, c.name AS category_name FROM products p JOIN categories c ON c.id = p.category_id WHERE p.id = ?',
        [req.params.id]
      );

    res.json(rows[0]);
  })
);

app.delete(
  '/api/products/:id',
  requireAuth,
  asyncRoute(async (req, res) => {
    await pool.query(
      'DELETE FROM products WHERE id = ?',
      [req.params.id]
    );

    res.json({
      message: 'Product deleted.'
    });
  })
);

/*
|--------------------------------------------------------------------------
| Team
|--------------------------------------------------------------------------
*/

app.get(
  '/api/team',
  asyncRoute(async (_req, res) => {
    const [rows] =
      await pool.query(
        'SELECT * FROM team_members ORDER BY created_at DESC'
      );

    res.json(rows);
  })
);

app.post(
  '/api/team',
  requireAuth,
  upload.single('image'),
  asyncRoute(async (req, res) => {
    const data = parseBody(
      teamSchema,
      req,
      res
    );

    if (!data) return;

    const image =
      imagePath(req);

    const [result] =
      await pool.query(
        'INSERT INTO team_members (name, role, bio, image) VALUES (?, ?, ?, ?)',
        [
          data.name,
          data.role,
          data.bio,
          image
        ]
      );

    res.status(201).json({
      id: result.insertId,
      ...data,
      image
    });
  })
);

app.put(
  '/api/team/:id',
  requireAuth,
  upload.single('image'),
  asyncRoute(async (req, res) => {
    const data = parseBody(
      teamSchema,
      req,
      res
    );

    if (!data) return;

    const image =
      imagePath(req);

    const sql = image
      ? 'UPDATE team_members SET name=?, role=?, bio=?, image=? WHERE id=?'
      : 'UPDATE team_members SET name=?, role=?, bio=? WHERE id=?';

    const values = image
      ? [
          data.name,
          data.role,
          data.bio,
          image,
          req.params.id
        ]
      : [
          data.name,
          data.role,
          data.bio,
          req.params.id
        ];

    await pool.query(
      sql,
      values
    );

    res.json({
      ...data,
      image
    });
  })
);

app.delete(
  '/api/team/:id',
  requireAuth,
  asyncRoute(async (req, res) => {
    await pool.query(
      'DELETE FROM team_members WHERE id = ?',
      [req.params.id]
    );

    res.json({
      message: 'Team member deleted.'
    });
  })
);

/*
|--------------------------------------------------------------------------
| Gallery
|--------------------------------------------------------------------------
*/

app.get(
  '/api/gallery',
  asyncRoute(async (_req, res) => {
    const [rows] =
      await pool.query(
        'SELECT * FROM gallery ORDER BY created_at DESC'
      );

    res.json(rows);
  })
);

app.post(
  '/api/gallery',
  requireAuth,
  upload.single('image'),
  asyncRoute(async (req, res) => {
    const data = parseBody(
      gallerySchema,
      req,
      res
    );

    if (!data) return;

    if (!req.file) {
      return sendError(
        res,
        400,
        'An image is required.'
      );
    }

    const image =
      imagePath(req);

    const [result] =
      await pool.query(
        'INSERT INTO gallery (title, image, description) VALUES (?, ?, ?)',
        [
          data.title,
          image,
          data.description
        ]
      );

    res.status(201).json({
      id: result.insertId,
      ...data,
      image
    });
  })
);

app.put(
  '/api/gallery/:id',
  requireAuth,
  upload.single('image'),
  asyncRoute(async (req, res) => {
    const data = parseBody(
      gallerySchema,
      req,
      res
    );

    if (!data) return;

    const image =
      imagePath(req);

    const sql = image
      ? 'UPDATE gallery SET title=?, description=?, image=? WHERE id=?'
      : 'UPDATE gallery SET title=?, description=? WHERE id=?';

    const values = image
      ? [
          data.title,
          data.description,
          image,
          req.params.id
        ]
      : [
          data.title,
          data.description,
          req.params.id
        ];

    await pool.query(
      sql,
      values
    );

    res.json({
      ...data,
      image
    });
  })
);

app.delete(
  '/api/gallery/:id',
  requireAuth,
  asyncRoute(async (req, res) => {
    await pool.query(
      'DELETE FROM gallery WHERE id = ?',
      [req.params.id]
    );

    res.json({
      message: 'Gallery item deleted.'
    });
  })
);

/*
|--------------------------------------------------------------------------
| Messages
|--------------------------------------------------------------------------
*/

app.post(
  '/api/messages',
  asyncRoute(async (req, res) => {
    const data = parseBody(
      messageSchema,
      req,
      res
    );

    if (!data) return;

    await pool.query(
      'INSERT INTO messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [
        data.name,
        data.email,
        data.phone,
        data.subject,
        data.message
      ]
    );

    res.status(201).json({
      message:
        'Thanks, your message has been received.'
    });
  })
);

app.get(
  '/api/messages',
  requireAuth,
  asyncRoute(async (_req, res) => {
    const [rows] =
      await pool.query(
        'SELECT * FROM messages ORDER BY created_at DESC'
      );

    res.json(rows);
  })
);

app.put(
  '/api/messages/:id',
  requireAuth,
  asyncRoute(async (req, res) => {
    const status =
      req.body.status === 'read'
        ? 'read'
        : 'unread';

    await pool.query(
      'UPDATE messages SET status=? WHERE id=?',
      [
        status,
        req.params.id
      ]
    );

    res.json({
      status
    });
  })
);

app.delete(
  '/api/messages/:id',
  requireAuth,
  asyncRoute(async (req, res) => {
    await pool.query(
      'DELETE FROM messages WHERE id=?',
      [req.params.id]
    );

    res.json({
      message: 'Message deleted.'
    });
  })
);

/*
|--------------------------------------------------------------------------
| Complaints
|--------------------------------------------------------------------------
*/

app.post(
  '/api/complaints',
  complaintUpload,
  asyncRoute(async (req, res) => {
    const data = parseBody(
      complaintSchema,
      req,
      res
    );

    if (!data) return;

    const image =
      imagePath(req);

    const [result] =
      await pool.query(
        `INSERT INTO complaints
        (
          customer_name,
          email,
          phone,
          category,
          message,
          image,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          data.customer_name,
          dbValue(data.email),
          dbValue(data.phone),
          data.category,
          data.message,
          image,
          'pending'
        ]
      );

    res.status(201).json({
      id: result.insertId,
      message:
        'Complaint submitted successfully.'
    });
  })
);

app.get(
  '/api/complaints',
  requireAuth,
  asyncRoute(async (req, res) => {
    const params = [];

    let sql =
      `SELECT
        id,
        customer_name,
        email,
        phone,
        category,
        message,
        image,
        status,
        admin_note,
        created_at,
        updated_at
       FROM complaints
       WHERE 1=1`;

    if (req.query.status) {
      sql +=
        ' AND status = ?';

      params.push(
        req.query.status
      );
    }

    if (req.query.category) {
      sql +=
        ' AND category = ?';

      params.push(
        req.query.category
      );
    }

    sql +=
      ' ORDER BY created_at DESC';

    const [rows] =
      await pool.query(
        sql,
        params
      );

    res.json(rows);
  })
);

app.get(
  '/api/complaints/:id',
  requireAuth,
  asyncRoute(async (req, res) => {
    const [rows] =
      await pool.query(
        `SELECT
          id,
          customer_name,
          email,
          phone,
          category,
          message,
          image,
          status,
          admin_note,
          created_at,
          updated_at
         FROM complaints
         WHERE id = ?`,
        [req.params.id]
      );

    if (!rows[0]) {
      return sendError(
        res,
        404,
        'Complaint not found.'
      );
    }

    res.json(rows[0]);
  })
);

app.put(
  '/api/complaints/:id',
  requireAuth,
  asyncRoute(async (req, res) => {
    const data = parseBody(
      complaintAdminSchema,
      req,
      res
    );

    if (!data) return;

    const [result] =
      await pool.query(
        'UPDATE complaints SET status = ?, admin_note = ? WHERE id = ?',
        [
          data.status,
          dbValue(data.admin_note),
          req.params.id
        ]
      );

    if (!result.affectedRows) {
      return sendError(
        res,
        404,
        'Complaint not found.'
      );
    }

    const [rows] =
      await pool.query(
        `SELECT
          id,
          customer_name,
          email,
          phone,
          category,
          message,
          image,
          status,
          admin_note,
          created_at,
          updated_at
         FROM complaints
         WHERE id = ?`,
        [req.params.id]
      );

    res.json(rows[0]);
  })
);

app.delete(
  '/api/complaints/:id',
  requireAuth,
  asyncRoute(async (req, res) => {
    const [rows] =
      await pool.query(
        'SELECT image FROM complaints WHERE id = ?',
        [req.params.id]
      );

    await pool.query(
      'DELETE FROM complaints WHERE id = ?',
      [req.params.id]
    );

    if (rows[0]) {
      removeUploaded(
        rows[0].image
      );
    }

    res.json({
      message: 'Complaint deleted.'
    });
  })
);

/*
|--------------------------------------------------------------------------
| Reviews
|--------------------------------------------------------------------------
*/

const reviewImagePaths = (
  req
) => ({
  reviewer_image:
    req.files?.reviewer_image?.[0]
      ? `/uploads/${req.files.reviewer_image[0].filename}`
      : null,

  review_image:
    req.files?.review_image?.[0]
      ? `/uploads/${req.files.review_image[0].filename}`
      : null
});

app.get(
  '/api/reviews',
  asyncRoute(async (req, res) => {
    const params = [
      'approved'
    ];

    let sql =
      `SELECT
        id,
        customer_name,
        rating,
        review_text,
        reviewer_image,
        review_image,
        created_at,
        product_id
       FROM reviews
       WHERE status = ?`;

    if (req.query.product_id) {
      sql +=
        ' AND product_id = ?';

      params.push(
        Number(
          req.query.product_id
        )
      );
    }

    sql +=
      ' ORDER BY created_at DESC';

    const [rows] =
      await pool.query(
        sql,
        params
      );

    res.json(rows);
  })
);

app.post(
  '/api/reviews',
  reviewUpload,
  asyncRoute(async (req, res) => {
    const data = parseBody(
      reviewSchema,
      req,
      res
    );

    if (!data) return;

    const images =
      reviewImagePaths(req);

    await pool.query(
      `INSERT INTO reviews
      (
        customer_name,
        rating,
        review_text,
        status,
        reviewer_image,
        review_image,
        product_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.customer_name,
        data.rating,
        data.review_text,
        'pending',
        images.reviewer_image,
        images.review_image,
        dbValue(
          data.product_id
        )
      ]
    );

    res.status(201).json({
      message:
        'Review submitted and pending approval.'
    });
  })
);

app.get(
  '/api/reviews/admin',
  requireAuth,
  asyncRoute(async (_req, res) => {
    const [rows] =
      await pool.query(
        'SELECT * FROM reviews ORDER BY created_at DESC'
      );

    res.json(rows);
  })
);

app.post(
  '/api/reviews/admin',
  requireAuth,
  reviewUpload,
  asyncRoute(async (req, res) => {
    const data = parseBody(
      adminReviewSchema,
      req,
      res
    );

    if (!data) return;

    const images =
      reviewImagePaths(req);

    const [result] =
      await pool.query(
        `INSERT INTO reviews
        (
          customer_name,
          rating,
          review_text,
          status,
          reviewer_image,
          review_image,
          product_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          data.customer_name,
          data.rating,
          data.review_text,
          data.status,
          images.reviewer_image,
          images.review_image,
          dbValue(
            data.product_id
          )
        ]
      );

    res.status(201).json({
      id: result.insertId,
      ...data,
      ...images
    });
  })
);

app.put(
  '/api/reviews/:id',
  requireAuth,
  reviewUpload,
  asyncRoute(async (req, res) => {
    const data = parseBody(
      adminReviewSchema,
      req,
      res
    );

    if (!data) return;

    const images =
      reviewImagePaths(req);

    const [existingRows] =
      await pool.query(
        'SELECT reviewer_image, review_image FROM reviews WHERE id = ?',
        [req.params.id]
      );

    if (!existingRows[0]) {
      return sendError(
        res,
        404,
        'Review not found.'
      );
    }

    const reviewerImage =
      images.reviewer_image ||
      existingRows[0].reviewer_image;

    const reviewImage =
      images.review_image ||
      existingRows[0].review_image;

    const [result] =
      await pool.query(
        `UPDATE reviews
         SET
           customer_name = ?,
           rating = ?,
           review_text = ?,
           status = ?,
           reviewer_image = ?,
           review_image = ?,
           product_id = ?
         WHERE id = ?`,
        [
          data.customer_name,
          data.rating,
          data.review_text,
          data.status,
          reviewerImage,
          reviewImage,
          dbValue(
            data.product_id
          ),
          req.params.id
        ]
      );

    if (!result.affectedRows) {
      return sendError(
        res,
        404,
        'Review not found.'
      );
    }

    if (
      images.reviewer_image &&
      existingRows[0].reviewer_image
    ) {
      removeUploaded(
        existingRows[0].reviewer_image
      );
    }

    if (
      images.review_image &&
      existingRows[0].review_image
    ) {
      removeUploaded(
        existingRows[0].review_image
      );
    }

    res.json({
      id: req.params.id,
      ...data,
      reviewer_image:
        reviewerImage,
      review_image:
        reviewImage
    });
  })
);

app.patch(
  '/api/reviews/:id/status',
  requireAuth,
  asyncRoute(async (req, res) => {
    const status =
      req.body.status ===
      'approved'
        ? 'approved'
        : 'pending';

    const [result] =
      await pool.query(
        'UPDATE reviews SET status = ? WHERE id = ?',
        [
          status,
          req.params.id
        ]
      );

    if (!result.affectedRows) {
      return sendError(
        res,
        404,
        'Review not found.'
      );
    }

    res.json({
      status
    });
  })
);

app.delete(
  '/api/reviews/:id',
  requireAuth,
  asyncRoute(async (req, res) => {
    const [rows] =
      await pool.query(
        'SELECT reviewer_image, review_image FROM reviews WHERE id = ?',
        [req.params.id]
      );

    await pool.query(
      'DELETE FROM reviews WHERE id = ?',
      [req.params.id]
    );

    if (rows[0]) {
      removeUploaded(
        rows[0].reviewer_image
      );

      removeUploaded(
        rows[0].review_image
      );
    }

    res.json({
      message: 'Review deleted.'
    });
  })
);

/*
|--------------------------------------------------------------------------
| Orders / Add-ons
|--------------------------------------------------------------------------
*/

const orderItemSchema =
  z.object({
    product_id: z.coerce
      .number()
      .int()
      .positive(),

    quantity: z.coerce
      .number()
      .int()
      .min(1)
      .max(99),

    addon_ids: z.array(
      z.coerce
        .number()
        .int()
        .positive()
    ).default([])
  });

const orderSchema =
  z.object({
    customer_name: z.string()
      .trim()
      .min(2)
      .max(120),

    order_type: z.enum([
      'dine_in',
      'take_away',
      'online'
    ]),

    table_number: optField(
      z.string()
        .trim()
        .max(20)
    ),

    contact: optField(
      z.string()
        .trim()
        .max(190)
    ),

    items: z.array(
      orderItemSchema
    )
      .min(1)
      .max(50)
  });

app.get(
  '/api/addons',
  asyncRoute(async (_req, res) => {
    const [rows] =
      await pool.query(
        'SELECT id, name, price, available FROM addons WHERE available = 1 ORDER BY name'
      );

    res.json(rows);
  })
);

app.get(
  '/api/products/:id/addons',
  asyncRoute(async (req, res) => {
    const [rows] =
      await pool.query(
        `SELECT
          a.id,
          a.name,
          a.price,
          a.available
         FROM addons a
         JOIN product_addons pa
           ON pa.addon_id = a.id
         WHERE pa.product_id = ?
           AND a.available = 1
         ORDER BY a.name`,
        [req.params.id]
      );

    res.json(rows);
  })
);

app.get(
  '/api/addons/admin',
  requireAuth,
  asyncRoute(async (_req, res) => {
    const [rows] =
      await pool.query(
        `SELECT
          a.id,
          a.name,
          a.price,
          a.available,
          COUNT(pa.product_id) AS product_count
         FROM addons a
         LEFT JOIN product_addons pa
           ON pa.addon_id = a.id
         GROUP BY a.id
         ORDER BY a.name`
      );

    res.json(rows);
  })
);

app.post(
  '/api/addons',
  requireAuth,
  asyncRoute(async (req, res) => {
    const data = parseBody(
      addonSchema,
      req,
      res
    );

    if (!data) return;

    const [result] =
      await pool.query(
        'INSERT INTO addons (name, price, available) VALUES (?, ?, ?)',
        [
          data.name,
          data.price,
          data.available
        ]
      );

    res.status(201).json({
      id: result.insertId,
      ...data
    });
  })
);

app.put(
  '/api/addons/:id',
  requireAuth,
  asyncRoute(async (req, res) => {
    const data = parseBody(
      addonSchema,
      req,
      res
    );

    if (!data) return;

    const [result] =
      await pool.query(
        'UPDATE addons SET name = ?, price = ?, available = ? WHERE id = ?',
        [
          data.name,
          data.price,
          data.available,
          req.params.id
        ]
      );

    if (!result.affectedRows) {
      return sendError(
        res,
        404,
        'Add-on not found.'
      );
    }

    res.json({
      id: req.params.id,
      ...data
    });
  })
);

app.delete(
  '/api/addons/:id',
  requireAuth,
  asyncRoute(async (req, res) => {
    const [result] =
      await pool.query(
        'DELETE FROM addons WHERE id = ?',
        [req.params.id]
      );

    if (!result.affectedRows) {
      return sendError(
        res,
        404,
        'Add-on not found.'
      );
    }

    res.json({
      message: 'Add-on deleted.'
    });
  })
);

app.get(
  '/api/addons/:id/products',
  requireAuth,
  asyncRoute(async (req, res) => {
    const [rows] =
      await pool.query(
        `SELECT
          p.id,
          p.name
         FROM products p
         JOIN product_addons pa
           ON pa.product_id = p.id
         WHERE pa.addon_id = ?
         ORDER BY p.name`,
        [req.params.id]
      );

    res.json(rows);
  })
);

app.put(
  '/api/addons/:id/products',
  requireAuth,
  asyncRoute(async (req, res) => {
    const body = z
      .object({
        product_ids: z.array(
          z.coerce
            .number()
            .int()
            .positive()
        ).default([])
      })
      .safeParse(req.body);

    if (!body.success) {
      return sendError(
        res,
        400,
        'Please check the submitted fields.'
      );
    }

    const productIds = [
      ...new Set(
        body.data.product_ids
      )
    ];

    if (productIds.length) {
      const [rows] =
        await pool.query(
          'SELECT id FROM products WHERE id IN (?)',
          [productIds]
        );

      if (
        rows.length !==
        productIds.length
      ) {
        return sendError(
          res,
          400,
          'One or more selected products do not exist.'
        );
      }
    }

    const connection =
      await pool.getConnection();

    try {
      await connection.beginTransaction();

      await connection.query(
        'DELETE FROM product_addons WHERE addon_id = ?',
        [req.params.id]
      );

      for (
        const productId
        of productIds
      ) {
        await connection.query(
          'INSERT INTO product_addons (product_id, addon_id) VALUES (?, ?)',
          [
            productId,
            req.params.id
          ]
        );
      }

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }

    res.json({
      product_ids: productIds
    });
  })
);

/*
|--------------------------------------------------------------------------
| Orders
|--------------------------------------------------------------------------
*/

app.post(
  '/api/orders',
  asyncRoute(async (req, res) => {
    const data = parseBody(
      orderSchema,
      req,
      res
    );

    if (!data) return;

    if (
      data.order_type ===
        'dine_in' &&
      !data.table_number
    ) {
      return sendError(
        res,
        400,
        'Table number is required for dine-in orders.'
      );
    }

    if (
      data.order_type ===
        'online' &&
      !data.contact
    ) {
      return sendError(
        res,
        400,
        'Contact information is required for online orders.'
      );
    }

    const productIds = [
      ...new Set(
        data.items.map(
          (item) =>
            item.product_id
        )
      )
    ];

    const addonIds = [
      ...new Set(
        data.items.flatMap(
          (item) =>
            item.addon_ids
        )
      )
    ];

    const [productRows] =
      await pool.query(
        'SELECT id, name, price, discount_price, available FROM products WHERE id IN (?)',
        [productIds]
      );

    const products =
      new Map(
        productRows.map(
          (p) => [p.id, p]
        )
      );

    for (
      const id
      of productIds
    ) {
      const product =
        products.get(id);

      if (!product) {
        return sendError(
          res,
          400,
          `Product ${id} does not exist.`
        );
      }

      if (!product.available) {
        return sendError(
          res,
          400,
          `${product.name} is currently unavailable.`
        );
      }
    }

    const addonMap =
      new Map();

    if (addonIds.length) {
      const [addonRows] =
        await pool.query(
          'SELECT id, name, price, available FROM addons WHERE id IN (?)',
          [addonIds]
        );

      addonRows.forEach(
        (a) =>
          addonMap.set(
            a.id,
            a
          )
      );

      for (
        const id
        of addonIds
      ) {
        const addon =
          addonMap.get(id);

        if (!addon) {
          return sendError(
            res,
            400,
            `Add-on ${id} does not exist.`
          );
        }

        if (!addon.available) {
          return sendError(
            res,
            400,
            `${addon.name} is currently unavailable.`
          );
        }
      }

      const [paRows] =
        await pool.query(
          'SELECT product_id, addon_id FROM product_addons WHERE product_id IN (?) AND addon_id IN (?)',
          [
            productIds,
            addonIds
          ]
        );

      const allowed =
        new Set(
          paRows.map(
            (r) =>
              `${r.product_id}:${r.addon_id}`
          )
        );

      for (
        const item
        of data.items
      ) {
        for (
          const addonId
          of item.addon_ids
        ) {
          if (
            !allowed.has(
              `${item.product_id}:${addonId}`
            )
          ) {
            return sendError(
              res,
              400,
              `Add-on ${addonId} is not available for this product.`
            );
          }
        }
      }
    }

    let subtotal = 0;

    const orderItems =
      data.items.map(
        (item) => {
          const product =
            products.get(
              item.product_id
            );

          const addons =
            item.addon_ids.map(
              (id) =>
                addonMap.get(id)
            );

          const effectivePrice =
            product.discount_price !==
              null &&
            product.discount_price !==
              undefined &&
            Number(
              product.discount_price
            ) <
              Number(
                product.price
              )
              ? Number(
                  product.discount_price
                )
              : Number(
                  product.price
                );

          const unitPrice =
            effectivePrice +
            addons.reduce(
              (sum, a) =>
                sum +
                Number(a.price),
              0
            );

          const lineTotal =
            unitPrice *
            item.quantity;

          subtotal +=
            lineTotal;

          return {
            ...item,
            product,
            addons,
            unitPrice,
            lineTotal,
            effectivePrice
          };
        }
      );

    subtotal =
      Math.round(
        subtotal * 100
      ) / 100;

    const taxAmount =
      Math.round(
        subtotal *
          TAX_RATE *
          100
      ) / 100;

    const total =
      Math.round(
        (subtotal +
          taxAmount) *
          100
      ) / 100;

    const connection =
      await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [
        orderResult
      ] =
        await connection.query(
          `INSERT INTO orders
          (
            order_number,
            customer_name,
            order_type,
            table_number,
            contact,
            subtotal,
            tax_rate,
            tax_amount,
            total,
            status
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            'GG-PENDING',
            data.customer_name,
            data.order_type,
            data.table_number ||
              null,
            data.contact ||
              null,
            subtotal,
            TAX_RATE,
            taxAmount,
            total,
            'pending'
          ]
        );

      const orderId =
        orderResult.insertId;

      const orderNumber =
        `GG-${String(
          orderId
        ).padStart(5, '0')}`;

      await connection.query(
        'UPDATE orders SET order_number = ? WHERE id = ?',
        [
          orderNumber,
          orderId
        ]
      );

      for (
        const item
        of orderItems
      ) {
        const [
          itemResult
        ] =
          await connection.query(
            `INSERT INTO order_items
            (
              order_id,
              product_id,
              product_name_snapshot,
              unit_price_snapshot,
              quantity,
              line_total
            )
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
              orderId,
              item.product.id,
              item.product.name,
              item.effectivePrice,
              item.quantity,
              item.lineTotal
            ]
          );

        for (
          const addon
          of item.addons
        ) {
          await connection.query(
            `INSERT INTO order_item_addons
            (
              order_item_id,
              addon_id,
              addon_name_snapshot,
              addon_price_snapshot
            )
            VALUES (?, ?, ?, ?)`,
            [
              itemResult.insertId,
              addon.id,
              addon.name,
              addon.price
            ]
          );
        }
      }

      await connection.commit();

      const [orderRows] =
        await connection.query(
          'SELECT * FROM orders WHERE id = ?',
          [orderId]
        );

      const [itemRows] =
        await connection.query(
          'SELECT * FROM order_items WHERE order_id = ?',
          [orderId]
        );

      const [addonRows] =
        await connection.query(
          `SELECT
            oia.*
           FROM order_item_addons oia
           JOIN order_items oi
             ON oi.id = oia.order_item_id
           WHERE oi.order_id = ?`,
          [orderId]
        );

      res.status(201).json({
        ...orderRows[0],

        items:
          itemRows.map(
            (item) => ({
              ...item,

              addons:
                addonRows.filter(
                  (a) =>
                    a.order_item_id ===
                    item.id
                )
            })
          )
      });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  })
);

app.get(
  '/api/orders/:id',
  asyncRoute(async (req, res) => {
    const [orderRows] =
      await pool.query(
        'SELECT * FROM orders WHERE id = ?',
        [req.params.id]
      );

    if (!orderRows[0]) {
      return sendError(
        res,
        404,
        'Order not found.'
      );
    }

    const [itemRows] =
      await pool.query(
        'SELECT * FROM order_items WHERE order_id = ?',
        [req.params.id]
      );

    const [addonRows] =
      await pool.query(
        `SELECT
          oia.*
         FROM order_item_addons oia
         JOIN order_items oi
           ON oi.id = oia.order_item_id
         WHERE oi.order_id = ?`,
        [req.params.id]
      );

    res.json({
      ...orderRows[0],

      items:
        itemRows.map(
          (item) => ({
            ...item,

            addons:
              addonRows.filter(
                (a) =>
                  a.order_item_id ===
                  item.id
              )
          })
        )
    });
  })
);

/*
|--------------------------------------------------------------------------
| Global error handler
|--------------------------------------------------------------------------
*/

app.use(
  (err, req, res, _next) => {
    console.error(
      '========================================'
    );

    console.error(
      `API ERROR ${req.method} ${req.originalUrl}`
    );

    console.error(
      err
    );

    console.error(
      '========================================'
    );

    if (
      err instanceof
      multer.MulterError
    ) {
      return res
        .status(400)
        .json({
          message:
            'File upload failed.',
          error:
            err.message
        });
    }

    res.status(500).json({
      message:
        'Internal server error.'
    });
  }
);

/*
|--------------------------------------------------------------------------
| Start server
|--------------------------------------------------------------------------
*/

const server =
  app.listen(
    port,
    '0.0.0.0',
    () => {
      console.log(
        '========================================'
      );

      console.log(
        'Green Grounds Cafe API started successfully.'
      );

      console.log(
        `Server running on port ${port}`
      );

      console.log(
        `Health check: /api/health`
      );

      console.log(
        '========================================'
      );
    }
  );

/*
|--------------------------------------------------------------------------
| Graceful shutdown
|--------------------------------------------------------------------------
*/

const shutdown =
  async (signal) => {
    console.log(
      `${signal} received. Shutting down gracefully...`
    );

    server.close(
      async () => {
        try {
          await pool.end();

          console.log(
            'MySQL pool closed.'
          );

          process.exit(0);
        } catch (error) {
          console.error(
            'Error while closing MySQL pool:',
            error
          );

          process.exit(1);
        }
      }
    );
  };

process.on(
  'SIGTERM',
  () => shutdown('SIGTERM')
);

process.on(
  'SIGINT',
  () => shutdown('SIGINT')
);

export default app;