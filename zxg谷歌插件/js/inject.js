// 通过postMessage调用content-script
function invokeContentScript(code) {
    window.postMessage({
        cmd: 'invoke',
        code: code
    }, '*');
}
// 发送普通消息到content-script
function sendMessageToContentScriptByPostMessage(data) {
    window.postMessage({
        cmd: 'message',
        data: data
    }, '*');
}

// 通过DOM事件发送消息给content-script
(function () {
    var customEvent = document.createEvent('Event');
    customEvent.initEvent('myCustomEvent', true, true);
    // 通过事件发送消息给content-script
    function sendMessageToContentScriptByEvent(data) {
        data = data || '你好，我是injected-script!';
        var hiddenDiv = document.getElementById('myCustomEventDiv');
        hiddenDiv.innerText = data
        hiddenDiv.dispatchEvent(customEvent);
    }
    window.sendMessageToContentScriptByEvent = sendMessageToContentScriptByEvent;

    var myDate = new Date();
    var mytime = myDate.toLocaleTimeString(); //获取当前时间	
    console.log('我是 : E:\\____dropbox__Sync\\Dropbox\\阅读\\zxq\\js\\inject.js ' + mytime);
    if (location.host == 'q.stock.sohu.com') {
        clickDayK(location);
        AddMySeleStock(location);
    }
    if (location.host == 'gu.qq.com') {
        eableQQclick(); //QQ自选股查看k线的按钮点击
    }
    if (location.host == 'news.10jqka.com.cn' || location.host == 'm.10jqka.com.cn' || location.host == 't.10jqka.com.cn') {
        codeto_aaa_m();
        removeSpan();
        
        //StopTip();
    }
    if (location.host == 'quote.eastmoney.com') {
        scrollDown();
    }
    if (location.host == 'oa.gzqiaoyin.com') {
        OA_Pro();
        OA_selectSets(location);
    }
    if (location.host == 'finance.sina.com.cn') {
        clickDayK(location);
        sinaAddBtn();
        cleartTable();
    }
    if (location.host == 'gd.122.gov.cn') {
        var x = document.cookie;
        console.log(x);
    }
    if (location.host == 'www.ywsft.com' || location.host == 'www.ywnmt.com' || location.host == 'www.mtsyt.com' || location.host == 'www.swmzt.com'|| location.host == 'www.sfwht.com' || location.host == 'www.yhmnt.com' || location.host == 'www.gqnmt.com' ) {
        quchuMohu() ;
    }
    if (location.host == 'www.photos18.com') {
       img缩小();
    }
    if (location.host == 'camcam.cc') {
        quAD();
    }
    if (location.host == 'www.google.com') {
        GooglePureText();
    }
    if (location.host == 'twitter.com') {
        twitterFunc();
    }
    if (location.host == 'aflow.dingtalk.com') {
        ding9();
    }
    if (location.host == 'xueqiu.com') {    //雪球网站
        if(location == 'https://xueqiu.com/S/BK0684') {
            showAllSotock();
        }
    }
})();

function showAllSotock(){
    //2023-8-3
    console.log("---------------中船系板块展开所有列表-----------------")
    console.log("执行方法：showAllSotock")
    setTimeout(function () {
        (function ($) {
            $("div.widget-option i:first-child").trigger("click");
            $("div.widget-option").html("");
        })(jQuery);
    }, 1500);
}


//所有审批节点数组
const ding01 = () => {
    var timesRun = 0;
    return new Promise((resolve, reject)=>{
        
        var inter = setInterval(function () {
            var nodes = $("body").contents().find("div.node-wrap")
            if(nodes.length > 1  ){
                resolve(nodes)
                timesRun++;
            }
            if (timesRun > 0) {
                clearInterval(inter);
            }
        }, 300);
    })


    // return new Promise((resolve, reject)=>{
    //     setTimeout(()=> {
    //         var nodes = $("body").contents().find("div.node-wrap")
    //         resolve(nodes)
    //     }, ss)
    // })
}
//要添加的节点
// const ding2 = (_node) => {
//     var rt = "";
//     var title = $(_node).contents().find("span.editable-title")
//     for(const el of title){
//         var spr = $(el).text()
//         if(spr == "审批人a"){
//             rt =  "ok"
//             break;
//         }
//     }
//     return rt;
// }

