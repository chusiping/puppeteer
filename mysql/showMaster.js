//可用2021-6-24完成
//功能：循环数据库对象，从不同ip的不同的数据库不同的表中，读取不同的数据
var mysql      = require('mysql');
var ConnRs = [
    {host:'win7.qy',  obj: mysql.createConnection({host:'win7.qy',  user:'root', password : '1qaz@WSX', database : 'news'})},
    {host:'127.0.0.1',obj: mysql.createConnection({host:'127.0.0.1',user:'root',password : '',          database : ''})}
];

var SqlRs = [
    {host:'win7.qy',  sql:'show master status;'},
    {host:'127.0.0.1',sql:'show slave status;'}
];

ConnRs.forEach(conn => {
    SqlRs.forEach(sql => {
        // console.log(conn.host);
        // console.log(sql.sql);
        if(conn.host == sql.host){
            console.log(sql.host + " : " + sql.sql);
            conn.obj.query(sql.sql,function (err, result) {
                console.log(result);// if(err){console.log('[SELECT ERROR] - ',err.message); return;}
                if(!err) process.exit(1);
            });
        }
    });
});
