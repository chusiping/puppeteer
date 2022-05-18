// 任务跟踪处理
const express = require('express');
var sd = require('silly-datetime');
var fs = require("fs");
var bodyParser = require('body-parser');//用req.body获取post参数，安装npm install body-parser express --save-dev

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post("/add",function(req,res){
    //提交到这里然后处理数据，插入数据库
    console.log(JSON.stringify(req.body));
    res.send(req.body);
})

app.post("/us",function(req,res){
    res.send('haha us');
})

//这里可同时处理html和js
app.use('', express.static('./')).listen(3000);
