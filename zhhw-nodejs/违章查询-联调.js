const puppeteer = require('puppeteer');
const request = require('request');
var baidu = require("./lib_myFunc"); //old: var baidu = require("./lib_OCR_baidu");
var mf = require("./lib_myFunc");
const fs = require('fs').promises;

var NewCookie = async () => {
    const browser = await puppeteer.launch({headless: false, args: [`--window-size=1440,780`], executablePath:'D:\\Users\\Administrator\\AppData\\Local\\CentBrowser\\Application\\chrome.exe',defaultViewport: {width: 1440, height: 780}
    })

	const page = await browser.newPage();
    //===============  part2 加载按钮的url ===========================
    const _url = "https://gd.122.gov.cn/m/login?t=2";
    var ts = true,idx =1;
    while (ts) {
        if(idx>3) break;
        //1 点验证码 2 下载 3 ocr结果 4 判断失败 5 提交 6 判断错误 7 重复
        await page.goto(_url);
        await mf.sleep(6000);
        // await page.waitForTimeout(2000);
        await page.click('#csessionid2');
        await page.type('#login2 > div > div > input#inputId', '44012012107753' ,{delay: 50});
        await page.type('#login2 > div > div > input#inputPassword','CT29DjKq6',{delay: 50}); 
        try {
            const element = await page.$('img[title="点击刷新验证码"]');
            // await page.click('img[title="点击刷新验证码"]');
            await page.waitForTimeout(1000);
            await element.screenshot({
                type: 'jpeg', quality: 100, path: "btn3.jpg", omitBackground: true
            });
            await page.waitForTimeout(1500);
            code = await baidu.OCR('btn3.jpg');
            code2 = mf.formatCode(code)
            code3 = eval(code2);
            code4 = eval(code3);
            console.log(code4);
            // code4 = Math.ceil(Math.random()*100);

            const input = await page.$('#login2 > div > div > input#csessionid2');
            await input.click({ clickCount: 3 });
            await page.waitForTimeout(1000);
            await input.type(code4.toString(),{delay: 50});
            await page.click('#isnormal');
            await page.waitForTimeout(4000);
            await page.click('#btnQyyhdl');
            await page.waitForTimeout(2000);
            var _url2 = page.url();

            if(_url2 == "https://gd.122.gov.cn/views/memfyy/")  { 
                mf.print("登录成功！") ;  ts = false;

                const cookies = await page.cookies();

                await fs.writeFile('./mycook.json', JSON.stringify(cookies, null, 2));
                mf.print("完成cookie写入！") ;
            }
            else {idx++;}
            await page.waitForTimeout(3000);
        } catch (err) {mf.print(idx+ ". 失败再次进入循环：" + err )  }
    }
}


var exe = async () => {
    var Ishave = await mf.exists2('./mycook.json')
    if(Ishave){
        mf.print("开始用cookie文件访问")
        const browser = await puppeteer.launch({headless: false, args: [`--window-size=1440,780`], executablePath:'D:\\Users\\Administrator\\AppData\\Local\\CentBrowser\\Application\\chrome.exe',defaultViewport: {width: 1440, height: 780} })

        const page = await browser.newPage();
        const cookiesString = await fs.readFile('./mycook.json');
        const cookies = JSON.parse(cookiesString);
        await page.setCookie(...cookies);
        //===============  part2 加载按钮的url ===========================
        const _url = "https://gd.122.gov.cn/views/memfyy/violation.html";
        await page.goto(_url);
        await page.waitForTimeout(6000);
        
        if(page.url() != _url ) NewCookie();
    }
    else{
        mf.print('没有cook，启动登录写入cookie')
        // NewCookie();
    }
}
// NewCookie();
exe();