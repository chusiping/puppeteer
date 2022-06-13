
const FormMaking = {
    getValue(ID) {return "ab3"},
    hide(Arr) {console.log("隐藏：" + Arr.toString())},
    display(Arr) { console.log("显示：" + Arr.toString())},
    copy() {

        /*  以下下是拷贝的代码                      */
        var tabValue = this.getValue('rad');   //tab控件ID的选值 ： a1,a2,a3
        var idx = "3";                          //tab页个数
        var Num = tabValue.substring(tabValue.length - 1);        //取出a1阿拉伯数字
        var tab内容项 = "quyu"; //隐藏区域名称
        var tabArr1 = [];
        var tabArr2 = [];
        for (let i = 1; i <= idx; i++) {
            if (i == Num) {
                tabArr1.push(tab内容项 + i);
                continue;
            }
            tabArr2.push(tab内容项 + i);
        }
        this.display(tabArr1);
        this.hide(tabArr2);
        // console.log("显示：" + tabArr1.toString())
        // console.log("隐藏：" + tabArr2.toString())

        /****************************************/
    }
}

FormMaking.copy();


