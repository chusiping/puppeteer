const puppeteer = require('puppeteer');
(async () => {
  // const browser = await puppeteer.launch({headless:true});
  const browser = await puppeteer.launch({
    executablePath: 'C:/Users/Administrator/AppData/Local/CentBrowser/Application/chrome.exe',
    headless:false
})
  const page = await browser.newPage();
  await page.goto('https://www.baidu.com');
  await page.screenshot({path: './download/down114.png'});
  // await browser.close();
})();