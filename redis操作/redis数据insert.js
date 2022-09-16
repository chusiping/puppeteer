

var mysql      = require('mysql');
var ConnRs = [
    {charset: 'utf-8',host:'mysql-slave1',  obj: mysql.createConnection({host:'119.23.57.45',  user:'yuefeng_read', password : 'yuefeng!@#100', database : 'yuefeng'})},
  ];

var SqlRs = [
     {host:'mysql-slave1',  sql:`select 
                                    a.id,
                                    a.pid as 'pid',
                                    a.registrationNO as '车牌号' ,
                                    a.terminalNO as '终端号',
                                    a.frameNumber as '车架号',
                                    a.engineNumber as '发动机号',
                                    a.isdel
                                from sys_vehicle a 
                                where 1=1 
                                    and a.pid in( SELECT id from v_sys_organ where isdel=0 and  orgCompany = 'dg1168') 
                                    and (LENGTH(a.registrationNO) > 1 )
                                limit 30000 `}
        ];
        var redis = require('redis')
        var client = redis.createClient('6379', 'redis.qy');
        client.auth('redis@qiaoyin.com!@#'); 

ConnRs.forEach(conn => {
    SqlRs.forEach(sql => {
        // console.log(conn.host);
        // console.log(sql.sql);
        if(conn.host == sql.host){
            // console.log(sql.host + " : " + sql.sql);
            conn.obj.query(sql.sql,function (err, result) {
                // console.log(result); 
                i =1;
                result.forEach(x => {
                    carinfo = `{carID:'${x.id}',carPID:'${x.pid}', carNO: '${x.车牌号}' ,carBNO = '${x.车架号}',carEGNO='${x.发动机号}' }`; 
                    client.set(x.车牌号,carinfo , redis.print);
                    console.log(i + ":" + x.车牌号);
                    i++; 
                });
                
                // console.log(iconv.decode(result,'gbk'));// if(err){console.log('[SELECT ERROR] - ',err.message); return;}
                process.exit(1);
            });
        }
    });
});
