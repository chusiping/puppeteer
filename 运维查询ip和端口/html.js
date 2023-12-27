//172.18.1.208:root/NodeJsApp/运维查询ip和端口/node html.js
//http://172.18.1.208:3301/ipcheck.html

const express = require('express');
const app = express();
const queryDatabase = require('../public/lib_mysql'); // 替换为模块文件的路径
const fs = require('fs');

function CombinSql(str) {
    if(str === null || str==='' ) return "select * from server_all2";
    const ipAddressRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/; //ip
    const portRegex = /^\d{1,5}$/;//端口
    if(ipAddressRegex.test(str)){
        return "select * from server_all2 where ip = '"+ str +"'";     
    } else if(portRegex.test(str)){
        return "select * from server_all2 where port like  '%"+ str +"%'";
    } else if(str == "去重的所有系统") {
        return "select DISTINCT(a.remark) from server_list a order by remark"
    } else if(str == "查看停用的端口") {
        return "select * from server_all2 where stop =1"
    } else {
        return "select * from server_all2 where remark like  '%"+ str +"%'";
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

// 定义一个函数，执行SQL查询并将结果写入到一个.txt文件中
async function executeQueryAndWriteToFile(filename) {
    const sql = "select ip,port from port_list where stop =0"; // 替换为你的SQL语句
    try {
        let rt = await queryDatabase(null,sql);
        let result = rt.map(row => `${row.ip} ${row.port}`).join('\r\n');
        
        // 将结果转换为字符串并写入到一个.txt文件中
        fs.writeFile(filename, result, (err) => {
            if (err) throw err;
            console.log('/root/work/test/data4.txt been created!');
        });
    } catch (err) {
        console.error(err);
    }
}

// 每5小时执行一次函数
executeQueryAndWriteToFile(`/root/work/test/data4.txt`) 
setInterval(() => executeQueryAndWriteToFile(`/root/work/test/data4.txt`), 6 * 60 * 60 * 1000);  // 5 * 60 * 60 * 1000


app.use('', express.static('./')).listen(3301);
