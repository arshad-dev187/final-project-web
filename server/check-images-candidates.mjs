// Verify candidate replacement URLs for remaining broken product images
const CANDIDATES = [
  ['French Fries', 'https://images.unsplash.com/photo-1560421683-6856ea585c78?w=700&q=80', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=700&q=80'],
  ['French Fries', 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=700&q=80'],
  ['Waffle', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=700&q=80', 'https://images.unsplash.com/photo-1562376552-0e14e3468b32?w=700&q=80'],
  ['Waffle', 'https://images.unsplash.com/photo-1578198998844-9774e46a94f4?w=700&q=80'],
  ['Pancakes', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=700&q=80', 'https://images.unsplash.com/photo-1562376552-8d6c3a5e4b72?w=700&q=80'],
  ['Pancakes', 'https://images.unsplash.com/photo-1494459948932-4265915603d0?w=700&q=80'],
  ['Pancakes', 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=700&q=80']
];

const results = [];
for (const [name, ...urls] of CANDIDATES) {
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      const ct = res.headers.get('content-type') || '';
      results.push({ name, url, status: res.status, ok: res.ok && ct.startsWith('image/') });
    } catch (err) {
      results.push({ name, url, status: 'ERR', ok: false });
    }
  }
}
for (const r of results) console.log(`${r.ok ? 'OK' : 'ERR'} ${r.name} ${r.status} ${r.url}`);