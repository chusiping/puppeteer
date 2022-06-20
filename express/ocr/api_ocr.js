const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const app = express();
app.use(fileUpload({createParentPath: true}));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
var MyLib = require("../../public/_LibNode"); 
var path = require('path');
const sleep = (tim) => new Promise((res, rej) => setTimeout(res, tim));

app.post('/ocr' ,async (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8")
    let leftName ='./temp_pic/' + Math.floor(Date.now() / 1000)+ "_" + parseInt((Math.random() * 100000000000), 10);
    let rt = await MyLib.upFile(req,leftName);
    if(rt.status){
        console.log(rt);
        await sleep(500); //如果文件很大，可能要很长的时间
        let code = await MyLib.OCR(rt.filePath);
        rt.ocr_words = code.words_result;
        res.send(rt);
    }else{
        res.send(rt);
    }
});

app.use(express.static(".")).listen(3000);
// https://www.jianshu.com/p/19bacc0f709c
//1. FormMaking 页面可以提交图片
//2. 接口判断图片大小,然后进行压缩
//3. 图片改名子,保持唯一,然后出给百度接口
//4. 返回数据给客户端

