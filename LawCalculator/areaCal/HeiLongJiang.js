var TimeArea = { Min: 200, Max: 2000 };
var TimeFreeTitle = "*";
var RiskFreeTitle = "实行政府指导价的基层法律服务不得实行风险代理收费";
var FreeRule = "收费标准可由双方在政府指导价基础上协商确定。";
//计件收费
var JiJianArr = [{
    cases: "刑事案件", desArr: [
    //     { name: "提供法律咨询", price: "200-2000元/件" },
    //     { name: "侦查阶段", price: "1500元/件" },
    //     { name: "审查起诉阶段", price: "2000元/件" },
    //     { name: "一审阶段", price: "3000元/件" },
    //    { name: "刑事自诉和被害代理（不涉及财产关系）", price: "3000元/件" }
        { name: "不涉及财产关系", price: "200—1000元/件" }
    ],
    CivilAction: [
        // { type: "民事案件", name: "不涉及财产", price: "收费标准为3000元/件，可上浮30%" },
        // { type: "行政案件", name: "不涉及财产", price: "2500元/件，可上浮50%" },
        // { type: "国家赔偿案件", name: "立案", price: "4000元/件，可上浮30%" }
        { type: "民事案件", name: "不涉及财产", price: "200—1000元/件" },
    ],
    Important: 0 //非重大案件
}, {
    // cases: "刑事案件", desArr: [
    //     { name: "提供法律咨询", price: "1000-10000元/件" },
    //     { name: "侦查阶段", price: "7500元/件" },
    //     { name: "审查起诉阶段", price: "10000元/件" },
    //     { name: "一审阶段", price: "15000元/件" },
    //    { name: "刑事自诉和被害代理（不涉及财产关系）", price: "15000元/件" }
    // ],
    // CivilAction: [
    //     { type: "民事案件", name: "不涉及财产", price: "15000元/件，可上浮30%" },
    //     { type: "行政案件", name: "不涉及财产", price: "12500元/件，可上浮30%" },
    //     { type: "国家赔偿案件", name: "立案", price: "20000元/件，可上浮30%" }
    // ],
    cases: "刑事案件", desArr: [
    //     { name: "提供法律咨询", price: "200-2000元/件" },
    //     { name: "侦查阶段", price: "1500元/件" },
    //     { name: "审查起诉阶段", price: "2000元/件" },
    //     { name: "一审阶段", price: "3000元/件" },
    //    { name: "刑事自诉和被害代理（不涉及财产关系）", price: "3000元/件" }
        { name: "不涉及财产关系", price: "200—1000元/件" }
    ],
    CivilAction: [
        // { type: "民事案件", name: "不涉及财产", price: "收费标准为3000元/件，可上浮30%" },
        // { type: "行政案件", name: "不涉及财产", price: "2500元/件，可上浮50%" },
        // { type: "国家赔偿案件", name: "立案", price: "4000元/件，可上浮30%" }
        { type: "民事案件", name: "不涉及财产", price: "200—1000元/件" },
    ],
    Important: 1 //重大案件
}];


/**
RatioFees ：比例收费
@val : 输入金额,
@important : 是否重大案件 bool true=是 false= 否 收费标准的5倍收费 , 这里设置最大5
**/
/**
RatioFees ：比例收费
@val : 输入金额,
@important : 是否重大案件 bool true=是 false= 否 收费标准的5倍收费 , 这里设置最大5
**/
function RatioFees (val, important) {
    
    //当前输入的值
    var curval = parseFloat(val);
    var IntMoney = 0;
    if (curval <= 100000) {
        IntMoney += parseFloat(stage10());
    }
    //10万元至50万元
    else if (curval > 100000 && curval <= 500000) {
        IntMoney += parseFloat(stage10()) + parseFloat(((curval - 100000) * 0.02));
    }
    //50万元至100万元
    else if (curval > 500000 && curval <= 10000000) {
        IntMoney += parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(((curval - 500000) * 0.01));
    }
    else if (curval > 10000000 && curval <= 50000000) {
        IntMoney += parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(((curval - 10000000) * 0.05));
    }
    else if (curval > 50000000) {
        IntMoney += parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(stage1000()) + parseFloat(((curval - 50000000) * 0.02));
    }
    if (!important) {
        return IntMoney;
    }
    else {
        return IntMoney;
    }
    //10以下算法 0.03
    function stage10() {
        if(curval>100000)
        {
            return 100000 * 0.03;
        }else
        {
            return curval * 0.03 < 500 ? 500 : curval * 0.03;
        }
    }
    //  10万元至50万元（含100万元）	2%
    function stage50() {
        return 400000 * 0.02;
    }
    //  50万元至100万元（含100万元）	1%
    function stage100() {
        return 500000 * 0.01;
    }
    //100万元至500万元（含1000万元）	0.5%
    function stage1000() {
        return 4000000 * 0.005;
    }

}

module.exports.RatioFees = RatioFees
exports.TimeArea = TimeArea
exports.TimeFreeTitle = TimeFreeTitle
exports.RiskFreeTitle = RiskFreeTitle
exports.FreeRule = FreeRule
exports.JiJianArr = JiJianArr