
// 方法传入两个数组，第一个数组为key，第二个数组对应位置为value，此方法在Python中为zip()函数。
const ArraytoObj = (keys = [], values = []) => {
    if (keys.length === 0 || values.length === 0) return {};
    const len = keys.length > values.length ? values.length : keys.length;
    const obj = {};
    for (let i = 0; i < len; ++i) {
        obj[keys[i]] = values[i]
    }
    return obj;
};

// 转驼峰表示：func.camel('USER_ROLE',true) => UserRole
// 转驼峰表示：func.camel('USER_ROLE',false) => userRole
const camel = (str, firstUpper = false) => {
    let ret = str.toLowerCase();
    ret = ret.replace(/_([\w+])/g, function (all, letter) {
        return letter.toUpperCase();
    });
    if (firstUpper) {
        ret = ret.replace(/\b(\w)(\w*)/g, function ($0, $1, $2) {
            return $1.toUpperCase() + $2;
        });
    }
    return ret;
};

// 把数组里面的所有转化为驼峰命名
const camelArr = (arrs = []) => {
    let _arrs = [];
    arrs.map(function (item) {
        _arrs.push(camel(item));
    });
    return _arrs;
};

// 读取数据库
// 1.把columns转化为驼峰；
// 2.把columns和values进行组合；
const dbToObj = (_data = {}) => {
    let _res = [];
    _data.map(function (item) {
        let _columns = camelArr(item.columns);
        item.values.map(function (values) {
            _res.push(ArraytoObj(_columns, values));
        });
    });
    return _res;
};

// 主函数
async function queryDatabase(url, sql) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        let db = new window.SQL.Database(new Uint8Array(response.data));
        let s = new Date().getTime();
        let r = db.exec(sql);
        let e = new Date().getTime();
        console.info("查询数据耗时：" + (e - s) + "ms");
        let obj = dbToObj(r);
        return obj;
    } catch (error) {
        console.error(error);
        throw error; // If you want the error to propagate
    }
}

function conn(title){
    let sql =  "SELECT * FROM token where 1=1 and title='"+ title +"'";
    queryDatabase("source/axios_token.db",sql)
    .then(obj => {
        console.info(obj[0]);
        $('#title').val(obj[0].title);
        $('#url').val(obj[0].url);
        $('#requestPayload').val(obj[0].payload);
        $('#headers').val(obj[0].header)
        showTemporaryMessage('完成',1000);
    });
}

function myFunction(selectedValue) {
    $('#url').val('');
    $('#requestPayload').val('');
    $('#headers').val('')
    if(selectedValue=="0") return;
    showTemporaryMessage('加载中',9000);
    conn(selectedValue);    
    console.log("id: " + selectedValue);
}

function toggleDiv() {
    var div = document.getElementById("myDiv");
    var data = document.getElementById("data");
    div.style.display = div.style.display === "none" ? "block" : "none";
    // data.style.display = data.style.display === "block" ? "none" : "block";
}

function submitData(obj,api) {
    if (obj) {
        $('#url').val(obj.url);
        $('#requestPayload').val(obj.payload);
        $('#headers').val(obj.header)
    } else {
        var title = $('#title').val().trim();
        if(!title){
            showTemporaryMessage('唯一名称必填',2000);
            return;
        }
        var url = $('#url').val().trim();
        var requestPayload = $('#requestPayload').val().trim();
        var headers = $('#headers').val().trim().replace(/'/g, "\"");
        showTemporaryMessage('等待接口返回',9000);
        axios.post(api, {
            title: encodeURIComponent(title),
            requestPayload: encodeURIComponent(requestPayload),
            url: encodeURIComponent(url),
            headers: encodeURIComponent(headers)
        },{ maxContentLength: Infinity })
            .then(response => {
                // 处理响应数据
                console.log(response.data);
                $('#data').html(JSON.stringify(response.data))
                showTemporaryMessage('完成');
            })
            .catch(error => {
                showTemporaryMessage('返回错误');
                console.error(error);
            });
    }
}
let temporaryMessage; 
function showTemporaryMessage(message, duration = "2000") {
  if (temporaryMessage) { temporaryMessage.remove();}
  temporaryMessage = $('<div>').text(message).addClass("success-message");
  $('body').prepend(temporaryMessage);
  setTimeout(() => { temporaryMessage.remove(); temporaryMessage = null; }, duration);
}

  
//1去空格，2转码