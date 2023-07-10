// 参考 2023-7-7 https://blog.csdn.net/weixin_44726970/article/details/121928476
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
    return "select requestid from workflow_requestbase where requestname like '"+ str +"%'";
};


var sql_1=` DECLARE @requestID VARCHAR(20)
            select @requestID=requestid from workflow_requestbase where requestname like '采购立项审批流程(职能部门专用)-范秉淇-2023-05-29%'

            DECLARE @billID VARCHAR(20)
            select @billID=billformid from workflow_form where requestid=@requestID

            DECLARE @tableName VARCHAR(100)
            SELECT @tableName=tablename from workflow_bill where id=@billID

            DECLARE @sqlstr NVARCHAR(MAX)
            set @sqlstr='select b.billformid,a.* from ' + @tableName + ' a left join workflow_form b
            on a.requestId=b.requestid
            where a.requestId=' + @requestID
            exec(@sqlstr) `;

var billID = "0";
var sql_2=` select b.billid, b.fieldname, b.fieldlabel,l.labelname,fielddbtype
            from workflow_billfield b
            left JOIN HtmlLabelInfo l 
            on b.fieldlabel=l.indexid and l.languageid=7
            where billid=`;

function CombinSql2(str) {
    return sql_2 + str;
};

            
// sql_1='SELECT top 3 id,lastname,mobile,created from hrmresource';

app.get("/",(req,res)=>{

    let rs;
    var str = CombinSql("采购立项审批流程(职能部门专用)-范秉淇-2023-05-29")
    MyQuery(str).then(result => {       //解释：返回result = requestID
        return MyQuery(sql_1);          //解释：返回审批表单的fieldlabe      
    })
    .then(result => { 
        rs=result;
        let id=result.recordset[0]["billformid"];
        let sql =  CombinSql2(id)
        return MyQuery(sql);
    })
    .then(result => { 
        let rt = SwitchName(rs,result)
        res.json(rt);  
    })



    // var Rows ;
    // MyQuery(sql_1).then(result => { 
    //     // res.json(RowToJson(result) )
    //     Rows=result;
    //     return MyQuery(sql_2 + result.recordset[0]["billformid"]);
    // })
    // .then(result => { 
    //     res.json(SwitchName(Rows,result) )
    // })



});

app.listen(3000)



