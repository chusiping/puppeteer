//可用2021-6-24完成
//功能：循环数据库对象，从不同ip的不同的数据库不同的表中，读取不同的数据
var mysql      = require('mysql');
var ConnRs = [
    {host:'win7.qy',  obj: mysql.createConnection({host:'win7.qy',  user:'root', password : '1qaz@WSX', database : 'news'})},
    // {host:'127.0.0.1',obj: mysql.createConnection({host:'127.0.0.1',user:'root',password : '',          database : ''})},
    // {host:'db.face.com',obj: mysql.createConnection({host:'db.face.com',user:'root',password : 'Qy@123456', database : 'face_cloud'})}
];

var SqlRs = [
    // {host:'win7.qy',  sql:'show master status;'},
    // {host:'127.0.0.1',sql:'show slave status;'},
    // {host:'db.face.com',sql:'select * from face_cloud.employee_punch_log order by punch_time desc limit 10'},
    {host:'win7.qy',  sql:'select code, name ,count(1) from t_his_price group by name order by code desc limit 5 '}
];

ConnRs.forEach(conn => {
    SqlRs.forEach(sql => {
        // console.log(conn.host);
        // console.log(sql.sql);
        if(conn.host == sql.host){
            console.log(sql.host + " : " + sql.sql);
            conn.obj.query(sql.sql,function (err, result) {
                console.log(result);// if(err){console.log('[SELECT ERROR] - ',err.message); return;}
                process.exit(1);
            });
        }
    });
});


