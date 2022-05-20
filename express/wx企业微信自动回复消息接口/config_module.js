/*
    说明：调用微信接口发送信息给指定的人
    使用：  var config = require('./config_module.js');
            var obj = { toUserName : "FanBingQi", agentid : "1000003",msgContent : "test4444" };
            config.SendMsg(obj).then(x=>{ console.log(x) }).catch(x=>{ console.log(x) });  
*/
var exec = require('child_process'); 
module.exports = {
    token: 'aa123',
    corpid: 'wwd8658d118708a9ae',
    encodingAESKey: 'youandmearetheworldpeople112233445566778899',
    corpsecret : '_toJoCPz-jx-npE8IW7sucyehx4feQT8jFYfYXbF_Cc',
    url_getToken : `curl 'https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=_corpid_&corpsecret=_corpsecret_'`,
    url_sendText : `curl 'https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=_token_' -H "Content-Type:application/json" -X POST -d '_msg_'`,
    textMsg : function(obj) {
        return `{"touser" : "${obj.toUserName}","msgtype" : "text",   "agentid" : ${obj.agentid},   "text" : {"content":"${obj.msgContent}"},"safe":0,   "enable_id_trans": 0,   "enable_duplicate_check": 0,   "duplicate_check_interval": 1800}`;
    },
    eCurl : function(cmdStr) { //命令行执行curl
        return new Promise((resolve,reject)=>{
            exec.exec(cmdStr, function(err,stdout,stderr){ // console.log('url:'+cmdStr);
                if(err) {
                    reject('error:'+stderr); // console.log('error:'+stderr);
                } else {
                    var data = JSON.parse(stdout); // console.log(data);
                    resolve((data));// resolve(JSON.stringify(data));
                }
            });
        });
    },
    SendMsg  : async function(obj)  {   
        return new Promise((resolve,reject) =>{   
            let url = this.url_getToken.replace('_corpid_',this.corpid).replace('_corpsecret_',this.corpsecret);
            this.eCurl(url).then(x1=>{
                var Json_msg = this.textMsg(obj);
                let urlsend = this.url_sendText.replace('_msg_',Json_msg).replace('_token_',x1.access_token);
                    this.eCurl(urlsend).then(x=>{
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