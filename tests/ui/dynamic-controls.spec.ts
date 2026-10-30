import { test, expect } from '@playwright/test';

test('UI-02 selects an autocomplete result without fixed delays', async ({ page }) => {
  await page.setContent(`
    <label>Country <input aria-controls="countries"></label>
    <ul id="countries" role="listbox"></ul>
    <script>
      const input = document.querySelector('input');
      input.addEventListener('input', () => {
        document.querySelector('ul').innerHTML = input.value === 'Arg' ? '<li role="option">Argentina</li>' : '';
      });
      document.querySelector('ul').addEventListener('click', event => input.value = event.target.textContent);
    </script>`);
  await page.getByLabel('Country').fill('Arg');
  await page.getByRole('option', { name: 'Argentina' }).click();
  await expect(page.getByLabel('Country')).toHaveValue('Argentina');
});

test('UI-03 selects a date and validates its normalized value', async ({ page }) => {
  await page.setContent('<label>Delivery date <input type="date"></label>');
  await page.getByLabel('Delivery date').fill('2026-12-15');
  await expect(page.getByLabel('Delivery date')).toHaveValue('2026-12-15');
});
