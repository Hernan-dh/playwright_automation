const assert = require('node:assert/strict');
const { chromium } = require('@playwright/test');

describe('Mocha interoperability example', function () {
  let browser;
  this.timeout(15_000);
  before(async () => { browser = await chromium.launch(); });
  after(async () => { await browser.close(); });

  it('MOCHA-01 uses Playwright with Mocha hooks and assertions', async () => {
    const page = await browser.newPage();
    await page.route('https://portfolio.local/', route => route.fulfill({ contentType: 'text/html', body: '<h1>Mocha and Playwright</h1>' }));
    await page.goto('https://portfolio.local/');
    assert.equal(await page.getByRole('heading').textContent(), 'Mocha and Playwright');
    await page.close();
  });
});
