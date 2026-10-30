import { test, expect } from '@playwright/test';
import http from 'node:http';

test('@security SEC-01 validates defensive HTTP headers on an authorized target', async ({ request }) => {
  const server = http.createServer((_request, response) => response.writeHead(200, {
    'content-type': 'text/html; charset=utf-8',
    'content-security-policy': "default-src 'self'",
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'referrer-policy': 'strict-origin-when-cross-origin',
  }).end('<h1>Secure demo</h1>'));
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Security server did not start');
  try {
    const response = await request.get(`http://127.0.0.1:${address.port}`);
    await expect(response).toBeOK();
    const headers = response.headers();
    expect(headers['content-security-policy']).toBe("default-src 'self'");
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers.server).toBeUndefined();
  } finally {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});
