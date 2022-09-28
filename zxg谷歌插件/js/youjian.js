//chrome.contextMenus.create({
//    title: '问财网|中财网|东方财富：%s', // %s表示选中的文字
//    contexts: ['selection'],
//    onclick: function(params)
//    {   
//        var s = name_to_code(params.selectionText);
//        // chrome.tabs.create({url: 'http://quote.cfi.cn/quote_' + s + '.html'});
//        chrome.tabs.create({url: 'http://quote.eastmoney.com/' + s + '.html'});
//        chrome.tabs.create({url: 'http://www.iwencai.com/stockpick/search?tid=stockpick&qs=sl_box_main_ths&w=' + encodeURI(params.selectionText)});
//    }
//});

chrome.contextMenus.create({
    title: '批量打开k图：%s', // %s表示选中的文字
    contexts: ['selection'],
    onclick: function(params)
    {   
		// ************** 批量打开给链接 ************************************
  		var arr = params.selectionText.split(" ");
  		var arr2= new Array();
  		var ii = 0;
  		for(i=0; i < arr.length; i++)
  		{
  			if(arr[i].trim().length == 0) continue;
  			var inputq1 = name_to_code(arr[i]);
  			if(inputq1 == "未收录") continue;
  			arr2[ii] = inputq1;
  			ii++;
  		}
  		for(i=0; i < arr2.length; i++)
  		{
        var href1 = `https://q.stock.sohu.com/cn/${arr2[i]}/index.shtml`;
  			//var href1 = "http://quote.cfi.cn/quote_"+ arr2[i] +".html";
  			chrome.tabs.create({url: href1});
  			// alert(arr2[i]);
  		}
    }
});

// chrome.contextMenus.create({
//     title: '中财网搜：%s', // %s表示选中的文字
//     contexts: ['selection'],
//     onclick: function(params)
//     {   
//         var s = name_to_code(params.selectionText);
//         // alert(s);
//         chrome.tabs.create({url: 'http://quote.cfi.cn/quote_' + s + '.html'});
//     }
// });

chrome.contextMenus.create({
    title: '有道翻译：%s', // %s表示选中的文字
    contexts: ['selection'],
    onclick: function(params)
    {   
      {
        var href1 = `http://www.youdao.com/w/eng/${params.selectionText}/#keyfrom=dict2.index`;
        chrome.tabs.create({url: href1});
      }
    }
});