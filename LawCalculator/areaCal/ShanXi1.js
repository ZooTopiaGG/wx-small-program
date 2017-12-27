/// <reference path="../LegalFreeComponents.js" />
var TimeArea = { Min: 50, Max: 2000 };
var TimeFreeTitle = "*政府指导价50-2000元/小时";
var RiskFreeTitle = "风险代理收费的金额不得高于收费合同约定标的的30%。";
var FreeRule = "无";
//计件收费
var JiJianArr = [{
    cases: "刑事案件", desArr: [
        { name: "侦查阶段", price: " 500—5000元/件" },
        { name: "审查起诉阶段", price: "1000—5000元/件" },
        { name: "一审审判阶段", price: "1000—10000元/件" },
        { name: "办理死刑复核案件", price: "10000—30000元/件" }
    ],
    CivilAction: [{ type: "民事、行政诉讼", name: "立案", price: "500元- 5000元/件" }],
    Important: 0
}];
/**
RatioFees ：比例收费
@val : 输入金额,
@important : 是否重大案件 bool true=是 false= 否 收费标准的5倍收费 , 这里设置最大5
   1万元(含1万元)以下部分 1000元
1万元以上—50万元(含50万元)部分 5%
50万元以上—100万元(含100万元)部分 4%
100万元以上—500万元(含500万元)部分 3%
500万元以上—1000万元(含1000万元)部分 2%
1000万元以上—5000万元(含5000万元)部分 1%
5000万元以上部分 0.5%
**/
function RatioFees (val, important) {

    //当前输入的值
    var curval = parseFloat(val);
    var IntMoney = 0;
    if (curval <= 10000) {
        IntMoney = 1000;
    }
        // 1万元以上—50万元(含50万元)部分 5%
    else if (curval > 10000 && curval <= 500000) {
        IntMoney += parseFloat(stage1()) + parseFloat(((curval - 10000) * 0.05));
    }
        // 50万元-100万元(含100万元)	4.00%
    else if (curval > 500000 && curval <= 1000000) {
        IntMoney += parseFloat(stage1()) + parseFloat(stage50()) + parseFloat(((curval - 500000) * 0.04));
    }
        //  100万元-500万元(含500万元)	3.00%
    else if (curval > 1000000 && curval <= 5000000) {
        IntMoney += parseFloat(stage1()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(((curval - 1000000) * 0.03));
    }
        // 500万元-1000万元(含1000万元)	2.00%
    else if (curval > 5000000 && curval <= 10000000) {

        IntMoney += parseFloat(stage1()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(stage500()) + parseFloat(((curval - 5000000) * 0.02));
    }
        // 1000万元以上—5000万元(含5000万元)部分 1%
    else if (curval > 10000000 && curval <= 50000000) {
        IntMoney += parseFloat(stage1()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(stage500()) + parseFloat(stage1000()) + parseFloat(((curval - 10000000) * 0.01));
    }
        //  5000万元以上	1.00%
    else if (curval > 50000000) {
        IntMoney += parseFloat(stage1()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(stage500()) + parseFloat(stage1000()) + parseFloat(stage5000()) + parseFloat(((curval - 50000000) * 0.005));
    }
    if (!important) {
        return IntMoney;
    }
    else {
        //刑事案件因时间或地域跨度极大、属集团犯罪和其他案情重大的、复杂的，但最高不得超过前述最高标准的5倍
        return "无";
    }


    //1万元(含1万元)以下部分 1000元
    function stage1() {
        return 1000;
    }
    //1万元以上—50万元(含50万元)部分 5%
    function stage50() {
        return 490000 * 0.05;
    }

    //50万元-100万元(含100万元)	4%
    function stage100() {
        return 500000 * 0.04;
    }
    //  100万元-500万元(含500万元)	3%
    function stage500() {
        return 4000000 * 0.03;
    }
    //  500万元-1000万元(含1000万元)	2%
    function stage1000() {
        return 5000000 * 0.02;
    }
    // 1000万元-5000万元（含5000万元）	1%
    function stage5000() {
        return 40000000 * 0.01;
    }

}

module.exports.RatioFees = RatioFees
exports.TimeArea = TimeArea
exports.TimeFreeTitle = TimeFreeTitle
exports.RiskFreeTitle = RiskFreeTitle
exports.FreeRule = FreeRule
exports.JiJianArr = JiJianArr