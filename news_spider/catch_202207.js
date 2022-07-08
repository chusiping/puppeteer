//新闻聚合优化版【2022-1-30】：单实例浏览器进程
const puppeteer = require('puppeteer');
const lib = require('../public/_LibNode.js');
const schedule = require('node-schedule');
const sleep = (tim) => new Promise((res, rej) => setTimeout(res, tim));
const SqliteDB = require('../public/_LibSqlite.js').SqliteDB;
const file = "new_spider.db";
const sqliteDB = new SqliteDB(file);
const IndexA = lib.RowIndex(); //递增
const IndexB = lib.RowIndex();
const cheerio = require('cheerio')

const urls = [
    // {
    //     site:"小众软件", 
    //     url: ["https://www.appinn.com/category/online-tools/"],
    //     dv:'#content_box div.post-data div header',  //所有的header集合
    //     selector : "x.children[0].textContent + \"|||\" + x.children[0].children[0].href + \"|||\" + x.children[1].children[1].children[1].textContent",
    //     IsShow : true
    // },
    {
        site:"donews", 
        url: ["https://www.donews.com/","https://www.donews.com/automobile/index","https://www.donews.com/digital/index"],
        dv:'div.content',
        selector : "x.children[2].children[0].textContent + \"|||\" + x.children[2].children[0].href + \"|||\" + x.children[3].children[1].textContent ",
        IsShow : true
    },
    {
        site:"it", //51cto
        url: ["https://www.51cto.com/"],
        dv:'div.home-left-list li',
        selector : "x.children[1].children[0].textContent + \"|||\" + x.children[1].children[0].href + \"|||\" + x.children[1].children[2].children[0].textContent ",
        IsShow : true
    },
    {   
        site:"myzaker.com", 
        url: ["https://www.myzaker.com/channel/10045","https://www.myzaker.com/"],
        dv:'#contentList div.article-content',
        selector : "x.children[0].textContent + \"|||\" + x.children[0].href + \"|||\" + x.children[1].children[1].textContent",
        IsShow : true
    },
    {   
        site:"myzaker精读", 
        url: ["https://www.myzaker.com/?pos=selected_article"],
        dv:'#contentList div.article-content',
        selector : "x.children[0].textContent + \"|||\" + x.children[0].href + \"|||\" + x.children[1].children[1].textContent",
        IsShow : true
    },
    {   
        site:"stcn.com", 
        url: ["https://stock.stcn.com/index.html","https://stock.stcn.com/index_[1-3].html"],
        dv:"ul.news_list li",
        selector: "x.children[0].children[0].textContent + \"|||\" + x.children[0].children[0].href + \"|||\" + x.children[1].textContent",
        IsShow : true
    },
    {   
        site:"博客", 
        url: ["http://caifuhao.eastmoney.com/cfh/240651"],
        dv:'ul.media_list li.item',
        selector : "x.children[0].children[0].textContent + \"|||\" + x.children[0].children[0].href + \"|||\" + x.children[1].children[1].children[1].children[0].textContent",
        IsShow : true
    },
    {
        site:"博客", //招财猫
        url: ["http://caifuhao.eastmoney.com/cfh/100043","http://caifuhao.eastmoney.com/cfh/123715"],
        dv:'ul.media_list li.item',
        selector : "x.children[0].children[0].textContent + \"|||\" + x.children[0].children[0].href + \"|||\" + x.children[1].textContent",
        IsShow : true
    },
    {
        site:"hack", //
        url: ["https://www.webshell.cc/"],
        dv:'article.post:not(.whisper)',
        selector : "x.children[0].children[0].textContent + \"|||\" + x.children[0].children[0].href + \"|||\" + x.children[1].children[0].textContent",
        IsShow : true
    }
];




//1 curl 方法返回html或json eCurl =
//2 对html处理返回jons
//3.A 循环各个站点,把[1-2]变成数组元素
//3.B 循环数组里的每个页面
//4 每个对象插入一条记录 InsertDB = 
//5 每3个小时定时轮询

// 1 curl 方法返回html或json
var eCurl = async(url)=>
{
    url = `curl "${url}"`;
    var rt = await lib.eCurl(url);
    return rt;
}
// 2 对html处理返回jons
var getHref = async(html,obj_site) => {
    objHref = {};
    rt = [];
    const $ = cheerio.load(html)
    // const $ = cheerio.load('<h2 class="title">Hello world</h2>')
    // let str= $("[class='normal-item normal-item-ie col-lg-4 col-md-4 col-sm-4 col-xs-12']");
    let str= $("[class='normal-item col-lg-3 col-md-3 col-sm-4 col-xs-6']");
    
    // jquery循环
    $(str).each(function(i, item){    
        // var title = $(this).children(1).children(1).children(0).text()
        var html = $(this).html();
        // var title = $(this).children().find('.title').text();
        // var href = $(this).children().find('.title').children().attr('href');
        // var title = $(this).children().attr('href');
        // var text = $(this).children(0).text();
        var title_str =  getRegStr(html,/<span class="title">(\s|.)*?<\/span>/); //title
        objHref.site = obj_site.site;
        objHref.href = $(title_str).find('a').attr('href');
        objHref.title = $(title_str).text().trim();
        objHref.date =  getRegStr(html,/((.(分钟前|小时前|天前))|(\d{4}-\d{1,2}-\d{1,2}))/); 
console.log(JSON.stringify(objHref)+IndexA())
        rt.push(objHref)
        // return false;
    });
    return str;

    // var 正则获取href ;
    // let arr= [];
    // for (const B of html) {
    //     title.site = A.site ; title.dateTime = lib.handTime(title.dateTime);
    //     arr.push(title);
    // }
    // return arr;
}
var getRegStr =(html,reg) => {
    var rt2 = html.match(reg)[0];
    return rt2;
}

//3.A 循环各个站点,把[1-2]变成数组元素
var RebuildPageRS = (obj) => {
    var rt = [];
    for (const A of obj) {                      //分解urls对象
        for (const B of A.url) {                //分解url地址数组
            var PageNOs = lib.Exp2Array(B);     //分解表达式test_[1-3]_html,成数组'
            for (const el_url of PageNOs) {
                var New = { site: A.site , url: el_url, dv: A.dv , selector : A.selector , IsShow : A.IsShow };  
                rt.push(New); 
            }   
        }
    }
    return rt;
}
//3.B 循环数组里的每个页面
var ForUrlPage = async(obj) => {
    var site_Arr = RebuildPageRS(obj) //重组urls数组
    for (const obj_site of site_Arr) {        //循环页面
        var rt = await eCurl(obj_site.url); //取得页面title的html集合
        // console.log(rt)
        let obj = getHref(rt,obj_site)
        break;
    }   
    // return TitleRS;
}



//5 每3个小时定时轮询
(async()=>{
    ForUrlPage(urls);
    // let rule = new schedule.RecurrenceRule();       
    // // rule.minute = 30;rule.second = 0;   
    // console.log("爬出新闻 : schedule定时执行等待中...:");
    // let job = schedule.scheduleJob(rule, () => {
    //     console.log( "schedule开始:");
    // });
})();



