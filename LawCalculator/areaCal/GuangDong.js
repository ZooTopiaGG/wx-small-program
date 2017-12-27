var TimeArea = { Min: 200, Max: 5000 };
var TimeFreeTitle = "*政府指导价200-5000元/小时";
var RiskFreeTitle = "风险代理收费的金额不得高于收费合同约定标的的30%。";
var FreeRule = "不高于规定收费标准的5倍收费";
//计件收费
var JiJianArr = [{
    cases: "刑事案件", desArr: [
        { name: "侦查阶段", price: "3000-30000元/件" },
        { name: "审查起诉阶段", price: "6000-50000元/件" },
        { name: "审判阶段", price: "6000-60000元/件" }
    ],
    CivilAction: [{ type: "民事、行政诉讼案件", name: "立案", price: "3000-15000元/件" }],
    Important: 0 //非重大案件
}, {
    cases: "刑事案件", desArr: [
        { name: "侦查阶段", price: "15000-150000元/件" },
        { name: "审查起诉阶段", price: "30000-250000元/件" },
        { name: "审判阶段", price: "30000-300000元/件" }
    ],
    CivilAction: [{ type: "民事、行政诉讼案件", name: "立案", price: "15000-75000元/件" }],
    Important: 1 //重大案件
}];


/**
RatioFees ：比例收费
@val : 输入金额,
@important : 是否重大案件 bool true=是 false= 否 收费标准的5倍收费 , 这里设置最大5
每人收费标准为在收取基础费用3000-10000元的基础上，按其争议标的额分段累计收费
**/
function RatioFees (val, important) {

    //当前输入的值
    var curval = parseFloat(val);
    var IntMoney = 0;

    if (curval <= 50000) {
        IntMoney = "3000-10000元";
    }
        // 5万-10万（含10万元）	10%
    else if (curval > 50000 && curval <= 1000000) {
        IntMoney += parseFloat(stage5()) + parseFloat(((curval - 50000) * 0.1));
    }
        // 10万-50万（含50万元）	8%
    else if (curval > 100000 && curval <= 500000) {

        IntMoney += parseFloat(stage5()) + parseFloat(stage10()) + parseFloat(((curval - 100000) * 0.08));
    }
        // 50万-100万（含100万元）	6%
    else if (curval > 500000 && curval <= 1000000) {
        IntMoney += parseFloat(stage5()) + parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(((curval - 500000) * 0.06));
    }
        //  100万-500万（含500万元）	4%
    else if (curval > 1000000 && curval <= 5000000) {
        IntMoney += parseFloat(stage5()) + parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(((curval - 1000000) * 0.04));
    }
        // 500万-1000万（含1000万元）	2%
    else if (curval > 5000000 && curval <= 10000000) {

        IntMoney += parseFloat(stage5()) + parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(stage500()) + parseFloat(((curval - 5000000) * 0.02));
    }
        // 1000万-5000万（含5000万元）	1%
    else if (curval > 10000000 && curval <= 50000000) {
        IntMoney += parseFloat(stage5()) + parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(stage500()) + parseFloat(stage1000()) + parseFloat(((curval - 10000000) * 0.01));
    }
        // 5000万元以上	0.5%
    else if (curval > 50000000) {
        IntMoney += parseFloat(stage5()) + parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(stage500()) + parseFloat(stage1000()) + parseFloat(stage5000()) + parseFloat(((curval - 50000000) * 0.005));
    }
    if (!important) {
        if (curval > 50000) {
            var maxm = IntMoney + 7000;
            return IntMoney + "-" + maxm;
        } else {
            return IntMoney;
        }
    }
    else {
        //刑事案件因时间或地域跨度极大、属集团犯罪和其他案情重大的、复杂的，可以在不高于规定标准5倍之内协商确定收费标准。
        if (curval > 50000) {
            var maxm = (IntMoney + 7000) * 5;
            IntMoney = IntMoney * 5;
            return IntMoney + "-" + maxm;
        } else {
            return "15000-50000元";
        }
    }

    /*
    5万元（含5万元）以下
 	免加收
    5万-10万（含10万元）	10%
 
     10万-50万（含50万元）	8%
 
    50万-100万（含100万元）	6%
 
    100万-500万（含500万元）	4%
 
     500万-1000万（含1000万元）	2%
 
    1000万-5000万（含5000万元）	1%
 
    5000万元以上	0.5%
    
    */


    //  5万元（含5万元）以下  免加收
    function stage5() {
        return 3000;
    }
    // 5万-10万（含10万元）	10%
    function stage10() {
        return 50000 * 0.1;
    }
    //  10万-50万（含50万元）	8%
    function stage50() {
        return 400000 * 0.08;
    }
    //  50万-100万（含100万元）	6%
    function stage100() {
        return 500000 * 0.06;
    }
    //  100万-500万（含500万元）	4%
    function stage500() {
        return 4000000 * 0.04;
    }
    // 500万-1000万（含1000万元）	2%
    function stage1000() {
        return 5000000 * 0.02;
    }
    //1000万-5000万（含5000万元）	1%
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