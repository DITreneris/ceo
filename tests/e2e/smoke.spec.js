const { test, expect } = require('@playwright/test');

const viewports = [
  { name: 'small-phone', width: 320, height: 640 },
  { name: 'phone', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 }
];

for (const viewport of viewports) {
  test.describe(`smoke:${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test('core UI renders and mode/depth switching works', async ({ page }) => {
      await page.goto('/');

      await expect(page.locator('#operationsCenter')).toBeVisible();
      await expect(page.locator('#opsOutput')).toBeVisible();

      await page.click('[data-mode="DIENOS"]');
      await expect(page.locator('[data-mode="DIENOS"]')).toHaveClass(/is-active/);
      await expect(page.locator('#form-dienos')).toBeVisible();

      await page.click('[data-depth="GILU"]');
      await expect(page.locator('[data-depth="GILU"]')).toHaveClass(/is-active/);
      await expect(page.locator('#depthBadge')).toHaveText(/Gilu/i);

      const outputText = await page.locator('#opsOutput').innerText();
      expect(outputText.length).toBeGreaterThan(40);

      const charCount = Number(await page.locator('#outputCharCount').innerText());
      expect(charCount).toBeGreaterThan(40);
    });

    test('no horizontal overflow on critical mobile widths', async ({ page }) => {
      await page.goto('/');
      const hasOverflow = await page.evaluate(() => {
        const root = document.documentElement;
        return root.scrollWidth > root.clientWidth;
      });
      expect(hasOverflow).toBeFalsy();
    });
  });
}
