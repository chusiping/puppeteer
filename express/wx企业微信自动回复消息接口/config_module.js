/*
    说明：调用微信接口发送信息给指定的人
    使用：  var config = require('./config_module.js');
            var obj = { toUserName : "FanBingQi", agentid : "1000003",msgContent : "test4444" };
            config.SendMsg(obj).then(x=>{ console.log(x) }).catch(x=>{ console.log(x) });  
    官方教程:https://developer.work.weixin.qq.com/document/path/90487
    上传素材:https://developer.work.weixin.qq.com/document/path/90871
            https://developer.work.weixin.qq.com/devtool/interface/alone?id=10112 (在线调用接口传素材)
    在线测试:https://developer.work.weixin.qq.com/devtool/interface/alone?id=10167
*/
var sd = require('silly-datetime');
var exec = require('child_process'); 
module.exports = {
    token: 'aa123',
    corpid: 'wwd865xxxxxxxxxx187xxxxa9ae',
    encodingAESKey: 'youandmearetsssssssssssle112233445566778899',
    corpsecret : '_toJoCPz-jx-npE8IW7sucyehx4feQT8jFYfYXbF_Cc',
    url_getToken : `curl 'https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=_corpid_&corpsecret=_corpsecret_'`,
    url_sendText : `curl 'https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=_token_' -H "Content-Type:application/json" -X POST -d '_msg_'`,
    url_upfile : `curl "https://qyapi.weixin.qq.com/cgi-bin/media/upload?access_token=_token_&type=_type_" -H "Content-Type:multipart/form-data"  -F "file=@_filePath_" -v`,
    textMsg : function(obj) {  //消息统一类,可以区分文本,图片,视频
        let rt = {};
        rt.touser = obj.touser;
        rt.msgtype = obj.msgtype;
        rt.agentid = obj.agentid
        rt.safe =0;
        rt.enable_id_trans = 0;
        rt.enable_duplicate_check = 0;
        rt.duplicate_check_interval = 1800;
        switch (obj.msgtype) {
            case "text":
                rt.text = {"content":"测试信息 - " + obj.msgContent};
            case "image":
                rt.image = { "media_id" : obj.media_id} 
                break;   
            case "file":
                rt.file = { "media_id" : obj.media_id} 
                break;  
            case "textcard":
                rt.textcard = { "title" : obj.title, "description": obj.description, "url":obj.url} ;
                break;      
            default:
                rt.msgtype = "image"; 
                rt.image = { "media_id" : "xxx"}; 
                break;
        }
        let msgTZ = `${sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')} 发送消息主体:  ${JSON.stringify(rt)} \n`;
        console.log(msgTZ);
        return rt;
    },
    upImageVideo:function(upObj){    //上传素材获得media-id
        return new Promise((resolve,reject) =>{   
            let url = this.url_getToken.replace('_corpid_',this.corpid).replace('_corpsecret_',this.corpsecret);
            this.eCurl(url).then(x1=>{  //获取token值
                let urlsend = this.url_upfile.replace('_type_',upObj.type).replace('_token_',x1.access_token).replace('_filePath_',upObj.filePath);
                exists2(upObj.filePath).then(xx3 =>{
                    if(xx3){
                        this.eCurl(urlsend).then(x2=>{ //填充token值和上传文件路径
                            resolve(x2); 
                        });
                    }else{
                        resolve({"err":"文件不存在"}); 
                    }
                })
            });
        })
    },
    eCurl : function(cmdStr) { //命令行执行curl
        return new Promise((resolve,reject)=>{
            exec.exec(cmdStr, function(err,stdout,stderr){  //命令行执行curl
                if(err) {
                    reject('error:'+stderr); 
                } else {
                    var data = JSON.parse(stdout);  //curl成功返回data
                    resolve((data));
                }
            });
        });
    },
    SendMsg  : async function(obj)  {   
        return new Promise((resolve,reject) =>{   
            let url = this.url_getToken.replace('_corpid_',this.corpid).replace('_corpsecret_',this.corpsecret);
            this.eCurl(url).then(x1=>{ //获取token值
                var Json_msg = JSON.stringify(this.textMsg(obj)) //this.textMsg(obj);
                let urlsend = this.url_sendText.replace('_msg_',Json_msg).replace('_token_',x1.access_token);
                    this.eCurl(urlsend).then(x=>{ //发送信息和图片
                        resolve(x); 
                    }).catch(exp=>{
                        reject(exp);
                    })
            });
        })
    },
    GetJson : (req) => {   //通用函数,可以转为通用函数
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
};
async function exists2(path) {
    return new Promise(resolve => {
        fs.stat(path, (err) => {
        resolve(err ? false : true);
        });
    })
}



/*
    测试命令: 
    1. multipart 不是 application
    
    //通过测试 发送文本   
    clear && curl "http://127.0.0.1:8080/send_wx?UID=BF4E3603-135C-48F1-9DBB-479A6FD5BBF8&type=send" -H "Content-Type:multipart/json" -X POST \
    -d \
    '{"touser" : "FanBingQi","msgtype" : "text", "msgContent" :"33\n\n 444","agentid":"1000003"}'

    //通过测试 发送图片
    curl "http://127.0.0.1:8080/send_wx?UID=BF4E3603-135C-48F1-9DBB-479A6FD5BBF8&type=send" -H "Content-Type:multipart/json" -X POST -d \
    '{"touser" : "FanBingQi","msgtype" : "image","agentid":1000003, "media_id" :"3TXEMZAGVIaNSMubZrWWTLHbSfME0NVS-PpiMh1LpVQLN5H8kW4XWAiphJxPWwE5V"}' 

    发文件
    curl "http://127.0.0.1:8080/send_wx?UID=BF4E3603-135C-48F1-9DBB-479A6FD5BBF8&type=send" -H "Content-Type:multipart/json" -X POST -d \
    '{"touser" : "FanBingQi","msgtype" : "file","agentid":1000003, "media_id" :"3XRGDLYJkClAzMk8R71k1kvYLezUv8Zg86ian760yvEhyBpuEDAdD-pkvtndlsJUk"}'

    发卡片
    curl "http://127.0.0.1:8080/send_wx?UID=BF4E3603-135C-48F1-9DBB-479A6FD5BBF8&type=send" -H "Content-Type:multipart/json" -X POST -d \
    '{"touser" : "FanBingQi","msgtype" : "textcard","agentid":1000003, "title" : "test" ,"description" : "<div class=gray>2016年9月26日</div> <div class=normal>恭喜你抽中iPhone 7一台，领奖码：xxxx</div><div class=highlight>请于2016年10月10日前联系行政同事领取</div>","url" : "URL", "btntxt":"更多"  }'

    //通过测试 本地接口上传测试  
    图片
    curl "http://127.0.0.1:8080/send_wx?UID=BF4E3603-135C-48F1-9DBB-479A6FD5BBF8&type=up" -H "Content-Type:multipart/json" -X POST -d "{\"type\":\"image\",\"filePath\" :\"./te3.png\" }"
    文件
    curl "http://127.0.0.1:8080/send_wx?UID=BF4E3603-135C-48F1-9DBB-479A6FD5BBF8&type=up" -H "Content-Type:multipart/json" -X POST -d "{\"type\":\"file\",\"filePath\" :\"./sys.docx\" }"


    //windows 通过测试上传图片
    curl "https://qyapi.weixin.qq.com/cgi-bin/media/upload?access_token=HHkgFfQYr9X4rLcPq-Npvq5HFUh2B7JMoyZMQS28MnMG17S87Ayhq8yJvKJ06UaO4NCfTDH406BDW81TR--dOEsLyP228H6a9f-QQhx1lARTFI5ZtUbxqNZ7A-LaBHLtAImJveYwlB1m4yjmYjSkAE38w8diPhG5vLaNMTLfryAfELIj5cjkGriF8KusLtiJ86ax_FXnm5n33_yehjW8qg&type=image" -H "Content-Type:multipart/form-data"  -F "file=@C:\Users\Administrator\Desktop\te3.png" -v

    //centos 通过测试
    curl "https://qyapi.weixin.qq.com/cgi-bin/media/upload?access_token=HHkgFfQYr9X4rLcPq-Npvq5HFUh2B7JMoyZMQS28MnMG17S87Ayhq8yJvKJ06UaO4NCfTDH406BDW81TR--dOEsLyP228H6a9f-QQhx1lARTFI5ZtUbxqNZ7A-LaBHLtAImJveYwlB1m4yjmYjSkAE38w8diPhG5vLaNMTLfryAfELIj5cjkGriF8KusLtiJ86ax_FXnm5n33_yehjW8qg&type=image" -H "Content-Type:multipart/form-data"  -F "file=@./te3.png" -v

});

*/