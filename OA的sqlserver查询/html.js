// 参考 2023-7-7 https://blog.csdn.net/weixin_44726970/article/details/121928476
// 代码逻辑说明见底部
var request = require('request');
const express = require('express');
const app = express();
const db = require('./lib_sqlserver.js'); 
var sd = require('silly-datetime');
const fs = require('fs');


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
    var _date = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    console.log(_date + " - "  + str);

    MyQuery(str).then(result => {       //解释：返回result = requestID
        if(result.recordset && result.recordset[0] && result.recordset[0]["requestid"]){
            let requestID = result.recordset[0]["requestid"];
            let sql = sql_1a.replace(/_requestID_/g,requestID)
            return MyQuery(sql);            //解释：返回审批表单的fieldlabe    
        }
    })
    .then(result => { 
        if(!result)return null;
        rs=result;
        let id=result.recordset[0]["billformid"];
        let sql = sql_2.replace("_billid_",id)  //解释：返回fieldlabel对应的中文
        return MyQuery(sql);
    })
    .then(result => { 
        if(result){
            let rt = SwitchName(rs,result)          //解释：替换成中文
            res.json(rt);  
        }else{
            res.json([{"exception!" : "数据无" + str}]); ;
        } 
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
    var sql = sql_流程模板.replace("_key_",_seleItem.trim());
    MyQuery(sql).then(result => {       
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
});





//show2.html 私有使用
app.get("/all",(req,res)=>{

    let flowName = req.query.flowname;
    let seleItem = req.query.seleItem
    let data = req.query.data;
    let workBaseID = req.query.workBaseID;

    //分类查询
    if (workBaseID || seleItem) {
        if (workBaseID === null || workBaseID === undefined){
            flow_所有模板(seleItem,res);  
        }else{
            flow_分类查询(workBaseID,seleItem,data,res);  
        }
    };
    
    //流程详情
    if (flowName) {
        Query_flow(flowName,res);   
    };

});


//数据中心统计(邱宏育)
// 接口：http://127.0.0.1:3000/sjzx
// 前台：http://127.0.0.1:3000/shujuzhongxin.html
function sql_数据中心统计(){
   

    const Datas1 = [
        { dpt: '人力资源部',taskName:"残疾人证件统计表",					dateFiled:"modedatacreatedate", taskFName:"taskID",	    tableName: "edc_uf_table487"},		
        { dpt: '人力资源部',taskName:"部门月绩效考核比例表",				dateFiled:"modedatacreatedate", taskFName:"taskID",	    tableName: "edc_uf_table482"}, 		
        { dpt: '综合办公室',taskName:"公司年报填报数据填写",				dateFiled:"xfrq",               taskFName:"requestid",	tableName: "formtable_main_594"},
        { dpt: '综合办公室',taskName:"优秀管理部门投票",					dateFiled:"modedatacreatedate", taskFName:"taskID",	    tableName: "edc_uf_table581"},	
        { dpt: '采购部',	taskName:"物资类供应商问卷调查",				dateFiled:"tbrq",               taskFName:"requestid",  tableName: "formtable_main_513"},
        { dpt: '采购部',	taskName:"物资类新合作供应商首次合作回访调研表", dateFiled:"tbrq",                taskFName:"requestid",  tableName: "formtable_main_514"},
        { dpt: '采购部',	taskName:"物资质量异常反馈",					dateFiled:"fkrq",               taskFName:"requestid",	tableName: "formtable_main_597"},
        { dpt: '证券部',	taskName:"行政处罚统计表",						dateFiled:"modedatacreatedate", taskFName:"taskID",	    tableName: "edc_uf_table488"},	
        { dpt: '品牌中心',	taskName:"公司业务布局统计表",					dateFiled:"modedatacreatedate", taskFName:"taskID",	    tableName: "edc_uf_table519"},		
        { dpt: '法务部',	taskName:"案件登记台账",						dateFiled:"modedatamodifydatetime", taskFName:"requestid", tableName: "uf_ajdjtz"},	
        { dpt: '商务中心',	taskName:"中标项目信息统计的台账",				dateFiled:"modedatamodifydatetime", taskFName:"requestid",	    tableName: "uf_zbxmxxtj"},	
        { dpt: '预决算部',	taskName:"工程项目月度进度统计台账",			dateFiled:"tbrq",                   taskFName:"requestid",	    tableName: "formtable_main_515"} 
    ];

    const Datas2 = [
        { dpt: '运管中心' ,taskName:"项目耗水登记",							dateFiled:"modedatacreatedate",                    taskFName:"taskID",	tableName: "edc_uf_table586" },	
        { dpt: '运管中心' ,taskName:"项目耗电登记",							dateFiled:"modedatacreatedate",                   taskFName:"taskID",	tableName: "edc_uf_table587" },	
        { dpt: '运管中心' ,taskName:"项目统计",								dateFiled:"modedatacreatedate",                   taskFName:"taskID",	tableName: "edc_uf_table589" },	
        { dpt: '运管中心' ,taskName:"作业车辆用水用电登记",					dateFiled:"modedatacreatedate",                   taskFName:"taskID",	tableName: "edc_uf_table590" },		
        { dpt: '运管中心' ,taskName:"项目扣款预警",							dateFiled:"modedatacreatedate",                   taskFName:"taskID",	tableName: "edc_uf_table439" },		
        { dpt: '运管中心' ,taskName:"超限违章查询",							dateFiled:"modedatacreatedate",                   taskFName:"taskID",	tableName: "edc_uf_table438" },		
        { dpt: '运管中心' ,taskName:"交通违章查询",							dateFiled:"modedatacreatedate",                   taskFName:"taskID",	tableName: "edc_uf_table437" },		
        { dpt: '运管中心' ,taskName:"商业保险购买",							dateFiled:"modedatacreatedate",                   taskFName:"taskID",	tableName: "edc_uf_table436" },		
        { dpt: '运管中心' ,taskName:"一线员工绩效考核",						dateFiled:"modedatacreatedate",                   taskFName:"taskID",	tableName: "edc_uf_table435" },		
        { dpt: '运管中心' ,taskName:"业务招待费",							dateFiled:"modedatacreatedate",                   taskFName:"taskID",	tableName: "edc_uf_table431" },		
        { dpt: '运管中心' ,taskName:"项目一线员工血压监测",					dateFiled:"modedatacreatedate",                   taskFName:"taskID",	tableName: "edc_uf_table432" },		
        { dpt: '运管中心' ,taskName:"项目入离职人员报备表",					dateFiled:"modedatacreatedate",                   taskFName:"taskID",	tableName: "edc_uf_table433" },		
        { dpt: '运管中心' ,taskName:"项目主数据",							dateFiled:"modedatacreatedate",                   taskFName:"requestid",	tableName: "uf_project_group" },	
        { dpt: '运管中心' ,taskName:"项目通讯录",							dateFiled:"modedatacreatedate",                   taskFName:"requestid",	tableName: "uf_xmtongxunlu" },	
        { dpt: '运管中心' ,taskName:"主管绩效责任制优化人数目标",			dateFiled:"modedatamodifydatetime",                   taskFName:"requestid",	tableName: "uf_youhuarenshumb" },	
        { dpt: '运管中心' ,taskName:"主管绩效责任制优化人数完成情况周汇报",	dateFiled:"modedatacreatedate",                   taskFName:"requestid",	tableName: "edc_uf_table427" },		
        { dpt: '运管中心' ,taskName:"主管绩效责任制优化人数台账",			dateFiled:"modedatamodifydatetime",                   taskFName:"requestid",	tableName: "uf_zgjxzrzyhrstz" },
        { dpt: '运管中心' ,taskName:"项目运营信息台账",						dateFiled:"modedatacreatedate",                   taskFName:"requestid",	tableName: "uf_xmyunyingxinxi" },	
        { dpt: '运管中心' ,taskName:"回款督办台账",							dateFiled:"modedatacreatedate",                   taskFName:"requestid",	tableName: "edc_uf_table426" },	
        { dpt: '运管中心' ,taskName:"确认单督办表",							dateFiled:"modedatacreatedate",                   taskFName:"requestid",	tableName: "uf_querendan" },	
        { dpt: '运管中心' ,taskName:"项目零星、增标信息统计",				dateFiled:"modedatacreatedate",                   taskFName:"requestid",	tableName: "uf_xmlxzbxxtjbs" },	
        { dpt: '运管中心' ,taskName:"车辆违章核查及处理登记表",				dateFiled:"modedatacreatedate",                   taskFName:"requestid",	tableName: "uf_vehicle_violatio" },	
        { dpt: '运管中心' ,taskName:"非机动车险事故-逾期",					dateFiled:"modedatacreatedate",                   taskFName:"requestid",	tableName: "uf_vehicle_accident" }
    ];


    const Datas = Datas1.concat(Datas2);
    var allsql = ''
    Datas.forEach((Item, index) => {
        var sql = `SELECT top 10 '${Item.dpt} - ${Item.taskName}' 任务名称 ,  CONVERT(varchar(10), ${Item.dateFiled}, 120) AS 时间,${Item.taskFName} 任务ID, COUNT(*) AS 总数
                FROM ${Item.tableName}
                GROUP BY CONVERT(varchar(10), ${Item.dateFiled}, 120),${Item.taskFName}
                UNION ALL
                SELECT '${Item.dpt} - ${Item.taskName}' AS 任务名称,  null AS 时间, null AS 任务ID, 0 AS 总数  WHERE NOT EXISTS ( SELECT 1 FROM ${Item.tableName})

                `
        allsql += sql
        if(index != Datas.length - 1)       
        {
            allsql += `
            UNION

            `  
        }else{
            allsql += "order by 任务名称,时间 desc  " 
        }
    });
    return allsql;
}
app.get("/sjzx",(req,res)=>{
    var sql = sql_数据中心统计();
    // fs.writeFile('output.txt', sql, (err) => {
    //     if (err) {
    //         console.error('写入文件时出错：', err);
    //         return;
    //     }
    //     console.log('sql语句写入到 output.txt 文件中！');
    // });

    MyQuery(sql).then(result => {       
        res.json(result.recordset);    
    })
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
    
10  异常处理 Error: listen EACCES: permission denied 0.0.0.0:3000
    net stop winnat
    net start winnat

*/
