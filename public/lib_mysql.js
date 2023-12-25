const util = require('util');
const mysql = require('mysql');
var sd = require('silly-datetime');

//  jarry 2023-12-25 mysql 通用函数- 查询
//  调用示例
//  try {
//     let rt = await queryDatabase(res, sql);
//     res.json(rt)
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'An error occurred' });
//   }

async function queryDatabase(res, sql,connectionParams = {
    host: '172.18.1.208',
    user: 'root',
    password: 'toor.1qaz@WSX',
    database: 'yunwei'
  }) {
  const conn = mysql.createConnection(connectionParams);
  const queryPromise = util.promisify(conn.query).bind(conn);
  try {
    const rt = await queryPromise(sql);
    var _date = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    console.log(_date + " - " + sql);
    return rt
    //原生 res.json(rt);
  } catch (err) {
    console.error(err);
    return { error: 'An error occurred while querying the database' }
    //原生 res.status(500).json({ error: 'An error occurred while querying the database' });
  } finally {
    conn.end();
  }
}

module.exports = queryDatabase;