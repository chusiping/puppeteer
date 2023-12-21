//172.18.1.208:root/NodeJsApp/运维查询ip和端口/node html.js
//http://172.18.1.208:3301/ipcheck.html

var request = require('request');
const express = require('express');
const app = express();
const db = require('./lib_mysql.js'); 

// 这里要改成通用的mysql函数
var mysql = require('mysql');
function Quer_IP(res,keyword)
{
    let conn = mysql.createConnection({host:'172.18.1.208',  user:'root', password : 'toor.1qaz@WSX', database : 'yunwei'});
    let sql =  CombinSql(keyword);
    conn.query(sql,function (err, rt) {
        console.log(sql);
        res.json(rt);
    });
};

function CombinSql(str) {
    if(str === null || str==='' ) return "select * from server_all";
    const ipAddressRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/; //ip
    const portRegex = /^\d{1,5}$/;//端口
    if(ipAddressRegex.test(str)){
        return "select * from server_all where ip = '"+ str +"'";     
    } else if(portRegex.test(str)){
        return "select * from server_all where port like  '%"+ str +"%'";
    } else {
        return "select * from server_all where remark like  '%"+ str +"%'";
    }
};

//ipcheck.html使用
app.get("/all",(req,res)=>{
    let keyword = req.query.data; 
    Quer_IP(res,keyword)  
});

app.use('', express.static('./')).listen(3301);