//要的+号节点
const ding3 = (_node) => {

    // return new Promise((resolve, reject)=>{
    //     var timesRun = 0;
    //     var inter = setInterval(function () {
    //         var title = $(_node).contents().find("span.editable-title")
    //         for(const el of title){
    //             var spr = $(el).text()
    //             if(spr == "审批人a"){
    //                 var prev_node = $(_node).prev();
    //                 resolve(prev_node)
    //                 timesRun++;
    //                 break;
    //             }
    //         }
    //         if (timesRun > 0) {
    //             clearInterval(inter);
    //         }
    //     }, 3000);
    // })

    var rt = null;
    var title = $(_node).contents().find("span.editable-title")
    for(const el of title){
        var spr = $(el).text()
        if(spr == "审批人a"){
            var prev_node = $(_node).prev();
            return prev_node
            break;
        }
    }
    return rt;
}

//+号按钮
const ding4 = (_node) => {
    let timesRun = 0;
    return new Promise((resolve, reject)=>{
        var inter = setInterval(function () {
            var btn = $(_node).contents().find("button.btn")
            if(btn.length > 0){
               resolve(btn[0]);
               timesRun++;
            }
            if (timesRun > 0) {
                clearInterval(inter);
            }
        }, 600);
    })


    // return new Promise((resolve, reject)=>{
    //     setTimeout(()=> {
    //         var btn = $(_node).contents().find("button.btn")
    //         resolve(btn[0]);
    //     }, 1000)
    // })
  
}

//点击加号
const ding5 = (_node) => {
    return new Promise((resolve, reject)=>{
        setTimeout(()=> {
            $(_node).trigger('click');
            resolve("ok");
        }, 600)
    })
}

//检查完成否是
const ding5_1 = (_node) => {
    return new Promise((resolve, reject)=>{
        setTimeout(()=> {
            resolve("ok");
        }, 9000)
        // let timesRun = 0;
        // var inter = setInterval(function () {
        //     var title = $(_node).contents().find("span.editable-title"); // div.node-wrap $("div.node-wrap").contents().find("span.editable-title")
            
        //     for(item of title){
        //         console.log('item▶ '+$(item).text());
        //         if($(item).text()=="推送A"){
        //            timesRun++;
        //            resolve("ok"); 
        //         }
        //     }
        //     if (timesRun > 0) {
        //         clearInterval(inter);
        //     }
        //     console.log('▶等待ahk完成。。。');
        //     ding5_1();
        // }, 500);
    });
}

//审批人菜单按钮
const ding6 = (_node) => {
    return new Promise((resolve, reject)=>{
        setTimeout(()=> {
            var addp = $("div[class='ant-popover add-node-wrapper ant-popover-placement-rightBottom ']");
            console.log($(addp))
            var addspr = $(addp).contents().find("span");
            for(const gg of addspr){
                resolve(gg);
                if($(gg).text() ==  "审批人"){
                    $(gg).trigger("click")
                    resolve(gg);
                    break;
                }
            }
        }, 600) // 延时等待菜单隐藏打开
    })
}

//选角色
const ding7 = () => {
    return new Promise((resolve, reject)=>{
        setTimeout(()=> {
            var juese = $("div.side-modal-body").contents().find("span:contains(角色)")[0];
            $(juese).trigger("click");
            resolve("ok");
            // var add = $("div.side-modal-body").contents().find("span:contains(添加)").trigger("click");
           
            // $(add).parent().trigger("click");
        }, 1000) // 延时等待菜单隐藏打开
    })
}

