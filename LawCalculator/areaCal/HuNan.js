var TimeArea = { Min: 500, Max: 1000 };
var TimeFreeTitle = "*政府指导价500-2000元/小时";
var RiskFreeTitle = "风险代理收费的金额不得高于收费合同约定标的的50%。";
var FreeRule = "收费标准的5倍计算";
//计件收费

var JiJianArr = [{
    cases: "", desArr: [
        // { name: "侦查阶段", price: "1000-10000元/件" },
        // { name: "起诉阶段", price: "1000-10000元/件" },
        // { name: "审判阶段（一审）", price: "2000-20000元/件" },
        // { name: "审判阶段（二审）", price: "2000-30000元/件" },
        // { name: "死刑复核阶段", price: "2000-2OOO0元/件" },
        // { name: "担任刑事自诉案件的原告或公诉案件被害人的代理人的", price: "200O-2OOO0元/件" }
    ],
    CivilAction: [
        { type: "行政复议、行政听证案件，民事、经济案件", name: "不涉及财产关系", price: "3000-20000元/件" },
        { type: "婚姻、家庭、小额民间借贷等一般民事法律事务的代书、咨询", name: "涉及财产关系", price: "200-2000元/件" },
        { type: "审查、起草、修改合同、章程，提供资信调查", name: "涉及财产关系", price: "3000-20000元/件" },
        { type: "出具法律意见书、咨询建议书，参加项目谈判，出具律师见证书", name: "涉及财产关系", price: "3000-20000元/件" }
    ],
    Important: 0 //非重大案件
}, {
    cases: "", desArr: [
    //     { name: "侦查阶段", price: "5000-40000元/件" },
    //     { name: "起诉阶段", price: "5000-40000元/件" },
    //     { name: "审判阶段（一审）", price: "10000-60000元/件" },
    //     { name: "审判阶段（二审）", price: "10000-75000元/件" },
    //    { name: "担任刑事自诉案件的原告或公诉案件被害人的代理人的", price: "5000-50000元/件" }
    ],
    CivilAction: [
        { type: "行政复议、行政听证案件，民事、经济案件", name: "不涉及财产关系", price: "3000-20000元/件" },
        { type: "婚姻、家庭、小额民间借贷等一般民事法律事务的代书、咨询", name: "涉及财产关系", price: "200-2000元/件" },
        { type: "审查、起草、修改合同、章程，提供资信调查", name: "涉及财产关系", price: "3000-20000元/件" },
        { type: "出具法律意见书、咨询建议书，参加项目谈判，出具律师见证书", name: "涉及财产关系", price: "3000-20000元/件" }
    ],
    Important: 1 //重大案件
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
    if (curval <= 100000) {
        IntMoney = stage1();
    }
    // 10万元-50万元(含10万元)	6%-8%
    else if (curval > 100000 && curval <= 500000) {
        var s1 = stage1();
        section.Add(s1.Min, s1.Max);
        section.Add(((curval - 100000) * 0.06), ((curval - 100000) * 0.08));
        IntMoney = section.Calculate();
    }
   //  50万元-500万元(含50万元)	4%-6%
    else if (curval > 500000 && curval <= 5000000) {
        var s1 = stage1();
        var s10 = stage50();
        section.Add(s1.Min, s1.Max);
        section.Add(s10.Min, s10.Max);
        section.Add(((curval - 500000) * 0.04), ((curval - 500000) * 0.06));
        IntMoney = section.Calculate();
    }
    //  500万元-100万元(含100万元)	2%-4%
    else if (curval > 5000000 && curval <= 20000000) {
        var s1 = stage1();
        var s10 = stage50();
        var s50 = stage500();
        section.Add(s1.Min, s1.Max);
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(((curval - 5000000) * 0.02), ((curval - 5000000) * 0.04));
        IntMoney = section.Calculate();
    }
        // 2000万元-10000万元(含500万元)	1%-2%
    else if (curval > 20000000 && curval <= 100000000) {
        var s1 = stage1();
        var s10 = stage50();
        var s50 = stage500();
        var s100 = stage2000();
        section.Add(s1.Min, s1.Max);
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(((curval - 20000000) * 0.01), ((curval - 20000000) * 0.02));
        IntMoney = section.Calculate();
    }
    else if (curval > 100000000) {
        var s1 = stage1();
        var s10 = stage50();
        var s50 = stage500();
        var s100 = stage2000();
        var s1000 = stage10000();
        section.Add(s1.Min, s1.Max);
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s1000.Min, s1000.Max);
        section.Add(((curval - 100000000) * 0.005), ((curval - 100000000) * 0.01));
        IntMoney = section.Calculate();
    }
    if (!important) {
        return IntMoney.Min == 0 ? IntMoney.Max : IntMoney.Min.toFixed(2) + "-" + IntMoney.Max.toFixed(2);
    }
    else {
        return (IntMoney.Min * 5).toFixed(2) + "-" + (IntMoney.Max * 5).toFixed(2);
    }


    function stage1() {
        return { Min: 3000, Max: 10000 };
    }
    //  10万元-50万元(含10万元)	8%-6%
    function stage50() {
        return { Min: 400000 * 0.06, Max: 400000 * 0.08 };
    }
    //    50万元-500万元(含50万元)	4%-6%
    function stage500() {
        return { Min: 4500000 * 0.04, Max: 4500000 * 0.06 };
    }
    //      500万元-2000万元(含100万元)	2%-4%
    function stage2000() {
        return { Min: 15000000 * 0.02, Max: 15000000 * 0.04 };
    }
    //    2000万元-1亿元(含500万元)	1%-2%
    function stage10000() {
        return { Min: 80000000 * 0.01, Max: 80000000 * 0.02 };
       // return 4000000 * 0.04;
    }

}

module.exports.RatioFees = RatioFees
exports.TimeArea = TimeArea
exports.TimeFreeTitle = TimeFreeTitle
exports.RiskFreeTitle = RiskFreeTitle
exports.FreeRule = FreeRule
exports.JiJianArr = JiJianArr