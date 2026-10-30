export const productSchema = {
  $id: 'https://portfolio.local/schemas/product.json',
  type: 'object',
  required: ['id', 'title', 'price'],
  properties: {
    id: { type: 'integer', minimum: 1 },
    title: { type: 'string', minLength: 1 },
    price: { type: 'number', minimum: 0 },
    description: { type: 'string' },
    category: { type: 'string' },
  },
} as const;
