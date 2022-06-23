//新闻聚合优化版【2021-5-18】：单实例浏览器进程
const puppeteer = require('puppeteer');
const lib = require('../public/_LibNode.js');
var MongoClient = require('mongodb').MongoClient;
var mongodb = "mongodb://192.168.1.16:27017";
var sy_sleep = require('system-sleep');
const mongoose = require('mongoose');
const conn = mongoose.createConnection('mongodb://192.168.1.16:27017/zhhw', { useNewUrlParser: true, useUnifiedTopology: true })



const urls = [
    {
        site:"donews", 
        url: ["https://www.donews.com/","https://www.donews.com/automobile/index","https://www.donews.com/digital/index"],
        dv:'div.content',
        selor : "x.children[2].children[0].textContent + \"|||\" + x.children[2].children[0].href + \"|||\" + x.children[3].children[1].textContent ",
        IsShow : true
    },
    {
        site:"it", //51cto
        url: ["https://www.51cto.com/"],
        dv:'div.home-left-list li',
        selor : "x.children[1].children[0].textContent + \"|||\" + x.children[1].children[0].href + \"|||\" + x.children[1].children[2].children[0].textContent ",
        IsShow : true
    },
    {   
        site:"myzaker.com", 
        url: ["https://www.myzaker.com/channel/10045","https://www.myzaker.com/"],
        dv:'#contentList div.article-content',
        selor : "x.children[0].textContent + \"|||\" + x.children[0].href + \"|||\" + x.children[1].children[1].textContent",
        IsShow : true
    },
    {   
        site:"myzaker精读", 
        url: ["https://www.myzaker.com/?pos=selected_article"],
        dv:'#contentList div.article-content',
        selor : "x.children[0].textContent + \"|||\" + x.children[0].href + \"|||\" + x.children[1].children[1].textContent",
        IsShow : true
    },
    {   
        site:"stcn.com", 
        url: ["https://stock.stcn.com/index.html","https://stock.stcn.com/index_[1-3].html"],
        dv:"ul.news_list li",
        selor: "x.children[0].children[0].textContent + \"|||\" + x.children[0].children[0].href + \"|||\" + x.children[1].textContent",
        IsShow : true
    },
    {   
        site:"博客", 
        url: ["http://caifuhao.eastmoney.com/cfh/240651"],
        dv:'ul.media_list li.item',
        selor : "x.children[0].children[0].textContent + \"|||\" + x.children[0].children[0].href + \"|||\" + x.children[1].children[1].children[1].children[0].textContent",
        IsShow : true
    },
    {
        site:"博客", //招财猫
        url: ["http://caifuhao.eastmoney.com/cfh/100043","http://caifuhao.eastmoney.com/cfh/123715"],
        dv:'ul.media_list li.item',
        selor : "x.children[0].children[0].textContent + \"|||\" + x.children[0].children[0].href + \"|||\" + x.children[1].textContent",
        IsShow : true
    },
    {
        site:"hack", //
        url: ["https://www.webshell.cc/"],
        dv:'article.post:not(.whisper)',
        selor : "x.children[0].children[0].textContent + \"|||\" + x.children[0].children[0].href + \"|||\" + x.children[1].children[0].textContent",
        IsShow : true
    }
];
async function hanld(arrstr,site)
{
    x_ = arrstr.replace("null","").replace(/\n/g,"").replace(/\t/g,"")
    arr = x_.split("|||")
    var reg=/ \d+(小时前) | \d+(分钟前) |\ d+(天前) | (昨天) | (刚刚) | \d{4}-\d{1,2}-\d{1,2} /;
    tti = ""
    if(reg.test(arr[2]))
    {
        if(arr[2].match(reg).length>0)
        {
            str=arr[2].match(reg)[0]
            tti = await lib.handTime(str.trim())
        } 
    }
    else
    {
        tti = await lib.handTime(arr[2])
    }
    var _bj = { site:site, name:arr[0].trim(),href:arr[1],dt: new Date(tti),show:1}
    return _bj
};
(async () => {      
    const browser = await puppeteer.launch
    ({
        args: [
                '--proxy-server=127.0.0.1:10809',"--disable-web-security","--disable-setuid-sandbox","--no-sandbox","--disable-gpu","--disable-dev-shm-usage","--no-first-run","--no-zygote","--disable-popup-blocking"
        ],
        headless: true,
    })
    while (0 < 1) {  //开始循环page       
                               //第一层：永久循环
        var cnt = 0
        var ArrnewHre = []                                      //新的复合数组
        for (let index = 0; index < urls.length; index++) {     //第二层：循环数组
            const el_obj = urls[index];
            for (let i2 = 0; i2 < (el_obj.url).length; i2++) {    //第三层：循环同一个站点里的多个url
                var el2 = (el_obj.url)[i2];
                reg=/\[\d+\-\d+\]/;
                if(reg.test(el2))
                {
                    var strMC = el2.match(reg)[0]            //www.abc.com/分隔[0-1]分隔.html,
                    var hrefArr = el2.split(strMC);          //把 abc.com/[0-3].html变成 abc.com/1.html|2.html|3.html 多个数组
                    strMC = strMC.replace(/\[/,"").replace(/\]/,"")
                    ArrstrMC = strMC.split('-');
                    for (let i4 = ArrstrMC[0]; i4 < parseInt(ArrstrMC[1])+1; i4++) {
                        var hrefcomb = hrefArr[0]+ i4 + hrefArr[1];  //abc.com/ +  1 + .html 组合
                        var ArrnewHre_son = { site: el_obj.site , url: hrefcomb, dv: el_obj.dv , selor : el_obj.selor , IsShow :  el_obj.IsShow };   
                        ArrnewHre.push(ArrnewHre_son);
                    }
                }
                else
                {
                    var ArrnewHre_son = { site: el_obj.site , url: el2, dv: el_obj.dv , selor : el_obj.selor , IsShow :  el_obj.IsShow };   
                    ArrnewHre.push(ArrnewHre_son);
                }          
            }
        }
        for (let i_ok = 0; i_ok < ArrnewHre.length; i_ok++) {
            // const el_ok = ArrnewHre[i_ok];
            // console.log(el_ok);
            const el = ArrnewHre[i_ok];
            const page = await browser.newPage()
            await page.goto(el.url)
            console.log( "\n" + el.url + "\n")
            const hrefs = await page.$$eval(el.dv, (a,_selor) => a.map(x=>  (eval(_selor) )),el.selor );
            const rs = []
            for (let ix = 0; ix < hrefs.length; ix++) {
                var _bj = await hanld(hrefs[ix],el.site) ///第三层：title,href，日期转成对象
                rs.push(_bj)
                // console.log(ix + " :: " + JSON.stringify(_bj))
            }  
            // 旧方法
            // { useNewUrlParser: true, useUnifiedTopology: true },
            MongoClient.connect(mongodb, function(err, db) { //第四层 插入数据库
                if (err) throw err;
                var dbo = db.db("zhhw");
                var _collection = dbo.collection('posts');
                for (let i = 0; i < rs.length; i++) {
                    _collection.updateOne({name:rs[i].name},{'$setOnInsert':rs[i]},  {upsert:true});
                    console.log(cnt+": " +  JSON.stringify(rs[i])+ "\n")
                    cnt++
                }    
                db.close();
            // });
            // =======================================================================
            // conn.on('open', () => {
            //     console.log('打开 mongodb 连接');   
            //     var _collection = (conn).collection('posts');
            //     for (let i = 0; i < rs.length; i++) {
            //         _collection.updateOne({name:rs[i].name},{'$setOnInsert':rs[i]},  {upsert:true});
            //         console.log(cnt+": " +  JSON.stringify(rs[i])+ "\n")
            //         cnt++
            //     }  
               // dbo = conn.db("zhhw");
               // var _collection = dbo.collection('posts');
            //    var _collection = (conn).collection('test');
            //    _collection.updateOne({test:"test555"},{'$setOnInsert':{test:"test555"}},  {upsert:true});
            //    console.log("test555")
            
            })
            conn.on('err', (err) => {
                console.log('err:' + err);
            })
            await page.close();await lib.sleep(30000);
        }
    }
    await browser.close();//结束循环page
})().catch(error => console.log('error: ', error.message));





