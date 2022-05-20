var ttMyClass = (function (){      //定义一个类
    var a = 0;
    console.log('外' + a)
    return{                         //返回成员，可以是数值也可以是方法
        aa: function aa (){
                a++;
                console.log('aa内' + a)
            },
        bb: function bb (){
                a++;
                console.log('bb内' + a)
            }
    }
    // return { a1 : aa, b1 :bb }
})();
ttMyClass.aa(); //=1
ttMyClass.aa(); //=2
ttMyClass.bb(); //=3