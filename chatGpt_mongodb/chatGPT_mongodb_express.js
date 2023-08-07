const express = require('express');
const bodyParser = require('body-parser');
const { Database, getClientIp,getCurrentDateTime } = require('./chatGPT_mongodbUtils');

const db = new Database({});

const app = express();
app.use(bodyParser.json());
app.post('/insert', async function (req, res) {
  try {
    const data = req.body;
    data.addTime = getCurrentDateTime();
    data.ip = getClientIp(req);
    const result = await db.insertData(data);
    console.log(result);
    res.send(result);
  } catch (error) {
    console.error(error);
  }
});

// 删除数据
app.post('/delete', async function (req, res) {
  try {
    const filter = req.body;
    var result = null;
    if(filter.id){
      result = await db.dedeleteDataByID(filter.id);
    }else{
      delete filter.id;
      result = await db.deleteData(filter);
    } 
    
    console.log(result);
    res.send(result);
  } catch (error) {
    console.error(error);
  }
});

// 更新数据
app.post('/update', async function (req, res) {
  try {
    const data = req.body;
    data.update = getCurrentDateTime();
    data.ip = getClientIp(req);
    let id_ =data.id;
    delete data.id;
    const result = await db.updateDataByID(id_,data);
    console.log(result);
    res.send(result);
  } catch (error) {
    console.error(error);
  }
});

// 查询数据
app.post('/find', async function (req, res) {
  try {
    const data = req.body;
    const result = await db.getDataByCondition(data); //或 await db.getDataByCondition(data);
    console.log(result);
    res.send(result);
  } catch (error) {
    console.error(error);
  }
});

app.use('', express.static('./')).listen(3000);
