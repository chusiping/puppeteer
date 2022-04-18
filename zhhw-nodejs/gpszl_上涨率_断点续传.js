//【2021.09.23】
// redis.qy / NodeJsApp / zhhw-nodejs / shangzhanglv_stock.js
//流程图：https://www.processon.com/diagraming/6139a166e401fd1fb6b5bdc7
//接口：http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=sh601066&scale=240&ma=20&datalen=2  symbol：代码 scale：240日线 ma:20均线 datalen=前2天
const got = require('got');
var fs = require("fs");
var sd = require('silly-datetime');
const lib_AllStockCode = require('./lib_AllStockCode');
var destPath = './download/point.txt'
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
    return `总${array.length}天，开始于：${st}[${array.at(0).close}] , 结束于：${et}[${array.at(-1).close}] `;
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
    var rt={};
    rt.stockObj = stockObj; rt.gp = gp;
    return rt;
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
    var string = sd.format(new Date(), 'YYYY-MM-DD');
    var appfile = './download/AllHistoryData_'+ string +'.txt';
    var ponit  = getPoint();
    var kaitou = "[";
    var weiba = ","
    console.log("开始 ponit :" + ponit);
    for ( let i = ponit; i < stock_arr.length; i++) {    //循环数组
        var obj = stock_arr[i];                     //取出股票代码
        if((obj.name).includes('ST')) continue;     //ST股票跳过
        var _code = 加sz前缀(obj.code)
        // const element = array[i];
        try {
            const response = await got('http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol='+ _code +'&scale=240&ma=20&datalen='+daylength); //获取接口报价
            console.log(lib_逐行显示打印行号(i,stock_arr.length,obj));
            //改为追加 
            if( i>0 ) kaitou = "";
            if( i == stock_arr.length -1)weiba = "]"; 
            var to_txtRow_ = to_txtRow(obj.name,obj.code, JSON.parse(response.body));
            await AppendData(appfile,kaitou + JSON.stringify(to_txtRow_.stockObj) + weiba );
            fs.writeFileSync(destPath, (i+1).toString());
        } catch (error) {
            console.log('error:', error);
        }
        await sleep();
    }

    // 循环已经完成则删除point.txt
    fs.unlink(destPath,function(error){
        if(error){console.log('出现异常'); return false; } console.log('删除成功');
    });
});
const fenxi = (async (recentDay,cutTpp)=>{
    var string = sd.format(new Date(), 'YYYY-MM-DD');
    file = './download/AllHistoryData_'+ string +'.txt';
    const data = await fs.readFileSync(file, 'utf8');
    var object = JSON.parse(data); 
    var arr_all = [];
    for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            const le = object[key];
            await sleep();
            // var splice_data =  le.data.slice(recentDay)
            var splice_data = le.data.slice(recentDay);

            console.log(splice_data);
            var rt = to_txtRow(le.name,le.code,splice_data)
            arr_all.push(rt.gp);
        }
    }
    
    var writerStream1 = fs.createWriteStream('./download/爬虫数据_最近n天涨幅.txt');
    writerStream1.write(sortData(arr_all,"zhangfu_now",cutTpp),'UTF8');
    writerStream1.end();
});

const getPoint = ()=>{
    try { 
        fs.accessSync(destPath, fs.constants.F_OK); 
        console.log('0');
        console.log('1');
    } catch (err) { 
        fs.writeFileSync(destPath, "0");
        console.log('创建断点文件完成 - ' + destPath);
        console.log('01');
        console.log('02');
    } finally {
        const data = fs.readFileSync(destPath, 'utf8');
        console.log('开始数据位置 : ' + data);
        console.log("-----------");
        return data;
    }
};

const AppendData = (async (appfile,content)=>{
    fs.appendFile(appfile,content+'\n',function(error){
        if(error){
            console.log(error);
            return false;
        }
        console.log('写入成功');
    })
});


//参数1：股票数组 
//参数2：多少天的价格
//筛选结果：上涨天数最多，上涨幅度最大
// hdcode(stock_arr,60);
// 

//参数1：根究下载的txt数据分析，只看最近5天的数据,用-5
//筛选结果：上涨天数最多，上涨幅度最大
// fenxi(-20,20);


var arg = process.argv.splice(2);
if(arg.length >0)
{
    if(arg[0] == "2") {
        fenxi(-20,20);
    }else
        hdcode(stock_arr,60);
}else{
    console.log('请输入参数:1 为爬取数据 2 为分析数据');
}


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