//选角色
function ding7_a () {
    return new Promise((resolve, reject)=>{
        setTimeout(()=> {
            // var juese = $("div.side-modal-body").contents().find("span:contains(角色)")[0];
            // $(juese).trigger("click");
            console.log('ding7_a▶ ')
            $("div.side-modal-body").contents().find("span:contains(添加)").eq(0).parent().parent().append(`<div class="dtd-select-selection-overflow-item" style="opacity: 1;">
    <span><span class="dtd-tag approver-selectField-tagItem"><span class="approver-selectField-tagLabel approver-cursor-pointer">
       <svg width="1em" height="1em" viewbox="0 0 23 21" fill="currentColor" aria-hidden="true">
        <path d="M9.5 12.5c5.462 0 9 2.15 9 5.5 0 1.878-1.187 2.95-2.771 2.998l-.111.002H3.382C1.731 21 .5 19.908.5 18c0-3.357 3.533-5.5 9-5.5zm8.434-9.391c1.126 2.66.855 5.421-.365 7.445l-.095.152.157.085c3.238 1.783 4.947 4.998 4.421 8.684l-.028.185a1 1 0 01-1.974-.32c.533-3.29-1.189-6.05-4.506-7.315a1 1 0 01-.358-1.635c1.43-1.455 1.963-4.005.906-6.501a1 1 0 111.842-.78zM9.5 14.5c-4.505 0-7 1.513-7 3.5 0 .714.262.977.806.999l.076.001h12.236c.593 0 .882-.251.882-1 0-1.98-2.5-3.5-7-3.5zm0-14a5.5 5.5 0 110 11 5.5 5.5 0 010-11zm0 2a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" fill-rule="nonzero"></path>
       </svg>主管理员 <span class="label-member-count">（5）</span></span><span class="dtd-tag-close-icon"><span role="img" class="dd-icon">
        <svg class="dt__icon" viewbox="0 0 1024 1024" width="1em" height="1em" fill="currentColor" aria-hidden="true">
         <defs></defs>
         <path d="M843.861 180.139a42.667 42.667 0 012.176 58.005l-2.176 2.347L572.331 512l271.53 271.53a42.667 42.667 0 01-58.005 62.507l-2.347-2.176L512 572.331 240.47 843.86a42.667 42.667 0 01-62.507-58.005l2.176-2.347L451.627 512 180.139 240.47a42.667 42.667 0 0158.005-62.507l2.347 2.176L512 451.627l271.53-271.488a42.667 42.667 0 0160.331 0z"></path>
        </svg></span></span></span></span>
   </div>`);
           resolve("ok");
            // $(add).parent().trigger("click");
        }, 1000) // 延时等待菜单隐藏打开
    })
}


//选角色2
const ding8 = () => {
    return new Promise((resolve, reject)=>{
        setTimeout(()=> {
            var win = $("div#DingDingSelector").contents().find("iframe");
            resolve(win);
            ;
        }, 4000) 
    })
}

//动态添加按钮
function ding9() {
   $(document).ready(function () {
        // setInterval(function () {
        console.log('add 悬浮按钮')
        $("body").append(`<div id="myzxg" style="width: 120px;height: 30px;z-index: 9999999999;background-color: aquamarine ;margin: 5px;border: solid 1px ;position: fixed;left: 200px;top: 120px">
                        <span style="cursor:pointer;">
                            <span onclick="ss2();">开始自动处理</span>  
                        </span>
                    </div>`) 
        // },2000)

    });
}

//保存橘色
const ding10 = () => {
    return new Promise((resolve, reject)=>{
        setTimeout(()=> {
            var quxiao = $("#SIDE_MODAL").contents().find("span:contains(保 存)").parent().click();
            resolve("ok");
            ;
        }, 600) 
    })
}


//修改新增节点
const ding11 = (_node) => {
    return new Promise((resolve, reject)=>{
        setTimeout(()=> {
            $("div.node-wrap").contents().find("span.placeholder").text('主管理员会签');
            resolve("ok");
            ;
        }, 600) 
    })
}

const ding11a = (_node) => {
    return new Promise((resolve, reject)=>{
        setTimeout(()=> {
            var Inter = setInterval(function () {
                var news = $(_node).prev();
                if(news.length>0){
                    console.log('▶2'+news)
                    clearInterval(Inter);
                    resolve(news)
                }
            },200);
            ;
        }, 1000) 
    })
}

