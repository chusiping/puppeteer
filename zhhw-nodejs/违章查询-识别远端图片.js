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
    await page.waitForTimeout(1000);
    await page.click('#csessionid2');
    await page.waitForTimeout(1000);

    await worker.load()
    await worker.loadLanguage('eng')
    await worker.initialize('eng')
    await worker.setParameters({
        tessedit_pageseg_mode: PSM.AUTO,
    })

    const { data: { text } } = await worker.recognize('https://gd.122.gov.cn/m/tmri/captcha/math?nocache=1634026996934');

    await worker.terminate()
//   console.log(text)
    console.log(text);

  

})()


