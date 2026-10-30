# Checkout planner run

- Run date: 2026-10-30
- Role: Playwright test planner
- Target: SauceDemo checkout flow
- Status: Complete; generator handoff ready

## Inputs inspected

- `.codex/agents/playwright_test_planner.toml`
- `.codex/prompts/playwright-test-plan.md`
- `specs/checkout.plan.md`
- `tests/seed.spec.ts`
- `tests/e2e/checkout.spec.ts`
- `src/pages/InventoryPage.ts`
- `src/pages/LoginPage.ts`
- `docs/TEST_STRATEGY.md`
- `docs/TRACEABILITY.md`

This pass used the versioned repository sources as its evidence boundary. It did not claim a live browser exploration because no planner MCP browser session was available to this run.

## Existing coverage retained

The generator must not duplicate the following executable behavior:

- `CART-01`: add one named item and observe it in the cart.
- `CHECK-01`: complete checkout with valid synthetic customer data.
- `CHECK-02`: reject submission when all customer fields are empty.
- `AUTH-01` and `AUTH-02`: successful and locked-user authentication.

## Gap analysis

The current suite proves the primary purchase path, but it does not independently verify cart removal, field-specific checkout validation beyond the first empty field, order-summary integrity, or safe cancellation. These gaps affect revenue protection and recovery from user mistakes. Sorting, visual appearance, and authentication variants are outside this handoff because they are either covered elsewhere or do not strengthen checkout behavior directly.

## Proposed independent cases

### CART-02 removes a product before checkout

**Starting state:** Fresh browser context; authenticated standard demo user; empty cart.

1. Add `Sauce Labs Backpack` from inventory.
2. Open the cart and remove that product.
3. Verify the product row is absent and the cart badge is absent.

**Success criteria:** No removed product can proceed to checkout. Failure is any remaining row or non-zero badge.

### CHECK-03 validates each required customer field

**Starting state:** Fresh browser context; one product in the cart; checkout information page open.

1. Submit with first name empty while last name and postal code are populated; expect the first-name error.
2. Reload the independent starting state and submit with last name empty; expect the last-name error.
3. Reload the independent starting state and submit with postal code empty; expect the postal-code error.

**Success criteria:** Each omitted field produces its specific message and the order overview is not opened. Implement as named data-driven cases so failures identify the field.

### CHECK-04 preserves product and price in the order overview

**Starting state:** Fresh browser context; one `Sauce Labs Backpack` in the cart.

1. Enter valid synthetic customer data and continue.
2. Verify the overview contains the same product exactly once.
3. Capture the displayed item price and verify item subtotal equals it.
4. Verify total is not lower than item subtotal before finishing.

**Success criteria:** Product identity and monetary summary remain internally consistent. Do not hard-code tax or total unless the application contract explicitly requires it.

### CHECK-05 cancels checkout without creating an order

**Starting state:** Fresh browser context; one product in the cart; checkout information page open.

1. Select Cancel.
2. Verify navigation returns to the cart.
3. Verify the product is still present and no completion message is shown.

**Success criteria:** Cancellation is reversible and never displays order confirmation.

## Generator handoff criteria

- Generate `CART-02` and `CHECK-03..05` only; preserve existing IDs and tests.
- Use fresh state per test and public demo credentials from the existing fixture.
- Prefer accessible roles, labels, and product-row scoping; use `data-test` only where the UI exposes no semantic equivalent.
- Avoid fixed waits, test ordering, shared mutable state, and duplicated login mechanics.
- Extract a checkout Page Object only if it removes meaningful duplication without hiding assertions.
- Add every implemented ID to strategy and traceability documentation.
- Run the focused Chromium tests, TypeScript check, traceability check, and repository verification before healer review.
