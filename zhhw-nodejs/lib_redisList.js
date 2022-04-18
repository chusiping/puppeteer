var redis = require('redis')
var client = redis.createClient('6379', '127.0.0.1');
client.auth('redis@qiaoyin.com!@#');


const list = (key) => {
    return new Promise((resolve, reject)=>{
        var _key = '*';
        if(key == 'all') 
            _key = '*';
        else
            _key =  '*'+ key +'*';
        client.keys('*'+ _key +'*', function(err, keys) {
            rt = [];
            if(keys){
                for(var i=0;i<keys.length;i++){
                    rt.push(keys[i]);
                }
                resolve(rt);
            }
            else{
                reject(new Error('无数据'));
            }
        })
    })
};   
module.exports.list = list;
    