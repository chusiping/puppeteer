//【2022.12.09】
// 将下载的txt文件AllHistoryData_2022-08-15数据插入mysql表里
var fs = require("fs");
var sd = require('silly-datetime');
const lib_AllStockCode = require('./lib_AllStockCode');
var destPath = './download/point.txt'
const sleep = () => new Promise((res, rej) => setTimeout(res, 4000));
var stock_arr = lib_AllStockCode.codes2;
const schedule = require('node-schedule');
const mysql = require('mysql')
var lib = require('../public/_LibNode');


const DbClient = require('ali-mysql-client');
const db = new DbClient({ host : 'win7.qy',user: 'root',password : '1qaz@WSX', port: '3306',database: 'news', });

//注释：读取AllHistoryData..txt文件，循环遍历插入数据
let fenxi = (async (_date2)=>{
    var txtSJ = sd.format(new Date(), 'YYYY-MM-DD');
    if(_date2 == null) _date2 = txtSJ;
    file = '../express/download/AllHistoryData_'+ _date2 +'.txt'; // file = '../express/download/AllHistoryData_'+ _date2 +'.txt';
    let ishave = await lib.exists2(file);
    if(!ishave) {
        console.log(file + " 不存在！");
        return false ;
    }
    const data = await fs.readFileSync(file, 'utf8')
    var object = JSON.parse(data); 
    for (const key in object) {
        if(key!=0){
            let x = object[key]
            let rt = FormData(x) 
            await insertData(rt);  // console.log('\n▶'+key,rt)  // sleep()      
        }
    }
    console.log(file + " 数据插入完成！")
});

//注释： 把A格式: testData  数据转为 B格式: [['000001','平安银行','2021-07-02',22.720,22.740,21.760,21.810,107067756],['000001','平安银行','2021-07-05',21.690,22.150,21.090,22.060,85934129]] 格式
let FormData = (dataOBJ) => {
    //注释 testData = {"name":"平安银行","code":"000001","data":[{"day":"2022-04-07","open":"16.380","high":"16.660","low":"16.200","close":"16.280","volume":"165906455","ma_price20":14.922,"ma_volume20":141213756},{"day":"2022-04-08","open":"16.260","high":"16.450","low":"16.130","close":"16.400","volume":"106677946","ma_price20":15.05,"ma_volume20":137543852}]};
    // dataOBJ = testData
    rt = [];
    for (const key in dataOBJ.data) {
        let x = dataOBJ.data[key]
        let newData = [dataOBJ.code, dataOBJ.name,x.day,x.open,x.high,x.low,x.close,x.volume]
        rt.push(newData)
    }
    return rt;
}

let insertData = (async(param) => {
    await new Promise((resolve, reject) => {
        var connection = mysql.createConnection({ host : 'win7.qy',user: 'root',password : '1qaz@WSX', port: '3306',database: 'news', }); 
        var  userAddSql = 'INSERT IGNORE INTO t_his_price(code,name,date,open,high,low,close,vol) VALUES ? ';  
        //注释： var param = [['000001','平安银行','2021-07-02',22.720,22.740,21.760,21.810,107067756],['000001','平安银行','2021-07-05',21.690,22.150,21.090,22.060,85934129]]
        // console.log(userAddSql);
        var query = connection.query(userAddSql,[param],function (err, result) { 
            console.log(param[0] + " - error : " + err ); 
            connection.end();
            return err ? reject(err) : resolve()
        });
    })
});

var arg = process.argv.splice(2);
if(arg.length >0)
{
    if(arg[0] == "1") {
        console.log("schedule定时执行等待中...:");
        let rule = new schedule.RecurrenceRule();      
        rule.hour=17;rule.minute =00;rule.second =00;   
        let job = schedule.scheduleJob(rule, () => {
            fenxi();
        });
    }else{
        fenxi(arg[0]);
    }
}else{
    console.log('请输入:\n\tA.轮询每天: node g2pszl_上涨率_插入mysql.js 1\n\tB.指定日期：node g2pszl_上涨率_插入mysql.js 2022-xx-xx');
}

// 查询
// SELECT  name, code,count(1) as cnt from t_his_price
// GROUP BY name,code
// -- HAVING cnt <> 60