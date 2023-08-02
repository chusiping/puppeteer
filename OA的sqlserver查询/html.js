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

function seleObj(str)
{
    let _ob ;
    const myArray = [
        { p1: "采购立项审批流程（环卫项目专用）",   p2: "b.htje 合同金额,b.yyje 预算金额",p3:" and (status='归档'  or  status='结束') " }, 
        { p1: "采购立项审批流程（项目专用）",     p2: "b.htje 合同金额,b.yyje 预算金额",p3:" and (status='归档'  or  status='结束') " }, 
        { p1: "采购立项审批流程(职能部门专用)",     p2: "b.yyje 预算金额" ,p3:" and (status='归档'  or  status='结束') " }, 
        { p1: "工程项目立项审批流程",               p2: "b.bsje 报送金额" ,p3:" and (status='归档'  or  status='结束') " }, 
        { p1: "工程项目结算审核流程", p2: "b.bsje 报送金额", p3:" and (status='归档'  or  status='结束') " },
        { p1: "工程付款合同", p2: "", p3:"" }
    ];
    for (let i = 0; i < myArray.length; i++) {
        const obj = myArray[i];
        if (obj.p1 == str) {
            _ob = obj
        }
    }
    return _ob;
}


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

var sql_3all=` IF OBJECT_ID('tempdb..#tp1') IS NOT NULL  DROP TABLE #tp1;
            IF OBJECT_ID('tempdb..#tp2') IS NOT NULL  DROP TABLE #tp2;

            select 
                re.status,
                re.requestmark flowID,
                re.createdate rq,
                re.creater ,
                requestid,
                LEFT(re.createdate, 7) as Ndata,
                re.requestname,
                SUBSTRING(requestnamenew, CHARINDEX('请示主题', requestnamenew) + LEN('请示主题:'), LEN(requestnamenew)) as newName
                
                into #tp1

                from workflow_requestbase re
                where 2=2 and 1=1
                and LEFT(re.createdate, _len_)='_data_'

              

            SELECT a.*,b.billformid bill_id,c.tablename 
            into #tp2
            from #tp1 a 
            LEFT JOIN workflow_form b 
            on a.requestid=b.requestid
            LEFT JOIN workflow_bill c  
            on b.billformid=c.id


            DECLARE @TableID VARCHAR(500)
            DECLARE @query nvarchar(500)
            
            
            SELECT top 1 @TableID = tablename from #tp2 
            
            set @query = '
            SELECT
                a.flowID 流程编号,a.status 节点,
                a.Ndata 月份,a.requestname 请求标题,a.newName 请求主题
              from 
                #tp2 a LEFT JOIN '+ @TableID +' b
                on a.requestid=b.requestId
                LEFT JOIN hrmresource c
                ON a.creater= c.id
            order by a.rq desc '
            
            exec(@query) 
            
            `

var sql_3=` IF OBJECT_ID('tempdb..#tp1') IS NOT NULL  DROP TABLE #tp1;
            IF OBJECT_ID('tempdb..#tp2') IS NOT NULL  DROP TABLE #tp2;

            select 
                re.status,
                re.requestmark flowID,
                re.createdate rq,
                re.creater ,
                requestid,
                LEFT(re.createdate, 7) as Ndata,
                re.requestname,
                SUBSTRING(requestnamenew, CHARINDEX('请示主题', requestnamenew) + LEN('请示主题:'), LEN(requestnamenew)) as newName
                
                into #tp1

                from workflow_requestbase re
                where requestname like '_seleItem_%' and 
                LEFT(re.createdate, _len_)='_data_'
                _status_
              

            SELECT a.*,b.billformid bill_id,c.tablename 
            into #tp2
            from #tp1 a 
            LEFT JOIN workflow_form b 
            on a.requestid=b.requestid
            LEFT JOIN workflow_bill c  
            on b.billformid=c.id


            DECLARE @TableID VARCHAR(500)
            DECLARE @query nvarchar(500)
            
            
            SELECT top 1 @TableID = tablename from #tp2 
            
            set @query = '
            SELECT
                a.flowID 流程编号,a.status 节点,
                a.Ndata 月份,a.requestname 请求标题,a.newName 请求主题,_fd3_
              from 
                #tp2 a LEFT JOIN '+ @TableID +' b
                on a.requestid=b.requestId
                LEFT JOIN hrmresource c
                ON a.creater= c.id
            order by a.rq desc '
            
            exec(@query) 
            
            `

