
let r2 = () => {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve('我是张三')
        }, 1500)
    })
}

let r3 = (xx) => {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(' 我等到你:'+xx)
        },1000)
    })
}

const demo = async ()=>{
    result = await r2();
    result2 = await r3(result);
    console.log('我由于上面的程序还没执行完，先不执行“等待一会”' + result2);
    return result2
}
demo().then(result=>{
    console.log('输出',result);
})
