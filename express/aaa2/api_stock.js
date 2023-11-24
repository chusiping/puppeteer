// 2022-7-25 16:55 
// 把https://win7.qy/vhost/custom/api_stock.php 转为 api_stock.js
var SqliteDB = require('../../public/_LibSqlite.js').SqliteDB;
var file     = "aaa2.db";
var DB = new SqliteDB(file);
var exec = require('child_process'); 

const express = require('express')
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const ejs = require('ejs');   
app.engine('html',ejs.__express);  
app.set('view engine', 'html');  
app.set('views', './html')
var request = require('request');
var iconv = require('iconv-lite');


// app.use(fileUpload({createParentPath: true}));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

var exec_getSinaPrice = function (req, res, next) {   
    //函数：正则取6位数字，返回逗号隔开的串值  cn_512760-ETF-,cn_512880-ETF-,cn_512800-ETF =>  612760,612800
    let str_common_GetSixCode = function (rt){
        var patt = /\d{6}/g;
        if(rt==null) return [];
        var rt2 = rt.match(patt);
        var rt3 = rt2.map(x=> {
            let mk = "sz";
            if(x.substring(0,1) == "6") mk = "sh";
            if(x.substring(0,1) == "5") mk = "s_sh";
            return mk+x;
        });
        return rt3.join(',');
    };  
    let str_getPrice_FromSina = function (){
        return new Promise((resolve, reject) => { 
            let _code =  str_common_GetSixCode(req.body.P_code);
            var site = { url: 'http://hq.sinajs.cn/list=' + _code, headers: { referer: "https://finance.sina.com.cn"}
            }
            request.get(site).pipe(iconv.decodeStream('gb2312')).collect(function(err, body) {
                resolve(body)
            });
        });
    };
    let GetCurrPrice = function (sina_html){
        let rt =[];
        let arr1 = sina_html.split(';');
        for (let x = 0; x < arr1.length; x++) {
            const e1 = arr1[x];
            let arr2 = e1.split('="');
            if(arr2.length == 2){
                let arr3 = arr2[1].split(',');
                if(arr3.length > 1) rt.push(arr3);
            }   
        }
        return rt;
    }
    let GetArrBK = function(){
        let code = req.body.P_code
        // var patt = /_.*-/g;
        if(code == null) return [];
        var rt2 = code.split(',')
        let rt = [];
        for (let x = 0; x < rt2.length; x++) {
            const el = rt2[x];
            let str = el.replace('cn_','');
            let arr = str.split('-');
            var obj = {};
            if(arr.length > 1){
                obj.code = arr[0];obj.bkname = arr[1] ;
                rt.push(obj);
            }
        }
        return rt;
    }
    let compbin = function(arr1,BK_arr){    
        var obj = {};   
        var rt = [];

        for (let x = 0; x < arr1.length; x++) {
            const e1 = arr1[x];
            const bk_item = BK_arr[x];
            var chajia = 0.00;
            var baifenbi = 0.00;
            if(bk_item.code.substring(0,1) == "5") //eft报价和普通报价的排列方式不同,需要分开处理
            {
                chajia =  parseFloat(e1[2]);
                baifenbi = parseFloat(e1[3]);
            }else{
                chajia = e1[3]-e1[2];
                baifenbi = chajia /  e1[2] * 100;
            }
            if(e1[3]==0) baifenbi = 0;

            obj.code = bk_item.code ;
            obj.name = e1[0];
            obj.price = e1[3];
            obj.per =  baifenbi.toFixed(2);; //百分比
            obj.chajia = chajia.toFixed(2);;
            obj.bkname = bk_item.bkname;
            obj = [obj.code,obj.name, obj.price, obj.per,obj.chajia,obj.bkname];//可以用数组,可以用对象
            rt.push(obj);
        }
        return rt;
    }
    async function exec(){
        let  rt = await str_getPrice_FromSina();
        let arr1 = GetCurrPrice(rt);
        let arr2 = GetArrBK();
        rt =  compbin(arr1,arr2);
        res.send(rt);
    }
    exec();
    // console.log(str_common_GetSixCode(req.body.P_code))
};

