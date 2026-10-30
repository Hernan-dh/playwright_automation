import { test, expect } from '@playwright/test';
import http from 'node:http';

const api = process.env.API_BASE_URL || 'https://dummyjson.com';

test('@api API-03 creates, verifies, and deletes a persisted resource', async ({ request }) => {
  const products = new Map<number, { id: number; title: string; price: number }>();
  const server = http.createServer((incoming, response) => {
    response.setHeader('content-type', 'application/json');
    if (incoming.method === 'POST' && incoming.url === '/products') {
      let body = '';
      incoming.on('data', chunk => body += chunk);
      incoming.on('end', () => {
        const product = { id: 1, ...JSON.parse(body) };
        products.set(product.id, product);
        response.writeHead(201).end(JSON.stringify(product));
      });
      return;
    }
    const id = Number(incoming.url?.split('/').pop());
    if (incoming.method === 'GET' && products.has(id)) return response.end(JSON.stringify(products.get(id)));
    if (incoming.method === 'DELETE' && products.delete(id)) return response.end(JSON.stringify({ isDeleted: true }));
    response.writeHead(404).end(JSON.stringify({ message: 'Not found' }));
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('API server did not start');
  const baseURL = `http://127.0.0.1:${address.port}`;
  try {
    const create = await request.post(`${baseURL}/products`, { data: { title: 'Portfolio product', price: 99 } });
    expect(create.status()).toBe(201);
    const product = await create.json();
    await expect(await request.get(`${baseURL}/products/${product.id}`)).toBeOK();
    await expect(await request.delete(`${baseURL}/products/${product.id}`)).toBeOK();
    expect((await request.get(`${baseURL}/products/${product.id}`)).status()).toBe(404);
  } finally {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});

test('@api @session API-04 injects an API token into a browser session', async ({ request, page }) => {
  const login = await request.post(`${api}/auth/login`, { data: { username: 'emilys', password: 'emilyspass' } });
  await expect(login).toBeOK();
  const { accessToken } = await login.json();
  await page.addInitScript(token => localStorage.setItem('accessToken', token), accessToken);
  await page.route('https://portfolio.local/', route => route.fulfill({ contentType: 'text/html', body: '<h1>Authenticated dashboard</h1>' }));
  await page.goto('https://portfolio.local/');
  expect(await page.evaluate(() => localStorage.getItem('accessToken'))).toBe(accessToken);
  await expect(page.getByRole('heading', { name: 'Authenticated dashboard' })).toBeVisible();
});
