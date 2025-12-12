const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Load the local index.html file
  const htmlPath = path.join(__dirname, 'index.html');
  const content = fs.readFileSync(htmlPath, 'utf8');
  
  // We set the content directly to handle local file references if needed
  // But for better style loading, a file:// URL is safer if styles are relative
  await page.setContent(content, { waitUntil: 'networkidle0' });
  
  // Add CSS styles specifically for the render if setContent doesn't pick up local links easily
  // Or navigate to file url:
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: 'giuseppe-filomena.pdf',
    format: 'A4',
    printBackground: true,
    margin: {
      top: '10mm',
      right: '10mm',
      bottom: '10mm',
      left: '10mm'
    }
  });

  await browser.close();
  console.log('PDF Generated successfully: cv.pdf');
})();
