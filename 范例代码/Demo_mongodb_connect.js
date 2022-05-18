// 使用说明：mongodb使用的增删改查
var MongoClient = require('mongodb').MongoClient;
var server = "mongodb://192.168.1.16:27017/";
var db = "zhhw";
var url = server + db;

//1.数据是否连接
var conn1 = () => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        console.log("数据库已创建!");
        db.close();
    });
}

//2.查询所有数据
var find = (dbname,table_name)=>{
    MongoClient.connect(server, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbname);
        dbo.collection(table_name). find({}).toArray(function(err, result) { // 返回集合中所有数据
            if (err) throw err;
            console.log(result);
            db.close();
        });
    });
}

//3.创建集合
var CreateDB = (dbname,table_name) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        console.log('数据库已创建');
        var dbase = db.db(dbname);
        dbase.createCollection(table_name, function (err, res) {
            if (err) throw err;
            console.log("创建集合!");
            db.close();
        });
    });
}
 
//  屏蔽此函数，容易出错重复数据。。。
//  插入一条数据  可以插入完全相同对象重复数据，
// var Insert = (dbname,table_name,record_obj) =>{
//     MongoClient.connect(url, function(err, db) {
//         if (err) throw err;
//         var dbo = db.db(dbname);
//         var myobj =  record_obj;//{ name: "菜鸟教程", url: "www.runoob" };
//         dbo.collection(table_name).insertOne(myobj, function(err, res) {
//             if (err) throw err;
//             console.log("文档插入成功");
//             db.close();
//         });
//     });
// }

//4 不存在则插入否则更新一条数据
var InsertByNul = (dbname,table_name,query_obj) => { 
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbname);
        var query = query_obj; // {url : "https://33444"};
        dbo.collection(table_name).findOneAndUpdate(query, {'$set':query},  {upsert:true},function(err, res) {
            if (err) throw err;
            console.log("文档更新成功");
            db.close();
        });
    });
}

//取消使用待条件更新一条数据
// var updateOne_where = (dbname,table_name,record_obj,where_obj) => {
//     MongoClient.connect(url, function(err, db) {
//         if (err) throw err;
//         var dbo = db.db(dbname);
//         var whereStr = where_obj ;// {"name":'菜鸟教程'};  // 查询条件
//         var updateStr = {$set: record_obj }; //{$set: { "url" : "https://33" }}; 这里错了，应该去掉括号
//         dbo.collection(table_name).updateOne(whereStr, updateStr, function(err, res) {
//             if (err) throw err;
//             console.log("文档更新成功");
//             db.close();
//         });
//     });
// }




//带条件删除数据
// var deleteOne_where = (dbname,table_name,where) => { 
//     //delete var url = "mongodb://192.168.1.16:27017"
//     MongoClient.connect(url, function(err, db) {
//         if (err) throw err;
//         var dbo = db.db(dbname);
//         var whereStr = where;// {"name":'菜鸟教程'};  // 查询条件
//         dbo.collection(table_name).deleteOne(whereStr, function(err, obj) {
//             if (err) throw err;
//             console.log("文档删除成功");
//             db.close();
//         });
//     });
// }

//8.删除多条数据，禁止无条件删除
var deleteMany_where = (dbname,table_name,where) => { 
    //delete var url = "mongodb://192.168.1.16:27017"
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbname);
        var whereStr =  where //{ type: "en" }; // 查询条件 { }; 全部
        dbo.collection(table_name).deleteMany(whereStr, function(err, obj) {
            if (err) throw err;
            console.log(obj.result.n + " 条文档被删除");
            db.close();
        });
    });
}

// 9.更新一条数据
//upsert : 可选，这个参数的意思是，如果不存在update的记录，是否插入objNew,true为插入，默认是false，不插入。
// query : update的查询条件，类似sql update查询内where后面的
// 如果我们需要更新所有符合条件的所有记录，我们需要将 multi 参数设置为 true。
// 不加"$set"，整个全部属性都会被替换，加上则只是替换指定的
var update_all = (dbname,table_name,update_obj,where) => { 
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbname);
        var query = update_obj;     
        var query2 = where;        
        dbo.collection(table_name).update(query2, {"$set":query},{multi:true},function(err, res) {
            if (err) throw err;
            console.log("文档更新成功");
            db.close();
        });
    });
}



var inser_obj =  { name: "菜鸟教程222", url: "www.runoob",ID: 1002 };
var re_obj =  { name: "张三",ID: 1001 };
var update_obj =  { name: "222 aa" };
var where =  { ID: 1001 };   
var mydb = "zhhw";
var table_name = "posts";



// node Demo_mongodb_connectTest.js

//1.数据是否连接
// conn1(); 
//2.查询所有数据
// find(mydb,table_name);
//3.创建集合
// CreateDB(mydb,table_name);

//4.插入数据
// InsertByNul(mydb,table_name,re_obj); // 用这个方法防止对象重复，对象完全相同则跳过，任一字段不同则插入一条新数据，

//后续加入批量插入

// 9.更新一批数据
// update_all(mydb,table_name,update_obj,where); //  把整个内容完全替换掉了。。。，并且只更改了一条记录。。。。。

//8.删除多条数据
// deleteMany_where(mydb,table_name,where);









