var TimeArea = { Min: 100, Max: 2500 };
var TimeFreeTitle = "*政府指导价500-3000元/小时";
var RiskFreeTitle = "风险代理收费的金在标的额10%-30%。";
var FreeRule = "收费标准的5倍计算";
//计件收费
var JiJianArr = [{
    // cases: "刑事案件", desArr: [
    //     { name: "侦查阶段", price: "500-2000元/件" },
    //     { name: "审查起诉阶段", price: "800-3000元/件" },
    //     { name: "审判阶段", price: "1000-4000元/件" },
    //     { name: "刑事自诉案件代理或刑事案件被害人代理", price: "1000-4000元/件" }
    // ],
    CivilAction: [
        // { type: "民事案件", name: "立案", price: "500-3000元/件" },
        // { type: "行政案件", name: "立案", price: "500-2000元/件" },
        // { type: "代理申诉案件", name: "立案", price: "500-2000元/件" }
        { type: "民事诉讼案件", name: "立案", price: "3000-30000元/件" }
    ],
    Important: 0 //非重大案件
}, {
    // cases: "刑事案件", desArr: [
    //    { name: "侦查阶段", price: "2500-10000元/件" },
    //    { name: "审查起诉阶段", price: "4000-15000元/件" },
    //    { name: "审判阶段", price: "5000-20000元/件" },
    //    { name: "刑事自诉案件代理或刑事案件被害人代理", price: "5000-20000元/件" }
    // ],
    CivilAction: [
        // { type: "民事案件", name: "立案", price: "2500-15000元/件" },
        // { type: "行政案件", name: "立案", price: "2500-10000元/件" },
        // { type: "代理申诉案件", name: "立案", price: "2500-10000元/件" }
        { type: "民事诉讼案件", name: "立案", price: "15000-150000元/件" }
    ],
    Important: 1 //重大案件
}];



/**
RatioFees ：比例收费
@val : 输入金额,
@important : 是否重大案件 bool true=是 false= 否 收费标准的5倍收费 , 这里设置最大5
    标的额10万元（含）以下的部分按8%收取，不足3000元的按3000元收取；
    标的额在10万元至100万元（含）之间的部分按6%收取；
标的额在100万元至1000万元（含）的部分按4%收取；
标的额1000万元以上的部分按2%收取。

**/
function RatioFees (val, important) {

    //当前输入的值
    var curval = parseFloat(val);
    var IntMoney = 0;
    if (curval <= 100000) {
        IntMoney = parseFloat(stage10());
        if (IntMoney < 3000)
            IntMoney = 3000;
    }
        // 标的额在10万元至100万元（含）之间的部分按6%收取；
    else if (curval > 100000 && curval <= 1000000) {
        IntMoney += parseFloat(stage10()) + parseFloat(((curval - 100000) * 0.06));
    }
        //标的额在100万元至1000万元（含）的部分按4%收取
    else if (curval > 1000000 && curval <= 10000000) {
        IntMoney += parseFloat(stage10()) + parseFloat(stage100()) + parseFloat(((curval - 1000000) * 0.04));
    }

        // 标的额1000万元以上的部分按2%收取
    else if (curval > 10000000) {
        IntMoney += parseFloat(stage10()) + parseFloat(stage100()) + parseFloat(stage1000()) + parseFloat(((curval - 10000000) * 0.02));
    }
    if (!important) {
        return IntMoney;
    }
    else {
        //刑事案件因时间或地域跨度极大、属集团犯罪和其他案情重大的、复杂的，但最高不得超过前述最高标准的5倍
        return IntMoney * 5;
    }

    //标的额10万元（含）以下的部分按8%收取，不足3000元的按3000元收取；
    function stage10() {
        return curval * 0.08;
    }
    // 标的额在10万元至100万元（含）之间的部分按6%收取
    function stage100() {
        return 900000 * 0.06;
    }
    //标的额在100万元至1000万元（含）的部分按4%收取
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