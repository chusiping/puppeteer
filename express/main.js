const express = require('express')
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const inc = require("./main_include")
const app = express();
const ejs = require('ejs');   
app.engine('html',ejs.__express);  
app.set('view engine', 'html');  
app.set('views', './html')

app.use(fileUpload({createParentPath: true}));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

app.get('/sina', inc.sina)
app.get('/top', inc.top)
app.all('/ocr', inc.ocr)
app.all('/myStockExist', inc.myStockExist)
app.all('/getIp', inc.getIp)

app.use(express.static("./html")).listen(3000);
