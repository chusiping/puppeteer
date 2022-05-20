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


/*
返回:
var hq_str_sz002307="����·��,5.640,5.780,5.940,6.050,5.640,5.940,5.950,103761065,607586509.320,937600,5.940,476200,5.930,214800,5.920,152600,5.910,221800,5.900,271700,5.950,300366,5.960,178400,5.970,159000,5.980,165900,5.990,2022-05-19,15:00:03,00";
*/