//test
var star = 0
function ding__111111111  () {
        console.log(document.domain);    
     // setInterval(function () {
          $("head").append(`<script>
                                document.domain="dingtalk.com";
        var ifr = document.createElement('iframe');
        ifr.src = 'https://oa.dingtalk.com/selector.htm';
        ifr.style.display = 'none';
        document.body.appendChild(ifr);
        ifr.onload = function(){
            var doc = ifr.contentDocument || ifr.contentWindow.document;
            var oUl = doc.getElementById('dingapp');
            alert(oUl.innerHTML);
            ifr.onload = null;
        };

                            </script>`)   
                star = 1;  
        console.log(document.domain);  
        console.log('ding__331 ▶')


        var win3 = $("div#DingDingSelector").contents().find("iframe")[0];//.contents().find("div#dingapp");
       
    
        //console.log(win3.contentWindow.document);
        var win4 = $(win3).contents().find("div#dingapp");
        if(win3.length > 0){
            if(star == 0 ){
                console.log('https://oa.dingtalk.com/selector.htm ▶')
                 $("head").append(`<script>
                let script = document.createElement('script');
                script.src = 'https://oa.dingtalk.com/selector.htm';
                document.body.appendChild(script);
                </script`)   
                star = 1;              
            }
        //var vt = document.getElementsByTagName("iframe").contentWindow.document.getElementById("dingapp");
        //console.log('vt -'+ vt);
           //  
        }
     // },4000)
}


function ss2() {
    $(document).ready(async function () {
        console.log('自动批量处理开始▶')
        setTimeout(async ()=> {
            var node = await ding01();
            
            for(const el of node){
                rt = ding3(el);                     //符合要求的上一个节点
                
                if(rt!=null){
                    // ding4(rt).then(rt=>{ return ding5(rt) }).then(rt=>{ return ding6(rt) });
                    
                    var add = await ding4(rt);          //+号按钮
                    var win = await ding5(add);         //点击加号 后面的交给ahk
                    var over = await ding5_1(rt); 

                    // var addspr = await ding6(win);  //审批人菜单按钮

                    // console.log('▶390')
                    // var juse = await ding7();
                    // console.log('▶392')
                    // var addjuese = await ding7_a();
                    // console.log('▶394')
                    // var save = await ding10();


                    // newnode = await ding11a(node);                     //新增的节点
                    // var newnode = await ding11(newnode);    //修改新增的节点
                    // 
                    
                    // var sele = await ding8();
                    console.log('add ' + $(add)  )
                    console.log('win ' + $(win)  )
                }
            }
            console.log('end'+node);
            ;
        }, 500) 
    });
}



function twitterFunc() {
    setInterval(function () {
        let eleList = document.querySelectorAll('time')
        for (let i = 0; i < eleList.length; i++) {
            var pageKZ = eleList[i].innerText 
            eleList[i].style.color="#ff0000"
        }
    }, 2000);
}

function GooglePureText() {
    setTimeout(function () {
        let eleList = document.querySelectorAll('span')
            for (let i = 0; i < eleList.length; i++) {
                var pageKZ = eleList[i].innerText 
                if(pageKZ=='网页快照'){
                    console.log(pageKZ)
                }
            }
    }, 800);
}

function quAD() {
    setTimeout(function () {
        (function ($) {
            $("div#adde_modal-overlay").css("display","none");
            $("div#adde_modal-modal").css("display","none");
        })(jQuery);
    }, 800);
}

//2020-10-23 EditJarry 因为不能在插件中使用jquery的包，所以被迫使用httpRequest对象
function codeto_aaa_m() {
    //第一步：建立所需的对象
    var httpRequest = new XMLHttpRequest();
    //第二步：打开连接  将请求参数写在url中  ps:"./Ptest.php?name=test&nameone=testone"
    httpRequest.open('GET', 'http://news.10jqka.com.cn/siteapi/ucenter/selfstock/?track=wap_self&callback=getSelfStock1596770176000', true);
    http: //news.10jqka.com.cn/siteapi/ucenter/selfstock/?track=wap_self&callback=getSelfStock1596781232000
        //第三步：发送请求  将请求参数写在URL中
        httpRequest.send();
    /**
     * 获取数据后的处理程序
     */
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = httpRequest.responseText; //获取到json字符串，还需解析
            // json = "600333,300222";
            json = json.replace('getSelfStock1596770176000', '');
            var reg = /([063]\d{5})/g;
            var rs = json.match(reg);
            //保存自选股
            SaveZxgcodeArr(rs.toString());
            console.log(rs.toString());
        }
    };
}

