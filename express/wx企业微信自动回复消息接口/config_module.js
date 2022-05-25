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
var exec = require('child_process'); 
module.exports = {
    token: 'aa123',
    corpid: 'wwd86xxxxxxx08a9ae',
    encodingAESKey: 'youandmearexxxxxxxx233445566778899',
    corpsecret : '_toJoCPz-jx-xxxxxxxxxT8jFYfYXbF_Cc',
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
            default:
                break;
        }
        return rt;
    },
    upImageVideo:function(upObj){    //上传素材获得media-id
        return new Promise((resolve,reject) =>{   
            let url = this.url_getToken.replace('_corpid_',this.corpid).replace('_corpsecret_',this.corpsecret);
            this.eCurl(url).then(x1=>{  //获取token值
                let urlsend = this.url_upfile.replace('_type_',upObj.type).replace('_token_',x1.access_token).replace('_filePath_',upObj.filePath);
                    this.eCurl(urlsend).then(x2=>{ //填充token值和上传文件路径
                        if(x2.errmsg == "ok"){
                            resolve(x2); 
                        }else{
                            reject(x2);
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
                        if(x.errmsg == "ok"){
                            resolve(x); 
                        }else{
                            reject(x);
                        }
                    })
            });
        })
    }
};