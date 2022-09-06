var request = require('request');
var app = require('express')
var sd = require('silly-datetime');
var fs = require("fs");
var MyLib = require("../public/_LibNode"); 
var path = require('path');
const sleep = (tim) => new Promise((res, rej) => setTimeout(res, tim));
const schedule = require('node-schedule');

//自动重启 nodemon --exec node main.js


// 获取新浪股票价格接口 测试地址 http://192.168.12.14:3000/sina?code=sh601225
exports.sina = function (req, res, next) {
    let code = req.query.code;
    if(code==null || code=="") code = "sh601066"
    let get_sina = function (_code) {
        return new Promise((resolve, reject) => {       
            request.get({
                url: 'http://hq.sinajs.cn/list=' + _code,
                headers: {
                    referer: "https://finance.sina.com.cn"
                },
            }, (err, response, data) => {
                console.log(_code)
                resolve(data)
            });
        });
    };
    get_sina(code).then(data => { res.send(data) });
}
// 显示股票排行榜 测试地址 http://192.168.12.14:3000/top?day=10&date=2022-07-05
exports.top = function (req, res, next) {
    var arrHisData = [];
    var _day = req.query.day;
    var _date2 = req.query.date;
    var _isapi = req.query.isapi == null ? "" : req.query.isapi;
    _day =  ~_day+1;
    var _date = sd.format(new Date(), 'YYYY-MM-DD');
    var _href = "<a href=\"/top?day=10&date=" + _date + "\">排行</a>";
    let init = async ()=> {
        try {
            const rt = await fenxi(_day,30,_date2);

            // res.send(rt);
            if(_isapi == ""){
                await res.render("top",{ data : rt.data , href : _href, codes : rt.codes });
            }else{
                res.send(rt.codes.replaceAll("<br>",""));
            }

        } catch (error) {
            res.send("异常 : "+ error + "\n"+ _href);
        } 
    };
    let fenxi = (async (recentDay,cutTop,_date2)=>{
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
                if(rt==null) continue;
                arr_all.push(rt);
            }
        }
        var str = sortData(arr_all,"zhangfu_now",cutTop,recentDay);
        return str;
    });
    
        
    let to_txtRow=function (name,code,arryhistory)
    {   
        var day_zhang =上涨次数(arryhistory);
        var zhangfu = 高低价差(arryhistory);
        var zhangfu_now = 当前涨幅(arryhistory);
        gp = {};
        gp.name = name;gp.code = code;gp.zhang = day_zhang; gp.zhangfu = zhangfu;gp.zhangfu_now = zhangfu_now;gp.stet = 开始结束日期(arryhistory);
        var stockObj = {};
        stockObj.name = name;stockObj.code = code,stockObj.data = arryhistory;
        if(gp.stet == null || gp.stet == "" )
        {
            return null;
        }
        arrHisData.push(stockObj);
        return gp;
    }
    let 上涨次数 = function (array)
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
    let 高低价差 = function (array)
    {
        var arr = 一维数组(array);
        zuigaojia = Math.max(...arr);
        zuidijia =  Math.min(...arr);
        rt = ((zuigaojia - zuidijia)/zuidijia * 100) ;
        return rt.toFixed(2);
    }
    let 当前涨幅 = function (array)
    {
        var values = 一维数组(array);
        let cha =  values.at(-1)-values[0] ;
        let rt = (cha/values[0]) * 100;
        return rt.toFixed(2);;
    }
    let 一维数组 = function (array)
    {
        var newArray=[];
        for(let i in array){
            newArray.push(array[i].close); //取收盘价格
        }
        return newArray;
    }

    let 开始结束日期 =  function (array)
    {
        var st开始日期 = array.at(0).day;
        var et结束日期 = array.at(-1).day;
        //排除停牌股票和退市股票

        var t = new Date();///计算日期 计算时间 日期加减
        let str_ = sd.format(t, 'YYYYMMDD');
        let str2 = sd.format(new Date(et结束日期), 'YYYYMMDD');
        let cha距当天多少天 = parseInt(str_) - parseInt(str2)
        if(array.at(0).close < 2 || cha距当天多少天 > 3 )    return "";  //1块多的st或退市股不计算
        return `\t总${array.length}天，开始于：${st开始日期}[${array.at(0).close}] , 结束于：${et结束日期}[${array.at(-1).close}] `;
    }
    let sortData = function (arryrt,type,cut=4000,recentDay)
    {   
        arryrt.sort(compare(type)); //选择zhang ，还是zhangfu 排序
        var codes = "";             //"000653,600454 ...."
        var string = arryrt[0].stet + "<br>";   // var string = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
        var obj_rt = {};
        var HuanHang = 1;
        for (let i = 0; i < arryrt.length; i++) {
            if((arryrt[i].name).includes('ST')) continue;
            if(arryrt[i].name.length == 3) arryrt[i].name += "　" 
            // string += '\r\n'+ arryrt[i].code + "," +arryrt[i].name + ","+ tt +"上涨天数：" + arryrt[i].zhang + "%,  振幅：" + arryrt[i].zhangfu +"%,\t涨幅：" + arryrt[i].zhangfu_now +"%," + arryrt[i].stet ;
            codeAdd = `<a href='http://win7.qy/vhost/custom/api_stock.php?fcname=AddCode&bkname=null&code=${arryrt[i].code}'  target='_blank'>加入自选</a> `;
            hrefgoog = `<a href='https://www.google.com/search?ei=pM7HXL-yHovfz7sPsaa-SA&q=${arryrt[i].name}+site%3Acaifuhao.eastmoney.com&oq=${arryrt[i].name}+site%3Acaifuhao.eastmoney.com'  target='_blank'>${arryrt[i].code}</a> `
            Wencai = `<a href='http://www.iwencai.com/unifiedwap/result?tid=stockpick&qs=sl_box_main_ths&w=${arryrt[i].name}'   target='_blank'>${arryrt[i].code}</a>` ;
            var istr = i < 9 ? 0 + (i+1).toString() : (i+1).toString();
            
            //原来模板 
            //string += `<br>${istr} <a href='https://q.stock.sohu.com/cn/${arryrt[i].code}/index.shtml' target='_blank'>${arryrt[i].name}</a> ${Wencai} ${codeAdd} 上涨天数：${arryrt[i].zhang}% , 振幅：${arryrt[i].zhangfu}% , 涨幅：${arryrt[i].zhangfu_now}% , ${arryrt[i].stet}` ;

            var string_模板 = `<br> _序号_ <a href='https://q.stock.sohu.com/cn/_代码_/index.shtml' target='_blank'>_名称_</a> _问财_ _添加_ _recentDay_天涨幅：_当前涨幅_% ,上涨天数：_涨天数_% , 振幅：_振幅_% ,  _上涨率_` ;

            var zhang_ = arryrt[i].zhang.length == 5 ? "0"+arryrt[i].zhang : arryrt[i].zhang;

            string += string_模板.replace('_序号_',istr).replace('_代码_',arryrt[i].code).replace('_名称_',arryrt[i].name).replace('_问财_',Wencai).replace('_添加_',codeAdd).replace('_涨天数_',zhang_).replace('_振幅_',arryrt[i].zhangfu).replace('_当前涨幅_',arryrt[i].zhangfu_now).replace('_上涨率_',arryrt[i].stet).replace('_recentDay_',- recentDay);

            codes += arryrt[i].code+",";
            if( (HuanHang > 9) && (HuanHang % 10) == 0) codes += "<br>"; //一行显示太长，换三行
            HuanHang++;
            if((i+1) == cut) break;
        }
        obj_rt.data = string;
        obj_rt.codes = codes;

        return obj_rt;
    }
    let compare = function (p){ //这是比较函数
        return function(m,n){
            var a = m[p];
            var b = n[p];
            return b - a; //升序
        }
    }

    init();
}
// ocr图片转文字提交百度接口接口 测试地址 http://192.168.12.14:3000/api_ocr.html
exports.ocr = async function (req, res, next) {
    var gUID = "BF4E3603-135C-48F1-9DBB-479A6FD5BBF8";
    let exec = async()=>{
        if(gUID == req.query.UID ){
            let leftName ='./temp_pic/' + Math.floor(Date.now() / 1000)+ "_" + parseInt((Math.random() * 100000000000), 10);
            let rt = await MyLib.upFile(req,leftName);
            if(rt.status){
                console.log(rt);
                await sleep(500); //如果文件很大，可能要很长的时间
                let code = await MyLib.OCR(rt.filePath);
                rt.ocr_words = code.words_result;
                res.send(rt);
            }else{
                res.send(rt);
            }
        } else{
            res.send('{status:false,message:"UID错误"}'); 
        }
    };
    let clear = ()=>{
        console.log("api_ocr : schedule定时清理执行等待中...:");
        let rule = new schedule.RecurrenceRule();       // https://segmentfault.com/a/1190000022455361
        // rule.second = [0, 2, 4, 6, 8, 10];           //每十秒实行
        // rule.minute = 30;rule.second = 0;            //每小时 30 分执行
        rule.hour=03;rule.minute =01;rule.second =01;   //每天 01点01 点执行
        let job = schedule.scheduleJob(rule, () => {
            console.log("清除过期文件开始.....");
            MyLib.delDir('./temp_pic');
        });
    };
    exec();
    clear();
}



