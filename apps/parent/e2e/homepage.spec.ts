import { test, expect } from '@playwright/test';

test('homepage renders the hero and division router placeholders', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /we turn ideas into things that ship/i })).toBeVisible();

  for (const division of ['studio', 'tech', 'learn', 'labs']) {
    await expect(page.locator(`[data-property="${division}"]`)).toBeVisible();
  }
});
