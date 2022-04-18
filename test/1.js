const puppeteer = require('puppeteer');
const lib = require('./_LibNode.js');
async function hanld(arrstr,site)
{
    x_ = arrstr.replace("null","").replace(/\n/,"").replace(/\t/g,"")
    arr = x_.split("|||")
    var reg=/ \d+(小时前) | \d+(分钟前) |\ d+(天前) | (昨天) | (刚刚) | \d{4}-\d{1,2}-\d{1,2} /;
    tti = ""
    if(reg.test(arr[2]))
    {
        if(arr[2].match(reg).length>0)
        {
            str=arr[2].match(reg)[0]
            tti = await lib.handTime(str.trim())
        } 
    }
    else
    {
        tti = await lib.handTime(arr[2])
    }
    var _bj = { site:site, name:arr[0].trim(),href:arr[1],dt:tti}
    return _bj
};

const urls = [
    {   site:"IT", 
        url:"https://www.appinn.com/category/online-tools/",
        dv:'div.post-data-container',
        selor : "x.children[0].children[0].textContent + \"|||\" + x.children[0].children[0].href + \"|||\"  x.children[0].children[1].children[1].children[1].textContent ",
        IsSele : true
    },
    {   
        site:"donews", 
        url:"https://www.donews.com/", 
        dv:'div.content',
        selor : "x.children[2].children[0].textContent + \"|||\" + x.children[2].children[0].href + \"|||\" + x.children[3].children[1].textContent ",
        IsSele : true
    }
];

(async (_urls) => {
    const browser = await puppeteer.launch({
        args: [
            // '--proxy-server=127.0.0.1:10809',
        ],
        headless: false,
    })
    const page = await browser.newPage()
    //测试条件_urls[0|1|2|3]
    var uu = _urls[1]
    var url = uu.url
    var dv = uu.dv
    var selor = uu.selor
    

    await page.goto(url)
    await page.evaluate(_ => {
      window.scrollBy(0, window.innerHeight);
    });
    const hrefs = await page.$$eval(dv, (a,_selor) => a.map(x=>  (eval(_selor) )),selor );
    for (let i = 0; i < hrefs.length; i++) {
        var _bj = await hanld(hrefs[i],uu.site);
        console.log(_bj)
        // console.log(hrefs[i])
    }                                                          
    await page.close();
    await browser.close();
})(urls)


