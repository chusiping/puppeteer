var request     = require('request');
const express   = require('express');
const app       = express();
var sqlite3     =  require('sqlite3').verbose();
var file        = "new_spider.db";;
var db          = new sqlite3.Database(file);
var sd = require('silly-datetime');

var sits = async()=>{
        return new Promise((resolve, reject) => {
        db.all("select distinct site from news",function(err,row){
            if(err){
                reject(err)
            }else{
                resolve(row);
            }
        })
        });
}

var content = async(site) => {
    return new Promise((resolve, reject) => {
        var t = new Date();//你已知的时间
        var str_ =  t.setTime(t.setDate(t.getDate() - 10)); //日期加减
        var str2_ = sd.format(new Date(str_), 'YYYY-MM-DD');
        let sql = `select * from news where site = '${site}' and AddTime > '${str2_}' order by AddTime desc `; 
        db.all(sql ,function(err,row){
        console.log(sql);
            if(err){
                reject(err)
            }else{
                resolve(row);
            }
        })
    });
};
var getList = async()=>{
    let rs = await sits();
    var rt = "";
    for (let x = 0; x < rs.length; x++) {
        var div = tempDiv();
        const ele = rs[x];
        // console.log(ele);
        let r2s = await content(ele.site);
        let _list_ = "";
        for (let xx = 0; xx < r2s.length; xx++) {
            const e2e = r2s[xx];
            // console.log(e2e); var _date = ;
            // _list_+= `<li><a href="${e2e.url}">${xx+1}. ${e2e.title}  ${sd.format(e2e.AddTime, 'MM-DD')}</a></li><br>\n`;
            // _list_+= `<div class="row2">${xx+1}</div>　<div class="row"><a href="${e2e.url}">${e2e.title}  ${sd.format(e2e.AddTime, 'MM-DD')}</a></div>\n`;
            
            _list_+= `<a href="${e2e.url}">${xx+1}. ${e2e.title}  ${sd.format(e2e.AddTime, 'MM-DD')}</a>\n`;
        }
        rt += div.replace('_site_',ele.site).replace('_list_',_list_);
    }
    
    var r2t = template(rt);
    // console.log(r2t)
    return template(rt);
}

app.all("/",async(req,res)=>{
    var rt = await getList();
    res.send(rt);
});


// http://127.0.0.1:3000/get_site
app.get("/get_site",(req,res)=>{
    db.all("select distinct site from news",function(err,row){
        res.json(row); 
    })
});
// http://127.0.0.1:3000/get_list?site=baidu
// http://127.0.0.1:3000/get_list?site=donews
app.get("/get_list",(req,res)=>{
    var site = req.query.site;
    (async()  => {
        try {   
            db.all(`select * from news where site = '${site}' order by AddTime desc ` ,function(err,row){
                res.json(row); 
            })
        } catch (error) {
            res.json({"err":error});
        }
    })();
});

var tempDiv=()=>{
    return tempeStr = `   
    <div class="item">
        _site_<br>
        _list_
    </div>`;
}

var template = (_content_)=>{
    let tempStr = ` 
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>favo.html</title>
<link rel="stylesheet" href="../jscss/js.do.css" />
<link rel="stylesheet" href="../jscss/BIZ_MS.css" />
<script type="text/javascript" src="http://js.jrjimg.cn/lib/jquery-1.7.min.js"></script>
<base target="_blank"/>
</head>
<body>
    <div class="masonry">${_content_}
    </div>
<style type="text/css">    
.masonry { column-count: 5; column-gap: 0; margin-left: 10px;margin-right: 10px; margin-top: 5px;}
.item { break-inside: avoid; box-sizing: border-box; padding: 5px; border:solid 1px rgb(180, 177, 179);margin: 3px;}
.item a{ list-style: none; margin-bottom: 8px; margin-left: 3px; display: list-item; color: rgb(58, 23, 166); font-size: 12px; line-height: 20px; text-decoration: none;color: black}
.row { width: 90%; display: flex;float: right }
.row2 { float: left; font-size: 12px;}
a:hover { color: red; }
a:nth-child(odd){ background: #f0eded;}
    
    
</style>
</body>
</html>
    `;
    return tempStr;
    // padding-left:25px;text-indent:-25px;
}

app.use(express.static("views")).listen(3003);
console.log("http://127.0.0.1:3003/ : 新闻列表")
//测试入口 http://127.0.0.1:3000/content_newslist_bak.html
// app.listen(3000)

// 显示逻辑
// 1. 默认显示最近一周的新闻
// 2. 可以选择上周,上上周的

// 爬行逻辑
// 3. centos上是否可以运行chrome浏览器
// 4. 后台固定爬行, 定时循环

