// 单独分析html代码的div抓取规则
const puppeteer = require('puppeteer');
const lib = require('../public/_LibNode.js');
const urls = 
    {
        // site:"myzaker精读", 
        // url: "https://www.myzaker.com/?pos=selected_article",
        // dv:'#contentList div.article-content',
        // selector : "x.children[0].textContent + \"|||\" + x.children[0].href + \"|||\" + x.children[1].children[1].textContent",
        // IsShow : true

        //chrome浏览器console测试用语句
        // $$('#content_box div.post-data div header')[0].children[0].textContent
        site:"小众软件", 
        url: "https://www.appinn.com/category/online-tools/",
        dv:'#content_box div.post-data div header',  //所有的header集合
        selector : "x.children[0].textContent + \"|||\" + x.children[0].children[0].href + \"|||\" + x.children[1].children[1].children[1].textContent",
        IsShow : true
    }

var browser;
const Br = async()=> {
    browser = await puppeteer.launch
    ({
        args: [`--window-size=1440,780`,'--proxy-server=127.0.0.1:10809'],
        executablePath:'D:\\Users\\Administrator\\AppData\\Local\\CentBrowser\\Application\\chrome.exe',
        headless: true
    })
} 
// 单页抓取title
var PageGetHref2 = (async (PageObj) =>{
    const page = await browser.newPage()
    await page.goto(PageObj.url);
    const hrefs = await page.$$eval(PageObj.dv, (a,_selor) => a.map(x=>  (eval(_selor) )),PageObj.selector );
    await page.close();
    return hrefs;
})

var exec = async (A)=>{
    await Br();     
    var rt = await PageGetHref2(A); //取得页面title的html集合
    TestI = 0
    for (const B of rt) {
        var title = (lib.ClearTitleHtml(B)).obj; //清理每个title的空格回车并split ||| 得到对象或数组
        title.site = A.site ; title.dateTime = lib.handTime(title.dateTime);
        console.log(title)
        TestI++
        if(TestI > 3 ) return 
    }
}

exec(urls)

