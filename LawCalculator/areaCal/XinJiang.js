var TimeArea = { Min: 200, Max: 2000 };
var TimeFreeTitle = " ";
var RiskFreeTitle = "风险代理收费的金额不得高于收费合同约定标的的30%。";
var FreeRule = "收费标准的2倍计算";
//计件收费
var JiJianArr = [{
    cases: "刑事案件", desArr: [
        { name: "侦察阶段", price: "500元-2000元/件" },
        { name: "侦查阶段", price: "1000元-4000元/件" },
        { name: "一审案件", price: "1500元-5000元/件" },
       
    ],
    CivilAction: [
        { type: "刑事案件", name: "不涉及财产", price: "收费标准为1000—4000元/件" },
           { type: "行政案件", name: "不涉及财产", price: "收费标准为500元一3000元/件" },
           { type: "代理民事", name: "不涉及财产", price: "收费标准为500元一4000元/件" },
    ],
    Important: 0 //非重大案件
}, {
    cases: "刑事案件", desArr: [
         { name: "侦察阶段", price: "1000元-4000元/件" },
        { name: "侦查阶段", price: "2000元-8000元/件" },
        { name: "一审案件", price: "3000元-10000元/件" },
    ],
    CivilAction: [
       { type: "刑事案件", name: "不涉及财产", price: "收费标准为2000—8000元/件" },
        { type: "行政案件", name: "不涉及财产", price: "收费标准为1000元一6000元/件" },
       { type: "代理民事", name: "不涉及财产", price: "收费标准为1000元一8000元/件" },
        
    ],
    Important: 1 //重大案件
}];


/**
RatioFees ：比例收费
@val : 输入金额,
@important : 是否重大案件 bool true=是 false= 否 收费标准的5倍收费 , 这里设置最大5

1万元以下的 收取手续费500—800元
1万元-10万元(含10万元)部分 5%
10万元-50万元(含50万元)部分 4%
50万元-100万元(含100万元)部分 3%
100万元-500万元(含500万元)部分 2%
500万元-1000万元(含1000万元)部分 1%
1000万元以上部分 0.5%
**/
function RatioFees (val, important) {

    //当前输入的值
    var curval = parseFloat(val);
    var IntMoney = 0;
    //1万元以下（含1万元）
    if (curval <= 10000) {
        IntMoney = stage1();
    }
        //1万元-10万元(含10万元)部分 5%
    else if (curval > 10000 && curval <= 100000) {
        IntMoney += parseFloat(stage1()) + parseFloat(((curval - 10000) * 0.05));
    }
        //10万元-50万元(含50万元)部分 4%
    else if (curval > 100000 && curval <= 500000) {

        IntMoney += parseFloat(stage1()) + parseFloat(stage10()) + parseFloat(((curval - 100000) * 0.04));
    }
        //50万元-100万元(含100万元)部分 3%
    else if (curval > 500000 && curval <= 1000000) {
        IntMoney += parseFloat(stage1()) + parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(((curval - 500000) * 0.03));
    }
        // 100万元-500万元(含500万元)部分 2%
    else if (curval > 1000000 && curval <= 5000000) {
        IntMoney += parseFloat(stage1()) + parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(((curval - 1000000) * 0.02));
    }
        //500万元-1000万元(含1000万元)部分 1%
    else if (curval > 5000000 && curval <= 10000000) {

        IntMoney += parseFloat(stage1()) + parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(stage500()) + parseFloat(((curval - 5000000) * 0.01));
    }
        //1000万元以上部分 0.5%
    else if (curval > 10000000 ) {
        IntMoney += parseFloat(stage1()) + parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(stage500()) + parseFloat(stage1000()) + parseFloat(((curval - 10000000) * 0.005));
    }
   
    if (!important) {
        return IntMoney;
    }
    else {
        //刑事案件因时间或地域跨度极大、属集团犯罪和其他案情重大的、复杂的，可以在不高于规定标准2倍之内协商确定收费标准。
        return IntMoney * 2;
    }


    /*
    
    1万元以下的 收取手续费500—800元
1万元-10万元(含10万元)部分 5%
10万元-50万元(含50万元)部分 4%
50万元-100万元(含100万元)部分 3%
100万元-500万元(含500万元)部分 2%
500万元-1000万元(含1000万元)部分 1%
1000万元以上部分 0.5%
    */

    // 1万元以下（含1万元）800
    function stage1() {
        return 800;
    }
    //1万元-10万元  5%
    function stage10() {
        return 90000 * 0.05;
    }
    //  10万元-50万元	4%
    function stage50() {
        return 400000 * 0.04;
    }
    //  50万元-100万元	3%
    function stage100() {
        return 500000 * 0.03;
    }
    //  100万元-500万元	2%
    function stage500() {
        return 4000000 * 0.02;
    }
    // 500万元-1000万元 0.1%
    function stage1000() {
        return 5000000 * 0.01;
    }
 
}

module.exports.RatioFees = RatioFees
exports.TimeArea = TimeArea
exports.TimeFreeTitle = TimeFreeTitle
exports.RiskFreeTitle = RiskFreeTitle
exports.FreeRule = FreeRule
exports.JiJianArr = JiJianArr