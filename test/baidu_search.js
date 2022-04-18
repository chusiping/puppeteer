//!!! 自动打开页面进行百度查询
const puppeteer = require('puppeteer');
(async () => {
const browser = await puppeteer.launch({headless: true});
const page = await browser.newPage();
await page.goto('https://baidu.com');
await page.type('#kw', '六四运动', {delay: 100}); //打开百度后，自动在搜索框里慢慢输入puppeteer ,
page.click('#su') //然后点击搜索
await page.waitForTimeout(3000);
const targetLink = await page.evaluate(() => {
    let url =  document.querySelector('.result a').href
return url
});
console.log(targetLink);
await page.goto(targetLink);
// await page.waitFor(1000);
browser.close();
})()