//同花顺-自选股-涨跌幅(删除毛角分)
function removeSpan(){
    if (window.location.href.includes("https://t.10jqka.com.cn/newcircle/user/userPersonal/?from=finance&tab=zx")){
        //2023-8-1 11:13
        console.log("---------------同花顺-自选股-涨跌幅(删除毛角分)-----------------")
        console.log("执行方法：removeSpan")
        setTimeout(function () {
            (function ($) {
                console.log("点击展开")
                $('.stockinfo-desplay').click()
                // console.log(`$('.stockinfo-desplay').click()`)
            })(jQuery);
        }, 2000);
        setInterval(removeFirstSpan, 2000);
    }
}

function removeFirstSpan() {
    //2023-8-1 11:13
    console.log("执行方法：removeFirstSpan")
    $('.loadallcode').click();
    $('table.codename tbody tr').each(function() {
       var spanCount = $(this).find('td:eq(2) label span').length;
       if (spanCount > 1) {
          $(this).find('td:eq(2) label span:first').remove();
       }
    });
}



function img缩小() {
    setTimeout(function () {
        (function ($) {
            $("div.card").each(function () {
                $(this).css("width", 150);
            });
            $("div.my-2 img").each(function () {
                $(this).css("width", 200);
            });
            $("div.my-2").each(function () {
                $(this).css("display", "flex");
                $(this).css("float", "left");
            });
            $("div.main-header").children().css("display","none");
        })(jQuery);
     
    }, 800);
}

//去除模糊 
function quchuMohu() {
    setTimeout(function () {
        console.log("执行方法：去除模糊")
        let picg_ = document.getElementById("picg")
        picg_.id = 'id_new';
        var x = document.getElementsByClassName("bg-text"); //class隐藏
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.display = 'none';
        }
        let title_ = document.getElementsByTagName("title")[0].innerText;
        let img_ = document.getElementById("id_new").firstChild.firstChild.firstChild.src
        let msg = `地址::${window.location.href}`;
        console.log("当前title::"+title_);
        console.log("当前地址::"+msg);
        console.log("当前图片::"+img_);
        document.getElementById("divStayTopright2").innerHTML = "";
        
    }, 600);
}

