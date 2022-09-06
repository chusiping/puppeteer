const sleep = (tim) => new Promise((res, rej) => setTimeout(res, tim));
var exec = require('child_process'); 
var sd = require('silly-datetime');
var fs = require('fs');
const schedule = require('node-schedule');
let stderr = fs.createWriteStream('./addto_JQK.log', {flags: 'w',  encoding: 'utf8', });//日志
let logger = new console.Console(stderr);//???如何实现一条语句两个用处
//返回cookie值
var msg = "";
var df  = {
    name : "东方财富",
    cookie : function() { return "em_hq_fls=js; st_si=42671117262218; qgqp_b_id=0e771b8aa1190285582a8b6ca7938de3; em-quote-version=topspeed; p_origin=https%3A%2F%2Fpassport2.eastmoney.com; login_canskip=true; intellpositionL=1013.49px; yzmkey=92928e5dd2f6496d8c4e0bfd27244fd9; intellpositionT=2055.11px; login_apicontext=rhz3Y1cR5uZ5IpDRpN%2FVmj1YGOmoCLLbecJT8AcRdWX61DjNP4rk%2B3uQUHM%2FVssl912coOF61EmqPYD0TxzOcOCh0NCx6evgBgZIwBhV7aH7i5pHbspEXd09o6fjskxt%2Fe0jaO4N4YDKsFZcWTv7r5vm9dKWkBN5s3FUB1OgCB4%3D; mtp=1; ct=iYyz_fsnhBJb6GTebXeRKIbp3DRCpeodZAja2AJFXE0TRbzaa903yDrnyL9Wsf6TmmjAygqq2kBRulEDF-w3RE_xyPI_yyTqUb0Gtk1hAB6x4KTBbLF_Xgp7oo4n4xusU4qTJY1sqPxSBbWmMUdNWJg2OjGmc7w4xOfh5lF_-yM; ut=FobyicMgeV6W21ICVIh674b-4cT8YBaIDxfxf5hBLhgiiVlkCdk9OEyAaXgBfZQYi7vu62r2eFFB1RiQVSLTvluK0U_DUIOYwG1lUr-h75-z1opMZyrowt3ntpcCpmDBuzkbs-2e0d7G0DJpQDrI3WN51gbJfaxI-2p5AuYnzmBCc3jtHBCxEmSNE-_4zB19iyxCNDTfRDAp9lew4x7rg8K5ctGVmM5DPUmc47u04rAgydxorKLx6iW72zueQCFTp9X5q_Aqkdy9yQtUf2QaWeJe16t_yxOb; pi=3391013824560020%3b%3b%e5%bf%83__%e8%bf%9c%3bFbwEroScrhAnlsmh8HdQLplIvLP6bt9LkoQlyhp%2bSDAbF5FEV9wswCQIAiH8HZuxJgaNAcpIUKZwA8LE7%2b1wAuzndSZSRRyZ%2fdGGljUID0xJFyYrlPI%2fbvpkZgv3Rq0PVumRzY32UtIA3Q2uKO6jbQx0%2bc0o3JNbVMc9RkaFx37l06ky7Qh4OhsPfICbg7ZfQZ1lVoHq%3bCwuhWhkwM5j3ec%2b60V4fY%2fit9Q5J5fXrwZutDuwsqHQFFg1LVpl%2f%2fLa%2fYgIk2eWWl5dXBIYOSFRHrFT2dn%2fmzHxwWtxtZgHHVbkXJYGPVJ9EWis49T9bHXbzxfJeA%2f2BlaYDZZddeLRHGszG0YLHZM3ZKPXPOg%3d%3d; uidal=3391013824560020%e5%bf%83__%e8%bf%9c; sid=8960218; vtpst=|; HAList=a-sh-601975-%u62DB%u5546%u5357%u6CB9%2Ca-sz-000756-%u65B0%u534E%u5236%u836F%2Ca-sz-000957-%u4E2D%u901A%u5BA2%u8F66%2Ca-sz-002761-%u6D59%u6C5F%u5EFA%u6295%2Ca-sh-601066-%u4E2D%u4FE1%u5EFA%u6295%2Ca-sz-000722-%u6E56%u5357%u53D1%u5C55%2Ca-sz-002883-%u4E2D%u8BBE%u80A1%u4EFD%2Cty-90-BK0473-%u8BC1%u5238%2Ca-sz-002670-%u56FD%u76DB%u91D1%u63A7%2Ca-sz-002603-%u4EE5%u5CAD%u836F%u4E1A%2Ca-sz-002424-%u8D35%u5DDE%u767E%u7075%2Ca-sh-600062-%u534E%u6DA6%u53CC%u9E64; st_pvi=18891856310866; st_sp=2021-12-15%2009%3A14%3A12; st_inirUrl=http%3A%2F%2Fquote.eastmoney.com%2Fsz300967.html; st_sn=7084; st_psi=20220607154620191-113200301712-2515579100; st_asi=20220607154620191-113200301712-2515579100-Web_so_ss-3"},
    url : function(bk_){ return 'curl -A "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:32.0) Gecko/20100101 Firefox/32.0"  --cookie "'+ this.cookie() +'" "http://myfavor.eastmoney.com/v4/webouter/as?appkey=d41d8cd98f00b204e9800998ecf8427e&cb=jQuery33103190186058732998_165458125273&g='+ bk_ +'&sc=_zero_%24_code_&_=_time_" --referer http://quote.eastmoney.com/' },

    url_have : function(){ return 'curl --cookie "'+ this.cookie() +'"  "http://myfavor.eastmoney.com/v4/webouter/ggdefstkindexinfos?appkey=d41d8cd98f00b204e9800998ecf8427e&cb=jQuery331008460323221682065_1654668930577&_=_time_" --referer http://quote.eastmoney.com/'; },

    //top排行
    url_have3 :function(){ return 'curl --cookie "'+ this.cookie() +'"  "http://myfavor.eastmoney.com/v4/webouter/gstkinfos?appkey=d41d8cd98f00b204e9800998ecf8427e&cb=jQuery33106590009349949781_1662348089426&g=3&_=_time_" --referer http://quote.eastmoney.com/'; },

    url_delete :function(bk_) {return ' curl --cookie "'+ this.cookie() +'" "http://myfavor.eastmoney.com/v4/webouter/dslot?appkey=d41d8cd98f00b204e9800998ecf8427e&cb=jQuery33108123426252924042_1655431990230&g='+ bk_ +'&scs=_zero_%24_code_&_=_time_"  --referer http://quote.eastmoney.com/'},
    RegMessage : /"message":".*?"/g,
    RegSelectCode : /\$\d{6}\$/g
}
var JQK  = {
    name : "同花顺",
    cookie : function() { return "__utmc=156575163; __utmz=156575163.1627262428.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utma=156575163.1268590257.1627262428.1646796534.1646971540.9; historystock=HK6066%7C*%7C002761%7C*%7C600062%7C*%7C600769%7C*%7C600519; searchGuide=sg; log=; user=MDpjaHVzaXBpbmc6Ok5vbmU6NTAwOjg2NzY0MzE0OjcsMTExMTExMTExMTEsNDA7NDQsMTEsNDA7NiwxLDQwOzUsMSw0MDsxLDEwMSw0MDsyLDEsNDA7MywxLDQwOzUsMSw0MDs4LDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxLDQwOzEwMiwxLDQwOjI3Ojo6NzY3NjQzMTQ6MTY1NzA5OTM0NDo6OjEyNjAyOTE3ODA6NDAxODU2OjA6MTM3NDM2ZTcwMTkzZTIxYTRiNzA4NTc2ZDdmNzQ1M2ZmOmRlZmF1bHRfNDow; userid=76764314; u_name=chusiping; escapename=chusiping; ticket=19c7039170d83f8d3e928115982e5fe6; user_status=0; utk=0758a1ce3e8003afd200fc6cc4c960dc; Hm_lvt_78c58f01938e4d85eaf619eae71b4ed1=1657099351; Hm_lpvt_78c58f01938e4d85eaf619eae71b4ed1=1657099393; v=Ax7HnUPw8Iz26yTorIn3OIoCb79j3-JZdKGWPcinimFc67BpMG8yaUQz5kKb"},
    url : function(){ return 'curl -A "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:32.0) Gecko/20100101 Firefox/32.0" --cookie "'+ this.cookie() +'" "https://t.10jqka.com.cn/newcircle/group/modifySelfStock/?callback=modifyStock&op=add&stockcode=_code_&_=_time_"   --referer http://t.10jqka.com.cn/' },

    //使用东方财务的列表数据循环删除
    url_have : function(){ return 'curl -A "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:32.0) Gecko/20100101 Firefox/32.0" --cookie  "'+ this.cookie() +'"  "https://t.10jqka.com.cn/newcircle/group/getSelfStockWithMarket/?callback=selfStock&_=_time_" --referer http://t.10jqka.com.cn/'; },


    url_delete : function(){ return 'curl -A "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:32.0) Gecko/20100101 Firefox/32.0" --cookie "'+ this.cookie() +'" "https://t.10jqka.com.cn/newcircle/group/modifySelfStock/?op=del&stockcode=_code___mark_"   --referer http://t.10jqka.com.cn/' },
    RegMessage : /"errorCode":.*re/g,
    RegSelectCode : /\d{6}/g
}
var site =  { df : df, JQK : JQK }
//获取自选股代码
var getZXG = async()=>
{
    var url = 'curl "http://win7.qy/vhost/custom/api_stock.php?fcname=get_bk2&code=bkzxg_%E8%87%AA%E9%80%89&showtype=1"';
    var rt = await eCurl(url);
    let arrCode = rt.split(',');
    return arrCode;
}
var getTop = async()=>
{

    var t = new Date();///计算日期 计算时间 日期加减
    var str_ =  t.setTime(t.setDate(t.getDate() - 1)); //日期加减
    str_ = sd.format(new Date(str_), 'YYYY-MM-DD');
    var url = 'curl "http://www.mapked.com:3000/top?day=10&date='+str_+'&isapi=1"';
    msg = `获取接口数据::${url}` ;
    console.log(msg);logger.log(msg);
    var rt = await eCurl(url);
    let arrCode = rt.split(',');
    return arrCode;
}

