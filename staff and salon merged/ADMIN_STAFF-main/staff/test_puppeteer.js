const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set up console listener
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://127.0.0.1:5500/staff/index.html', { waitUntil: 'networkidle0' });
  
  console.log("Page loaded. Clicking Walk-in Services...");
  
  await page.evaluate(() => {
    openServiceTypeModal('walkin');
  });
  
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: 'walkin_test.png' });
  console.log("Screenshot saved.");
  
  await browser.close();
})();
