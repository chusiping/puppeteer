// 参考 2023-7-7 https://blog.csdn.net/weixin_44726970/article/details/121928476
// 代码逻辑说明见底部
var request = require('request');
const express = require('express');
const app = express();
const db = require('./lib_sqlserver.js'); 


function MyQuery(sql) {
    return new Promise((resolve, reject) => {       
        db.sql(sql, function (err, result) {
            if (err) {
                reject(err)
            }else{
                resolve(result)
            }
        });
        // db.close();
    });
};

// 修改行数据
function RowToJson(result) {
    const Rows = [];
    for (let i = 0; i < result.recordset.length; i++) {
        const row = result.recordset[i];
        Rows.push((row));
    };
    return Rows;
};

// 英文列名称，替换成中文名称
function SwitchName(result,data) {
    const Rows = [];
    for (let i = 0; i < result.recordset.length; i++) {
        const row = result.recordset[i];
        for (let column in row) {
            var str = RowToJson2(data,column) == "" ?  column : RowToJson2(data,column);
            var ob ={
                [str]:row[column]
            };
            Rows.push(ob)
        }
    };
    return Rows;
};

function RowToJson2(result,Column英文名) {
    var rt = "";
    for (let i = 0; i < result.recordset.length; i++) {
        const row = result.recordset[i];
        if(row["fieldname"]==Column英文名){
            rt=row["labelname"];    
            return rt;
        }
    }
    return rt;
};

function CombinSql(str) {
    const startsWithLetterRegex = /^[a-zA-Z]/;
    if(!startsWithLetterRegex.test(str)){
        return "select requestid from workflow_requestbase where requestname like '"+ str +"%'";
    }else{
        return "select requestid from workflow_requestbase where requestmark = '"+ str +"'";
    }
};

var sql_1a=`DECLARE @billID VARCHAR(20)
            select @billID=billformid from workflow_form where requestid=_requestID_

            DECLARE @tableName VARCHAR(100)
            SELECT @tableName=tablename from workflow_bill where id=@billID

            DECLARE @sqlstr NVARCHAR(MAX)
            set @sqlstr='select b.billformid,a.* from ' + @tableName + ' a left join workflow_form b
            on a.requestId=b.requestid
            where a.requestId=_requestID_'
            exec(@sqlstr) `;

var billID = "0";
var sql_2=` select b.billid, b.fieldname, b.fieldlabel,l.labelname,fielddbtype
            from workflow_billfield b
            left JOIN HtmlLabelInfo l 
            on b.fieldlabel=l.indexid and l.languageid=7
            where billid=_billid_`;

var sql_3=` IF OBJECT_ID('tempdb..#tp1') IS NOT NULL  DROP TABLE #tp1;
            IF OBJECT_ID('tempdb..#tp2') IS NOT NULL  DROP TABLE #tp2;

            select 
                re.createdate rq,
                re.creater ,
                requestid,
                LEFT(re.createdate, 7) as Ndata,
                re.requestname,
                SUBSTRING(requestnamenew, CHARINDEX('请示主题', requestnamenew) + LEN('请示主题:'), LEN(requestnamenew)) as newName
                
                into #tp1

                from workflow_requestbase re
                where requestname like '工程项目结算审核流程%' and 
                LEFT(re.createdate, 4)='_data_'

            SELECT a.*,b.billformid bill_id,c.tablename 
            into #tp2
            from #tp1 a 
            LEFT JOIN workflow_form b 
            on a.requestid=b.requestid
            LEFT JOIN workflow_bill c  
            on b.billformid=c.id

            SELECT
                a.Ndata 月份,a.requestname 请求标题,a.newName 请求主题,b.bsje 报送金额
            from 
                #tp2 a LEFT JOIN formtable_main_175 b
                on a.requestid=b.requestId
                LEFT JOIN hrmresource c
                ON a.creater= c.id
            order by a.rq desc`



// 查询某个流程表单内容 
function  Query_flow(_flowName,res){
    let rs;
    var str = CombinSql(_flowName);

    MyQuery(str).then(result => {       //解释：返回result = requestID
        let requestID = result.recordset[0]["requestid"];
        let sql = sql_1a.replace(/_requestID_/g,requestID)
        return MyQuery(sql);            //解释：返回审批表单的fieldlabe      
    })
    .then(result => { 
        rs=result;
        let id=result.recordset[0]["billformid"];
        let sql = sql_2.replace("_billid_",id)  //解释：返回fieldlabel对应的中文
        return MyQuery(sql);
    })
    .then(result => { 
        let rt = SwitchName(rs,result)          //解释：替换成中文
        res.json(rt);  
    })
}      

function TongJI(_data,res){
    let sql = sql_3.replace("_data_",_data);
    MyQuery(sql).then(result => {       
        res.json(result.recordset);    
    })
}


app.get("/",(req,res)=>{

    let flowName = req.query.flowname;
    let data = req.query.data;

    if (flowName) {
        Query_flow(flowName,res);   
    };

    if (data) {
        TongJI(data,res);   
    };

});

app.use('', express.static('./')).listen(3000);




/* ****** 代码逻辑 ***********

1. CombinSql 根据条件查出requestID
2. requestID 传给 sql_1a 
3. sql_1a 返回审批表单的fieldlabel  
4. sql_2  返回fieldlabel对应的中文
5. SwitchName 切换sql里字段的英文label为中文label
6. 测试
    127.0.0.1:3000/?flowname=采购立项审批流程(职能部门专用)-范秉淇-2023-05-29
    127.0.0.1:3000/?flowname=GCXMYJS2023040008

7. TongJI统计下面格式
    127.0.0.1:3000/?data=2023   127.0.0.1:3000/?data=2023-05
    月份	请求标题	                            请示主题
    4月	    工程项目结算审核流程-刘宁馨-2023-04-21	广州市荔湾区侨银办公大楼项目临时用电拆除工程结算申请
    4月	    工程项目结算审核流程-刘正刚-2023-04-20	大园环卫车充电车棚工程完工结算


*/
