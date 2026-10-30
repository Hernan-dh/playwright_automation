# SauceDemo checkout test plan

**Seed:** `tests/seed.spec.ts`

## 1. Cart and checkout

### 1.1 Add a product to the cart

1. Start from the authenticated inventory seed.
2. Add `Sauce Labs Backpack` to the cart.
3. Open the cart.
4. Verify the selected product is displayed exactly once.

### 1.2 Reject incomplete checkout data

1. Start with one product in the cart.
2. Open checkout and continue without customer information.
3. Verify the required first-name error is visible.

### 1.3 Complete checkout

1. Start with one product in the cart.
2. Enter valid public synthetic customer data.
3. Review and finish the order.
4. Verify the order confirmation is visible.

All cases must be independent, use semantic locators where available, avoid fixed delays, and never introduce non-demo credentials.
