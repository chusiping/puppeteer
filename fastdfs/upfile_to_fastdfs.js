// https://github.com/ymyang/fdfs

var FdfsClient = require('fdfs');

var fdfs = new FdfsClient({
    // tracker servers
    trackers: [
        {
            host: '192.168.1.146',
            port: 22122
        }
    ],
    // 默认超时时间10s
    timeout: 10000,
    // 默认后缀
    // 当获取不到文件后缀时使用
    defaultExt: 'txt',
    // charset默认utf8
    charset: 'utf8'
});

fdfs.upload('E:/法考资料副本/411外国法制史/外国法制史杂项/禁止性补贴与可诉性补贴的区别1.jpg').then(function(fileId) {
    tu1 = "http://192.168.1.148:8888/"+fileId
    tu2 = "http://192.168.1.149:8888/"+fileId
    console.log(tu1);
    console.log(tu2);
    console.log(fileId);
}).catch(function(err) {
    console.error(err);
});