var sql_4 = `
IF OBJECT_ID('tempdb..#tb_流程实例') IS NOT NULL  DROP TABLE #tb_流程实例;
IF OBJECT_ID('tempdb..#tb_流程表单') IS NOT NULL  DROP TABLE #tb_流程表单;
IF OBJECT_ID('tempdb..#tb_流程模板id') IS NOT NULL  DROP TABLE #tb_流程模板id;

select id into #tb_流程模板id from workflow_base 	where id='1124'

select 	*,	LEFT(re.createdate, 7) as Ndata,re.requestname nd,re.createdate rq,
SUBSTRING(requestnamenew, CHARINDEX('请示主题', requestnamenew) + LEN('请示主题:'), LEN(requestnamenew)) as newName
into #tb_流程实例	from workflow_requestbase re	where 1=1 
and workflowid in(select * from #tb_流程模板id) 
and     LEFT(re.createdate, _len_)='_data_'

SELECT b.billformid bill_id,c.tablename,a.* 	
into #tb_流程表单
from #tb_流程实例 a 	LEFT JOIN workflow_form b 	on a.requestid=b.requestid	LEFT JOIN workflow_bill c  
on b.billformid=c.id

DECLARE @TableID VARCHAR(500)
DECLARE @query nvarchar(500)

SELECT top 1 @TableID = tablename from #tb_流程表单 

set @query = 'SELECT 
							a.requestmark 流程编号,
							a.Ndata 月份,
							''工程类合同'' 合同类型,
							b.htmc 合同名称,
							b.htje 合同金额,
							a.status 状态
              from 
                #tb_流程表单 a LEFT JOIN '+ @TableID +' b
                on a.requestid=b.requestId
                LEFT JOIN hrmresource c
                ON a.creater= c.id
								where 1=1
								and b.htlb=14
								and a.status=''档案管理员确认''
								order by a.rq desc
              '
exec(@query) 
`

var sql_流程模板 = `select  DISTINCT(workflowname) sname,max(id) id  from workflow_base where isvalid = 1 and workflowname 
like '%_key_%' GROUP BY workflowname order by id desc `

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

function TongJI(_seleItem,_data,res){
    let sql = sql_3.replace("_data_",_data);
    sql = sql.replace("_len_",_data.length);
    sql = sql.replace("_seleItem_",_seleItem);
    let ob = seleObj(_seleItem);
    sql = sql.replace("_fd3_",ob.p2);
    sql = sql.replace("_status_",ob.p3); //是否显示状态
    MyQuery(sql).then(result => {       
        res.json(result.recordset);    
    })
}

function TongJI_工程付款合同(_seleItem,_data,res){
    let sql = sql_4.replace("_data_",_data);
    sql = sql.replace("_len_",_data.length);
    console.log(sql)
    MyQuery(sql).then(result => {       
        res.json(result.recordset);    
    })
}

function TongJI2(_seleItem,_data,res){
    let sql = sql_3.replace("_data_",_data);
    sql = sql.replace("_len_",_data.length);
    sql = sql.replace("_seleItem_",_seleItem);
    let ob = seleObj(_seleItem);
    sql = sql.replace(",_fd3_","");
    sql = sql.replace("_status_",""); //是否显示状态
    MyQuery(sql).then(result => {       
        res.json(result.recordset);    
    })
}


function flow_分类查询(_workBaseID_,_seleItem,_data,res){
    let sql = sql_3all;
    sql = sql.replace("_data_",_data);
    sql = sql.replace("_len_",_data.length);
    if(_workBaseID_) sql = sql.replace("2=2"," workflowid=" + _workBaseID_);
    if(_seleItem) sql = sql.replace("1=1"," requestnamenew like '%"+ _seleItem +"%'");
    MyQuery(sql).then(result => {       
        res.json(result.recordset);    
    })
}



function flow_所有模板(_seleItem,res){
    sql_流程模板 = sql_流程模板.replace("_key_",_seleItem.trim());
    MyQuery(sql_流程模板).then(result => {       
        res.json(result.recordset);    
    })
}


app.get("/",(req,res)=>{

    let flowName = req.query.flowname;
    let seleItem = req.query.seleItem
    let data = req.query.data;

    //流程详情
    if (flowName) {
        Query_flow(flowName,res);   
    };

    //统计
    if (data) {
        if(seleItem=='工程付款合同'){
            TongJI_工程付款合同(seleItem,data,res);   
        }else{
            TongJI(seleItem,data,res);   
        }
    };
    //所有流程模板
    if (seleItem) {
        flow_所有模板(seleItem,res);   
    };


});

//show2.html 私有使用
app.get("/all",(req,res)=>{

    let flowName = req.query.flowname;
    let seleItem = req.query.seleItem
    let data = req.query.data;
    let workBaseID = req.query.workBaseID;

    //分类查询
    if (workBaseID || seleItem) {
        flow_分类查询(workBaseID,seleItem,data,res);  
    };
    
    //流程详情
    if (flowName) {
        Query_flow(flowName,res);   
    };
    
    //流程名模糊查询
    // if (data) {
    //     TongJI2(seleItem,data,res);  
    // };


    // if (seleItem) {
    //     flow_分类查询(seleItem,data,res);  
    // };

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
    127.0.0.1:3000/?flowname=CGLXZN2023050308

7. TongJI统计下面格式
    127.0.0.1:3000/?data=2023   127.0.0.1:3000/?data=2023-05
    月份	请求标题	                            请示主题
    4月	    工程项目结算审核流程-刘宁馨-2023-04-21	广州市荔湾区侨银办公大楼项目临时用电拆除工程结算申请
    4月	    工程项目结算审核流程-刘正刚-2023-04-20	大园环卫车充电车棚工程完工结算

8   根据情况判断 p3:"and (status='归档'  or  CHARINDEX('预决算', status)>0)" 

9   查询所有的流程模板
    127.0.0.1:3000/?seleItem=人力资源  

*/
