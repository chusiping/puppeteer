const puppeteer = require('puppeteer');
(async () => {
    const brower = await puppeteer.launch({
        executablePath:'C:\\Users\\Administrator\\AppData\\Local\\CentBrowser\\Application\\chrome.exe',
        headless:false,
        defaultViewport: null,
        args: [`--start-maximized`]
    });
    const page = await brower.newPage();
    await page.goto('https://suzhou.anjuke.com/');
    await page.$eval('#login_l a:nth-child(1)',a => a.click() );
    //方法2： await page.click('#login_l a:nth-child(1)');
    await page.goto(page.url())
    const frame = page.frames().find(frame => frame.name() === 'iframeLoginIfm')
    console.log('name:'+frame.name());
    // await page.click('#footer li:nth-child(2)');

    await frame.waitForSelector('#phoneIpt')
    await frame.type('#phoneIpt','15626169339')
    await frame.type('#smsIpt','1211212')
    console.log('end::')

})()