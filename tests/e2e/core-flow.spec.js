const { test, expect } = require('@playwright/test');

test.describe('core first-run flows', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('first-run generate and copy shows toast', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');

    await page.fill('#s-pajamos', '12500');
    await page.fill('#s-sanaudos', '9800');
    await page.fill('#s-likutis', '115000');
    await page.fill('#s-question', 'What are the top 3 priorities this week?');

    await page.click('#outputCopyCta');
    await expect(page.locator('#toast')).toHaveClass(/show/);

    const text = await page.locator('#opsOutput').inputValue();
    expect(text).toContain('QUESTION');
  });

  test('sample data then copy and open ChatGPT', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');

    await page.evaluate(() => {
      window.__openedUrls = [];
      window.open = function (url) {
        window.__openedUrls.push(String(url));
        return null;
      };
    });

    await page.click('#sampleDataBtn');
    await expect(page.locator('#opsOutput')).not.toHaveValue('');
    await expect(page.locator('#tab-savaites')).toHaveAttribute('aria-selected', 'true');

    await page.click('[data-ai-tool="chatgpt"]');
    await expect(page.locator('#toast')).toHaveClass(/show/);

    const opened = await page.evaluate(() => window.__openedUrls);
    expect(opened.some((url) => url.includes('chatgpt.com'))).toBeTruthy();

    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip.length).toBeGreaterThan(40);
    expect(clip).toMatch(/QUESTION|Weekly/i);
  });

  test('session save and restore survives reload', async ({ page }) => {
    await page.goto('/');

    await page.fill('#s-pajamos', '12000');
    await page.fill('#s-question', 'What should we do first?');
    await page.click('#sessionSaveBtn');

    await expect(page.locator('#sessionList .session-item')).toHaveCount(1);
    await page.reload();

    await expect(page.locator('#sessionList .session-item')).toHaveCount(1);

    await page.fill('#s-pajamos', '');
    await page.locator('#sessionList .session-item').first().click();
    await expect(page.locator('#s-pajamos')).toHaveValue('12000');
  });

  test('hero secondary CTA scrolls to PDF guides section', async ({ page }) => {
    await page.goto('/');

    await page.click('.header-cta .cta-button-outline');
    await expect(page.locator('#pdf-guides')).toBeInViewport();
    await expect(page.locator('#pdf-guides-title')).toBeVisible();
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

    await page.click('.ops-journey-step[href="#library"]');
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

  test('root product is EN-US and has no visible language switcher', async ({ page }) => {
    await page.goto('/');
    const lang = await page.evaluate(() => document.documentElement.getAttribute('lang'));
    expect(lang).toBe('en-US');
    await expect(page.locator('#langLtBtn')).toHaveCount(0);
    await expect(page.locator('#langEnBtn')).toHaveCount(0);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /CEO-ready weekly operating brief/);
  });

  test('legacy /lt/ path still serves full app for regression coverage', async ({ page }) => {
    await page.goto('/lt/');
    await page.locator('#tab-master').focus();
    await page.keyboard.press('ArrowRight');
    await page.locator('[data-depth="GREITA"]').focus();
    await page.keyboard.press('ArrowRight');
    const lang = await page.evaluate(() => document.documentElement.getAttribute('lang'));
    expect(lang).toBe('lt');
    await expect(page.locator('#tab-dienos')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('[data-depth="GILU"]')).toHaveAttribute('aria-checked', 'true');
  });

  test('/en/ path serves full app with EN-US language', async ({ page }) => {
    await page.goto('/en/');
    await page.locator('#tab-master').focus();
    await page.keyboard.press('ArrowRight');
    await page.locator('[data-depth="GREITA"]').focus();
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(/\/en\/?/);
    const lang = await page.evaluate(() => document.documentElement.getAttribute('lang'));
    expect(lang).toBe('en-US');
    await expect(page.locator('#tab-dienos')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('[data-depth="GILU"]')).toHaveAttribute('aria-checked', 'true');
  });
});
