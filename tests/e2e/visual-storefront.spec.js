const { test, expect } = require('@playwright/test');

async function stabilizeForScreenshot(page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => document.fonts.ready);
}

test.describe('visual storefront regression', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'desktop screenshots only');
    await page.goto('/');
    await stabilizeForScreenshot(page);
  });

  test('hero-above-fold', async ({ page }) => {
    const header = page.locator('header.header');
    await expect(header).toBeVisible();
    await expect(header).toHaveScreenshot('hero-above-fold.png', {
      maxDiffPixelRatio: 0.02
    });
  });

  test('ops-center-desktop', async ({ page }) => {
    const ops = page.locator('#operationsCenter');
    await ops.scrollIntoViewIfNeeded();
    await expect(ops).toBeInViewport();
    await expect(ops).toHaveScreenshot('ops-center-desktop.png', {
      maxDiffPixelRatio: 0.02
    });
  });

  test('pdf-guides-section', async ({ page }) => {
    const section = page.locator('#pdf-guides');
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeInViewport();
    await expect(section).toHaveScreenshot('pdf-guides-section.png', {
      maxDiffPixelRatio: 0.02
    });
  });
});

test.describe('visual storefront regression — mobile', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'mobile screenshots only');
    await page.goto('/');
    await stabilizeForScreenshot(page);
  });

  test('pdf-guides-mobile', async ({ page }) => {
    const section = page.locator('#pdf-guides');
    await section.scrollIntoViewIfNeeded();
    await expect(page.locator('.pdf-guide-card')).toHaveCount(2);
    await expect(section).toHaveScreenshot('pdf-guides-mobile.png', {
      maxDiffPixelRatio: 0.02
    });
  });

  test('ops-center-mobile', async ({ page }) => {
    const ops = page.locator('#operationsCenter');
    await ops.scrollIntoViewIfNeeded();
    await expect(ops).toHaveScreenshot('ops-center-mobile.png', {
      maxDiffPixelRatio: 0.02
    });
  });
});
