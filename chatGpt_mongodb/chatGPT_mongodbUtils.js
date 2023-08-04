const MongoClient = require('mongodb').MongoClient;

async function insertData(url, dbName, collectionName, data) {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(data);
    // console.log('操作成功:', result.insertedId);
    client.close();
    return { success: true, message: 'inserted successfully', insertedId: result.insertedId };
  } catch (error) {
    // console.error('Failed to insert document:', error);
    return { success: false, message: '操作失败', error: error };
  }
}
module.exports = {  insertData };