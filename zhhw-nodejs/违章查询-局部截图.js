const puppeteer = require('puppeteer');
const request = require('request');
const { createWorker } = require('tesseract.js')
const PSM = require('tesseract.js/src/constants/PSM.js')
const worker = createWorker();

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        //args: [`--start-maximized`],
        args: [`--window-size=1440,780`],
        // userDataDir:"./user_data",
        executablePath:'D:\\Users\\Administrator\\AppData\\Local\\CentBrowser\\Application\\chrome.exe',
        // defaultViewport: null
        defaultViewport: {width: 1440, height: 780}
    })

	const page = await browser.newPage();
	//await page.setCookie(cookie1);
    // await page.setCookie(...cookies);
    //===============  part2 加载按钮的url ===========================
    const _url = "https://gd.122.gov.cn/m/login?t=2";
    await page.goto(_url);
    await page.waitForTimeout(2000);
    await page.click('#csessionid2');
    await page.waitForTimeout(1000);

    const element = await page.$('img[title="点击刷新验证码"]');

    // await element.screenshot({
    //     type: 'jpeg',
    //     quality: 100,
    //     // path: "btn.jpg",
    //     omitBackground: true
    // });

    const image = await page.screenshot({
        type: 'jpeg',
        quality: 100,
        path: "btn3.jpg",
        clip: {
          x: 455,
          y: 340,
          width: 100,
          height: 80,
        },
        omitBackground: true,
      });

})()




