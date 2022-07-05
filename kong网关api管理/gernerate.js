const e = require("cors");
var fs = require("fs");

// 设计思路
// 1. www.mapked.com/   转发到 www.mapked.com
// 2. vhost.mapked.com/ 转发到 win7.qy/vhost/
// 3. api.mapked.com/   转发到 www.mapked.com:3000
// 4. form.mapked.com   转发到 www.mapked.com/form

const collect = [
    {
        svr:"form", isWrite : true, path:"http://121.4.43.207:80/form",
        route:[
            { strip: "true", routeName:"route2", path:"/form_",hosts:"form.mapked.com" }
        ]
        //strip curl -v http://form.mapked.com:8000/form_formake.html = formake.html
    },  
    {
        svr:"api", isWrite : true, path:"http://121.4.43.207:3002",
        route:[
            { strip: "false", routeName:"route1", path:"/",hosts:"api.mapked.com" }
        ],
        // curl -v http://api.mapked.com:8000/ocr.js
    },   
    {   
        svr:"vhost", isWrite:true, path:"http://192.168.1.144/vhost/",
        route:[
            { strip: "false", routeName:"route3",path:"/",hosts:"vhost.mapked.com" },
        ]
        //strip curl -v http://vhost.mapked.com:8000/cus/aaa2.php 
    }
]

const ex = ()=>{
    var rt_add = "#!/bin/bash\nsource del.sh\n";
    var rt_del = "#!/bin/bash";
    for (let i = 0; i < collect.length; i++) {
        const el = collect[i];
        if(!el.isWrite)continue;
        rt_add+= service_str().replace('_svr_',el.svr).replace('_url_',el.path);
        
        for (let x = 0; x < el.route.length; x++) {
            const ele = el.route[x];
            rt_add+=route_str().replace('_svr_',el.svr).replace('_url_',el.path).replace('_routePath_',ele.path).replace('_routeName_',ele.routeName).replace('_RouteHosts_',ele.hosts).replace('_strip_',ele.strip);
            rt_del+= delRoutes_str().replace('_routeName_',ele.routeName);
        }
        rt_del+= delServices_str().replace('_svr_',el.svr);
    }
    fs.writeFileSync('./add.sh',rt_add);
    fs.writeFileSync('./del.sh',rt_del);
    console.log(rt_add);
    console.log(rt_del);
}

const service_str = ()=>{
    return `
    cmd='
    curl -s -X POST 
    --url http://127.0.0.1:8001/services/ 
    --data "name=_svr_" 
    --data "url=_url_" |python -m json.tool '
    echo \${cmd} 
    echo \${cmd} |awk '{run=$0;system(run)}'
    `
}

const route_str = ()=>{
    return `
    cmd='
    curl -s -X POST 
    --url http://127.0.0.1:8001/services/_svr_/routes 
    --data "paths=_routePath_" 
    --data "strip_path=_strip_" 
    --data "hosts=_RouteHosts_" 
    --data "name=_routeName_" |python -m json.tool '
    echo \${cmd} 
    echo \${cmd}|awk '{run=$0;system(run)}'
    `
}
const delRoutes_str = () =>{
    return `
    cmd='curl -s -X DELETE http://127.0.0.1:8001/routes/_routeName_'
    echo \${cmd} 
    echo \${cmd}|awk '{run=$0;system(run)}'
    `
}
const delServices_str = () =>{
    return `
    cmd='curl -s -X DELETE http://127.0.0.1:8001/services/_svr_'
    echo \${cmd} 
    echo \${cmd}|awk '{run=$0;system(run)}'
    `
}

const delConsumers_str = () =>{
    return `
    cmd='curl -s -X DELETE http://127.0.0.1:8001/consumers/_consumerName_'
    echo \${cmd} 
    echo \${cmd}|awk '{run=$0;system(run)}'
    `
}

const delPlugins_str = () =>{
    return `
    cmd='curl -s -X DELETE http://127.0.0.1:8001/plugins/_pluginName_'
    echo \${cmd} 
    echo \${cmd}|awk '{run=$0;system(run)}'
    `
}

// console.log(service_str())
ex();