//同花顺自选股禁止确认框
function StopTip() {
    (function ($) { // dialogtip-text
        setInterval(function () {
            console.log("执行方法：StopTip");
            $(function () {
                $("i.rmv").each(function () {
                    $(this).attr("onclick", "delFc();"); //绑定事件
                });
            });
        }, 2500);
    })(jQuery);
}
//同花顺自选股-关联绑定
function delFc() {
    if (confirm("将会循环删除全部，是否继续") == true) {
        (function ($) { // dialogtip-text
            setInterval(function () {
                $(function () {
                    $("div.dialogtip-btn-sure").each(function () {
                        $(this).trigger("click"); //遍历和触发所有事件	
                        console.log('自动删除自选股循环中......');
                    });
                });
            }, 1500);
        })(jQuery);
    } else {
        text = "You canceled!";
    }
}
//侨银oa的流程显示优化 多个嵌套的iframe查找元素
function OA_Pro() {
    var timesRun = 0;
    (function ($) {
        var inter = setInterval(function () {
            $(function () {

                $("#mainFrame").contents().find("#myFrame").contents().find("#tabcontentframe").contents().find("div#_xTable a").each(function () {
                    var txt = $(this).text();
                    MarkRed(txt, 'IT服务提单', 'color', $(this));
                    MarkRed(txt, '文件传阅', 'hide', $(this));
                    MarkRed(txt, '工商注册类', 'hide', $(this));
                    MarkRed(txt, '中标项目核算归属', 'hide', $(this));
                    MarkRed(txt, '共享查阅权限开通流程', 'hide', $(this));
                    // $(this).text(txt);
                    console.log(txt);
                    timesRun++;
                });

            });
            if (timesRun > 0) {
                clearInterval(inter);
            }
        }, 4000);
    })(jQuery);
}
//【2021.09.16】选择项目车载设备
function OA_selectSets(host) {
    //iframe https://oa.gzqiaoyin.com/workflow/request/AddRequestIframe.jsp?workflowid=905&isagent=0&beagenter=0&f_weaver_belongto_userid=&isfromtab=false&fromFlowDoc=&prjid=&docid=&crmid=&hrmid=43125&reqid=&topage=&f_weaver_belongto_userid=&f_weaver_belongto_usertype=null
    var key = 'workflow/request/AddRequest.jsp?workflowid=905&isagent=0&beagenter=0&f_weaver_belongto_userid=';
    // var key = 'CommonSingleBrowser.jsp?customid=25&browsertype=browser';
    if (host.toString().includes(key)) {
        // 1 提叫地址
        // 2 获取返回的table
        // 3 遍历table所有的值
        // 4 循环数组，动态添加到表单里
        var tr = [];
        (function ($) {
            //【2021.09.17】通过定时循环抓取iframe里item
            ck = 0;
            var done = 0;
            var timerId = window.setInterval(function () {
                var baseIframe;
                $("iframe").each(function () {
                    src = $(this).attr('src');

                    if (ck == 0 && typeof (src) != "undefined" && src.includes('AddRequestIframe.jsp?workflowid=905')) {
                        baseIframe = this;
                        if ($(this).contents().find("#field15858_0_browserbtn").length) {
                            $(this).contents().find("#field15858_0_browserbtn").click();
                            ck = 1;
                        }
                    } else if (ck == 1) {
                        // tr = [];
                        if (typeof (src) != "undefined" && src.includes('/interface/CommonBrowser.jsp?type=browser.JM_ITbzj|15858_0')) {
                            $(this).contents().find('iframe').each(function () {
                                if ($(this).contents().find('div.table').length) {
                                    //console.log($(this).attr('id'));
                                    $(this).contents().find('div.table').find("tr").each(function () {
                                        var Things = $(this).find("td");
                                        var td = {};
                                        for (var i = 0; i < Things.length; i++) {
                                            if (i == 2 && Things[2].innerText.length > 0) {
                                                td["name"] = Things[2].innerText
                                            };
                                            if (i == 3 && Things[3].innerText.length > 0) {
                                                td["typee"] = Things[3].innerText
                                            };
                                            if (i == 4 && Things[4].innerText.length > 0) {
                                                td["price"] = Things[4].innerText
                                            };
                                        }
                                        if (JSON.stringify(td) != '{}') {
                                            tr.push(td);
                                        }
                                    });
                                    console.log(JSON.stringify(tr));
                                    done = 1;
                                    // window.clearInterval(timerId);
                                    //循环赋值给input

                                }
                                if (done == 1 && tr.length > 0) $(this).contents().find("#btncancel").click();
                            });
                        };
                    };
                });
            }, 2000);
            var ck2 = 0;
            var timerId2 = window.setInterval(function () {
                if (done == 1 && tr.length > 0) {
                    $("iframe").each(function () {
                        src = $(this).attr('src');
                        if (typeof (src) != "undefined" && src.includes('AddRequestIframe.jsp?workflowid=905')) {
                            var bt1 = $(this).contents().find("#div0button > button").first();

                            if ($(bt1).length) {
                                for (var i = 0; i < tr.length - 1; i++) {
                                    tri = tr[i];
                                    if (ck2 == 0) $(bt1).click();
                                    console.log(tri);
                                }
                                console.log(ck2);
                                ck2 = 1;
                            }
                            idx = 0;
                            content = `<span class="e8_showNameClass"><a title="" href="/formmode/view/AddFormMode.jsp?type=0&amp;modeId=56&amp;formId=-365&amp;billid=2" target="_blank">车载摄像头</a>&nbsp;<span class="e8_delClass" id="2" onclick="del(event,this,1,false,{});" style="opacity: 1; visibility: hidden;">&nbsp;x&nbsp;</span></span>`
                            $(this).contents().find("table#oTable0").find('tr').each(function () {
                                if ($(this).attr("_target") == 'datarow') {
                                    var Things = $(this).find("td");
                                    for (var i = 0; i < Things.length; i++) {
                                        if (i == 3) {
                                            $(Things[i]).text(tr[idx].typee);
                                        }
                                        if (i == 4) {
                                            $(Things[i]).text(tr[idx].name);
                                        }
                                        if (i == 5) {
                                            $(Things[i]).text('0');
                                        }
                                        if (i == 6) {
                                            $(Things[i]).text('个');
                                        }
                                        if (i == 7) {
                                            $(Things[i]).text(tr[idx].price);
                                        }
                                    }
                                    idx++;
                                    if (idx == tr.length - 1) idex = 0;
                                };
                            });
                        }
                    });
                    //window.clearInterval(timerId2);
                }
            }, 4000);

        })(jQuery);
    }
}
//对字符窜标红或者隐藏
function MarkRed(str, key, how, obj) {
    var rt = str;
    if (str.indexOf(key) > -1) {
        if (how == 'color') {
            obj.parent().css("background-color", "#a0a2e0");
        }
        if (how == 'hide') {
            obj.parent().parent().css("display", "none");
        }
    }
}

