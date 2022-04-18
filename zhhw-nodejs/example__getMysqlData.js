//代码范例
var lib = require('./lib_myFunc');
var mysql = require('mysql');

var ConnRs = [
    {charset: 'utf-8',host:'mysql-slave1',  obj: mysql.createConnection({host:'119.23.57.45',  user:'yuefeng_read', password : 'yuefeng!@#100', database : 'yuefeng'})}
];
var sql = `select      a.id,     a.pid as 'pid',     a.registrationNO as '车牌号' ,     a.terminalNO as '终端号',     a.frameNumber as '车架号',     a.engineNumber as '发动机号',     a.isdel from sys_vehicle a  where 1=1      and a.pid in( SELECT id from v_sys_organ where isdel=0 and  orgCompany = 'dg1168')      and (LENGTH(a.registrationNO) > 1 ) limit 10 `;

lib.query("mysql-slave1",sql,ConnRs).then(rt => {
    if (rt) {
        rt.forEach(el => {
            console.log(el);
        });
    }
});