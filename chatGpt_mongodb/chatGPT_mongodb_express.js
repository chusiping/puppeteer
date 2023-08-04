const express = require('express');
const bodyParser = require('body-parser');
const { insertData } = require('./chatGPT_mongodbUtils');
const url = 'mongodb://myussser:mypassword@redis.qy:27017/mydatabase';
const dbName = 'mydatabase';
const collectionName = 'mycollection';


const app = express();
app.use(bodyParser.json());
app.post('/insert', function (req, res) {
  const data = req.body;
  insertData(url, dbName, collectionName, data)
    .then((result) => {
      console.log(result);
      res.send(result);
    })
    .catch((error) => {
      console.error(error);
    });

});
app.use('', express.static('./')).listen(3000);