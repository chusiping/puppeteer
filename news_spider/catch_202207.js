//新闻聚合优化版【2022-1-30】：单实例浏览器进程
const lib = require('../public/_LibNode.js');
const schedule = require('node-schedule');
const sleep = (tim) => new Promise((res, rej) => setTimeout(res, tim));
const SqliteDB = require('../public/_LibSqlite.js').SqliteDB;
const file = "new_spider.db";
const sqliteDB = new SqliteDB(file);
// var IndexA = lib.RowIndex(); //递增
// var IndexB = lib.RowIndex();
const cheerio = require('cheerio')
var fs = require('fs');
// var log4js = require('log4js');
// var logger = log4js.getLogger();
var sd = require('silly-datetime');
// log4js.configure({appenders: [{ type:'file',filename: './log/default.log'}]}) //log4js 日志

var urls = [
    {
        site:"donews", 
        each:".normal-item", // 循环每个titile的 class 或者 id
        url: ["https://www.donews.com/","https://www.donews.com/automobile/index","https://www.donews.com/digital/index"],
        regHref:"<span class=\"title\">(\\s|.)*?</span>", //找出<span>...</span>里的href和title
        regDate:"((.(分钟前|小时前|天前))|(\\d{4}-\\d{1,2}-\\d{1,2}))",
        IsShow : true,
        IsCuteTitle:false,
        IsFixHref : false 
    },
    {
        site:"小众软件", 
        each:'[class="post-data"]', 
        url: ["https://www.appinn.com/category/online-tools/"],
        regHref:'<h2(\\s|.)*?</h2>|<div class="post-title">(\\s|.)*?</div>',
        regDate:"(.(分钟前|小时前|天前))|(\\d{4}(-|/)\\d{1,2}(-|/)\\d{1,2})|(\\d{1,2}月(\s|.)*\\d{4})",
        IsShow : true,
        IsCuteTitle:false,
        IsFixHref : false 
    },
    {
        site:"it", //51cto
        url: ["https://www.51cto.com/"],
        each:'[class="article-ir articleItem"]', 
        regHref:'<div class="article-irl-ct"(\\s|.)*?</div>', 
        regDate:"(\\d{4}(-|/)\\d{1,2}(-|/)\\d{1,2}\\s\\d{2}:\\d{2}:\\d{2})", //2022-07-08 09:41:20
        IsShow : true,
        IsCuteTitle:false,
        IsFixHref : false 
    },
    {
        site:"myzaker.com", 
        url: ["https://www.myzaker.com/"],
        each:'[class="article-wrap"]', 
        regHref:'', 
        regDate:"(.(分钟前|小时前|天前))|(\\d{4}(-|/)\\d{1,2}(-|/)\\d{1,2})", 
        IsShow : true,
        IsCuteTitle:false ,  //不取多行的第一行
        IsFixHref : false 
    },
    {
        site:"stcn", 
        url: ["https://stock.stcn.com/index.html"],
        each:'#idData li', 
        regHref:'<p class="tit"(\\s|.)*?</p>', 
        regDate:"(.(分钟前|小时前|天前))|(\\d{4}(-|/)\\d{1,2}(-|/)\\d{1,2})|(\\d{1,2}月(\s|.)*\\d{4})", 
        IsShow : true,
        IsCuteTitle:false ,
        IsFixHref : false 
    },
    {
        site:"stcn", 
        url: ["https://kuaixun.stcn.com/"],
        each:'#news_list2 li', 
        regHref:'', //如果为空, 则添加外层的div 
        regDate:"(.(分钟前|小时前|天前))|(\\d{4}(-|/)\\d{1,2}(-|/)\\d{1,2})|(\\d{1,2}月(\s|.)*\\d{4})", 
        IsShow : true,
        IsCuteTitle:false,
        IsFixHref : true 
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
var getSqliteData = async(html,obj_site) => {
   
    rt = [];
    const $ = cheerio.load(html)
    let str= $(obj_site.each);
// logger.debug(obj_site.url, new Date()); 
    var eachcount=0;
    $(str).each(function(i, item){   
        eachcount++ //因为是异步的所有要加循环
        objHref = {}; 
        let html = $(this).html();
        let title_str =  getRegStr(html,obj_site.regHref); //title

        let tm_title =  $(title_str).find('a').first().text().trim(); //作废: let tm_title = $(title_str).text().trim();
        if(tm_title==null || tm_title=="") tm_title = $(title_str).find('a').first().attr('title');
        if(obj_site.IsCuteTitle) tm_title = tm_title.substr(0,tm_title.indexOf('\n')); //多个换行主题的第一行

        let tm_href =  $(title_str).find('a').attr('href');
        let html_date = getRegStr(html, obj_site.regDate);

        objHref.site = obj_site.site;
        objHref.title = tm_title;        
        objHref.url = FixHref(tm_href,obj_site);
        objHref.AddTime = lib.handTime(html_date) ;
        // objHref.date_source = html_date;
        // objHref.date = lib.handTime(html_date)  ; 
        rt.push(objHref)
        if(eachcount>=$(str).length){
            return rt;
        }
        // logger.debug("row 126 :"+IndexA(), new Date());
        // logger.debug(JSON.stringify(objHref));
    });
    return rt;
}
var getRegStr =(html,reg) => {
    if(reg=="") return "<div>"+ html + "</div>";
    var re = new RegExp(reg)
    if(html.match(re) == null) return "";
    var rt2 = html.match(re)[0];
    return rt2;
}

//3.A 循环各个站点,把[1-2]变成数组元素
var RebuildPageRS = (obj) => {
    var rt = [];
    for (const A of obj) {    
        if(!A.IsShow) continue;                  //分解urls对象
        for (const B of A.url) {                //分解url地址数组
            var PageNOs = lib.Exp2Array(B);     //分解表达式test_[1-3]_html,成数组'
            for (const el_url of PageNOs) {
                var New = { site: A.site , url: el_url, regHref: A.regHref , regDate : A.regDate , IsShow : A.IsShow ,each:A.each,IsCuteTitle : A.IsCuteTitle,IsFixHref : A.IsFixHref};  
                rt.push(New); 
            }   
        }
    }
    return rt;
}
//3.B 循环数组里的每个页面
var ForUrlPage = async(obj) => {
    var site_Arr = RebuildPageRS(obj) //重组urls数组
    var count = 1;
    for (const obj_site of site_Arr) {        //循环页面
        var PageCodeOrJson = await eCurl(obj_site.url); //取得页面title的html集合
        let obj = await getSqliteData(PageCodeOrJson,obj_site)
        for (let x = 0; x < obj.length; x++) {
            const item = obj[x];
            // logger.debug("162"+JSON.stringify(item)+IndexA(), new Date());
            InsertDB(item);
            count++;
        }

    }   
    console.log("本地循环总计条数:" + count +  " - " + sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss') )
}
//3.c 修正href的相对链接 './aa.html'=>'http://xxx.com/aa.html'
var FixHref = (href,obj_site) => {
    var rt = href;
    if(href.indexOf("./")==0){
        rt = obj_site.url + href.replace('./','');
    }
    if(href.indexOf("//www")==0){
        rt = href.replace('//','http://');
    }
    return rt;
}

// 每个对象插入一条记录 InsertDB = 
var InsertDB = async (item) =>{
    return new Promise((resolve, reject) => {
        var rt = Object.values(item) //对象转为数组
        var insertTileSql = "insert or ignore into news(site, title, url,AddTime,IsDel,type) values(?, ?, ?, ?, ?, ?)";
        // console.log(IndexA())
        try {
            sqliteDB.insertData(insertTileSql,[rt]);
            resolve("ok");
        } catch (error) {
            console.log(error)
            reject("error");
        }
    });
}

// var InsertDB = async (item) =>{
//     var rt = Object.values(item) //对象转为数组
//     var insertTileSql = "insert or ignore into news(site, title, url,AddTime,IsDel,type) values(?, ?, ?, ?, ?, ?)";
//     sqliteDB.insertData(insertTileSql,[rt]);
// }

//5 每3个小时定时轮询
(async()=>{
    // fs.unlinkSync("./log/default.log")
    // ForUrlPage(urls);
    let rule = new schedule.RecurrenceRule();       
    rule.minute = 30;rule.second = 0;   
    console.log("爬新闻等待中...:");
    let job = schedule.scheduleJob(rule, () => {
        var dt = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
        console.log( dt + " 新闻 schedule开始:");
        ForUrlPage(urls);
    });
})();



