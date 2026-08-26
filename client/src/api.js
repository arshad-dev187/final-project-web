const API_URL = import.meta.env.VITE_API_URL || '/api';

const API_ORIGIN = API_URL.startsWith('http')
  ? API_URL.replace(/\/api\/?$/, '')
  : window.location.origin;

export const assetUrl = (value) => {
  if (!value) return '';

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalized = String(value).replace(/\\/g, '/');

  const uploadIndex = normalized.indexOf('/uploads/');

  const publicPath =
    uploadIndex >= 0
      ? normalized.slice(uploadIndex)
      : normalized.startsWith('/')
        ? normalized
        : `/uploads/${normalized}`;

  return `${API_ORIGIN}${publicPath}`;
};

export async function api(path, options = {}) {
  const cleanPath = path.startsWith('/')
    ? path
    : `/${path}`;

  const response = await fetch(
    `${API_URL}${cleanPath}`,
    {
      credentials: 'include',
      ...options,
    }
  );

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
      'Something went wrong. Please try again.'
    );
  }

  return data;
}

export const jsonOptions = (
  body,
  method = 'POST'
) => ({
  method,
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});