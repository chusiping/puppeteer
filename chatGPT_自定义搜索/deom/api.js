const express = require('express');
const axios = require('axios');
const fs = require('fs');
const { json } = require('body-parser');
var SqliteDB = require('../../public/_LibSqlite.js').SqliteDB;
var file = "source/axios_token.db";
var sqliteDB = new SqliteDB(file);
const app = express();
app.use(express.json());

app.post('/api/search', (req, res) => {

    let url = req.body.url;
    let requestPayload = req.body.requestPayload
    let headers =  req.body.headers

    url = decodeURIComponent(url)
    requestPayload = JSON.parse(decodeURIComponent(requestPayload))
    headers = JSON.parse(decodeURIComponent(headers));

    axios.post(url, requestPayload, { headers })
        .then(response => {
            let rt = response.data;
            //console.log(rt);
            res.send(rt);
        })
        .catch(error => {
            res.send(error);
        });
});

app.post('/api/db/:param', (req, res) => {
    const paramValue = req.params.param;
    let url = req.body.url;
    let requestPayload = req.body.requestPayload;
    let headers =  req.body.headers;
    let title = req.body.title;

    url = decodeURIComponent(url);
    title = decodeURIComponent(title);
    requestPayload = (decodeURIComponent(requestPayload));
    headers = (decodeURIComponent(headers));

    data = [title,url,requestPayload,headers];

    sqliteDB.executeSql("delete from token where title='"+ title +"'");
    if(paramValue == "add"){
        var add_sql = "insert into token(title, url, payload,header) values(?, ?, ?, ?)";
        sqliteDB.insertData(add_sql, data);     
    }
    res.send({"success":"ok"});
});

app.all('/api/db/json/:title', (req, res) => {
    const title = req.params.title;
    var sql = "select * from token where title='" + title + "'";
    if (title == "all") {
        sql = "select title from token ";
        sqliteDB.queryDatabase(file, sql)
            .then(result => {
                res.send(result);//console.log(JSON.stringify(result));
            })
            .catch(error => {
                res.send(result); console.error(error);
            });
    } else {
        sqliteDB.queryDatabase(file, sql)
            .then(result => {
                // res.send(result);//console.log(result);
                url = (result[0].url)
                requestPayload = JSON.parse((result[0].payload))
                headers = JSON.parse((result[0].header));

                axios.post(url, requestPayload, { headers })
                    .then(response => {
                        let rt = response.data;
                        //console.log(rt);
                        res.send(rt);
                    })
                    .catch(error => {
                        res.send(error);
                    });
            })
            .catch(error => {
                res.send(error); console.error(error);
            });
    }

});

console.log("应用程序:token查看api的接口数据，端口 3005");
app.use('', express.static('./')).listen(3005);

// 待改进  1 sql返回的结果没有  3  前端取消使用JavaScript获取sqlite