const { test, expect } = require('@playwright/test');

test.describe('core first-run flows', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('first-run generate and copy shows toast', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');

    await page.fill('#m-goal', 'Padidinti MRR');
    await page.fill('#m-income', '45000');
    await page.fill('#m-expenses', '32000');
    await page.fill('#m-question', 'Kokie 3 prioritetai savaitei?');

    await page.click('#outputCopyCta');
    await expect(page.locator('#toast')).toHaveClass(/show/);

    const text = await page.locator('#opsOutput').innerText();
    expect(text).toContain('KLAUSIMAS');
  });

  test('session save and restore survives reload', async ({ page }) => {
    await page.goto('/');

    await page.fill('#m-goal', 'Tikslas testui');
    await page.fill('#m-question', 'Ką daryti pirmiausia?');
    await page.click('#sessionSaveBtn');

    await expect(page.locator('#sessionList .session-item')).toHaveCount(1);
    await page.reload();

    await expect(page.locator('#sessionList .session-item')).toHaveCount(1);

    await page.fill('#m-goal', '');
    await page.locator('#sessionList .session-item').first().click();
    await expect(page.locator('#m-goal')).toHaveValue('Tikslas testui');
  });

  test('accordion stays single-open and hero link opens target section', async ({ page }) => {
    await page.goto('/');

    const libraryToggle = page.locator('#libraryToggle');
    const rulesToggle = page.locator('#rulesToggle');

    await libraryToggle.click();
    await expect(libraryToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(rulesToggle).toHaveAttribute('aria-expanded', 'false');

    await rulesToggle.click();
    await expect(rulesToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(libraryToggle).toHaveAttribute('aria-expanded', 'false');

    await page.click('.header-step[href="#library"]');
    await expect(libraryToggle).toHaveAttribute('aria-expanded', 'true');
  });

  test('keyboard arrows switch mode and depth', async ({ page }) => {
    await page.goto('/');

    await page.locator('#tab-master').focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#tab-dienos')).toHaveAttribute('aria-selected', 'true');

    await page.locator('[data-depth="GREITA"]').focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('[data-depth="GILU"]')).toHaveAttribute('aria-checked', 'true');
  });
});
