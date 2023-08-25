
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

function conn(title) {
    let sql = "SELECT * FROM token where 1=1 and title='" + title + "'";
    queryDatabase("source/axios_token.db", sql)
        .then(obj => {
            console.info(obj[0]);
            $('#title').val(obj[0].title);
            $('#url').val(obj[0].url);
            $('#requestPayload').val(obj[0].payload);
            $('#headers').val(obj[0].header)
            showTemporaryMessage('完成', 1000);
        });
}

function myFunction(selectedValue) {
    $('#title').val('');
    $('#url').val('');
    $('#requestPayload').val('');
    $('#headers').val('')
    if (selectedValue == "0") return;
    showTemporaryMessage('加载中', 9000);
    conn(selectedValue);
    console.log("id: " + selectedValue);
}

function toggleDiv() {
    var div = document.getElementById("myDiv");
    var data = document.getElementById("data");
    div.style.display = div.style.display === "none" ? "block" : "none";
}

function submitData(api, direct) {
    if (direct === "初始化select") {
        PostAPI(api, "all");
    } else if (direct === "直接查询单个接口") {
        let dp = $('#dp').val();
        api = api.replace("title", dp);
        showTemporaryMessage('等待接口返回', 19000);
        PostAPI(api, title);
    } else {
        var title = $('#title').val().trim();
        if (!title) { showTemporaryMessage('唯一名称必填', 2000); return;}
        PostAPI(api, title);
        showTemporaryMessage('等待接口返回', 19000);
        submitData('/api/db/json/all','初始化select');
    }
}
function PostAPI(api,title){
    var url = $('#url').val().trim();
    var requestPayload = $('#requestPayload').val().trim();
    var headers = $('#headers').val().trim().replace(/'/g, "\"");
    axios.post(api, {
        title: encodeURIComponent(title),
        requestPayload: encodeURIComponent(requestPayload),
        url: encodeURIComponent(url),
        headers: encodeURIComponent(headers)
    }, { maxContentLength: Infinity })
        .then(response => {
            // 处理响应数据
            console.log(response.data);
            if(title == "all"){
                $('#dp').empty();
                $('#dp').append($('<option>', {value: "0", text: "选择API"}));
                response.data.forEach(item => {
                    var option = $('<option>', {
                      value: item.title,
                      text: item.title
                    });
                    $('#dp').append(option);
                  });
            }else{
                $('#data').val(JSON.stringify(response.data))
                showTemporaryMessage('完成');
            }
        })
        .catch(error => {
            showTemporaryMessage('返回错误');
            console.error(error);
        });
}



let temporaryMessage;
function showTemporaryMessage(message, duration = "2000") {
    if (temporaryMessage) { temporaryMessage.remove(); }
    temporaryMessage = $('<div>').text(message).addClass("success-message");
    $('body').prepend(temporaryMessage);
    setTimeout(() => { temporaryMessage.remove(); temporaryMessage = null; }, duration);
}


function extract6Digits(str) {
    var regex = /\d{6}/g;
    var matches = str.match(regex);
    if (!matches) {
      return "";
    }
    var result = matches.join(",");
    return result;
  }
  


var _data;
var count = 0;
function handleClick() {
    if (count % 2 === 0) {
        toStr();
    } else {
        backup();
    }
    count++;
}
function toStr() {
    _data = $('#data').val();
    $('#data').val(extract6Digits(_data))
}
function backup() {
    $('#data').val(_data)
}

//搜索关键字：去重函数
function removeDupStr(str) {
    var arr = str.split(/[\s,]+/);
    var uniqueArr = [...new Set(arr)];
    var result = uniqueArr.join(",");
    return result;
}

function removeDuplicates() {
    var rt = removeDupStr($('#data').val())
    $('#data').val(rt)
}




//1去空格，2转码