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


app.get("/",(req,res)=>{

    let flowName = req.query.flowname;

    if (!flowName) {
        return res.status(400).send('缺少必需的参数flowName！');
    }else{
        Query_flow(flowName,res);
    }

});

app.listen(3000)



/* ****** 代码逻辑 ***********

1. CombinSql 根据条件查出requestID
2. requestID 传给 sql_1a 
3. sql_1a 返回审批表单的fieldlabel  
4. sql_2  返回fieldlabel对应的中文
5. SwitchName 切换sql里字段的英文label为中文label
6. 测试
    127.0.0.1:3000/?flowname=采购立项审批流程(职能部门专用)-范秉淇-2023-05-29
    127.0.0.1:3000/?flowname=GCXMYJS2023040008

*/
