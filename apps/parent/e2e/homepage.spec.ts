import { test, expect } from '@playwright/test';

test('homepage renders the hero, division cards, and division router', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /we turn ideas into things that ship/i })).toBeVisible();

  // One card link per division, pointing at its subdomain.
  for (const division of ['studio', 'tech', 'learn', 'labs']) {
    await expect(
      page.locator(`a[data-property="${division}"][href^="https://${division}.amalyte.com"]`),
    ).toBeVisible();
  }

  // Division Router: picking an intent reveals the routing CTA with the
  // intent preserved as a query param (architecture §4.0 signature module).
  const router = page.getByRole('group', { name: /choose what you need/i });
  await expect(router).toBeVisible();
  await router.getByRole('button', { name: 'get noticed' }).click();
  const cta = page.getByRole('link', { name: /go to amalyte studio/i });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute('href', 'https://studio.amalyte.com?intent=get-noticed');
});
