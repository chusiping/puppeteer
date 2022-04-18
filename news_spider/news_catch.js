//新闻聚合优化版【2022-1-30】：单实例浏览器进程
const puppeteer = require('puppeteer');
const lib = require('../public/_LibNode.js');
var obj_url = require('./module_url.js');
var sleep = require('system-sleep');

var SqliteDB = require('../public/_LibSqlite.js').SqliteDB;
var file = "new_spider.db";
var sqliteDB = new SqliteDB(file);
const IndexA = lib.RowIndex(); //闭包循环累加实例
const IndexB = lib.RowIndex();

//1 启动一个浏览器实力
var browser;
const Br = async()=> {
    browser = await puppeteer.launch
    ({
        args: [`--window-size=1440,780`,'--proxy-server=127.0.0.1:10809'],
        executablePath:'D:\\Users\\Administrator\\AppData\\Local\\CentBrowser\\Application\\chrome.exe',
        headless: true
    })
} 

// 2页面重组成对象集合
var RebuildPageRS = (obj) => {
    var rt = [];
    for (const A of obj) {                      //分解urls对象
        for (const B of A.url) {                //分解url地址数组
            var PageNOs = lib.Exp2Array(B);     //分解表达式test_[1-3]_html'
            for (const el_url of PageNOs) {
                var New = { site: A.site , url: el_url, dv: A.dv , selector : A.selector , IsShow : A.IsShow };  
                rt.push(New); 
            }   
        }
    }
    return rt;
}

// 单页抓取title
var PageGetHref2 = (async (PageObj) =>{
    const page = await browser.newPage()
    await page.goto(PageObj.url);
    const hrefs = await page.$$eval(PageObj.dv, (a,_selor) => a.map(x=>  (eval(_selor) )),PageObj.selector );
    await page.close();
    return hrefs;
})

//后续增加任务中断再续功能
var ForUrlPage = async(obj) => {
    await Br();                 //启动浏览器
    var Rs = RebuildPageRS(obj) //重组urls数组
    TitleRS = []; 
    for (const A of Rs) {       //循环页面
        var rt = await PageGetHref2(A); //取得页面title的html集合
        for (const B of rt) {
            var title = (lib.ClearTitleHtml(B)).obj; //清理每个title的空格回车并split ||| 得到对象或数组
            title.site = A.site ; title.dateTime = lib.handTime(title.dateTime);
            IndexB('ForUrlPage');// console.log(title);
            InsertDB(title) //适用爬一页插入一页 此方法替代TitleRS.push
            // 测试用：TitleRS.push(title);
            // 测试用：sleep(1000);
            // 测试用：if(TestI > 3 ) return TitleRS  //测试专用，正式要取消
        }
    }   
    return TitleRS;
}
//批量循环插入数据库
var ForInsertDB = async (urls) =>{
    var rs = await ForUrlPage(urls);//两中方式 1. 得到全部循环插入 2.一页一页插入
    for (const item of rs) {
        InsertDB(item)
    }
}
//单个对象插入，适用爬一页插入一页
var InsertDB = async (item) =>{
    var rt = Object.values(item) //对象转为数组
    var insertTileSql = "insert or ignore into news(site, title, url,AddTime,IsDel,type) values(?, ?, ?, ?, ?, ?)";
    sqliteDB.insertData(insertTileSql,[rt]);
    console.log("InsertDB:" + rt);
}


//无限定时循环
var exec = async () => {
    while (true) {
        IndexA('启动次数')  //闭包循环
        //ForInsertDB(obj_url.urls);    //  A方法 批量抓取完，一次循环插入
        await ForUrlPage(obj_url.urls); //  B方法 抓一页插入一页
        var ti = 60000 * 30             //  30分钟
        sleep(ti);
    }
}
exec();

// 分解测试函数
// Br('https://www.51cto.com/');
// RebuildPageRS(obj_url.urls);
// ForUrlPage(obj_url.urls);
// InsertDB(obj_url.urls);
// PageGetHref(obj_url.urls[1],"https://www.51cto.com/");
// var tt = lib.Exp2Array('test_2_html')
// var t = lib.ClearTitleHtml('  力帆是怎么.. |||https://donews.com/...|||23小时前');
// t.obj.dateTime = lib.handTime(t.obj.dateTime);
// console.log(t);


//1. 各种类库的引入
//2. 返回数组：遍历所有网
//3. 循环网址：爬取title到sqlite
//4. 返回数组：读取sqlite
//5. 启动express，展示页面，最近的title