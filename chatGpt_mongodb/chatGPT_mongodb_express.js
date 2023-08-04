const express = require('express');
const bodyParser = require('body-parser');
const { insertData, getClientIp,getCurrentDateTime } = require('./chatGPT_mongodbUtils');

const app = express();
app.use(bodyParser.json());
app.post('/insert', function (req, res) {
  const data = req.body;
  data.addTime = getCurrentDateTime();
  data.ip = getClientIp(req);
  insertData({},data) // 重载方法 insertData(data,url, dbName, collectionName ) 
    .then((result) => {
      console.log(result);
      res.send(result);
    })
    .catch((error) => {
      console.error(error);
    });
});
app.use('', express.static('./')).listen(3000);