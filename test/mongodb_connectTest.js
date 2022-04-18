var MongoClient = require('mongodb').MongoClient;

//1.数据是否连接
//var url = "mongodb://192.168.1.16:27017/zhhw";
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("数据库已创建!");
//   db.close();
// });


//2.查询所有数据
// var url = "mongodb://192.168.1.16:27017"
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("zhhw");
//     dbo.collection("tb_employee"). find({}).toArray(function(err, result) { // 返回集合中所有数据
//         if (err) throw err;
//         console.log(result);
//         db.close();
//     });
// });

//3.创建集合
// var url = 'mongodb://192.168.1.16:27017'
// MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
//     console.log('数据库已创建');
//     var dbase = db.db("zhhw");
//     dbase.createCollection('posts', function (err, res) {
//         if (err) throw err;
//         console.log("创建集合!");
//         db.close();
//     });
// });

//4.插入一条数据
// var url = "mongodb://192.168.1.16:27017"
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("zhhw");
//     var myobj = { name: "菜鸟教程", url: "www.runoob" };
//     dbo.collection("posts").insertOne(myobj, function(err, res) {
//         if (err) throw err;
//         console.log("文档插入成功");
//         db.close();
//     });
// });

//5.待条件更新一条数据
// var url = "mongodb://192.168.1.16:27017"
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("zhhw");
//     var whereStr = {"name":'菜鸟教程'};  // 查询条件
//     var updateStr = {$set: { "url" : "https://33" }};
//     dbo.collection("posts").updateOne(whereStr, updateStr, function(err, res) {
//         if (err) throw err;
//         console.log("文档更新成功");
//         db.close();
//     });
// });

//6.不存在则插入否则更新一条数据
// var url = "mongodb://192.168.1.16:27017"
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("zhhw");
//     var query = {url : "https://33"};
//     dbo.collection("posts").findOneAndUpdate(query, {'$set':query},  {upsert:true},function(err, res) {
//         if (err) throw err;
//         console.log("文档更新成功");
//         db.close();
//     });
// });

// $setOnInsert操作符
// var url = "mongodb://192.168.1.16:27017"
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("zhhw");
//     var query = {name:"test",url : "https://334455"};
//     var query2 = {name:"test2"};
//     dbo.collection("posts").updateOne(query2, {'$setOnInsert':query},  {upsert:true},function(err, res) {
//         if (err) throw err;
//         console.log("文档更新成功");
//         db.close();
//     });
// });




//7.带条件删除数据
// var url = "mongodb://192.168.1.16:27017"
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("zhhw");
//     var whereStr = {"name":'菜鸟教程'};  // 查询条件
//     dbo.collection("posts").deleteOne(whereStr, function(err, obj) {
//         if (err) throw err;
//         console.log("文档删除成功");
//         db.close();
//     });
// });

//8.删除多条数据
// var url = "mongodb://192.168.1.16:27017"
//  MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("zhhw");
//     var whereStr = { type: "en" };  // 查询条件
//     var whereStr = { };  // 全部数据
//     dbo.collection("posts").deleteMany(whereStr, function(err, obj) {
//         if (err) throw err;
//         console.log(obj.result.n + " 条文档被删除");
//         db.close();
//     });
// });


