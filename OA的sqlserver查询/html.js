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
                resolve(result.recordsets)
            }
        });
    });
};

// db.sql('SELECT top 22 * from hrmresource', function (err, result) {
//     if (err) {
//         console.log(err);
//         return;
//     }else{
//         console.log(result.recordsets)
//     }
// });



app.get("/",(req,res)=>{
    MyQuery('SELECT top 1 * from hrmresource').then(data => { res.send(data) });
});

app.listen(3000)
// http://127.0.0.1:3000