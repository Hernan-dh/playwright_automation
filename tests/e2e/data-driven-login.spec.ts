import { test } from '../../src/fixtures/test';
import cases from '../../src/data/login-cases.json';

for (const data of cases) {
  test(`AUTH-04 rejects ${data.name}`, async ({ login }) => {
    await login.goto();
    await login.login(data.username, data.password);
    await login.expectError(new RegExp(data.message, 'i'));
  });
}
