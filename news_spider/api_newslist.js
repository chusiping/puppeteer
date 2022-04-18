var request     = require('request');
const express   = require('express');
const app       = express();
var sqlite3     =  require('sqlite3').verbose();
var file        = "new_spider.db";;
var db          = new sqlite3.Database(file);

// http://127.0.0.1:3000/get_site
app.get("/get_site",(req,res)=>{
    db.all("select distinct site from news",function(err,row){
        res.json(row); 
    })
});
// http://127.0.0.1:3000/get_list?site=baidu
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

app.use(express.static("views")).listen(3000);
//测试入口 http://127.0.0.1:3000/content_newslist_bak.html
// app.listen(3000)