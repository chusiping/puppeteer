//172.18.1.208:root/NodeJsApp/运维查询ip和端口/node html.js
//http://172.18.1.208:3301/ipcheck.html

const express = require('express');
const app = express();
const queryDatabase = require('../public/lib_mysql'); // 替换为模块文件的路径



function CombinSql(str) {
    if(str === null || str==='' ) return "select * from server_all";
    const ipAddressRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/; //ip
    const portRegex = /^\d{1,5}$/;//端口
    if(ipAddressRegex.test(str)){
        return "select * from server_all where ip = '"+ str +"'";     
    } else if(portRegex.test(str)){
        return "select * from server_all where port like  '%"+ str +"%'";
    } else if(str == "去重的所有系统") {
        return "select DISTINCT(a.remark) from server_list a order by remark"
    } else {
        return "select * from server_all where remark like  '%"+ str +"%'";
    }
};

//ipcheck.html使用
app.get("/all",async (req,res)=>{
    let keyword = req.query.data; 
    const sql = CombinSql(keyword);
    //jarry 2023-12-25 mysql 通用函数- 调用范例
    try {
      let rt = await queryDatabase(res, sql);
      res.json(rt)
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred' });
    }
});

app.use('', express.static('./')).listen(3301);


