let fs=require('fs');
function read(url) {
    //new Promise 需要传入一个executor 执行器
    //executor需要传入两个函数 resolve reject
    return new Promise((resolve,reject)=>{
        //异步读取文件
        fs.readFile(url,'utf8',function (err,data) {
            if(err){
                reject(err)
            }else{
                resolve(data);
            }
        })
    })
};
// read('../zhhw-nodejs/download/point.txt').then(data=>{ console.log(data) });



//async await 解决异步问题，基于promise
//async await这两个关键字一起使用
//await 后面只能跟promise对象
async function getData(){
    try{
        //Promise.all()并发读取
        let result =await Promise.all([read('name.txt'),read('age.txt')]);
        console.log(result);
    }catch (e){
        console.log(e);
    }
}
