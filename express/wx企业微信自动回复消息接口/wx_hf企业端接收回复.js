'use strict'
const express = require('express');
var ejs = require('ejs'); 
var WXBizMsgCrypt = require('wechat-crypto');
var xml2js = require('xml2js');
var config = require('./config.js');
const app = express();
app.engine('html',ejs.__express);  
app.set('view engine', 'html');  



app.all("/",(req,res,next)=>{
    var method = req.method;
    var sVerifyMsgSig = req.query.msg_signature;
    var sVerifyTimeStamp = req.query.timestamp;
    var sVerifyNonce = req.query.nonce;
    var sVerifyEchoStr = decodeURIComponent(req.query.echostr);
    var sEchoStr;
    var cryptor = new WXBizMsgCrypt(config.token, config.encodingAESKey, config.corpid);
    /* 验证 www.mapked.com 接受企业微信 */
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
    /* 处理手机微信发送的上行消息 */
    else if (method == 'POST') {
        load(req, function (err, buff) {
            try {
                if (err) {
                    var loadErr = new Error('weChat load message error');
                    loadErr.name = 'weChat';
                    console.log('err row 40');
                }
                var xml = buff.toString('utf-8');
                if (!xml) {
                    var emptyErr = new Error('-40002_body is empty');
                    emptyErr.name = 'weChat';
                    console.log('err row 46');
                }
                xml2js.parseString(xml, {
                    trim: true
                }, function (err, result) {
                    if (err) {
                        var parseErr = new Error('-40008_parse xml error');
                        parseErr.name = 'weChat';
                    }
                    var xml = formatMessage(result.xml);
                    
                    var encryptMessage = xml.Encrypt;
                    if (sVerifyMsgSig != cryptor.getSignature(sVerifyTimeStamp, sVerifyNonce, encryptMessage)) {
                        console.log("error 58 row ");
                        return;
                    }
                    var decrypted = cryptor.decrypt(encryptMessage);
                    var messageWrapXml = decrypted.message;
                    // console.log(messageWrapXml); //打印收到的xml格式字符串
                    if (messageWrapXml === '') {
                        res.status(401).end('-40005_Invalid corpId');
                        console.log('40005_Invalid');
                        return;
                    }
                    xml2js.parseString(messageWrapXml, {trim: true}, function (err, result) {
                        if (err) {
                            var parseErr = new Error('-40008_BadMessage:' + err.name);
                            parseErr.name = 'weChat';
                        }
                        var message = formatMessage(result.xml);
                        var msgType = message.MsgType;
                        var fromUsername = message.ToUserName;
                        var toUsername = message.FromUserName;
                        console.log("Msg row 77 : " + message.Content)
                        switch (msgType) {
                            case 'text':
                                var sendContent = send(fromUsername, toUsername);
                                console.log("Msg row 81 : " + sendContent)
                                res.status(200).end(sendContent);
                                break;
                            //其他逻辑根据业务需求进行处理
                            case 'image':
                                break;
                            case 'video':
                                break;
                            case 'voice':
                                break;
                            case 'location':
                                break;
                            case 'link':
                                break;
                            case 'event':
                                var event = message.Event;
                                console.log("98" + event);
                                break;
                                console.log('event');
                        }

                    });
                });


            } catch (err) {
                res.status(401).end('System Busy');
                return;
            }
        })
    }
})

/*
 * 接收数据块
 */
function load(stream, callback) {
    var buffers = [];
    stream.on('data', function (trunk) {
        buffers.push(trunk)
    });
    stream.on('end', function () {
        callback(null, Buffer.concat(buffers));
    });
    stream.once('error', callback);
}
/*!
 * 将xml2js解析出来的对象转换成直接可访问的对象
 */
function formatMessage(result) {
    let message = {};
    if (typeof result === 'object') {
        for (var key in result) {
            if (!Array.isArray(result[key]) || result[key].length === 0) {
                continue;
            }
            if (result[key].length === 1) {
                let val = result[key][0];
                if (typeof val === 'object') {
                    message[key] = formatMessage(val);
                } else {
                    message[key] = (val || '').trim();
                }
            } else {
                message[key] = [];
                result[key].forEach(function (item) {
                    message[key].push(formatMessage(item));
                });
            }
        }
    }
    return message;
}

/*!
 * 将回复消息封装成xml格式，其他类型，请按照业务需求重写该函数，或重新构造一个函数来进行业务支持
 */
function reply(fromUsername, toUsername) {
    var info = {};
    info.msgType = 'text';
    info.createTime = new Date().getTime();
    info.toUsername = toUsername;
    info.fromUsername = fromUsername;
    var body = '<xml>' +
        '<ToUserName><![CDATA[' + info.fromUsername + ']]></ToUserName>' +
        '<FromUserName><![CDATA[' + info.toUsername + ']]></FromUserName>' +
        '<CreateTime>' + info.createTime + '</CreateTime>' +
        '<MsgType><![CDATA[text]]></MsgType>' +
        '<Content><![CDATA[你好，同学！]]></Content>' +
        '</xml>';
    var pic = '<xml>' +
        '<ToUserName><![CDATA[' + info.fromUsername + ']]></ToUserName>' +
        '<FromUserName><![CDATA[' + info.toUsername + ']]></FromUserName>' +
        '<CreateTime>' + info.createTime + '</CreateTime>' +
        '<MsgType><![CDATA[image]]></MsgType>' +
        '<Image><MediaId><![CDATA[3mr-FzIL02ZH-z85cV2eFHqF6AjrnmmCMp3ve4DxafoSfo1OqyxADbWtEiUD-1RSY]]></MediaId></Image>' +
        '</xml>';
    return pic;
}
/*
 * 回复消息 将消息打包成xml并加密返回给用户
 * */
function send(fromUsername, toUsername) {
    var xml = reply(fromUsername, toUsername);
    var cryptor = new WXBizMsgCrypt(config.token, config.encodingAESKey, config.corpid);
    var encrypt = cryptor.encrypt(xml);
    var nonce = parseInt((Math.random() * 100000000000), 10);
    var timestamp = new Date().getTime();
    var signature = cryptor.getSignature(timestamp, nonce, encrypt);
    var wrapTpl = '<xml>' +
        '<Encrypt><![CDATA[' + encrypt + ']]></Encrypt>' +
        ' <MsgSignature><![CDATA[' + signature + ']]></MsgSignature>' +
        '<TimeStamp>' + timestamp + '</TimeStamp>' +
        '<Nonce><![CDATA[' + nonce + ']]></Nonce>' +
        '</xml>';
    console.log(wrapTpl);
    return wrapTpl;
}
app.listen(80)
