// var sleep = require( 'sleep' );
// 数组删除
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
const Ming = {
    六十甲子: ["甲子", "乙丑", "丙寅", "丁卯", "戊辰", "己巳", "庚午", "辛未", "壬申", "癸酉", "甲戌", "乙亥", "丙子", "丁丑", "戊寅", "己卯", "庚辰", "辛巳", "壬午", "癸未", "甲申", "乙酉", "丙戌", "丁亥", "戊子", "己丑", "庚寅", "辛卯", "壬辰", "癸巳", "甲午", "乙未", "丙申", "丁酉", "戊戌", "己亥", "庚子", "辛丑", "壬寅", "癸卯", "甲辰", "乙巳", "丙午", "丁未", "戊申", "己酉", "庚戌", "辛亥", "壬子", "癸丑", "甲寅", "乙卯", "丙辰", "丁巳", "戊午", "己未", "庚申", "辛酉", "壬戌", "癸亥"],
    四天干: "", 四地支: "", 六十甲子_逆: [], 甲子180个: [], 甲子180个_逆: [], 四柱: [], 流年: [], 大运: [], 岁: 0, 顺排: false, birthYear : 0, 
    init(bornYear, bazi, sex, age) {
        this.甲子180个 = this.六十甲子.concat(this.六十甲子).concat(this.六十甲子);
        this.甲子180个_逆 = [...this.甲子180个]; this.甲子180个_逆.reverse();
        this.六十甲子_逆 = [...this.六十甲子]; this.六十甲子_逆.reverse();
        this.birthYear = bornYear; 
        this.getSiZhu(bazi); this.getLiuNian(bornYear); this.getDaYun(sex, age, bornYear);
        this.callbacks.forEach(x => x(this));
    },
    getSiZhu(bazi) {     //分割参数,得到四柱数组 getSiZhu("戊午,壬戌,庚寅,戊寅")

        this.四柱 = bazi.split(',');
        SizhuStr = this.四柱.join("");
        Sizhu2Str = SizhuStr.split('');
        this.四天干 = Sizhu2Str[0] + Sizhu2Str[2] + Sizhu2Str[4] + Sizhu2Str[6];
        this.四地支 = Sizhu2Str[1] + Sizhu2Str[3] + Sizhu2Str[5] + Sizhu2Str[7];
    },
    getLiuNian(bornYear) {       //循环得到流年数组 getLiuNian(1978)
        var nian = (this.六十甲子).indexOf(this.四柱[0]);
        var _bornYear = bornYear;
        for (let index = nian; index < nian + 100; index++) {
            var ob = {}; ob[this.甲子180个[index]] = _bornYear;
            this.流年.push(ob);
// console.log(ob);
            _bornYear++;
        }
    },
    getDaYun(sex, age, bornYear) {
        this.getShunNie(sex);   //获取顺排逆排
        let jia180 = this.甲子180个;
        let yueZhu_pos = (this.六十甲子).indexOf(this.四柱[1]);
        if (!this.顺排) {
            jia180 = this.甲子180个_逆;  //选择顺逆的甲子数组
            yueZhu_pos = (this.六十甲子_逆).indexOf(this.四柱[1]);
        }

        var ten = 10, forIdx = 0; //设置循环大运的参数
        for (let index = yueZhu_pos + 1; index < yueZhu_pos + 8; index++) {
            var age2 = age + (ten * forIdx);
            var ob = {};
            ob[jia180[index]] = age2 + "-" + (age2 + ten - 1) + "," + (age2 + bornYear);
            this.大运.push(ob);
            forIdx++;
// console.log(ob);      
        }
    },
    getShunNie(sex) {
        var nian = (this.六十甲子).indexOf(this.四柱[0]);
        if (nian % 2 === 0 && sex == "男") this.顺排 = true;
        if (nian % 2 !== 0 && sex == "女") this.顺排 = true;
    },
    Is天克地_冲(arr四干支,arr大运干支,arr流年干支){ //可以删除  是否是三合局
        //甲庚,乙辛,丙壬,丁癸
        //子午,丑未
        let result = "";
        let dichong = ["子午","丑未","寅申","卯酉","辰戌","巳亥","午子","未丑","申寅","酉卯","戌辰","亥巳"];
        let tianke =  ["甲戊","乙己","丙庚","丁辛","戊壬","己癸","庚甲","辛乙","壬丙","癸丁","戊甲","己乙","庚丙","辛丁","壬戊","癸己","甲庚","乙辛","丙壬","丁癸"];
        let arrGan = [],arrZhi = [];
        arrGan.push(arr大运干支[0]+arr流年干支[0]); //干+干  //甲子,乙丑
        arrZhi.push(arr大运干支[1]+arr流年干支[1]); //支+支
        arr四干支.forEach(x => {
            str干 = x.split('')[0];
            str支 = x.split('')[1];
            arrGan.push(arr大运干支[0] + str干); //干+干
            arrZhi.push(arr大运干支[1] + str支); //支+支
            arrGan.push(arr流年干支[0] + str干); //干+干
            arrZhi.push(arr流年干支[1] + str支); //支+支
        } );
        for (let i = 0; i < arrGan.length; i++) {
            rt =`${arrGan[i]} - ${arrZhi[i]}`;
            // console.log(rt);//4
            if(tianke.includes(arrGan[i]) && dichong.includes(arrZhi[i])){
                let ganzhi1 = arrGan[i].split('')[0] + arrZhi[i].split('')[0];
                let ganzhi2 = arrGan[i].split('')[1] + arrZhi[i].split('')[1];
                result = `天克地冲:${ganzhi1} - ${ganzhi2}`
                // console.log(`\t天克地冲:${ganzhi1} - ${ganzhi2}`);
            };
        }
        return result;
    },
    Is合局(str四地支,str大运支,str流年支,JU){ //是否是三合或者三会局
        let rt = "";
        let SanJu = JU.JuArr;// 三合或者三会局 ["寅午戌", "申子辰", "亥卯未", "巳酉丑"];
        let SanJu_son = "";
        for (let i = 0; i < SanJu.length; i++) { //大运查三合局,看是哪个和局
            if(SanJu[i].includes(str大运支)){SanJu_son = SanJu[i];break;}
        };
        SanJu_son = SanJu_son.replaceAll(str大运支,''); //剩下两个
        if(SanJu_son.includes(str流年支)){
            SanJu_son = SanJu_son.replaceAll(str流年支,'');
            if(str四地支.includes(SanJu_son)) {
                rt = `${JU.JuName}:${str大运支}${str流年支}${SanJu_son}`
                // console.log(`\t流年${JU.JuName}:大运${str大运支}`);
                // return true;//如果也存在,则三个交集成和局成立
            }
        }//else{ return false;}
        return rt;
    },
    Get日干查日支(Mingx,obj){
        let rt="";
        let 羊刃 = obj.Arr;
        let rizhu = Mingx.四柱[2]; //日柱
        let 四支 = Mingx.四地支;
        for (let i = 0; i < 羊刃.length; i++) {
            let yangrenson = 羊刃[i];
            if(yangrenson.includes(rizhu.split('')[0])){ //查日干
                if(四支.includes(羊刃[i].split('')[1])){  //查四柱地支
                rt = `${obj.Name}:${rizhu.split('')[0]}${羊刃[i].split('')[1]}\n\t${obj.content}`;
// console.log(`日柱${obj.Name}:${rizhu.split('')[0]} - ${羊刃[i].split('')[1]}`)
                };
                break;
            };
        };
        return rt;
    },
    Get神煞(Mingx){
        let rt = "";
        // let 魁罡 = ["庚戌", "庚辰", "壬辰", "戊戌"];
        // if (魁罡.includes(Mingx.四柱[2])) { rt += `魁罡:${Mingx.四柱[2]}`;};

        /*  1.魁罡  */     
        let JU = { Name:"魁罡", Arr : ["庚戌", "庚辰", "壬辰", "戊戌"], content :"" };
        if (JU.Arr.includes(Mingx.四柱[2])) { rt += `魁罡:${Mingx.四柱[2]}\n`;};

        /*  2.羊刃  */     
        JU = { Name:"羊刃", Arr : ["甲卯","乙寅","丙午","丁未","庚酉","辛申","壬子","癸亥"] };
        rt += Mingx.Get日干查日支(Mingx,JU);

        /*  3.文昌贵人  */   
        JU = { Name:"文昌贵人", Arr : ["甲巳","乙午","丙申","丁酉","戊申","己酉","庚亥","辛子","壬寅","癸卯"] , content :"文昌贵人主人聪明，文笔好，记性好，学东西能举一反三，并主秀气，外表斯文，给人一种温文尔雅而谦虚的感觉。八字命带文昌贵人的人学习好，有灵性，是读书的材料，气质雅秀，具上进心，一生近官近贵"  };
        rt += Mingx.Get日干查日支(Mingx,JU);  
        
        //禄:日干的印或比劫
        //三奇贵人


        return rt;
    },
    callbacks: [
        (Mingx) => {
            let rt = Mingx.Get神煞(Mingx);
            console.log(rt);
        },
//         (Mingx) => { //魁罡
//             let 魁罡 = ["庚戌", "庚辰", "壬辰", "戊戌"];
//             if (魁罡.includes(Mingx.四柱[2])) {
// console.log("日柱魁罡:" + Mingx.四柱[2]) ;
//             };
//         },
        // (Mingx) => { 
        //     let JU = { Name:"羊刃", Arr : ["甲卯","乙寅","丙午","丁未","庚酉","辛申","壬子","癸亥"] };
        //     Mingx.Get日干查日支(Mingx,JU);
        // },     
        (Mingx) => { //循环四柱 大运 流年 交集各种情况
            Mingx.大运.forEach(y => {
                let 大运干支 = (Object.keys(y)).toString();
                let 大运干 = 大运干支.split('')[0];
                let 大运支 = 大运干支.split('')[1];
                let 大运起始流年 = (Object.values(y)).toString().split(',')[1];
                console.log(`${大运干支}运`);
                for (let i = 0; i < Mingx.流年.length; i++) {
                    let 流年干支 = (Object.keys(Mingx.流年[i])).toString();
                    let 流年干 = 流年干支.split('')[0];
                    let 流年支 = 流年干支.split('')[1];
                    let 流年年份 = (Object.values(Mingx.流年[i])).toString();
                    if ((parseInt(大运起始流年) + 10) > parseInt(流年年份) && parseInt(流年年份) >= parseInt(大运起始流年)) {//在大运中循环十年


// console.log(`${流年年份}年(${流年年份-Mingx.birthYear}岁): ${大运干支}运 - ${流年干支}`);
                        let Ju1 = { JuName:"三合局", JuArr : ["寅午戌", "申子辰", "亥卯未", "巳酉丑"] };
                        let Ju2 = { JuName:"三会局", JuArr : ["寅卯辰", "巳午未", "申酉戌", "亥子丑"] };
                        let _三合局 = Mingx.Is合局(Mingx.四地支,大运支,流年支,Ju1);   //测试ok
                        let _三会局 = Mingx.Is合局(Mingx.四地支,大运支,流年支,Ju2);   //测试ok
                        let _天克地冲 = Mingx.Is天克地_冲(Mingx.四柱,大运干支,流年干支); //测试ok

// console.log(`\t${流年年份}年(${流年年份-Mingx.birthYear}岁): ${流年干支} ${_天克地冲}${_三合局}${_三会局} ` );
                    };   
                };
            })
        }
    ]
};

/* 1. jarry */ 
// Ming.init(1978, "戊午,壬戌,庚戌,戊戌", "男", 8);
Ming.init(1978, "戊午,壬戌,庚戌,戌亥", "男", 8);

/* 2. 七銀 */ 
// Ming.init(1993,"丙子,丙申,甲辰,戊辰","女",9); 

