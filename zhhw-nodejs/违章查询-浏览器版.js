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
            "value": "nDpWfABeirh5GkHuHdP8n3i8mia0rFnSHJztrwhThKH49V2eMLvhjQOP62UeJaEUY5I3aDvbJoA3M/h4tMI6LYdBLzfS5QGhgehIo+iR1ilsZSEMxSJpkGlBN20U6xvQTHR1N7rHhrY3gSbMqKOydPQUP7AI3trDzJ5NFUfkj2eAIZE8H1Xr2WGckIcPEKa4",
            "id": 2
        },
        {
            "domain": "gd.122.gov.cn",
            "expirationDate": 1634098276.625777,
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
            "value": "99298DBFFF2E48200A25CED3FCF939A3",
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
            "value": "69a1630d-711f-45db-80ec-69a7567a5389",
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
            "value": "558BE399302128E4C36665C32C5CE57C",
            "id": 7
        }
        ];
	const page = await browser.newPage();
	//await page.setCookie(cookie1);
    await page.setCookie(...cookies);
    //===============  part2 加载按钮的url ===========================
    const _url = "https://gd.122.gov.cn/views/memfyy/violation.html";
    const _url2 = "https://gd.122.gov.cn/user/m/uservio/suriquery";
    await page.goto(_url);
    await page.waitForTimeout(2000);
    await page.type('#hphm', 'A29BN9', {delay: 50}); 
    await page.waitForTimeout(1000);
    await page.click('button[class="btn btn-primary btn-submit-veh"]');
    // await page.click('#vehSearchForm > div.form-actions > button'); 
    await page.waitForTimeout(2000);

    const textArray = await page.$$eval('#my-msg-list > tbody > tr > td', els => Array.from(els).map(el => el.innerHTML));
    var i = 1
    for (const li of textArray) {
            console.log(i + ":" + li + '\n')
            i++;
    };
    await page.waitForTimeout(9000);
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
