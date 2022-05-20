/* 使用方法：以类对象的方法调用, 等待迁移到lib库
    var MongoDB = require('../public/_Lib_Mongodb');
    var dd = MongoDB.GetRandom(false,8);
    var inser_obj =  { name: "菜鸟教程"+dd, url: "www.runoob",ID: dd };
    var re_obj =  { name: "张三",ID: 1001 };
    var update_obj =  { name: "10003" };
    var where =  { ID: 1002 }; 

    MongoDB.find().then(data=>{ console.log(data)});
    MongoDB.InsertByNull(inser_obj).then(data=>{ console.log(data)});
    MongoDB.update_all(update_obj,where).then(data=>{ console.log(data)});;
    MongoDB.deleteMany_where(where).then(data=>{ console.log(data)})
*/


var MongoClient = require('mongodb').MongoClient;

var DB = function () {
    this.Server = "mongodb://192.168.1.16:27017/";
    this.dbname =  "zhhw";
    this.table_name = "test";
    this.Exp = { useNewUrlParser:true,useUnifiedTopology: true};

    this.randomFlag = false;
    this.min = 8;
    this.max = 9999;
};

// 删除多条数据 { type: "en" }; // 查询条件 { }; 全部
DB.prototype.deleteMany_where = function (where){
    var _dbname = this.dbname;
    var _table_name  = this.table_name;
    return new Promise((resolve, reject) => {
        MongoClient.connect(this.Server, this.Exp, function(err, db) {
            if (err) throw err;
            var dbo = db.db(_dbname);
            dbo.collection(_table_name).deleteMany(where, function(err, obj) {
                if (err) throw err;
                resolve(obj.result.n + " 条文档被删除");
                db.close();
            });
        });
    });
}



DB.prototype.update_all = function (update_obj,where){
    var _dbname = this.dbname;
    var _table_name  = this.table_name;
    return new Promise((resolve, reject) => {
        MongoClient.connect(this.Server, this.Exp,function(err, db) {
            if (err) throw err;
            var dbo = db.db(_dbname);
            dbo.collection(_table_name).update(where, {"$set":update_obj},{multi:true},function(err, res) {
                if (err) throw err;
                resolve(update_obj + " 更新成功！ ");
                db.close();
            });
        });
    });
}


//不存在则插入, 忽略完全重复的对象
DB.prototype.InsertByNull = function (query_obj){
    var _dbname = this.dbname;
    var _table_name  = this.table_name;
    return new Promise((resolve, reject) => {
        MongoClient.connect(this.Server,this.Exp, function(err, db) {
            if (err) throw err;
            var dbo = db.db(_dbname);
            var query = query_obj; 
            dbo.collection(_table_name).findOneAndUpdate(query, {'$set':query},  {upsert:true},function(err, res) {
                if (err) throw err;
                resolve(query_obj + " 添加成功");
                // console.log("文档更新成功");
                db.close();
            });
        });
    });
}


DB.prototype.InsertByNull = function (query_obj){
    var _dbname = this.dbname;
    var _table_name  = this.table_name;
    return new Promise((resolve, reject) => {
        MongoClient.connect(this.Server, this.Exp,function(err, db) {
            if (err) throw err;
            var dbo = db.db(_dbname);
            dbo.collection(_table_name).findOneAndUpdate(query_obj, {'$set':query_obj},  {upsert:true},function(err, res) {
                if (err) throw err;
                resolve(JSON.stringify(query_obj) + " 文档更新成功");
                // console.log("文档更新成功");
                db.close();
            });
        });
    });
}

DB.prototype.find = function (){
    var _dbname = this.dbname;
    var _table_name  = this.table_name;
    return new Promise((resolve, reject) => {
        MongoClient.connect(this.Server, this.Exp,function(err, db) {
            if (err) throw err; // { reject(err);return; };
            var dbo = db.db(_dbname);
            dbo.collection(_table_name). find({}).toArray(function(err, result) { // 返回集合中所有数据
                if (err) throw err;
                // console.log(result);
                resolve(result);
                db.close();
            });
        });
    });
}
// 随机数使用： var dd = MongoDB.GetRandom(false,8);
DB.prototype.GetRandom = function (){
    var str = "",
    range = this.min,
    arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    // 随机产生 
    if(this.randomFlag){
        range = Math.round(Math.random() * (this.max-this.min)) + this.min;
    }
    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
};
module.exports = new DB();
