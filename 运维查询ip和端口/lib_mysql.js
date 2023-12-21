const mysql = require('mysql');
const db = {};

const config = {
    host: '172.18.1.208', // 改成你自己的MySQL服务器地址
    user: 'root', // 改成你自己的用户名
    password: 'toor.1qaz@WSX', // 改成你自己的密码
    database: 'yunwei', // 改成你自己的数据库名
    port: 3306, // 改成你自己的MySQL端口号，默认为3306
};

// 执行SQL，返回数据
db.sql = function (sql, callback) {
    const connection = mysql.createConnection(config);
    connection.connect(function (err) {
        if (err) {
            console.error('Error connecting to MySQL: ' + err.stack);
            return;
        }

        connection.query(sql, function (error, results, fields) {
            if (error) {
                console.error('Error executing query: ' + error.stack);
                callback(error, null);
                return;
            }
            callback(null, results);
        });
    });
};

module.exports = db;