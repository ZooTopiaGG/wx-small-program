var TimeArea = { Min: 60, Max: 1200 };
var TimeFreeTitle = "60-1200元/小时";
var RiskFreeTitle = "风险代理收费的金额不得高于收费合同约定标的的30%。";
var FreeRule = "收费标准的5倍计算";
//计件收费
var JiJianArr = [{
    cases: "", desArr: [
        // { name: "侦查阶段", price: "每件收费不超过5000元" },
        // { name: "审查起诉阶段", price: "每件收费不超过6000元" },
        // { name: "审判阶段", price: "每件收费不超过12000元" },
        // { name: "刑事自诉案件", price: "每件收费不超过10000元" },
        // { name: "担任被害人代理人", price: "每件不超过10000元" }
    ],
    CivilAction: [
        { type: "代理民事诉讼案件", name: "不涉及财产关系的", price: "4000-10000元/件" },
        { type: "代理行政诉讼案件", name: "不涉及财产关系", price: "4000-30000元/件" },
        { type: "公民请求国家赔偿案件", name: "不涉及财产关系", price: "4000-8000元/件" },
        { type: "公民请求国家赔偿案件", name: "涉及财产关系", price: "代理涉及财产关系的民事诉讼案件的收费标准减半收费，但最低不少于4000元" },
        { type: "代理诉讼案件", name: "不涉及财产关系", price: "4000-10000元/件" }
    ],
    Important: 0 //非重大案件
}, {
    cases: "", desArr: [
        // { name: "侦查阶段", price: "每件收费不超过25000元" },
        // { name: "审查起诉阶段", price: "每件收费不超过30000元" },
        // { name: "审判阶段", price: "每件收费不超过60000元" },
        // { name: "刑事自诉案件", price: "每件收费不超过50000元" },
        // { name: "担任被害人代理人", price: "每件不超过50000元" }
    ],
    CivilAction: [
        { type: "代理民事诉讼案件", name: "不涉及财产关系的", price: "20000-50000元/件" },
        { type: "代理行政诉讼案件", name: "不涉及财产关系", price: "20000-150000元/件" },
        { type: "公民请求国家赔偿案件", name: "不涉及财产关系", price: "20000-40000元/件" },
        { type: "公民请求国家赔偿案件", name: "涉及财产关系", price: "代理涉及财产关系的民事诉讼案件的收费标准减半收费，但最低不少于20000元" },
        { type: "代理诉讼案件", name: "不涉及财产关系", price: "20000-50000元/件" }
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
**/
function RatioFees (val, important) {
    /*
    10万元以下（含10万元）	每件收取基本代理费1000-8000元
    10万元-50万元(含50万元)	4%-6%
    50万元-100万元(含100万元)	3%-5%
    100万元-500万元(含500万元)	2%-4%
    500万元-1000万元(含1000万元)	1%-3%
    1000万元以上	1%-2%

    */
    //当前输入的值
    //初始化区间算法
    var section = new SectionOper();
    var curval = parseFloat(val);
    var IntMoney = 0;

    //  1万元以下（含1万元）	每件收取基本代理费1000-8000元
    if (curval <= 10000) {
        IntMoney = stage1();
    }
        //  1万元-10万元(含10万元)	8%-9%
    else if (curval > 10000 && curval <= 100000) {
        var s1 = stage1();
        section.Add(s1.Min, s1.Max);
        section.Add(((curval - 10000) * 0.08), ((curval - 10000) * 0.09));
        IntMoney = section.Calculate();
    }
        //    10万元-100万元(含100万元)	6%-8%
    else if (curval > 100000 && curval <= 1000000) {
        var s10 = stage1();
        var s50 = stage10();
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(((curval - 100000) * 0.06), ((curval - 100000) * 0.08));
        IntMoney = section.Calculate();
    }
     //  100万元-500万元(含500万元)	4%-6%
    else if (curval > 1000000 && curval <= 5000000) {
        var s10 = stage1();
        var s50 = stage10();
        var s100 = stage100();
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(((curval - 1000000) * 0.04), ((curval - 1000000) * 0.06));
        IntMoney = section.Calculate();
    }
        //   500万元-1000万元(含1000万元)	2%-4%
    else if (curval > 5000000 && curval <= 10000000) {
        var s10 = stage1();
        var s50 = stage10();
        var s100 = stage100();
        var s500 = stage500();
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s500.Min, s500.Max);
        section.Add(((curval - 5000000) * 0.02), ((curval - 5000000) * 0.04));
        IntMoney = section.Calculate();
    }
        //   1000万元-5000万元(含1000万元)	1%-2%
    else if (curval > 10000000 && curval <= 50000000) {
        var s10 = stage1();
        var s50 = stage10();
        var s100 = stage100();
        var s500 = stage500();
        var s1000 = stage1000();
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s500.Min, s500.Max);
        section.Add(s1000.Min, s1000.Max);
        section.Add(((curval - 40000000) * 0.01), ((curval - 40000000) * 0.02));
        IntMoney = section.Calculate();
    }
        //  5000万元以上	0.5%-1%
    else if (curval > 50000000) {
        var s10 = stage10();
        var s50 = stage50();
        var s100 = stage100();
        var s500 = stage500();
        var s1000 = stage1000();
        var s5000 = stage5000();
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s500.Min, s500.Max);
        section.Add(s1000.Min, s1000.Max);
        section.Add(s5000.Min, s5000.Max);
        section.Add(((curval - 10000000) * 0.005), ((curval - 10000000) * 0.01));
        IntMoney = section.Calculate();
    }
    if (!important) {

        return IntMoney.Min == 0 ? IntMoney.Max : IntMoney.Min.toFixed(2) + "-" + IntMoney.Max.toFixed(2);
    }
    else {
        return (IntMoney.Min * 5).toFixed(2) + "-" + (IntMoney.Max * 5).toFixed(2);
    }
    //   1万元以下（含10万元）	每件收取基本代理费4000元
    function stage1() {
        return { Min: 4000, Max: 4000 };
    }
    //   1万元-10万元(含10万元)	8%-9%
    function stage10() {
        return { Min: 90000 * 0.08, Max: 900000 * 0.09 };
    }
    //   10万元-100万元(含100万元)	6%-8%
    function stage100() {
        return { Min: 900000 * 0.06, Max: 900000 * 0.08 };
    }
    //   100万元-500万元(含500万元)	4%-6%
    function stage500() {
        return { Min: 4000000 * 0.04, Max: 4000000 * 0.06 };
    }
    // 500万元-1000万元(含1000万元)	2%-4%
    function stage1000() {
        return { Min: 5000000 * 0.02, Max: 5000000 * 0.04 };
    }
    // 1000万元-5000万元(含2000万元)	1%-2%
    function stage5000() {
        return { Min: 40000000 * 0.01, Max: 40000000 * 0.02 };
    }

}

module.exports.RatioFees = RatioFees
exports.TimeArea = TimeArea
exports.TimeFreeTitle = TimeFreeTitle
exports.RiskFreeTitle = RiskFreeTitle
exports.FreeRule = FreeRule
exports.JiJianArr = JiJianArr