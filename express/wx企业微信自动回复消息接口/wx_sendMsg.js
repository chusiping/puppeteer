const express = require('express');
const app = express();
var config = require('./config_module.js');
var bodyParser = require('body-parser');
const { render } = require('ejs');
app.use(bodyParser.json()); 

var gUID = "BF4E3603-135C-48F1-9DBB-479A6FD5BBF8";

const SendMsg = async (req,res,type)=>{
    let mJson = await config.GetJson(req);
    let rt = {};
    if(type == "send")  
        rt =  await config.SendMsg(mJson);      /* 如果是 ?type=send 则选择下推信息 */
    else if(type == "up")                  
        rt = await config.upImageVideo(mJson);  /* 如果是 ?type=up  则上传文件到微信素材库 */
    else
        rt = {};
    return rt;
} 

app.all("/send_wx", (req, res, next) => {
    if( req.method == 'POST' && gUID == req.query.UID ){    //UUID鉴权
        SendMsg(req,res,req.query.type).then(x=>{ res.send(x) });
    }
    else{
        res.send("{errcode: -1,errmsg : 'author error!' }"); //UUID错误无权访问
    }
});

app.use('', express.static('./')).listen(8080); 
