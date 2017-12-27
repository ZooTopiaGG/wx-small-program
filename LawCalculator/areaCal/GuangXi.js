var TimeArea = { Min: 200, Max: 2000 };
var TimeFreeTitle = "*政府指导价200-2000元/小时";
var RiskFreeTitle = "风险代理收费的最高金额不得高于收费合同约定标的额的30%。";
var FreeRule = "收费标准的5倍计算";
//计件收费
var JiJianArr = [{
    cases: "刑事案件", desArr: [
        { name: "侦查阶段", price: "2000-15000元/件" },
        { name: "审查起诉阶段", price: "2000-15000元/件" },
        { name: "审判阶段（基层法院审理）", price: "2000-20000元/件" },
        { name: "审判阶段（中院审理）", price: "3000-35000元/件" },
        { name: "审判阶段（高院审理）", price: "8000-50000元/件" },
        { name: "审判阶段（最高院审理）", price: "30000-150000元/件" }
    ],
    CivilAction: [{ type: "民事、行政诉讼和国家赔偿案件", name: "不涉及财产关系", price: "1000-10000元/件" }],
    Important:0
}, {
    cases: "刑事案件", desArr: [
       { name: "侦查阶段", price: "10000-75000元/件" },
        { name: "审查起诉阶段", price: "10000-75000元/件" },
        { name: "审判阶段（基层法院审理）", price: "10000-100000元/件" },
        { name: "审判阶段（中院审理）", price: "15000-175000元/件" },
        { name: "审判阶段（高院审理）", price: "40000-250000元/件" },
        { name: "审判阶段（最高院审理）", price: "150000-750000元/件" }
    ],
    CivilAction: [{ type: "民事、行政诉讼和国家赔偿案件", name: "不涉及财产关系", price: "15000-50000元/件" }],
    Important: 1
}];


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
        IntMoney += stage10();
    }
    //10万元至50万元
    else if (curval > 100000 && curval <= 500000) {
        IntMoney += parseFloat(stage10()) + parseFloat(((curval - 100000) * 0.045));
    }
   //50万元-100万元（含100万元）
    else if (curval > 500000 && curval <= 1000000) {
        IntMoney += parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(((curval - 500000) * 0.04));
    }
  //100万元-500万元（含500万元）	3.00%
    else if (curval > 1000000 && curval <= 5000000) {
        IntMoney += parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(((curval - 1000000) * 0.03));
    }
        //500万元-1000万元（含1000万元）	2.00%
    else if (curval > 5000000 && curval <= 10000000) {
        IntMoney += parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(stage500()) + parseFloat(((curval - 5000000) * 0.02));
    }
    else if (curval > 10000000) {
        IntMoney += parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(stage500()) + parseFloat(stage1000()) + parseFloat(((curval - 10000000) * 0.01));
    }
    if (!important) {
        return IntMoney;
    }
    else {
        return IntMoney*5;
    }
    //10以下算法 5%
    function stage10() {
        if (curval < 100000) {
            return curval < 1000 ? 1000 : curval * 0.05;
        } else {
            return 100000*0.05
        }
    }
    //4.5%
    function stage50() {
        return 400000 * 0.045;
    }
    //  50万元-100万元（含100万元）	4.00%
    function stage100() {
        return 500000 * 0.04;
    }
    //  100万元-500万元（含500万元）	3.00%
    function stage500() {
        return 4000000 * 0.03;
    }
    //500万元至1000万元（含1000万元）	2.00%
    function stage1000() {
        return 5000000 * 0.02;
    }


}

module.exports.RatioFees = RatioFees
exports.TimeArea = TimeArea
exports.TimeFreeTitle = TimeFreeTitle
exports.RiskFreeTitle = RiskFreeTitle
exports.FreeRule = FreeRule
exports.JiJianArr = JiJianArr
 