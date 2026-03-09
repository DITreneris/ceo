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
      await page.goto('/?lang=lt');

      await expect(page.locator('#operationsCenter')).toBeVisible();
      await expect(page.locator('#opsOutput')).toBeVisible();

      await page.locator('#tab-master').focus();
      await page.keyboard.press('ArrowRight');
      await expect(page.locator('[data-mode="DIENOS"]')).toHaveClass(/is-active/);
      await expect(page.locator('#form-dienos')).toBeVisible();

      await page.locator('[data-depth="GREITA"]').focus();
      await page.keyboard.press('ArrowRight');
      await expect(page.locator('[data-depth="GILU"]')).toHaveClass(/is-active/);
      await expect(page.locator('#depthBadge')).toHaveText(/Gilu/i);

      const outputText = await page.locator('#opsOutput').inputValue();
      expect(outputText.length).toBeGreaterThan(40);

      const charCount = Number(await page.locator('#outputCharCount').innerText());
      expect(charCount).toBeGreaterThan(40);
    });

    test('no horizontal overflow on critical mobile widths', async ({ page }) => {
      await page.goto('/?lang=lt');
      const hasOverflow = await page.evaluate(() => {
        const root = document.documentElement;
        return root.scrollWidth > root.clientWidth;
      });
      expect(hasOverflow).toBeFalsy();
    });

    test('language switch keeps app accessible in english route', async ({ page }) => {
      await page.goto('/?lang=lt');
      await page.locator('#langEnBtn').click({ force: true });
      await expect(page).toHaveURL(/lang=en/);
      await expect(page.locator('#operationsCenter')).toBeVisible();
    });

    test('path /lt/ serves full app with lang=lt and no redirect', async ({ page }) => {
      await page.goto('/lt/');
      await expect(page).toHaveURL(/\/lt\/?/);
      const lang = await page.evaluate(() => document.documentElement.getAttribute('lang'));
      expect(lang).toBe('lt');
      await expect(page.locator('#operationsCenter')).toBeVisible();
      await expect(page.locator('#opsOutput')).toBeVisible();
    });

    test('path /en/ serves full app with lang=en and no redirect', async ({ page }) => {
      await page.goto('/en/');
      await expect(page).toHaveURL(/\/en\/?/);
      const lang = await page.evaluate(() => document.documentElement.getAttribute('lang'));
      expect(lang).toBe('en');
      await expect(page.locator('#operationsCenter')).toBeVisible();
      await expect(page.locator('#opsOutput')).toBeVisible();
    });
  });
}