var eCurl = function(cmdStr) { //命令行执行curl
    return new Promise((resolve,reject)=>{
        exec.exec(cmdStr, function(err,stdout,stderr){  //命令行执行curl
            if(err) {
                reject('error:'+stderr); 
            } else {   
                // var data = JSON.parse(stdout);  //curl成功返回data
                resolve((stdout));
            }
        });
    });
}
//自选股已经存在列表,返回数组
var myStockExist = async function (obj,bkNO) {
    let mystock = obj.url_have();
    if(bkNO == 3) mystock = obj.url_have3();
    mystock = mystock.replace('_time_', + Math.floor(Date.now() / 1000)) //时间戳
    var rt = await eCurl(mystock);
    var rt2 = rt.match(obj.RegSelectCode);
    if(rt2 == null ) return [];
    var rt3 = rt2.map(x=> x.replaceAll("$",""));
    return rt3 ;
}

let Get_aaa2自选股或top的排行集合 = async (bkNO) =>{
    let ZxgArr = [] ;           
    if (bkNO == 3){             
        ZxgArr = await getTop();//获取top的30个排行
    }else{
        ZxgArr = await getZXG();
    }
    return ZxgArr
}

let Delete存在的股 = async  (obj,bkNO,_miao_) =>{
        let url_del = obj.url_delete(bkNO);
        let Exsit = await myStockExist(obj,bkNO);        //已经存在的股
        msg = `${sd.format(new Date(), 'YYYY-MM-DD')} :: 已经存在的股(${Exsit.length})个\n ${[...Exsit]}` ;
        console.log(msg);logger.log(msg);
        for (let i = 0; i < Exsit.length; i++) {    //删除已存在的股
            const el = Exsit[i];
            if(el.length == 0) continue;
            let _zero_ = Zero代码补六(el);
            let uurl = url_del.replace('_code_',el).replace('_time_', + Math.floor(Date.now() / 1000)).replace('_zero_',_zero_).replace('_mark_',getZero2(el)); 
            let rt = await eCurl(uurl);
            var rt2 = rt.match(obj.RegMessage);
            rt = rt2[0];
            rt = unescape(rt.replace(/\\u/g, '%u'));//转码
            let bkname__ = bkNO == 1 ? "自选股版块" : "板块2"
            msg =  `${i+1} . ${obj.name} ${bkname__} - 删除 ${el} : ${rt}`
            console.log(msg);logger.log(msg);
            await sleep(_miao_);  
        }
}
let add添加到软件板块 = async  (obj,bkNO,_miao_) =>{
    let url_add = obj.url(bkNO);
    let ZxgArr= await Get_aaa2自选股或top的排行集合(bkNO);
    msg = `${sd.format(new Date(), 'YYYY-MM-DD')} :: 获选接口自选或top排行(${ZxgArr.length})个\n ${[...ZxgArr]}` ;
    console.log(msg);logger.log(msg);
    for (let i = 0; i < ZxgArr.length; i++) { //添加自选股
        const el = ZxgArr[i];
        if(el.length == 0) continue;
        let _zero_ = Zero代码补六(el);
        let uurl = url_add.replace('_code_',el).replace('_time_', + Math.floor(Date.now() / 1000)).replace('_zero_',_zero_); 
        let rt = await eCurl(uurl);
        var rt2 = rt.match(obj.RegMessage);
        rt = rt2[0];
        rt = unescape(rt.replace(/\\u/g, '%u'));//转码
        msg =  `${i+1} . ${obj.name}-添加 ${el} : ${rt}`
        console.log(msg);logger.log(msg);
        await sleep(_miao_);  
    }
}

var Zero代码补六 = (code)=>{
    let rt = "0";
    if(code.substring(0,1) == "6") rt = "1";
    return rt;
}
var getZero2 = (code)=>{
    let rt = "33";
    if(code.substring(0,1) == "6") rt = "17";
    return rt;
}

let run = async()=>{
    await Delete存在的股(site.df,1,600);
    await Delete存在的股(site.df,3,600);
    await add添加到软件板块(site.df,1,600);
    await add添加到软件板块(site.df,3,600);
};

(async()=>{
    if((process.argv.splice(1)).length > 1)  //有参数就执行定时,反之
    {
        run(); //node addto_JQJK.js 1
    }
    else{
        let rule = new schedule.RecurrenceRule();       // https://segmentfault.com/a/1190000022455361
        rule.hour=18;rule.minute =00;rule.second =00;   //每天 01点01 点执行
        msg = `addto_JQK.js - schedule定时执行等待:: ${sd.format(new Date(), 'YYYY-MM-DD')}:`;
        console.log(msg);logger.log(msg);
        let job = schedule.scheduleJob(rule, () => {
            run();
        });
    }    
})();
