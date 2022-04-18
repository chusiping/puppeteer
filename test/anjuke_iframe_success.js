const puppeteer = require('puppeteer');
(async () => {
    const brower = await puppeteer.launch({
        // executablePath:'C:\\Users\\Administrator\\AppData\\Local\\CentBrowser\\Application\\chrome.exe',
        // headless:false,
        defaultViewport: null,
        args: [`--start-maximized`]
    });
    const page = await brower.newPage();
    await page.goto('https://login.anjuke.com/login/form?history=aHR0cHM6Ly9zdXpob3UuYW5qdWtlLmNvbS8=');
    const frame = page.frames().find(frame => frame.name() === 'iframeLoginIfm')
    await frame.waitForSelector('#phoneIpt')
    await frame.type('#phoneIpt','15626169339')
    await frame.type('#smsIpt','1211212')

    console.log('4:'+frame.name());
})()