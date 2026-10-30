import { test, expect } from '@playwright/test';
import ExcelJS from 'exceljs';
import path from 'node:path';
import fs from 'node:fs/promises';

test('FILE-03 edits an Excel workbook and uploads the result', async ({ page }, testInfo) => {
  const workbookPath = path.join(testInfo.outputDir, 'inventory.xlsx');
  await fs.mkdir(testInfo.outputDir, { recursive: true });
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Inventory');
  sheet.addRow(['Product', 'Price']);
  sheet.addRow(['Backpack', 29.99]);
  sheet.getCell('B2').value = 24.99;
  await workbook.xlsx.writeFile(workbookPath);

  await page.setContent('<label>Inventory file <input type="file"></label><p></p>');
  await page.getByLabel('Inventory file').setInputFiles(workbookPath);
  await expect(page.getByLabel('Inventory file')).toHaveJSProperty('value', 'C:\\fakepath\\inventory.xlsx');

  const verification = new ExcelJS.Workbook();
  await verification.xlsx.readFile(workbookPath);
  expect(verification.getWorksheet('Inventory')!.getCell('B2').value).toBe(24.99);
});
