const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({
        // headless: false,
        args: [`--start-maximized`],//args: [`--window-size=1440,780`]
        // userDataDir:"./user_data",
        // executablePath:'D:\\wangxiao\\chrome-win\\chrome-win\\chrome.exe',
        defaultViewport: null
    })
    //===============  part1 登录 ===========================
    const page = await browser.newPage();
    await page.goto('http://data.10jqka.com.cn/market/longhu/',{ waitUntil: 'load' });
    await page.waitForTimeout(2000)
    const textArray = await page.$$eval('#ggmx td span a', els => Array.from(els).map(el => el.textContent + el.getAttribute('stockcode')));

    textArray.map(el => console.log(el))
    console.log(textArray.length)
    console.log('end')
})()