// -- url 跳转到 东方财富网
function url_To_Eastomoney() {
    setInterval(function () {
        var $j = jQuery.noConflict();
        $j(".namebox a").each(function () {
            var txt = $j(this).attr("href");
            if (txt.indexOf('sohu.com') < 0) return false;
            txt = txt.replace("//q.stock.sohu.com/cn/", "").replace("/index.shtml", "");
            var nt = "http://quote.eastmoney.com/" + txt + ".html";
            $j(this).attr("href", nt);
            console.log(nt);
        });
    }, 1000);
}

function sohu_css() {
    var $j2 = jQuery.noConflict();
    var linkTag = $j2('<link href="http://127.0.0.1/phpmyadmin/custom/jscss/biz_ms.css" rel="stylesheet" type="text/css" media="screen" />');
    $j2($j2('head')[0]).append(linkTag);
}

function eableQQclick() {
    var i = 0;
    setInterval(function () {
        var $j2 = jQuery.noConflict();
        var s = $j2(".zxg-stocklist>dl");
        $j2(s).each(function () {
            // console.log(this);
            $j2(this).live("click", function () {
                $j2("[class='nav-item day']").click();
            });
        });
        i++;
    }, 1000);
}

function SaveZxgcodeArr(codeArr) {
    //http://win7.qy/vhost/custom/api_stock.php?fcname=save_zxg&code=600918,601066,600313,300386
    var httpRequest = new XMLHttpRequest();
    var postUrl = "http://win7.qy/vhost/custom/api_stock.php?fcname=save_zxg&code=" + codeArr;
    httpRequest.open('GET', postUrl, true);
    httpRequest.send();
    console.log("保存自选完成！");
}
//默认触发点击显示日k图，不是分时图,
function clickDayK(host) {
    var key = 'finance.sina.com.cn/realstock/company/';
    if (host.toString().includes(key)) {
        var $j3 = jQuery.noConflict();
        $j3(document).ready(function () {
            setTimeout(function () {
                $j3(window).scrollTop(600);
                $j3('div.kke_menus_tab_edage > div[data-id="KKE_tab_kd"] > a')[0].click();
            }, 3500);
        });
    }
}

function scrollDown() {
    var $j3 = jQuery.noConflict();
    $j3(document).ready(function () {
        setTimeout(function () {
            $j3(window).scrollTop(700);
        }, 3000);
    });
    window.jQuery = window.$ = jQuery;
}
//加自选按钮：加入自选 删除自选 相关新闻
function sinaAddBtn() {
    (function ($) {
        $(document).ready(function () {
            var _name = jQuery('.c8_name').text();
            var Code = jQuery('#stockName > span').text().replace("(", "").split('.')[0]
            console.log("执行Row331 sinaAddBtn")
            jQuery('#stockName').append(ReturnBtn(Code, _name));
        });
    })(jQuery)
}
function cleartTable() {
    (function ($) {
        $(document).ready(function () {
            setInterval(function () {
                // jQuery('div#h5Container > div.wrapflash > div.flash').children().eq(1).children().eq(2).children(0).children(0).eq(6).html('');
                    jQuery('div#h5Container > div.wrapflash > div.flash').children().eq(1).children().eq(2).children(0).children(0).eq(6).attr('style',"");
                    jQuery('div#h5Container > div.wrapflash > div.flash').children().eq(1).children().eq(2).children(0).children(0).eq(6).children(0).css("display","none");
          
                console.log("清除悬浮框380")
            }, 2000);
            // var hiddenDiv = document.getElementById('abhbk');
            // let tm = hiddenDiv.getAttribute("class")
            // console.log(tm)
        });
    })(jQuery)
}




