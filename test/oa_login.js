const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({
        // headless: false,
        args: [`--start-maximized`],//args: [`--window-size=1440,780`]
        // userDataDir:"./user_data",
        // executablePath:'D:\\wangxiao\\chrome-win\\chrome-win\\chrome.exe',
        // defaultViewport: null
        defaultViewport: {width: 1440, height: 780}
    })
    //===============  part1 登录 ===========================
    const page = await browser.newPage();
    await page.goto('https://oa.gzqiaoyin.com/login/Login.jsp?logintype=1');
    await page.type('#loginid', '00119960', {delay: 50}); 
    await page.type('#userpassword', '1qaz@WSX', {delay: 50}); 
    await page.click('#login') 
    await page.waitForTimeout(2000)

  
    //===============  part2 加载按钮的url ===========================
    await page.goto("https://oa.gzqiaoyin.com/workflow/request/RequestView.jsp?e71619595449289=");
    await page.waitForTimeout(3000)
    await page.$eval('#ztreeObj_12_a',a => a.click() );
    await page.waitForTimeout(3000)
    const frame = page.frames().find(frame => frame.name() === 'myFrame')
    await page.goto(frame.url());
    const frame2 = page.frames().find(frame => frame.name() === 'tabcontentframe')
    
    //===============  part3 加载目标url ===========================
    await page.goto(frame2.url());
    await page.waitForTimeout(3000)
    const textArray = await page.$$eval('td', els => Array.from(els).map(el => el.title));
    var i = 1
    for (const li of textArray) {
        if(li.includes('IT服务提单流程-'))
        {
            console.log(i + ":" + li + '\n')
            i++;
        }
    }
    console.log('end')
})()

//测试通过【2021-4-28】
//疑难思考：拿到了frame的对象，如何直接操作里面的Dom
