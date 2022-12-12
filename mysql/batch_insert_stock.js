//可用2021-7-7完成
//功能：循环url的历史股价json对象，异步循环插入到mysql数据库
var lib = require('./lib_stockcodes.js')
var async = require('async')
var http = require('http');
const mysql = require('mysql')

var arr = lib.getObjectArr();
var start = 0;
async.eachSeries(arr, (item, callback) => {
    if(start == 0){
        console.log(item.code);
        if(item.name ==  "联美控股") start = 1;  
        callback();    
    }else{
        // console.log(item.name);  callback(); 
        httpget(item,callback); 
    }
}, (err) => console.log("err : " + err));

async function httpget(obj,callback)
{
  setTimeout(() => {    
    http.get(obj.url, function (res) {
        var html = '';
        res.on('data', function (data) { html += data;  });
        res.on('end', function () {
            // console.log(html)
            if(dohtml===true)
            {   console.log(obj.url + ' ：反爬虫拒绝访问'); }else{
                data2=JSON.parse(html)
                // console.log(data2)
                par= doArr(data2,obj)
                insert(par);
                callback();
            }
        });
    });
  }, 1500);
}
async function insert(param)
{
    var connection = mysql.createConnection({ host : '192.168.1.144',user: 'root',password : '1qaz@WSX', port: '3306',database: 'news', }); 
    var  userAddSql = 'INSERT INTO t_his_price(code,name,date,open,high,low,close,vol) VALUES ? ';  
    // var param = [['000001','平安银行','2021-07-02',22.720,22.740,21.760,21.810,107067756],['000001','平安银行','2021-07-05',21.690,22.150,21.090,22.060,85934129]]
    var query = connection.query(userAddSql,[param],function (err, result) { 
        console.log(param[0] + " - error : " + err ); 
        connection.end();
        if(err) process.exit(1);
    });
}
function doArr(_data,obj)
{
    var arr = []
    for (let x = 0; x < _data.length; x++) {
        const el = _data[x];
        var sql = [`${obj.code}`,`${obj.name}`,`${el.day}`,`${el.open}`,`${el.high}`,`${el.low}`,`${el.close}`,`${el.volume}`];
        arr.push(sql);
    }
    return arr;
}
//判断是否出现反爬虫的警告信息
function dohtml(html)
{    
    return html.includes('拒绝访问');
}


// 数据格式
// [
//   {
//   day: "2021-07-01",
//   open: "31.950",
//   high: "32.260",
//   low: "30.070",
//   close: "30.130",
//   volume: "28817811"
//   },
//   {
//   day: "2021-07-02",
//   open: "30.130",
//   high: "30.220",
//   low: "29.450",
//   close: "29.500",
//   volume: "21507707"
//   },
//   {
//   day: "2021-07-05",
//   open: "29.630",
//   high: "29.730",
//   low: "28.900",
//   close: "29.240",
//   volume: "18064059"
//   }
//   ]

// 表结构
// DROP TABLE IF EXISTS `t_his_price`;
// CREATE TABLE `t_his_price` (
//   `ID` int(11) NOT NULL AUTO_INCREMENT,
//   `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL ,
//   `code` char(6) COLLATE utf8_unicode_ci NOT NULL,
//   `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   `open` decimal(10,4) COLLATE utf8_unicode_ci NOT NULL ,
//   `high` decimal(10,4) COLLATE utf8_unicode_ci NOT NULL ,
//   `low` decimal(10,4) COLLATE utf8_unicode_ci NOT NULL ,
//   `close` decimal(10,4) COLLATE utf8_unicode_ci NOT NULL ,
//   `vol` decimal(25) COLLATE utf8_unicode_ci NOT NULL ,
//   PRIMARY KEY (`ID`),
//   UNIQUE KEY `name_date` (`code`,`date`)
// ) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;  
  

// select code, name ,count(1) from t_his_price group by name 
// order by code 

/*  ali-mysql-client
为nodejs访问mysql数据库提供强大流畅的api的工具类库，目标是希望访问数据库逻辑都能使用一行代码完成，让访问数据库变得更加简单优雅。
https:ithub.com/liuhuisheng/ali-mysql-client
https://juejin.cn/post/6844903904728219661
*/