// 从sqlite获取板块和其下的个股,带参数则获取某一板块,否则全部板块
var get_bk2 = function(req, res, next) {
    let getDATA = function (){
        let bk = "";
        if(req.query.code != null ) bk = `and opt='${req.query.code}' `; 
        var sql = 'select opt,content from t_option where opt <> "gaoliang" and 1=1 ' + bk + ' order by md5';
        DB.queryData(sql, dataDeal);
        // DB.close();
    };  
    function dataDeal(objects){
        if(req.query.showtype!=null){
            res.send(objects[0].content)
        }else{
            res.send(JSON.stringify(objects))
        }
    }
    getDATA();
}
//根据条件opt更新content字段的值
var set_bkzxg = function(req, res, next) {
    let getDATA = function (){
        if(req.query.code != null && req.query.bkname != null  ) {
            //判断一下插入的字符串的正则必须是"600123,600343,600663"形式
            var reg =  /^(\d{6},{0,1})+(,\d{6})$/g;    //正则必须是"600123,600343"带逗号起步
            if(reg.test(req.query.code)){
                let _bkname = 'bkzxg_'+req.query.bkname
                var sql = `update t_option set content = '${req.query.code}' where opt='${_bkname}'`;
                console.log(sql);
                DB.executeSql(sql);
                // DB.close();
                res.send("ok");
            }else{
                res.send('字符串格式6位数字加逗号错误');
            }
        }
    };  
    getDATA();
}

//根据条件opt更新content字段的值
var delcode = function(req, res, next) {
    let getDATA = function (){
        if(req.query.code != null && req.query.bkname != null  ) {
            var reg =  /^(\d{6})$/g;    //正则必须是 600123
            if(reg.test(req.query.code)){
                let _bkname = req.query.bkname;
                var sql = `update t_option set content = replace(content,'${req.query.code},','') where opt='${_bkname}'`;
console.log(sql);
                DB.executeSql(sql);
                sql = `update t_option set content = replace(content,',${req.query.code}','') where opt='${_bkname}'`;
console.log(sql);
                DB.executeSql(sql);
                // DB.close();
                res.send("ok");
            }else{
                res.send('字符串格式6位数字错误');
            }
        }
    };  
    getDATA();
}

//高亮某个代码aaa
var gaoliang = function(req, res, next) {
    let getDATA = function (){
        if(req.query.code != null ) {
            var reg =  /^(\d{6})$/g;    //正则必须是 600123
            if(reg.test(req.query.code)){
                sql = `SELECT 1 FROM t_option  WHERE content LIKE '%${req.query.code}%'  and opt='gaoliang';`
                DB.queryData(sql, dataDeal2);
            }else{
                res.send('字符串格式6位数字错误');
            }
        }
    };
    //aaa 
    function dataDeal2(objects){
        if(objects.length > 0 ){   //如果标记高亮的代码存在，则删除
            sql = `update t_option set content = replace(content, '${req.query.code},','') where opt='gaoliang'`;DB.executeSql(sql);
            sql = `update t_option set content = replace(content,',${req.query.code}','') where opt='gaoliang'`; DB.executeSql(sql);
            res.send("ok");
        }else{
            sql = `update t_option set content = content || '${req.query.code}' || ',' where opt='gaoliang'`; DB.executeSql(sql);
            res.send("ok");
        }
    }
    getDATA();
}
var getGaoLinagCode = function(req, res, next) {
    let getDATA = function (){
        var sql = 'select opt,content from t_option where opt = "gaoliang"  ' ;
        DB.queryData(sql, dataDeal);
        // DB.close();
    };  
    function dataDeal(objects){
        if(req.query.showtype!=null){
            res.send(objects[0].content)
        }else{
            res.send(JSON.stringify(objects))
        }
    }
    getDATA();
}

//获取分时图数据-自制k线
var getMinite_KLine = function(req, res, next) {

    let GetSixCode = function (x){
        let mk = "sz";
        if(x.substring(0,1) == "6") mk = "sh";
        if(x.substring(0,1) == "5") mk = "sh";
        return mk+x;
    };  
    var getDATA = async()=>
    {
        let code = req.query.code;
        if(req.query.code==null) return "error: no code!";
        if(req.query.code.length != 6) return "error: code must be six !";
        let code2 = GetSixCode(code)
        let arr = [];
        var url = 'curl "https://quotes.sina.cn/cn/api/openapi.php/CN_MinlineService.getMinlineData?symbol='+ code2 +'&callback=var%20t1sh515220=&dpc=1"';
        var rt = await eCurl(url);
        var patt = /\/\*<script>.*<\/script>\*\//g; //替换   /*<script>location.href='//sina.com';</script>*/
        var rt2 = rt.replace(patt,'');

        patt = /\{"m".*?\}/g
        rt2 = rt2.match(patt);
        rt2 = rt2.map(x=> arr.push(JSON.parse(x)));
        let obj = {};
        obj.code = code; obj.data = arr;
        return obj;
    };


    async function exec(){
        let  rt = await getDATA();
        res.send(rt);
    }
    exec();
}


