var bgColor = "#fff";//背景
var upColor = "#ff0000";//涨颜色
var downColor = "#008b00";//跌颜色
var labelColor = "#666"; //文字颜色
var borderColor = "#bebebe"; // 图标边框色，会影响坐标轴上悬浮框的背景色
// ma  颜色
var ma5Color = "#39afe6";
var ma10Color = "#da6ee8";



var get_m_data = function (m_data, type) {
    var priceArr = new Array();
    var vol = new Array();
    // var times = time_arr(type);
    var times = new Array();
    $.each(m_data.data, function (i, v) {
        if(v[0]!="09:25:00") {
            // console.log(i,v.toString())
            // return;
            priceArr.push(v[1]);
            vol.push(v[2]); //目前数据没有均价，取值提前一位
            times.push(v[0])
        }
    })
    return {
        priceArr: priceArr,
        vol: vol,
        times: times  //生成242条?
    }
}


//分时图 option

/**
 * 生成分时option 
 * @param {Object} m_data 分时数据
 * @param {Object} type 股票类型  us-美股  hs-沪深  hk-港股
 */

function initMOption(m_data, type) {
    var m_datas = get_m_data(m_data, type); //m_data = 239 条
    var baseNumber = Number(m_data.yestclose).toFixed(2) //昨日收盘价
    var _minVal = Number(baseNumber - baseNumber * handle_num()).toFixed(4);
    var _maxVal = (Number(baseNumber) + baseNumber * handle_num()).toFixed(4);
    console.log(handle_num(),_minVal,_maxVal,)
    var _interval = Math.abs(Number((baseNumber - _minVal) / 5));

    function handle_num() {
        var _heighPrice = Math.abs((Math.max.apply(null, m_datas.priceArr) - baseNumber) / baseNumber).toFixed(4);//最高价
        var _lowerPrice = Math.abs((baseNumber - Math.min.apply(null, m_datas.priceArr)) / baseNumber).toFixed(4);//最低价
        _rt = _heighPrice > _lowerPrice ? _heighPrice : _lowerPrice;
        console.log("row:68->" + _rt)
        return parseFloat(_rt) + 0.002
    }
    function format_y(v) {
        v = v.toFixed(2)
        if (v > m_data.yestclose) {
            return '{red|' + v + '}';
        } else if (v == baseNumber) {
            return v;
        } else {
            return '{green|' + v + '}';
        }
    }
    return {
        tooltip: { //弹框指示器
            trigger: 'axis',
            backgroundColor: "#f1f1f1",
            borderColor: "#ccc",
            borderWidth: 1,
            textStyle: {
                color: '#333'
            },
            axisPointer: {
                type: 'cross',
                label: {
                    show: true,
                    backgroundColor: '#333'
                }
            },
            formatter: function (params, ticket, callback) {
                var i = params[0].dataIndex;
                var color;
                if (m_datas.priceArr[i] > m_data.yestclose) {
                    color = 'style="color:' + upColor + '"';
                } else {
                    color = 'style="color:' + downColor + '"';
                }
                var html = '<div class="commColor" style="width:100px;">\
                <div>时间 <span  '+ color + ' >' + m_datas.times[i] + '</span></div>\
                <div>当前价 <span  '+ color + ' >' + m_datas.priceArr[i] + '</span></div>\
                <div>涨幅 <span  '+ color + ' >' + ratioCalculate(m_datas.priceArr[i], m_data.yestclose) + '%</span></div>\
				<div>成交量 <span  '+ color + ' >' + m_datas.vol[i] + '</span></div></div>';
                return html;
            }
        },
        legend: { //图例控件,点击图例控制哪些系列不显示
            icon: 'rect',
            type: 'scroll',
            itemWidth: 14,
            itemHeight: 2,
            selectedMode: false,
            left: 0,
            top: '1%',
            textStyle: {
                fontSize: 12,
                color: labelColor
            }
        },
        color: [ma5Color, ma10Color],
        grid: [{
            show: true,
            borderColor: borderColor,
            id: 'gd1',
            height: '63%', //主K线的高度,
            top: '9%'
        }, {
            show: true,
            borderColor: borderColor,
            id: 'gd2',
            height: '63%', //主K线的高度,
            top: '9%'
        }, {
            show: true,
            borderColor: borderColor,
            id: 'gd3',
            top: '76%',
            height: '19%' //交易量图的高度
        }],
        xAxis: [ //==== x轴
            { //主图 
                gridIndex: 0,
                boundaryGap: false,
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: borderColor,
                    }
                },
                data: m_datas.times,
                axisLabel: { //label文字设置
                    show: false
                },
                splitLine: { //分割线设置
                    show: true,
                    lineStyle: {
                        type: 'dashed'
                    }
                },
            },
            {
                show: false,
                gridIndex: 1,
                boundaryGap: false,
                data: m_datas.times,
                axisLabel: { //label文字设置
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: borderColor,
                    }
                },
            }, { //交易量图
                splitNumber: 2,
                type: 'category',
                gridIndex: 2,
                boundaryGap: false,
                data: m_datas.times,
                axisLabel: { //label文字设置
                    color: labelColor,
                    fontSize: 10
                },
                axisTick: {
                    show: false
                },
                splitLine: { //分割线设置
                    show: true,
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: borderColor,
                    }
                }
            }
        ],
        yAxis: [ //y轴
            {
                type: 'value',
                min: _minVal,
                max: _maxVal,
                interval: _interval,
                gridIndex: 0,
                scale: true,
                axisTick: { // 分割线 短
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: borderColor,
                    }
                },
                axisPointer: {
                    show: true,
                    label: {
                        formatter: function (params) {
                            return (params.value).toFixed(2);
                        }
                    }
                },
                axisLabel: {
                    color: '#333',
                    formatter: format_y,
                    rich: {
                        red: {
                            color: 'red',
                            lineHeight: 10
                        },
                        green: {
                            color: 'green',
                            lineHeight: 10
                        }
                    }
                },
                z: 4,
                splitLine: { //分割线设置
                    show: true,
                    lineStyle: {
                        type: 'dashed'
                    }
                },
            }, {
                scale: true,
                gridIndex: 1,
                min: _minVal,
                max: _maxVal,
                interval: _interval,
                position: 'right',
                z: 4,
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: borderColor,
                    }
                },
                axisLabel: { //label文字设置
                    color: function (val) {
                        val = Number(val).toFixed(2)
                        if (val == baseNumber) {
                            return '#333'
                        }
                        return val > baseNumber ? upColor : downColor;
                    },
                    inside: false, //label文字朝内对齐 
                    formatter: function (val) {
                        var resul = ratioCalculate(val, baseNumber);
                        return Number(resul).toFixed(2) + '%'
                    }
                },
                splitLine: { //分割线设置
                    show: false,
                    lineStyle: {
                        color: '#181a23'
                    }
                },
                axisPointer: {
                    show: true,
                    label: {
                        formatter: function (params) { //计算右边Y轴对应的当前价的涨幅比例
                            return ratioCalculate(params.value, baseNumber) + '%';
                        }
                    }
                }
            }, { //交易图
                // name: '万',
                nameGap: '0',
                nameTextStyle: {
                    color: labelColor
                },
                gridIndex: 2,
                z: 4,
                splitNumber: 3,
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: borderColor,
                    }
                },
                axisTick: {
                    show: false
                },
                axisPointer: {
                    show: false,
                    label: {
                        formatter: function (params) { //计算右边Y轴对应的当前价的涨幅比例
                            var _p = ((params.value) / 10000).toFixed(1) + '万';
                            return _p
                        }
                    }
                },
                splitLine: { //分割线设置
                    show: false,
                },
                axisLabel: { //label文字设置
                    color: labelColor,
                    inside: false, //label文字朝内对齐 
                    fontSize: 10,
                    onZero: false,
                    formatter: function (params) { //计算右边Y轴对应的当前价的涨幅比例            
                        var _p = (params / 10000).toFixed(1);
                        if (params == 0) {
                            _p = '(万)'
                        }
                        return _p
                    }
                },
            }
        ],
        backgroundColor: bgColor,
        blendMode: 'source-over',
        series: [{
            name: '',
            type: 'line',
            data: m_datas.priceArr,
            smooth: true,
            symbol: "circle", //中时有小圆点 
            lineStyle: {
                normal: {
                    opacity: 0.8,
                    color: '#39afe6',
                    width: 1
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(0, 136, 212, 0.7)'
                    }, {
                        offset: 0.8,
                        color: 'rgba(0, 136, 212, 0.02)'
                    }], false),
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            markLine: {
                name: '昨日收盘价',
                symbol: ['none', 'none'],
                label: {
                    show: false,
                    formatter: Number(m_data.yestclose).toFixed(2),
                    position: 'start',
                },
                lineStyle: {
                    color: '#4289c5',
                    type: 'solid'
                },
                data: [{
                    yAxis: m_data.yestclose,
                }]
            }
        },
        {
            type: 'line',
            data: m_datas.priceArr,
            smooth: true,
            symbol: "none",
            gridIndex: 1,
            xAxisIndex: 1,
            yAxisIndex: 1,
            lineStyle: { //标线的样式 
                normal: {
                    width: 0
                }
            }
        },
        {
            name: '',
            type: 'bar',
            gridIndex: 2,
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: m_datas.vol,
            barWidth: '40%',
            itemStyle: {
                normal: {
                    color: function (params) {
                        var colorList;
                        if (m_datas.priceArr[params.dataIndex] > m_datas.priceArr[params.dataIndex - 1]) {
                            colorList = upColor;
                        } else {
                            colorList = downColor;
                        }
                        return colorList;
                    },
                }
            }
        }
        ]
    };
}

/**
 * 计算价格涨跌幅百分比
 * @param {Object} price 当前价
 * @param {Object} yclose 昨收价
 */
function ratioCalculate(price, yclose) {
    return ((price - yclose) / yclose * 100).toFixed(2);
}

