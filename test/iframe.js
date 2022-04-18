const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless: false, slowMo: 50});
    const page = await browser.newPage();
    await page.goto('https://www.188.com');
    
    for (const frame of page.mainFrame().childFrames()){
        //根据 url 找到登录页面对应的 iframe
        if (frame.url().includes('passport.188.com')){
            await frame.type('.dlemail', 'admin@admin.com',{delay: 100});
            await frame.type('.dlpwd', '123456',{delay: 100});
            await Promise.all([
                frame.click('#dologin'),
                page.waitForNavigation()
            ]);
            break;
        }
    }
    await page.close();
    await browser.close();
})();