var code2Name = async function(req, res, next) {
    let code2name_ = function (){
        return new Promise((resolve, reject) => { 
            let _code =  (req.query.code);
            var site = `https://q.stock.sohu.com/app1/stockSearch?method=search&callback=str&type=all&keyword=${_code}&_=${Math.floor(Date.now() / 1000)}`
            request.get(site).pipe(iconv.decodeStream('gb2312')).collect(function(err, body) {
                resolve(body)
            });
        });
    };
    let  rt = await code2name_();
    rt = rt.replace('str(','').replace(']]})',']]}');
    res.send(JSON.parse(rt));
}
// 获取收盘价sina的数据 http://127.0.0.1:3004/closePrice?code=601066
var closePrice = function(req, res, next) {
    let str_getPrice_FromSina = function (){
        return new Promise((resolve, reject) => { 
            let _code =  GetSixCode(req.query.code);
            var site = { url: 'http://hq.sinajs.cn/list=' + _code, headers: { referer: "https://finance.sina.com.cn"}
            }
            request.get(site).pipe(iconv.decodeStream('gb2312')).collect(function(err, body) {
                resolve(body)
            });
        });
    };
    async function exec(){
        let  rt = await str_getPrice_FromSina();
        res.send(rt);
    }
    exec();
}
//获取历史日线价格
var HistoryPrice =  async function(req, res, next) {
    let GetData = function (){
        return new Promise((resolve, reject) => { 
            let _code =  GetSixCode(req.query.code);
            let daylen = req.query.daylen;
            var url = `http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=${_code}&scale=240&ma=20&datalen=${daylen}`
            var site = { url: url, headers: { referer: "https://finance.sina.com.cn"}
            }
            request.get(site).pipe(iconv.decodeStream('gb2312')).collect(function(err, body) {
                resolve(body)
            });
        });
    };
    let  rt = await GetData();
    res.send(JSON.parse(rt));
}


let GetSixCode = function (code){
        let mk = "sz";
        if(code.substring(0,1) == "6") mk = "sh";
        if(code.substring(0,1) == "5") mk = "sh";
        return mk+code;
};  
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

console.log('app.use(express.static(".")).listen(3004);')
app.all("/exec_getSinaPrice", exec_getSinaPrice);//获取报价 http://127.0.0.1:3004/exec_getSinaPrice?code=601066
app.all("/get_bk2", get_bk2);           //获取所有板块的列表
app.all("/set_bkzxg", set_bkzxg);       //更新自选股的列表
app.all("/delcode", delcode);           //删除某个股票
app.all("/getMinite_KLine", getMinite_KLine); //获取分时图sina的数据
app.all("/closePrice", closePrice);                 //获取收盘价的数据 http://127.0.0.1:3004/closePrice?code=601066
app.all("/code2Name", code2Name);       //获取分时图sina的数据 http://127.0.0.1:3004/code2Name?code=601066
app.all("/HistoryPrice", HistoryPrice);  //获取历史数据  http://127.0.0.1:3004/HistoryPrice?code=601066$daylen=10
app.all("/gaoliang", gaoliang);            //高亮某个股票代码
app.all("/getGaoLinagCode", getGaoLinagCode);            //获取高亮的股票代码
app.use(express.static(".")).listen(3004);






