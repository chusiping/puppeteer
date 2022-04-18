//【2021.09.23】
// redis.qy / NodeJsApp / zhhw-nodejs / shangzhanglv_stock.js
//流程图：https://www.processon.com/diagraming/6139a166e401fd1fb6b5bdc7
//接口：http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=sh601066&scale=240&ma=20&datalen=2  symbol：代码 scale：240日线 ma:20均线 datalen=前2天
const got = require('got');
var fs = require("fs");
var sd = require('silly-datetime');
const lib_AllStockCode = require('./lib_AllStockCode');
const sleep = () => new Promise((res, rej) => setTimeout(res, 1200));
var stock_arr = lib_AllStockCode.codes2;
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
    var st = array.at(1).day;
    var et = array.at(-1).day;
    return `开始于：${st}-[${array.at(1).close}] , 结束于：${et}[${array.at(-1).close}] `;
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
    return gp;
}
function compare(p){ //这是比较函数
    return function(m,n){
        var a = m[p];
        var b = n[p];
        return b - a; //升序
    }
}
function show(arryrt,type)
{   
    arryrt.sort(compare(type));//选择zhang ，还是zhangfu 排序
    var string = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    for (let i = 0; i < arryrt.length; i++) {
        if((arryrt[i].name).includes('ST')) continue;
        tt = '\t';
        if((arryrt[i].name).length != 4 ) tt = '\t\t'; 
        string += '\r\n'+ arryrt[i].code + "," +arryrt[i].name + ","+ tt +"上涨天数：" + arryrt[i].zhang + "%,  涨跌幅：" + arryrt[i].zhangfu +"%,  当前涨幅：" + arryrt[i].zhangfu_now +",\t" + arryrt[i].stet ;
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
    var string = sd.format(new Date(), 'YYYY-MM-DD_HHmm');
    var writerStream = fs.createWriteStream('爬虫数据_上涨天数_'+ string +'.txt');
    var writerStream2 = fs.createWriteStream('爬虫数据_上涨幅度_'+ string +'.txt');
    writerStream.write(show(arr_all,"zhang"),'UTF8');
    writerStream2.write(show(arr_all,"zhangfu_now"),'UTF8');
    writerStream.end();
    writerStream2.end();
});

//参数1：股票数组 
//参数2：多少天的价格
//筛选结果：上涨天数最多，上涨幅度最大
hdcode(stock_arr,60);

/* 
    使用密钥登录
    ssh root@redis.qy 
    node ./NodeJsApp/zhhw-nodejs/gpszl_股票上涨率.js
*/
