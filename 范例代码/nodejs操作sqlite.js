/*
    关键字：sqlite
    文件内测试： (async ()=>{  await createTable();   await insert();   await usersDB.close(); })()
    文件外调用: 
    打印结果: 
    连接：https://www.coder.work/article/108513
*/
var sqlite3 = require('sqlite3');
var usersDB = new sqlite3.Database("../database/ClosePrice.db");

var createTable = async()=>{
    await usersDB.serialize(function() {
        usersDB.run("DROP TABLE history ;");
        usersDB.run("CREATE TABLE history (code text,name text,date date, close real)");
        console.log('done')
    });
};
var insert = async()=>{
    var stmt = usersDB.prepare("INSERT INTO history VALUES (?,?,?,?)");
    for (var i = 0; i < 4; i++) {
        var sql = `${i}`;
        stmt.run(sql,sql,sql,sql);
    }
    await stmt.finalize();
};

var getData = async()=>{
    await usersDB.each("SELECT * FROM history", function(err, row) {
        console.log(row.code + ": " + row.name);
    });
};

// 内部测试
(async ()=>{  
    await createTable();   
    await insert();
    await getData()  ;   
    await usersDB.close(); 
})()
