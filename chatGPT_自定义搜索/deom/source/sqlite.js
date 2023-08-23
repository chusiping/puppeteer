
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

function conn(id){
    let sql =  "SELECT * FROM token where 1=1 and id="+id;
    queryDatabase("source/axios_token.db",sql)
    .then(obj => {
        console.info(obj[0]);
        $('#url').val(obj[0].url);
        $('#requestPayload').val(obj[0].payload);
        $('#headers').val(obj[0].header)
        showTemporaryMessage('完成',);
    });
}

function myFunction(selectedValue) {
    $('#url').val('');
    $('#requestPayload').val('');
    $('#headers').val('')
    if(selectedValue=="0") return;
    showTemporaryMessage('加载中',);
    conn(selectedValue);    
    console.log("id: " + selectedValue);
}

function toggleDiv() {
    var div = document.getElementById("myDiv");
    div.style.display = div.style.display === "none" ? "block" : "none";
}

function submitData(obj) {
    if (obj) {
        $('#url').val(obj.url);
        $('#requestPayload').val(obj.payload);
        $('#headers').val(obj.header)
    } else {
        var url = $('#url').val();
        var requestPayload = $('#requestPayload').val();
        var headers = JSON.parse($('#headers').val());
        axios.post('/api/search', {
            requestPayload: requestPayload,
            url: url,
            headers: headers
        })
            .then(response => {
                // 处理响应数据
                console.log(response.data);
                $('#data').html(JSON.stringify(response.data))
            })
            .catch(error => {
                console.error(error);
            });
    }
}
function showTemporaryMessage(message, duration="2000") {
    const temporaryMessage = $('<div>').text(message).addClass("success-message");
    $('body').prepend(temporaryMessage);
    setTimeout(() => temporaryMessage.remove(), duration);
  }
  
