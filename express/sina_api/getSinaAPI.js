var request = require('request');
const express = require('express');
const app = express();

function ff(url) {
    return new Promise((resolve, reject) => {       
        request.get({
            url: 'http://hq.sinajs.cn/list=sz002307',
            headers: {
                referer: "https://finance.sina.com.cn"
            },
        }, (err, response, data) => {
            resolve(data)
        });
    });
};

app.get("/",(req,res)=>{
    ff('dd').then(data => { res.send(data) });
});

app.listen(3000)