function clickDayK2(host) {
    var key = 'q.stock.sohu.com/cn/';
    console.log("选日k");
    if (host.toString().includes(key)) {
        var $j4 = jQuery.noConflict();
        $j4(document).ready(function () {
            setTimeout(function () {
                $j4("iframe").each(function () {
                    src = $j4(this).attr('id');
                    if (src == "canvas") {
                        console.log(src);
                        $(this).contents().find('#hqNav_k').click();
                    }
                });
                //$j4("#hqNav_k").click();
                // $j4("#hqNav_k > a").click();
            }, 800);
        });
    }
}

function clickDayK(host) {
    var key = 'q.stock.sohu.com/cn/';
    if (host.toString().includes(key)) {
        console.log("执行：clickDayK(host)");
        (function ($) {
            setTimeout(function () {
                $("iframe").each(function () {
                    src = $(this).attr('id');
                    if (src == "canvas") {
                        console.log(src);
                        $(this).contents().find('#hqNav_k').click();
                    }
                });
                $("#hqNav_k").click();
                $("#hqNav_k > a").click();
            }, 900);
        })(jQuery)
    }
}
//sohu日k图添加自选按钮：加入自选 删除自选 相关新闻
function AddMySeleStock(host) {
    var key = 'q.stock.sohu.com/cn/';
    if (host.toString().includes(key)) {
        console.log("执行: AddMySeleStock()");
        (function ($) {
            $(document).ready(function () {
                var Code = "";
                var _name = "";
                $("li").each(function () {
                    src = $(this).attr('class');
                    if (src == "code") {
                        Code = $(this).text();
                        Code = Code.replace('(', '').replace(')', '');
                    }
                    if (src == "name") {
                        _name = $(this).text();
                    }
                    if (src == "addbtn") {
                        $(this).html('');
                        $(this).after(ReturnBtn(Code, _name));
                    }
                });
            });
        })(jQuery);

    }
}

function op3(cname) {
    //参考url https://www.cnblogs.com/chris-oil/p/4205517.html
    var $j4 = jQuery.noConflict();
    var mycars = new Array();
    mycars[0] = 'https://www.google.com/search?ei=pM7HXL-yHovfz7sPsaa-SA&q=' + cname + '+site:eastmoney.com&oq=' + cname + '+site:eastmoney.com&as_qdr=m';
    mycars[1] = 'http://www.iwencai.com/stockpick/search?tid=stockpick&qs=sl_box_main_ths&w=' + cname;
    $j4.each(mycars, function (i, url) {
        window.open(url, "_blank", "");
    });
};

function ReturnBtn(Code, _name) {
    var str = `<div id="myzxg" style="width: 120px;height: 30px;z-index: 999;background-color: aquamarine ;margin: 5px;border: solid 1px ;position: fixed;left: 200px;top: 120px" >
						<span style="">
                            <span onclick=visitApi('add','${Code}')>加自选</span>  
                            <span onclick=visitApi('del','${Code}')>删除</span> 
                            <span onclick="op3('${_name}')">新闻 </span>
    			 		</span>
					</div>`
    return str;
}

function visitApi(act, Code) {
    (function ($) {
        if (act == 'add') {
            $.get(`https://win7.qy/vhost/custom/api_stock.php?fcname=AddCode&bkname=bkzxg_%E8%87%AA%E9%80%89&code=${Code}`, function(result){  
                if(result.length == 0) {  console.log("get_bk_one:读取数据失败!"); return; }               
                if(result == "okok") { alert("成功!")}
            });  
        } else {
            $.get("https://win7.qy/vhost/custom/api_stock.php?fcname=delcode&code="+ Code +"&bkname=bkzxg_%E8%87%AA%E9%80%89", function(result){  
                if(result.length == 0) {  console.log("get_bk_one:读取数据失败!"); return; }               
                if(result == "ok") { alert("成功!")}
            });  
        }
    })(jQuery)
}