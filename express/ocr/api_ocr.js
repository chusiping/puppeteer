const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
app.use(fileUpload({createParentPath: true}));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
var MyLib = require("../../public/_LibNode"); 
var path = require('path');
const sleep = (tim) => new Promise((res, rej) => setTimeout(res, tim));
const schedule = require('node-schedule');
var fs = require("fs");
var gUID = "BF4E3603-135C-48F1-9DBB-479A6FD5BBF8";

(async()=>{
    console.log("schedule定时执行等待中...:");
    let rule = new schedule.RecurrenceRule();       // https://segmentfault.com/a/1190000022455361
    // rule.second = [0, 2, 4, 6, 8, 10];           //每十秒实行
    // rule.minute = 30;rule.second = 0;            //每小时 30 分执行
    rule.hour=03;rule.minute =01;rule.second =01;   //每天 01点01 点执行
    let job = schedule.scheduleJob(rule, () => {
        console.log("清除过期文件开始.....");
        MyLib.delDir('./temp_pic');
    });
})();




app.post('/ocr' ,async (req, res) => {
    if(gUID == req.query.UID ){
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
    } else{
        res.send('{status:false,message:"UID错误"}'); 
    }
});
console.log("http://121.4.43.207:3002/ocr?UID=xxxxxxxxxxx\nlistening......");
app.use(express.static(".")).listen(3002);

