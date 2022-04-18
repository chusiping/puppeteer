/// Import SqliteDB.
var SqliteDB = require('../public/_LibSqlite.js').SqliteDB;
var file = "new_spider.db";
var sqliteDB = new SqliteDB(file);

// var createLabelTableSql = "CREATE TABLE news (site text ,title text,url text,AddTime date,IsDel real,type text)";
// sqliteDB.createTable(createLabelTableSql);

var tileData = [
    ['baidu',"主体关于xx建设的问题1"," www.xxx21.com","2022-2-28 00:00:00","0","test"], 
    ['baidu',"主体关于xx建设的问题2"," www.xxx22.com","2022-2-28 00:00:00","0","test"],
];

var tileData2 = [
[ 'dd2',"主体关于xx建设的问题1"," www.xxx21.com","2022-2-28 00:00:00"] ]  

// var insertTileSql = "insert into news(site, title, url,AddTime) values(?, ?, ?, ?)";
// sqliteDB.insertData(insertTileSql, tileData);

var insertTileSql2 = "insert or ignore into news(site, title, url,AddTime,IsDel,type) values(?, ?, ?, ? , ? ,?) ";
sqliteDB.insertData(insertTileSql2, tileData);


/// query data.
var querySql = 'select * from news where 1=1';
sqliteDB.queryData(querySql, dataDeal);

// /// update data.
// var updateSql = 'update tiles set level = 2 where level = 1 and column = 10 and row = 10';
// sqliteDB.executeSql(updateSql);

// /// query data after update.
// querySql = "select * from tiles where level = 2";
// sqliteDB.queryData(querySql, dataDeal);
// sqliteDB.close();
function dataDeal(objects){
    for(var i = 0; i < objects.length; ++i){    
        console.log(objects[i])
    }
}