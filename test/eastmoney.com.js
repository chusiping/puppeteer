const puppeteer = require('puppeteer');

(async () => {
    // 启动浏览器
    const browser = await puppeteer.launch({
        headless: true, // 默认是无头模式，这里为了示范所以使用正常模式
    })
    // 控制浏览器打开新标签页面
    const page = await browser.newPage()
    // 在新标签中打开要爬取的网页
    await page.goto('https://www.lagou.com/jobs/list_web%E5%89%8D%E7%AB%AF?px=new&city=%E5%B9%BF%E5%B7%9E')

    // 使用evaluate方法在浏览器中执行传入函数（完全的浏览器环境，所以函数内可以直接使用window、document等所有对象和方法）
    // #s_position_list > ul > li:nth-child(6) > div.list_item_top > div.position > div.p_top > a > h3
    let data = await page.evaluate(() => {
        // let list = document.querySelectorAll('.item_con_list li')
        let list = document.querySelectorAll('.company_name a')

        let res = []
        for (let i = 0; i < list.length; i++) {
            res.push({
                name: list[i].textContent
            })
        }
        return res
    })
    console.log(data)
})()



