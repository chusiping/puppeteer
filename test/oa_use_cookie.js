// const { cookie1, cookie2} = require('./cookie');

const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: [`--start-maximized`],//args: [`--window-size=1440,780`]
        // userDataDir:"./user_data",
        // executablePath:'D:\\wangxiao\\chrome-win\\chrome-win\\chrome.exe',
        // defaultViewport: null
        defaultViewport: {width: 1440, height: 780}
    })
    const cookie1 = { "domain": "oa.gzqiaoyin.com",
    "hostOnly": true,
    "httpOnly": false,
    "name": "ecology_JSessionId",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": true,
    "storeId": "0",
    "value": "abchRr4qx0R3ScdQXUBKx",
    "id": 1}

    const cookie2 = { "domain": "oa.gzqiaoyin.com",
    "hostOnly": true,
    "httpOnly": false,
    "name": "sessionkey",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": true,
    "storeId": "0",
    "value": "f015513f-5740-4a4f-84c0-729960167d71",
    "id": 2}
	const page = await browser.newPage();
	await page.setCookie(cookie1)
    await page.setCookie(cookie2)
    //===============  part2 加载按钮的url ===========================
    await page.goto("https://oa.gzqiaoyin.com/workflow/request/RequestView.jsp?e71619595449289=");
    await page.waitForTimeout(3000)
    await page.$eval('#ztreeObj_12_a',a => a.click() );
    await page.waitForTimeout(3000)
    const frame = page.frames().find(frame => frame.name() === 'myFrame')
    
    const text = await frame.$eval('#objName', element => element.textContent);
    console.log(text)
    console.log('end')
})()





