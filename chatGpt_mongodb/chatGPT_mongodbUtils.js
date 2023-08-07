const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');

class Database {
  constructor(dbcoon) {
    this.url = dbcoon.url || 'mongodb://myuser:mypassword@redis.qy:27017/mydatabase';
    this.dbName = dbcoon.dbName || 'mydatabase';
    this.collectionName = dbcoon.collectionName || 'mycollection';
  }

  async getDataByCondition(condition) {
    try {
      const client = await MongoClient.connect(this.url, { useUnifiedTopology: true });
      const db = client.db(this.dbName);
      const collection = db.collection(this.collectionName);
      let result;
      if (condition) {
        result = await collection.find(condition).toArray();
      } else {
        result = await collection.find().toArray();
      }
      client.close();
      return { success: true, message: '查询成功', data: result };
    } catch (error) {
      return { success: false, message: '操作失败', error: error };
    }
  }


  async insertData(data) {
    try {
      const client = await MongoClient.connect(this.url, { useUnifiedTopology: true });
      const db = client.db(this.dbName);
      const collection = db.collection(this.collectionName);
      const result = await collection.insertOne(data);
      client.close();
      return { success: true, message: '添加成功', insertedId: result.insertedId };
    } catch (error) {
      return { success: false, message: '操作失败', error: error };
    }
  }

  async deleteData(filter) {
    try {
      const client = await MongoClient.connect(this.url, { useUnifiedTopology: true });
      const db = client.db(this.dbName);
      const collection = db.collection(this.collectionName);
      const count = await collection.countDocuments(filter);
      if (count === 0) {
        client.close();
        return { success: false, message: '没有数据需要删除' };
      }
      const result = await collection.deleteMany(filter);
      client.close();
      return { success: true, message: '删除成功', deletedCount: result.deletedCount };
    } catch (error) {
      return { success: false, message: '删除失败', error: error };
    }
  }

  async deleteDataByID(id) {
    try {
      const client = await MongoClient.connect(this.url, { useUnifiedTopology: true });
      const db = client.db(this.dbName);
      const collection = db.collection(this.collectionName);
      const count = await collection.countDocuments({ _id: ObjectId(id) });
      if (count === 0) {
        client.close();
        return { success: false, message: '没有数据需要删除' };
      }
      const result = await collection.deleteOne({ _id: ObjectId(id) });
      client.close();
      return { success: true, message: '删除成功', deletedCount: result.deletedCount };
    } catch (error) {
      return { success: false, message: '删除失败', error: error };
    }
  }

  async updateDataByID(id, newData) {
    try {
      const client = await MongoClient.connect(this.url, { useUnifiedTopology: true });
      const db = client.db(this.dbName);
      const collection = db.collection(this.collectionName);
      const count = await collection.countDocuments({ _id: ObjectId(id) });
      if (count === 0) {
        client.close();
        return { success: false, message: '没有找到需要修改的数据' };
      }
      const result = await collection.updateOne({ _id: ObjectId(id) }, { $set: newData });
      client.close();
      return { success: true, message: '修改成功', modifiedCount: result.modifiedCount };
    } catch (error) {
      return { success: false, message: '修改失败', error: error };
    }
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


module.exports = {Database, getClientIp, getCurrentDateTime };






/*
  优化之后改成类方法调用 
  { url: 'mongodb://myuser:mypassword@redis.qy:27017/mydatabase', dbName: 'mydatabase', collectionName: 'mycollection22' }
  const db = new Database({collectionName:"aaa"});

  //查询调用
  const result = await database.getDataByCondition();
  const result = await database.getDataByCondition({ age: 25 });

  
*/
