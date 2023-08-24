var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
 
var DB = DB || {};
 
DB.SqliteDB = function(file){
    DB.db = new sqlite3.Database(file);
 
    DB.exist = fs.existsSync(file);
    if(!DB.exist){
        console.log("Creating db file!");
        fs.openSync(file, 'w');
    };
};
 
DB.printErrorInfo = function(err){
    console.log("Error Message:" + err.message + " ErrorNumber:" + err);
};
 
DB.SqliteDB.prototype.createTable = function(sql){
    DB.db.serialize(function(){
        DB.db.run(sql, function(err){
            if(null != err){
                DB.printErrorInfo(err);
                return;
            }
        });
    });
};
 
/// tilesData format; [[level, column, row, content], [level, column, row, content]]
//可以是单数组，可以是多数组
DB.SqliteDB.prototype.insertData = function (sql, objects) {
    DB.db.serialize(function () {
        var stmt = DB.db.prepare(sql);
        var rt =  {"success":"ok"};
        if (Array.isArray(objects[0])) {
            for (var i = 0; i < objects.length; ++i) {
                try {
                    stmt.run(objects[i]);
                } catch (error) {
                    rt = error;
                    console.log(error);
                }
            }
        } else {
            // 如果 objects 是单个对象，则直接处理该对象
            try {
                stmt.run(objects);
            } catch (error) {
                rt = error;
                console.log(error);
            }
        }
        stmt.finalize();
        return rt;
    });
};


DB.SqliteDB.prototype.queryData = function(sql, callback){
    DB.db.all(sql, function(err, rows){
        if(null != err){
            DB.printErrorInfo(err);
            return;
        }
 
        /// deal query data.
        if(callback){
            callback(rows);
        }
    });
};
 
DB.SqliteDB.prototype.queryData2 = function(sql){
    DB.db.all(sql, function(err, rows){
        if(null != err){
            DB.printErrorInfo(err);
            return;
        }
        return rows
    });
};


DB.SqliteDB.prototype.executeSql = function(sql){
    DB.db.run(sql, function(err){
        if(null != err){
            DB.printErrorInfo(err);
        }
    });
};
 
DB.SqliteDB.prototype.close = function(){
    DB.db.close();
};
 
/// export SqliteDB.
exports.SqliteDB = DB.SqliteDB;