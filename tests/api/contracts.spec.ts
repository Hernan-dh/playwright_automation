import { test, expect } from '@playwright/test';

const api = process.env.API_BASE_URL || 'https://dummyjson.com';
test('@api API-01 validates the product contract', async ({ request }) => {
  const response = await request.get(`${api}/products/1`); await expect(response).toBeOK();
  expect(await response.json()).toEqual(expect.objectContaining({ id: 1, title: expect.any(String), price: expect.any(Number) }));
});
test('@api API-02 authenticates with a public demo account', async ({ request }) => {
  const response = await request.post(`${api}/auth/login`, { data: { username: 'emilys', password: 'emilyspass' } }); await expect(response).toBeOK();
  expect((await response.json()).accessToken).toEqual(expect.any(String));
});
