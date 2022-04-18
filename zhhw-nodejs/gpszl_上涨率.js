//【2021.09.23】
// redis.qy / NodeJsApp / zhhw-nodejs / shangzhanglv_stock.js
//流程图：https://www.processon.com/diagraming/6139a166e401fd1fb6b5bdc7
//接口：http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=sh601066&scale=240&ma=20&datalen=2  symbol：代码 scale：240日线 ma:20均线 datalen=前2天
const got = require('got');
var fs = require("fs");
var sd = require('silly-datetime');
const lib_AllStockCode = require('./lib_AllStockCode');
const sleep = () => new Promise((res, rej) => setTimeout(res, 1000));
var stock_arr = lib_AllStockCode.codes2;

// var sqlite3 = require('sqlite3');
// var usersDB = new sqlite3.Database("../database/ClosePrice.db");
var arrHisData = [];

//过滤得到一维数组
function 一维数组(array)
{
    var newArray=[];
    for(let i in array){
        newArray.push(array[i].close); //取收盘价格
    }
    return newArray;
}

function 上涨次数(array)
{
    var cnt =0;
    var cnt_all = array.length;
    for(let i in array){
        var lastclose = i == 0 ? 0:array[i-1].close;
        zhang = array[i].close - lastclose  //今日收盘价-昨日收盘价 = 今日涨幅  
        if(zhang > 0 ){
            cnt++
        }
    }
    return (cnt/cnt_all*100).toFixed(2);
}
function 开始结束日期(array)
{
    var st = array.at(0).day;
    var et = array.at(-1).day;
    return `\t总${array.length}天，开始于：${st}[${array.at(0).close}] , 结束于：${et}[${array.at(-1).close}] `;
}
function 高低价差(array)
{
    var arr = 一维数组(array);
    zuigaojia = Math.max(...arr);
    zuidijia =  Math.min(...arr);
    rt = ((zuigaojia - zuidijia)/zuidijia * 100) ;
    return rt.toFixed(2);
}
function 平均值(array)
{
    var values = 一维数组(array);
    let sum = values.reduce((previous, current) => current += previous);
    let avg = sum / values.length;
    return avg;
}
function 加sz前缀(code)
{
    st = 'sz';
    if(code.indexOf('6') == 0)
    {
        st='sh';
    }
    return st+code;
}
function 当前涨幅(array)
{
    var values = 一维数组(array);
    let cha =  values.at(-1)-values[0] ;
    let rt = (cha/values[0]) * 100;
    return rt.toFixed(2);;
}

function to_txtRow(name,code,arryhistory)
{   
    var day_zhang =上涨次数(arryhistory);
    var zhangfu = 高低价差(arryhistory);
    var zhangfu_now = 当前涨幅(arryhistory);
    gp = {};
    gp.name = name;gp.code = code;gp.zhang = day_zhang; gp.zhangfu = zhangfu;gp.zhangfu_now = zhangfu_now;gp.stet = 开始结束日期(arryhistory);
    var stockObj = {};
    stockObj.name = name;stockObj.code = code,stockObj.data = arryhistory;
    arrHisData.push(stockObj);
    return gp;
}
function compare(p){ //这是比较函数
    return function(m,n){
        var a = m[p];
        var b = n[p];
        return b - a; //升序
    }
}
function sortData(arryrt,type,cut=4000)
{   
    arryrt.sort(compare(type));//选择zhang ，还是zhangfu 排序
    var string = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    for (let i = 0; i < arryrt.length; i++) {
        if((arryrt[i].name).includes('ST')) continue;
        tt = '\t';
        if((arryrt[i].name).length != 4 ) tt = '\t\t'; 
        string += '\r\n'+ arryrt[i].code + "," +arryrt[i].name + ","+ tt +"上涨天数：" + arryrt[i].zhang + "%,  振幅：" + arryrt[i].zhangfu +"%,\t涨幅：" + arryrt[i].zhangfu_now +"%," + arryrt[i].stet ;
        if((i+1) == cut) break;
    }
    console.log(string);
    return string;
}
function lib_逐行显示打印行号(i,count,obj)
{
    rt =  i.toString() + '/' + count + ' ' + JSON.stringify(obj) + ' cpomlete!';
    return rt; 
}

const hdcode = (async (stock_arr,daylength) => { 
    var arr_all = [];
    for (let i = 0; i < stock_arr.length; i++) {    //循环数组
        var obj = stock_arr[i];                     //取出股票代码
        if((obj.name).includes('ST')) continue;     //ST股票跳过
        var _code = 加sz前缀(obj.code)
        // const element = array[i];
        try {
            const response = await got('http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol='+ _code +'&scale=240&ma=20&datalen='+daylength); //获取接口报价
            console.log(lib_逐行显示打印行号(i,stock_arr.length,obj));
            arr_all.push(to_txtRow(obj.name,obj.code, JSON.parse(response.body)));
        } catch (error) {
            console.log('error:', error);
        }
        await sleep();
    }
    var string = sd.format(new Date(), 'YYYY-MM-DD');
    // var writerStream1 = fs.createWriteStream('./download/爬虫数据_上涨天数_'+ string +'.txt');
    // var writerStream2 = fs.createWriteStream('./download/爬虫数据_上涨幅度_'+ string +'.txt');
    var writerStream3 = fs.createWriteStream('./download/AllHistoryData_'+ string +'.txt');
    // writerStream1.write(sortData(arr_all,"zhang"),'UTF8');
    // writerStream2.write(sortData(arr_all,"zhangfu_now"),'UTF8');
    writerStream3.write((JSON.stringify(arrHisData)),'UTF8');
    // writerStream1.end();
    // writerStream2.end();
    writerStream3.end();
});
const fenxi = (async (recentDay,cutTpp)=>{
    var string = sd.format(new Date(), 'YYYY-MM-DD');
    file = './download/AllHistoryData_'+ string +'.txt';
    const data = await fs.readFileSync(file, 'utf8')
    var object = JSON.parse(data); 
    var arr_all = [];
    for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            const le = object[key];
            var splice_data = le.data.slice(recentDay) 
            var rt = to_txtRow(le.name,le.code,splice_data)
            arr_all.push(rt);
        }
    }
    
    var writerStream1 = fs.createWriteStream('./download/爬虫数据_最近n天涨幅.txt');
    writerStream1.write(sortData(arr_all,"zhangfu_now",cutTpp),'UTF8');
    writerStream1.end();
});


//参数1：股票数组 
//参数2：多少天的价格
//筛选结果：上涨天数最多，上涨幅度最大
// hdcode(stock_arr,60);

//参数1：根究下载的txt数据分析，只看最近5天的数据,用-5
//筛选结果：上涨天数最多，上涨幅度最大
fenxi(-20,20);

/* 
    使用密钥登录
    ssh root@redis.qy 
    cd /root/NodeJsApp/zhhw-nodejs && node gpszl_股票上涨率.js
    node gpszl_股票上涨率.js
*/

/*
版本功能
2021-11-16 17:50
    增加中断续爬功能, 中断后,不用从头开始,从上次断开的地方续上爬取数据
*/