//gb2312的iconv-lite编码参考 https://cnodejs.org/topic/55b5e1ce0b2974890124e50f
//测试语句： curl -X POST -d P_code=cn_515030-ETF-,cn_512760-ETF-,cn_512880-ETF-,cn_512800-ETF- http://127.0.0.1:3004
// curl -X POST -d P_code=cn_515030-ETF-,cn_512760-ETF-,cn_512880-ETF-,cn_512800-ETF-,cn_512400-ETF-,cn_512660-ETF-,cn_512720-ETF-,cn_512690-ETF-,cn_515000-ETF-,cn_515210-ETF-,cn_510800-ETF-,cn_515710-ETF-,cn_515650-ETF-,cn_510150-ETF-,cn_516550-ETF-,cn_516760-ETF-,cn_515220-ETF-,cn_601066-固定跟踪-,cn_600418-固定跟踪-,cn_601225-固定跟踪-,cn_000957-固定跟踪-,cn_002703-固定跟踪-,cn_603069-固定跟踪-,cn_002714-固定跟踪-,cn_601066-自选-,cn_000957-自选-,cn_600418-自选-,cn_002623-自选-,cn_002466-自选-,cn_601975-自选-,cn_603069-自选-,cn_600026-自选-,cn_002706-自选-,cn_600546-自选-,cn_600508-自选-,cn_002125-自选-,cn_002876-自选-,cn_002824-自选-,cn_000821-自选-,cn_600478-自选-,cn_002031-自选-,cn_603530-自选-,cn_603758-自选-,cn_300552-自选-,cn_601225-自选-,cn_300757-自选-,cn_300712-自选-,cn_603728-自选-,cn_002866-自选-,cn_300602-自选-,cn_002805-自选-,cn_300093-自选-,cn_600305-自选-,cn_600872-自选-,cn_600559-自选-,cn_603288-自选-,cn_600338-自选-,cn_002703-自选-,cn_000899-自选-,cn_000970-自选-,cn_000629-自选-,cn_601908-自选-,cn_002407-自选-,cn_002902-自选-,cn_603893-自选-,cn_002843-自选-,cn_300565-自选-,cn_002953-自选-,cn_002090-自选-,cn_300403-自选-,cn_002166-自选-,cn_002204-自选-,cn_300587-自选-,cn_603917-自选-,cn_000001-银行保险-,cn_600036-银行保险-,cn_601318-银行保险-,cn_601628-银行保险-,cn_601398-银行保险-,cn_002936-银行保险-,cn_601857-银行保险-,cn_601288-银行保险-,cn_601166-银行保险-,cn_002142-银行保险-,cn_601328-银行保险-,cn_600919-银行保险-,cn_300059-证券-,cn_600030-证券-,cn_601901-证券-,cn_601788-证券-,cn_600918-证券-,cn_601066-证券-,cn_601990-证券-,cn_601236-证券-,cn_002670-证券-,cn_601198-证券-,cn_601375-证券-,cn_601995-证券-,cn_600369-证券-,cn_600906-证券-,cn_000712-证券-,cn_000776-证券-,cn_600958-证券-,cn_601555-证券-,cn_000166-证券-,cn_002797-证券-,cn_601878-证券-,cn_601696-证券-,cn_600846-证券-,cn_300116-历史-,cn_300399-历史-,cn_600640-历史-,cn_600338-历史-,cn_601600-历史-,cn_002512-历史-,cn_601989-历史-,cn_002426-历史-,cn_300099-历史-,cn_600808-历史-,cn_601225-历史-,cn_000958-历史-,cn_300527-历史-,cn_000713-历史-,cn_300750-能源车-,cn_002594-能源车-,cn_002812-能源车-,cn_300124-能源车-,cn_002460-能源车-,cn_603799-能源车-,cn_300014-能源车-,cn_002466-能源车-,cn_300450-能源车-,cn_002709-能源车-,cn_000651-消费50-,cn_600519-消费50-,cn_000858-消费50-,cn_000333-消费50-,cn_601888-消费50-,cn_600887-消费50-,cn_000568-消费50-,cn_603288-消费50-,cn_600690-消费50-,cn_603160-半导体-,cn_603501-半导体-,cn_300223-半导体-,cn_300782-半导体-,cn_603986-半导体-,cn_600745-半导体-,cn_300661-半导体-,cn_300623-半导体-,cn_603678-半导体-,cn_300598-半导体-,cn_002371-半导体-,cn_300548-半导体-,cn_300123-半导体-,cn_000016-半导体-,cn_002669-半导体-,cn_300706-半导体-,cn_300474-半导体-,cn_600305-食品饮料-,cn_600872-食品饮料-,cn_002216-食品饮料-,cn_600519-食品饮料-,cn_600882-食品饮料-,cn_603288-食品饮料-,cn_600809-食品饮料-,cn_603027-食品饮料-,cn_002646-食品饮料-,cn_600199-食品饮料-,cn_600559-食品饮料-,cn_000799-食品饮料-,cn_600519-食品饮料-,cn_600809-食品饮料-,cn_000596-食品饮料-,cn_000858-食品饮料-,cn_603919-食品饮料-,cn_603369-食品饮料-,cn_600059-食品饮料- http://127.0.0.1:3004