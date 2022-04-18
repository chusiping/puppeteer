const express = require('express');
var sd = require('silly-datetime');
var fs = require("fs");
const app = express();
var ejs = require('ejs');   
app.engine('html',ejs.__express);  
app.set('view engine', 'html');  
var arrHisData = [];
var _date = sd.format(new Date(), 'YYYY-MM-DD');
var _href = "<a href=\"/top?day=10&date=" + _date + "\">排行</a>";
var txt = "";

app.get("/",(req,res)=>{
    res.send(_href);
    // res.render("index",{ href : _href ,codes : dd});
});

app.get("/top",(req,res)=>{
    var dd = req.query.day;
    var _date2 = req.query.date;
    dd =  ~dd+1;
    (async()  => {
        try {
            const rt = await fenxi(dd,30,_date2);
            await res.render("index",{ data : rt.data , href : _href, codes : rt.codes });
        } catch (error) {
            res.send("异常 : "+ error + "\n"+ _href);
        }
    })();
});




//参数1：recentDay只看最近5天的数据,用-5
//参数2：cutTop只选排行前20的
//筛选结果：上涨天数最多，上涨幅度最大
var fenxi = (async (recentDay,cutTop,_date2)=>{
    var txtSJ = sd.format(new Date(), 'YYYY-MM-DD');
    file = 'download/AllHistoryData_'+ _date2 +'.txt';
    // file = '../zhhw-nodejs/download/AllHistoryData_'+ txtSJ +'.txt';
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
    var str = sortData(arr_all,"zhangfu_now",cutTop);
    return str;
});


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
function 高低价差(array)
{
    var arr = 一维数组(array);
    zuigaojia = Math.max(...arr);
    zuidijia =  Math.min(...arr);
    rt = ((zuigaojia - zuidijia)/zuidijia * 100) ;
    return rt.toFixed(2);
}
function 当前涨幅(array)
{
    var values = 一维数组(array);
    let cha =  values.at(-1)-values[0] ;
    let rt = (cha/values[0]) * 100;
    return rt.toFixed(2);;
}
function 一维数组(array)
{
    var newArray=[];
    for(let i in array){
        newArray.push(array[i].close); //取收盘价格
    }
    return newArray;
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
function sortData(arryrt,type,cut=4000)
{   
    arryrt.sort(compare(type)); //选择zhang ，还是zhangfu 排序
    var codes = "";             //"000653,600454 ...."
    var string = arryrt[0].stet + "<br>";   // var string = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    var obj_rt = {};
    for (let i = 0; i < arryrt.length; i++) {
        if((arryrt[i].name).includes('ST')) continue;
        if(arryrt[i].name.length == 3) arryrt[i].name += "　" 
        // string += '\r\n'+ arryrt[i].code + "," +arryrt[i].name + ","+ tt +"上涨天数：" + arryrt[i].zhang + "%,  振幅：" + arryrt[i].zhangfu +"%,\t涨幅：" + arryrt[i].zhangfu_now +"%," + arryrt[i].stet ;
        codeAdd = `<a href='http://win7.qy/vhost/custom/api_stock.php?fcname=AddCode&bkname=null&code=${arryrt[i].code}'  target='_blank'>加入自选</a> `;
        hrefgoog = `<a href='https://www.google.com/search?ei=pM7HXL-yHovfz7sPsaa-SA&q=${arryrt[i].name}+site%3Acaifuhao.eastmoney.com&oq=${arryrt[i].name}+site%3Acaifuhao.eastmoney.com'  target='_blank'>${arryrt[i].code}</a> `
        Wencai = `<a href='http://www.iwencai.com/unifiedwap/result?tid=stockpick&qs=sl_box_main_ths&w=${arryrt[i].name}'   target='_blank'>${arryrt[i].code}</a>` ;
        var istr = i < 9 ? 0 + (i+1).toString() : (i+1).toString();
        string += `<br>${istr} <a href='https://q.stock.sohu.com/cn/${arryrt[i].code}/index.shtml' target='_blank'>${arryrt[i].name}</a> ${Wencai} ${codeAdd} 上涨天数：${arryrt[i].zhang}% , 振幅：${arryrt[i].zhangfu}% , 涨幅：${arryrt[i].zhangfu_now}% , ${arryrt[i].stet}` ;
        //string += `<br>${istr} <a href='http://quote.eastmoney.com/${arryrt[i].code}.html' target='_blank'>${arryrt[i].name}</a> ${Wencai} ${codeAdd} 上涨天数：${arryrt[i].zhang}% , 振幅：${arryrt[i].zhangfu}% , 涨幅：${arryrt[i].zhangfu_now}% , ${arryrt[i].stet}` ;
        codes += arryrt[i].code+",";
        if((i+1) == cut) break;
    }
    obj_rt.data = string;
    obj_rt.codes = codes;

    return obj_rt;
}
function compare(p){ //这是比较函数
    return function(m,n){
        var a = m[p];
        var b = n[p];
        return b - a; //升序
    }
}

app.listen(3000)
