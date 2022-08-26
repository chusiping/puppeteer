//代码来源： https://gitee.com/ls_web/echarts-demo
var mdata = { "data": [] }
function getmData(callback) { //分时图
    $.ajax({
        // url: "http://data.gtimg.cn/flashdata/hushen/minute/sh601066.js?maxage=110&0.28163905744440854",
        url: "http://127.0.0.1:3004/getMinite_KLine?code=601066",  //分时数据
        dataType: "json",
        cache: "false",
        type: "GET",
        success: function (rt) {
            let _arr = [];
            for (var i = 0; i < rt.data.length; i++) {
                let _rt = [rt.data[i].m, rt.data[i].p, rt.data[i].v,];
                _arr.push(_rt)
            }
            mdata.data = _arr
            callback(mdata)
        },
        error: function () {
            alert("wrong");
        }
    });
}
function getInfo(callback) { //获取股票昨天的收盘价格
    $.ajax({
        url: "http://127.0.0.1:3004/test?code=601066",
        dataType: "script",
        cache: "false",
        type: "GET",
        success: function () {
            var info = eval('hq_str_sh601066').split(",")
            callback(info)
        },
        error: function () {
            alert("查询信息失败")
        }
    })
}
