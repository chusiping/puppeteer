const MongoClient = require('mongodb').MongoClient;

async function insertData(dbcoon, data) {
  if (!dbcoon.url) dbcoon.url = 'mongodb://myuser:mypassword@redis.qy:27017/mydatabase';
  if (!dbcoon.dbName) dbcoon.dbName = 'mydatabase';
  if (!dbcoon.collectionName) dbcoon.collectionName = 'mycollection';
  try {
    const client = await MongoClient.connect(dbcoon.url, { useUnifiedTopology: true });
    const db = client.db(dbcoon.dbName);
    const collection = db.collection(dbcoon.collectionName);
    const result = await collection.insertOne(data);
    // console.log('操作成功:', result.insertedId);
    client.close();
    return { success: true, message: 'inserted successfully', insertedId: result.insertedId };
  } catch (error) {
    // console.error('Failed to insert document:', error);
    return { success: false, message: '操作失败', error: error };
  }
}
// 获取ip地址
function getClientIp(req) {
  var ipAddress;
  var forwardedIpsStr = req.header('x-forwarded-for');
  if (forwardedIpsStr) {
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    ipAddress = req.connection.remoteAddress;
  }
  if (ipAddress.indexOf(':') !== -1) {
    ipAddress = ipAddress.split(':').reverse()[0];
  }
  return ipAddress;
}

function getCurrentDateTime() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60 * 1000;
  const currentDateTime = new Date(now.getTime() - offset).toISOString().replace('T', ' ').substr(0, 19);
  return currentDateTime;
}


module.exports = { insertData, getClientIp, getCurrentDateTime };






/*
  
  dbName和collectionName任意设定自动创建
  var dbcoon = { url: 'mongodb://myuser:mypassword@redis.qy:27017/mydatabase', dbName: 'mydatabase', collectionName: 'mycollection22' }
  var dbcoon = { collectionName: 'bbb' }
  insertData(dbcoon,data)
  insertData({},data)
*/
