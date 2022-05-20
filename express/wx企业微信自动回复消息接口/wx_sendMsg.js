const express = require('express');
const app = express();
var config = require('./config_module.js');

//先接受简单的get参数,后续增加json的解析
//测试鉴权UUID:BF4E3603-135C-48F1-9DBB-479A6FD5BBF8
app.all("/send_wx", (req, res, next) => {
    var method = req.method;
    var touser = req.query.touser, agentid = req.query.agentid, msg = req.query.msg, UID = req.query.UID;
    if (method == 'GET') {
        if (UID == "BF4E3603-135C-48F1-9DBB-479A6FD5BBF8") {
            var obj = { toUserName: touser, agentid: agentid, msgContent: msg };
            console.log(obj);
            config.SendMsg(obj).then(x => {
                res.send(x);
            }).catch(x => { res.send(x); });
        } else {
            res.send("{errcode: -1,errmsg : 'author error!' }"); //UUID错误无权访问
        }
    } else if (method == 'POST') {

    };
});
app.use('', express.static('./')).listen(8080);

//测试命令: curl 'http://127.0.0.1:8080/send_wx?touser=FanBingQi&agentid=1000003&msg=test-14222&UID=BF4E3603-135C-48F1-9DBB-479A6FD5BBF8';