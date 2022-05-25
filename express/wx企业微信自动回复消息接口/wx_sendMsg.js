const express = require('express');
const app = express();
var config = require('./config_module.js');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); 


//通用函数
let GetJson = (req) => {
    return new Promise((resolve,reject)=>{
        if (req.body.data) {    //能正确解析 json 格式的post参数
            resolve(req.body.data);// res.send({"status": "success", "name": req.body.data.name, "url": req.body.data.url});
        } else {                //不能正确解析json 格式的post参数
            var body = '', jsonStr;
            req.on('data', function (chunk) {
                body += chunk; 
            });
            req.on('end', function () {
                try {  //读取参数流结束后将转化的body字符串解析成 JSON 格式
                    jsonStr = JSON.parse(body);
                } catch (err) {
                    jsonStr = null;
                }
                resolve(jsonStr);
            });
        }
    });
}

var gUID = "BF4E3603-135C-48F1-9DBB-479A6FD5BBF8";

//先接受简单的get参数,后续增加json的解析
//测试鉴权UUID:BF4E3603-135C-48F1-9DBB-479A6FD5BBF8
app.all("/send_wx", (req, res, next) => {
    var method = req.method;
    if (method == 'POST') {
        GetJson(req).then(obj=>{ 
            if (obj.UID == gUID) {
                config.SendMsg(obj).then(x => {
                    res.send(JSON.stringify(x))
                }).catch(x=>{  res.send(JSON.stringify(x)) });
            } else {
                res.send("{errcode: -1,errmsg : 'author error!' }"); //UUID错误无权访问
            }
        }).catch(x=>{ console.log(x) });
    };
});

app.all("/up_file", (req, res, next) => {
    var method = req.method;
    if (method == 'POST') {
        GetJson(req).then(obj=>{ 
            if (obj.UID == gUID) {
                config.upImageVideo(obj).then(x => {
                    res.send(JSON.stringify(x));
                    }).catch(x=>{ res.send(x) });
            } else {
                res.send("{errcode: -1,errmsg : 'author error!' }"); //UUID错误无权访问
            }
        }).catch(x=>{ res.send(x) });
    };
});

app.use('', express.static('./')).listen(8080); 

/*
    测试命令: 
    启动 node NodeJsApp/express/wx企业微信自动回复消息接口/wx_sendMsg.js 
    1. multipart 不是 application
    
    //通过测试 发送文本
    curl http://127.0.0.1:8080/send_wx -H "Content-Type:multipart/json" -X POST \
    -d \
    "{\"touser\" : \"FanBingQi\",\"msgtype\" : \"text\", \"msgContent\" :\"ts33t22\",\"agentid\":\"1000003\",\"UID\" : \"BF4E3603-135C-48F1-9DBB-479A6FD5BBF8\" }"

    //通过测试 发送图片
    curl http://127.0.0.1:8080/send_wx -H "Content-Type:multipart/json" -X POST -d \
    "{\"touser\" : \"FanBingQi\",\"msgtype\" : \"image\",\"agentid\":1000003, \"media_id\" :\"3TXEMZAGVIaNSMubZrWWTLHbSfME0NVS-PpiMh1LpVQLN5H8kW4XWAiphJxPWwE5V\",\"UID\" : \"BF4E3603-135C-48F1-9DBB-479A6FD5BBF8\" }" 


    //通过测试 本地接口上传测试
    curl "http://127.0.0.1:8080/up_file" -H "Content-Type:multipart/json" -X POST -d "{\"type\":\"image\",\"filePath\" :\"./te3.png\",\"UID\" : \"BF4E3603-135C-48F1-9DBB-479A6FD5BBF8\" }"

    //windows 通过测试上传图片
    curl "https://qyapi.weixin.qq.com/cgi-bin/media/upload?access_token=HHkgFfQYr9X4rLcPq-Npvq5HFUh2B7JMoyZMQS28MnMG17S87Ayhq8yJvKJ06UaO4NCfTDH406BDW81TR--dOEsLyP228H6a9f-QQhx1lARTFI5ZtUbxqNZ7A-LaBHLtAImJveYwlB1m4yjmYjSkAE38w8diPhG5vLaNMTLfryAfELIj5cjkGriF8KusLtiJ86ax_FXnm5n33_yehjW8qg&type=image" -H "Content-Type:multipart/form-data"  -F "file=@C:\Users\Administrator\Desktop\te3.png" -v

    //centos 通过测试
    curl "https://qyapi.weixin.qq.com/cgi-bin/media/upload?access_token=HHkgFfQYr9X4rLcPq-Npvq5HFUh2B7JMoyZMQS28MnMG17S87Ayhq8yJvKJ06UaO4NCfTDH406BDW81TR--dOEsLyP228H6a9f-QQhx1lARTFI5ZtUbxqNZ7A-LaBHLtAImJveYwlB1m4yjmYjSkAE38w8diPhG5vLaNMTLfryAfELIj5cjkGriF8KusLtiJ86ax_FXnm5n33_yehjW8qg&type=image" -H "Content-Type:multipart/form-data"  -F "file=@./te3.png" -v

*/