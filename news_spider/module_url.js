const urls = [
    {
        site:"小众软件", 
        url: ["https://www.appinn.com/category/online-tools/"],
        dv:'#content_box div.post-data div header',  //所有的header集合
        selector : "x.children[0].textContent + \"|||\" + x.children[0].children[0].href + \"|||\" + x.children[1].children[1].children[1].textContent",
        IsShow : true
    },
    {
        site:"donews", 
        url: ["https://www.donews.com/","https://www.donews.com/automobile/index","https://www.donews.com/digital/index"],
        dv:'div.content',
        selector : "x.children[2].children[0].textContent + \"|||\" + x.children[2].children[0].href + \"|||\" + x.children[3].children[1].textContent ",
        IsShow : true
    },
    {
        site:"it", //51cto
        url: ["https://www.51cto.com/"],
        dv:'div.home-left-list li',
        selector : "x.children[1].children[0].textContent + \"|||\" + x.children[1].children[0].href + \"|||\" + x.children[1].children[2].children[0].textContent ",
        IsShow : true
    },
    {   
        site:"myzaker.com", 
        url: ["https://www.myzaker.com/channel/10045","https://www.myzaker.com/"],
        dv:'#contentList div.article-content',
        selector : "x.children[0].textContent + \"|||\" + x.children[0].href + \"|||\" + x.children[1].children[1].textContent",
        IsShow : true
    },
    {   
        site:"myzaker精读", 
        url: ["https://www.myzaker.com/?pos=selected_article"],
        dv:'#contentList div.article-content',
        selector : "x.children[0].textContent + \"|||\" + x.children[0].href + \"|||\" + x.children[1].children[1].textContent",
        IsShow : true
    },
    {   
        site:"stcn.com", 
        url: ["https://stock.stcn.com/index.html","https://stock.stcn.com/index_[1-3].html"],
        dv:"ul.news_list li",
        selector: "x.children[0].children[0].textContent + \"|||\" + x.children[0].children[0].href + \"|||\" + x.children[1].textContent",
        IsShow : true
    },
    {   
        site:"博客", 
        url: ["http://caifuhao.eastmoney.com/cfh/240651"],
        dv:'ul.media_list li.item',
        selector : "x.children[0].children[0].textContent + \"|||\" + x.children[0].children[0].href + \"|||\" + x.children[1].children[1].children[1].children[0].textContent",
        IsShow : true
    },
    {
        site:"博客", //招财猫
        url: ["http://caifuhao.eastmoney.com/cfh/100043","http://caifuhao.eastmoney.com/cfh/123715"],
        dv:'ul.media_list li.item',
        selector : "x.children[0].children[0].textContent + \"|||\" + x.children[0].children[0].href + \"|||\" + x.children[1].textContent",
        IsShow : true
    },
    {
        site:"hack", //
        url: ["https://www.webshell.cc/"],
        dv:'article.post:not(.whisper)',
        selector : "x.children[0].children[0].textContent + \"|||\" + x.children[0].children[0].href + \"|||\" + x.children[1].children[0].textContent",
        IsShow : true
    }
];

module.exports.urls = urls;