import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import { productSchema } from '../../src/schemas/product.schema';

const api = process.env.API_BASE_URL || 'https://dummyjson.com';

test('@api @contract API-05 validates the product JSON Schema', async ({ request }) => {
  const response = await request.get(`${api}/products/1`);
  await expect(response).toBeOK();
  const validate = new Ajv({ allErrors: true }).compile(productSchema);
  const body = await response.json();
  expect(validate(body), JSON.stringify(validate.errors, null, 2)).toBe(true);
});
