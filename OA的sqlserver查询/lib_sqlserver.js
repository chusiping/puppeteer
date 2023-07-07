/*
 mssql模块简单封装
*/
const mssql = require('mssql');
const db = {};
const config = {
    user: 'rpa_read',
    password: 'rpa_read',   //改成你自己的
    server: '172.18.1.6',  //改成你自己的
    database: 'ecology',     //改成你自己的
    port:1433,            //改成你自己的
    options: {
    encrypt: false // Use this if you're on Windows Azure
    },
    pool: {
        min: 0,
        max: 10,
        idleTimeoutMillis: 3000
    }
};

//执行sql,返回数据.
db.sql = function (sql, callBack) {
    const connection = new mssql.ConnectionPool(config, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        const ps = new mssql.PreparedStatement(connection);
        ps.prepare(sql, function (err) {
            if (err){
                console.log(err);
                return;
            }
            ps.execute('', function (err, result) {
                if (err){
                    console.log(err);
                    return;
                }

                ps.unprepare(function (err) {
                    if (err){
                        console.log(err);
                        callback(err,null);
                        return;
                    }
                    callBack(err, result);
                });
            });
        });
    });
};

module.exports = db;
