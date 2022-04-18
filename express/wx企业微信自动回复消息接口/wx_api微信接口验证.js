// 2022-1-29 测试通过：企业微信API的url的验证
const express = require('express');
const app = express();
var ejs = require('ejs');   
var WXBizMsgCrypt = require('wechat-crypto');
app.engine('html',ejs.__express);  
app.set('view engine', 'html');  

app.get("/",(req,res)=>{
    var method = req.method;
    var sVerifyMsgSig = req.query.msg_signature;
    var sVerifyTimeStamp = req.query.timestamp;
    var sVerifyNonce = req.query.nonce;
    var sVerifyEchoStr = decodeURIComponent(req.query.echostr);
    var sEchoStr;

    var cryptor = new WXBizMsgCrypt('aa123', 'youandmearetheworldpeople112233445566778899', 'wwd8658d118708a9ae');
    if (method == 'GET') {
        var MsgSig = cryptor.getSignature(sVerifyTimeStamp, sVerifyNonce, sVerifyEchoStr);
        if (sVerifyMsgSig == MsgSig) {
            sEchoStr = cryptor.decrypt(sVerifyEchoStr).message;
            console.log(sEchoStr);
            res.send(sEchoStr);
        } else {
            res.send("-40001_invaild MsgSig")
        }
    }
});

app.listen(80)
