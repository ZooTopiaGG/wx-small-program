var TimeArea = { Min: 100, Max: 2500 };
var TimeFreeTitle = "*政府指导价100-2500元/小时";
var RiskFreeTitle = "风险代理收费的最高金额不得高于收费合同约定标的额的30%。";
var FreeRule = "收费标准的5倍计算";
//计件收费
var JiJianArr = [{
    cases: "刑事案件", desArr: [
        { name: "侦查阶段", price: "1000-8000元/件" },
        { name: "审查起诉阶段", price: "1500-10000元/件" },
        { name: "一审阶段", price: "2500-20000元/件" },
        
    ],
    CivilAction: [{ type: "民事、行政诉讼、行政复议、国家赔偿案件", name: "不涉及财产", price: "2500-10000元/件" }],
    Important:0
}, {
    cases: "刑事案件", desArr: [
        { name: "侦查阶段", price: "5000-40000元/件" },
        { name: "审查起诉阶段", price: "7500-50000元/件" },
        { name: "一审阶段", price: "12500-100000元/件" },
    ],
    CivilAction: [{ type: "民事、行政诉讼、行政复议、国家赔偿案件", name: "不涉及财产", price: "12500-50000元/件" }],
    Important: 1
}];

function SectionOper() {
    var array = new Array();
    //添加最大值和最小值区间
    this.Add = function (min, max) {
        if (isNaN(min) || isNaN(max)) {
            alert("添加数据类型出错");
            return;
        }
        array.push({ Min: min, Max: max });
    }
     
    //区间运算
    this.Calculate = function () {
        var minVal = 0;
        var maxVal = 0;
        for (var i = 0; i < array.length; i++) {
            if (array[i]) {
                minVal += parseFloat(array[i].Min);
                maxVal += parseFloat(array[i].Max);
            }
        }
        return { Min: minVal, Max: maxVal };
    }
    //清空
    this.Clear = function () {
        for (var i = 0; i < array.length; i++) {
            delete array[i];
        }
    }
}

/**
RatioFees ：比例收费
@val : 输入金额,
@important : 是否重大案件 bool true=是 false= 否 收费标准的5倍收费 , 这里设置最大5
    1万元以下（含1万元）	2500元
    1万元-10万元(含10万元)	4%-7%
    10万元-50万元(含50万元)	3%-6%
    50万元-100万元(含100万元)	2.5%-5%
    100万元-500万元(含500万元)	2%-4%
    500万元-1000万元(含1000万元)	1.5%—3%
    1000万元-1亿元	0.7%-2%
    一亿元以上	0.50%
**/
function RatioFees (val, important) {
    //初始化区间算法
    var section = new SectionOper();
    //当前输入的值
    var curval = parseFloat(val);
    var IntMoney = 0;
    if (curval <= 10000) {
        IntMoney = stage1();
    }
    // 1万元-10万元(含10万元)	4%-7%
    else if (curval > 10000 && curval <= 100000) {
        var s1 = stage1();
        section.Add(s1.Min, s1.Max);
        section.Add(((curval - 10000) * 0.04), ((curval - 10000) * 0.07));
        IntMoney = section.Calculate();
    }
   //  10万元-50万元(含50万元)	3%-6%
    else if (curval > 100000 && curval <= 500000) {
        var s1 = stage1();
        var s10 = stage10();
        section.Add(s1.Min, s1.Max);
        section.Add(s10.Min, s10.Max);
        section.Add(((curval - 100000) * 0.03), ((curval - 100000) * 0.06));
        IntMoney = section.Calculate();
    }
    //  50万元-100万元(含100万元)	2.5%-5%
    else if (curval > 500000 && curval <= 1000000) {
        var s1 = stage1();
        var s10 = stage10();
        var s50 = stage50();
        section.Add(s1.Min, s1.Max);
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(((curval - 500000) * 0.025), ((curval - 500000) * 0.05));
        IntMoney = section.Calculate();
    }
        // 100万元-500万元(含500万元)	2%-4%
    else if (curval > 1000000 && curval <= 5000000) {
        var s1 = stage1();
        var s10 = stage10();
        var s50 = stage50();
        var s100 = stage100();
        section.Add(s1.Min, s1.Max);
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(((curval - 1000000) * 0.02), ((curval - 1000000) * 0.04));
        IntMoney = section.Calculate();
    }
        //    500万元-1000万元(含1000万元)	1.5%—3%
    else if (curval > 5000000 && curval <= 10000000) {
        var s1 = stage1();
        var s10 = stage10();
        var s50 = stage50();
        var s100 = stage100();
        var s500 = stage500();
        section.Add(s1.Min, s1.Max);
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s500.Min, s500.Max);
        section.Add(((curval - 5000000) * 0.015), ((curval - 5000000) * 0.03));
        IntMoney = section.Calculate();
    }
   //    1000万元-1亿元	0.7%-2%
    else if (curval > 10000000 && curval <= 100000000) {
        var s1 = stage1();
        var s10 = stage10();
        var s50 = stage50();
        var s100 = stage100();
        var s500 = stage500();
        var s1000 = stage1000();
        section.Add(s1.Min, s1.Max);
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s500.Min, s500.Max);
        section.Add(s1000.Min, s1000.Max);
        section.Add(((curval - 10000000) * 0.007), ((curval - 10000000) * 0.02));
        IntMoney = section.Calculate();
    }
    else if (curval > 100000000) {
        var s1 = stage1();
        var s10 = stage10();
        var s50 = stage50();
        var s100 = stage100();
        var s500 = stage500();
        var s1000 = stage1000();
        var s10000 = stage10000();
        section.Add(s1.Min, s1.Max);
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s500.Min, s500.Max);
        section.Add(s1000.Min, s1000.Max);
        section.Add(s10000.Min, s10000.Max);
        section.Add(((curval - 100000000) * 0.005), ((curval - 100000000) * 0.005));
        IntMoney = section.Calculate();
    }
    if (!important) {
        return IntMoney.Min == 0 ? IntMoney.Max : IntMoney.Min.toFixed(2) + "-" + IntMoney.Max.toFixed(2);
    }
    else {
        return (IntMoney.Min * 5).toFixed(2) + "-" + (IntMoney.Max * 5).toFixed(2);
    }


    function stage1() {
        return { Min: 0, Max: 2500 };
    }
    //  1万元-10万元(含10万元)	4%-7%
    function stage10() {
        return { Min: 90000 * 0.04, Max: 90000 * 0.07 };
    }
    //    10万元-50万元(含50万元)	3%-6%
    function stage50() {
        return { Min: 400000 * 0.03, Max: 400000 * 0.06 };
    }
    //      50万元-100万元(含100万元)	2.5%-5%
    function stage100() {
        return { Min: 500000 * 0.025, Max: 500000 * 0.05 };
    }
    //    100万元-500万元(含500万元)	2%-4%
    function stage500() {
        return { Min: 4000000 * 0.02, Max: 4000000 * 0.04 };
       // return 4000000 * 0.04;
    }
    //  500万元-1000万元(含1000万元)	1.5%—3%
    function stage1000() {
        return { Min: 5000000 * 0.15, Max: 5000000 * 0.03 };
    }

    // 1000万元-1亿元	0.7%-2%
    function stage10000() {
        return { Min: 90000000 * 0.007, Max: 90000000 * 0.02 };
    }


}
 
module.exports.RatioFees = RatioFees
exports.TimeArea = TimeArea
exports.TimeFreeTitle = TimeFreeTitle
exports.RiskFreeTitle = RiskFreeTitle
exports.FreeRule = FreeRule
exports.JiJianArr = JiJianArr