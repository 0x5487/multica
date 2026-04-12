import { test, expect } from '@playwright/test';

test('minimal login check', async ({ page }) => {
  await page.goto('http://localhost:3001/login');
  const h1 = page.locator('h1');
  await expect(h1).toBeVisible();
  const text = await h1.innerText();
  console.log('Found H1 text:', text);
  expect(text).toContain('Multica');
});
