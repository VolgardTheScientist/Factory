const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Navigate to local server
  await page.goto('http://localhost:8080/');
  
  // Wait for initial load
  await page.waitForTimeout(1000);

  // Click on the Architecture button
  await page.locator('.screen').filter({ hasText: 'Architecture' }).click();
  
  // Wait for transition (500ms fade to black, then fade up)
  await page.waitForTimeout(1500);

  // Take screenshot of default state in Architecture room
  await page.screenshot({ path: '/home/jules/verification/arch_default.png' });

  // Hover over the new back button
  await page.locator('#back-placeholder').hover();
  await page.waitForTimeout(500);

  // Take screenshot of hover state
  await page.screenshot({ path: '/home/jules/verification/arch_hover.png' });

  await browser.close();
})();
