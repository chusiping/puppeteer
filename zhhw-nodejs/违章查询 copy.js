const puppeteer = require('puppeteer');
const request = require('request');
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
    const cookies = [
        {
            "domain": "gd.122.gov.cn",
            "expirationDate": 1949108185,
            "hostOnly": true,
            "httpOnly": false,
            "name": "_uab_collina",
            "path": "/",
            "sameSite": "unspecified",
            "secure": false,
            "session": false,
            "storeId": "0",
            "value": "163374818524468265628371",
            "id": 1
        },
        {
            "domain": "gd.122.gov.cn",
            "hostOnly": true,
            "httpOnly": false,
            "name": "accessToken",
            "path": "/",
            "sameSite": "unspecified",
            "secure": false,
            "session": true,
            "storeId": "0",
            "value": "4kEykpccIIgbNn6tYaixPZuxoJ0uzcRvAskBcIMLo0mofrfCxzI94Fkz3fZAmd5DtsNMS5XaK0/a1cH/iOaBKOGopWVbqL/ZwK7Vu9qZpbR4X2M6gWEyFTth7tsEwci/SBIFTe/9RAPrPZ2A9SjO9gzoxSuwyw/9aefNh7jbORDegN0bdRlJsfxYePZnGcvh",
            "id": 2
        },
        {
            "domain": "gd.122.gov.cn",
            "expirationDate": 1633841264.032287,
            "hostOnly": true,
            "httpOnly": true,
            "name": "c_yhlx_",
            "path": "/",
            "sameSite": "unspecified",
            "secure": false,
            "session": false,
            "storeId": "0",
            "value": "2",
            "id": 3
        },
        {
            "domain": "gd.122.gov.cn",
            "hostOnly": true,
            "httpOnly": true,
            "name": "JSESSIONID",
            "path": "/",
            "sameSite": "unspecified",
            "secure": false,
            "session": true,
            "storeId": "0",
            "value": "E773F4DC2FEF20B38ACC60FEDC13DF3F",
            "id": 4
        },
        {
            "domain": "gd.122.gov.cn",
            "hostOnly": true,
            "httpOnly": true,
            "name": "JSESSIONID-L",
            "path": "/",
            "sameSite": "unspecified",
            "secure": false,
            "session": true,
            "storeId": "0",
            "value": "a4e9fb84-927b-4a8b-8d29-6e70e85df1e1",
            "id": 5
        },
        {
            "domain": "gd.122.gov.cn",
            "expirationDate": 1949149999.700376,
            "hostOnly": true,
            "httpOnly": false,
            "name": "sto-id-20480-sg_http",
            "path": "/",
            "sameSite": "unspecified",
            "secure": false,
            "session": false,
            "storeId": "0",
            "value": "BJAKKNKNCICD",
            "id": 6
        },
        {
            "domain": "gd.122.gov.cn",
            "hostOnly": true,
            "httpOnly": false,
            "name": "tmri_csfr_token",
            "path": "/",
            "sameSite": "unspecified",
            "secure": false,
            "session": true,
            "storeId": "0",
            "value": "2B7602BDB1AA290C0DCB1EB2A2831D49",
            "id": 7
        }
        ];
	const page = await browser.newPage();
	//await page.setCookie(cookie1);
    await page.setCookie(...cookies);
    //===============  part2 加载按钮的url ===========================
    const _url = "https://gd.122.gov.cn/views/memfyy/";
    const _url2 = "https://gd.122.gov.cn/user/m/uservio/suriquery";
    await page.goto(_url);
    await page.waitForTimeout(3000)
    // await page.screenshot({path: './test/download/weizhang1.png'});

    request.post({url: _url2 , form:{startDate:'20210101',endDate:'20211001',hpzl:'02',hphm:'A29BN9',page:'1',hphm:'0',}}, function(error, response, body) {
        if (!error) {
           console.log(body); // 请求成功的处理逻辑  
           console.log(response);
        }
        else{
            console.log("err:" + error);
        }
    })

})()




// 逻辑目录
// 爬取违章查询
// 1. 登录并导入cookie
//    ​	https://gd.122.gov.cn/m/login?t=2
//    ​	44012012107753
//    ​	CT29DjKq6
// 2. 查询页面
//    ​	https://gd.122.gov.cn/views/memfyy/violation.html
// 3. 提交地址
//    ​	测试车牌	A29BN9
//    ​	https://gd.122.gov.cn/user/m/uservio/suriquery
