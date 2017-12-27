var TimeArea = { Min: 500, Max: 3000 };
var TimeFreeTitle = "*政府指导价500-3000元/小时";
var RiskFreeTitle = "风险代理收费的金额不得高于收费合同约定标的的30%。";
var FreeRule = "收费标准的5倍计算";
//计件收费

var JiJianArr = [{
    // cases: "刑事案件", desArr: [
    //     { name: "侦查阶段", price: "5000-10000元/件" },
    //     { name: "审查起诉阶段", price: "5000-10000元/件" },
    //     { name: "一审阶段", price: "5000-30000元/件" },
    //     { name: "二审阶段", price: "5000-30000元/件" }
    // ],
    // CivilAction: [
    //     { type: "民事、行政诉讼案件	立案", name: "立案", price: "3000-30000元/件" }
    // ],
    cases: "涉及财产关系", desArr: [
        { name: "民事诉讼", price: "3000-30000/件" },
    ],
    CivilAction: [
        // { type: "民事、行政诉讼案件	立案", name: "立案", price: "3000-30000元/件" }
    ],
    Important: 0 //非重大案件
}, {
    // cases: "刑事案件", desArr: [
    //     { name: "侦查阶段", price: "25000-50000元/件" },
    //     { name: "审查起诉阶段", price: "25000-50000元/件" },
    //     { name: "一审阶段", price: "25000-150000元/件" },
    //     { name: "二审阶段", price: "25000-150000元/件" }
    // ],
    // CivilAction: [
    //     { type: "民事、行政诉讼案件	立案", name: "立案", price: "15000-60000元/件" }
    // ],
    cases: "涉及财产关系", desArr: [
        { name: "民事诉讼", price: "15000-150000/件" },
    ],
    CivilAction: [
        // { type: "民事、行政诉讼案件	立案", name: "立案", price: "3000-30000元/件" }
    ],
    Important: 1 //重大案件
}];


/**
RatioFees ：比例收费
@val : 输入金额,
@important : 是否重大案件 bool true=是 false= 否 收费标准的5倍收费 , 这里设置最大5
**/
/*

 
标的额10万元以下的部分按8%收取，不足3000元的按3000元收取；
标的额超过10万元至不满100万元的部分按6%收取；
标的额超过100万元至不满1000万元的部分按4%收取； 
标的额1000万元以上的部分按2%收取

  */
function RatioFees (val, important) {

    //当前输入的值
    var curval = parseFloat(val);
    var IntMoney = 0;
    //不足3000元	按3000元收取

    if (curval <= 100000) {
        IntMoney = parseFloat(curval * 0.08);
        if (IntMoney < 3000) {
            IntMoney = 3000;
        }
    }
        //标的额超过10万元至不满100万元的部分按6%收取；
    else if (curval > 100000 && curval <= 1000000) {
        IntMoney = parseFloat(stage10()) + parseFloat(((curval - 100000) * 0.06));
    }
        //标的额超过100万元至不满1000万元的部分按4%收取； 
    else if (curval > 1000000 && curval <= 10000000) {
        IntMoney = parseFloat(stage10()) + parseFloat(stage100()) + parseFloat(((curval - 1000000) * 0.04));
    }
        // 标的额1000万元以上的部分按2%收取
    else if (curval > 10000000) {
        IntMoney = parseFloat(stage10()) + parseFloat(stage100()) + parseFloat(stage1000()) + parseFloat(((curval - 10000000) * 0.02));
    }

    if (!important) {
        return IntMoney;
    }
    else {
        //刑事案件因时间或地域跨度极大、属集团犯罪和其他案情重大的、复杂的，可以在不高于规定标准5倍之内协商确定收费标准。
        return IntMoney * 5;
    }

    // 标的额10万元以下的部分按8 % 收取，不足3000元的按3000元收取；
    // 标的额超过10万元至不满100万元的部分按6 % 收取；
    // 标的额超过100万元至不满1000万元的部分按4 % 收取；
    // 标的额1000万元以上的部分按2 % 收取


    //标的额10万元以下的部分按8%收取，不足3000元的按3000元收取
    function stage10() {
        return 100000 * 0.08;
    }

    // 标的额超过10万元至不满100万元的部分按6 % 收取；
    function stage100() {
        return 900000 * 0.06;
    }
    // 标的额超过100万元至不满1000万元的部分按4 % 收取；
    function stage1000() {
        return 9000000 * 0.04;
    }


}

module.exports.RatioFees = RatioFees
exports.TimeArea = TimeArea
exports.TimeFreeTitle = TimeFreeTitle
exports.RiskFreeTitle = RiskFreeTitle
exports.FreeRule = FreeRule
exports.JiJianArr = JiJianArr