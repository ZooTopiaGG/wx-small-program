var TimeArea = { Min: 100, Max: 2000 };
var TimeFreeTitle = "政府指导价100-2000元/小时";
var RiskFreeTitle = "风险代理收费的金额不得高于收费合同约定标的的30%。";
var FreeRule = "收费标准的3倍计算";
//计件收费
var JiJianArr = [{
    cases: "刑事案件", desArr: [
        // { name: "侦查阶段一般案件", price: "500--1000元/件" },
        // { name: "侦查阶段比较复杂疑难案件", price: "1001--3000元/件" },
        // { name: "侦查阶段复杂疑难案件", price: "3001--5000/件" },
        // { name: "起诉阶段一般案件", price: "500--1000元/件" },
        // { name: "起诉阶段比较复杂疑难案件", price: "1001--3000元/件" },
        // { name: "起诉阶段复杂疑难案件", price: "3001--5000/件" },
        // { name: "审判阶段一般案件", price: "1000--5000/件" },
        // { name: "审判阶段比较复杂疑难案件", price: "5001--10000/件" },
        // { name: "审判阶段复杂疑难案件", price: "10001--20000/件" },
        { name: "侦查阶段", price: "500--5000/件" },
        { name: "起诉阶段", price: "500--5000/件" },
        { name: "审判阶段", price: "1000--20000/件" },
    ],
    CivilAction: [
        // { type: "民事、行政案件", name: "不涉及财产关系的案件", price: "1000元--5000元/件" },
        // { type: "民事、行政案件", name: "比较复杂疑难案件", price: "2001元--3000元/件" },
        // { type: "民事、行政案件", name: "复杂疑难案件", price: "3001--5000元/件" }
        { type: "民事、行政案件", name: "不涉及财产关系的案件", price: "1000元--5000元/件" },
        { type: "各类诉讼案件", name: "申诉收费", price: "1000元--5000元/件" },
    ],
    Important: 0 //非重大案件
}, {
    cases: "刑事案件", desArr: [
        // { name: "侦查阶段一般案件", price: "1500--3000元/件" },
        // { name: "侦查阶段比较复杂疑难案件", price: "3001--9000元/件" },
        // { name: "侦查阶段复杂疑难案件", price: "9001--15000/件" },
        // { name: "起诉阶段一般案件", price: "1500--3000元/件" },
        // { name: "起诉阶段比较复杂疑难案件", price: "3001--9000元/件" },
        // { name: "起诉阶段复杂疑难案件", price: "9001--15000/件" },
        // { name: "审判阶段一般案件", price: "3000--15000/件" },
        // { name: "审判阶段比较复杂疑难案件", price: "15001--30000/件" },
        // { name: "审判阶段复杂疑难案件", price: "30001--60000/件" },
        { name: "侦查阶段", price: "1500--15000/件" },
        { name: "起诉阶段", price: "1500--15000/件" },
        { name: "审判阶段", price: "3000--60000/件" },
    ],
    CivilAction: [
        // { type: "民事、行政案件", name: "不涉及财产关系的一般案件", price: "3000元--6000元/件" },
        // { type: "民事、行政案件", name: "比较复杂疑难案件", price: "6001元--9000元/件" },
        // { type: "民事、行政案件", name: "复杂疑难案件", price: "9001--15000元/件" }
        { type: "民事、行政案件", name: "不涉及财产关系的案件", price: "3000元--15000元/件" },
        { type: "各类诉讼案件", name: "申诉收费", price: "3000元--15000元/件" },
    ],
    Important: 1 //非重大案件
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
1万元(含1万元)以下1000 
1万以上10万元以下(含10万元)的部分 6%-5%
10万元以上50万元以下(含50万元)的部分 5%-4%
50万元以上100万元以下(含100万元)的部分 4%-3%
100万元以上500万元以下(含500万元)的部分 3%-2%
500万元以上-1000万元(含) 的部分 2%-1.5%
1000万元以上的部分 1%-0.5%
**/
function RatioFees (val, important) {
    //初始化区间算法
    var section = new SectionOper();
    //当前输入的值
    var curval = parseFloat(val);
    var IntMoney = 0;
    //1万元(含1万元)以下1000 
    if (curval <= 10000) {
        section.Add(0, 1000);
        IntMoney = section.Calculate();
        return "1000以上"
    }
        //1万以上10万元以下(含10万元)的部分 6%-5%
    else if (curval > 10000 && curval <= 100000) {
        s1 = stage1();
        section.Add(s1.Min, s1.Max);
        section.Add((curval - 10000) * 0.05, (curval - 10000) * 0.06);
        IntMoney = section.Calculate();
    }
        //10万元以上50万元以下(含50万元)的部分 5%-4%
    else if (curval > 100000 && curval <= 500000) {
        var s1 = stage1();
        var s10 = stage10();
        section.Add(s1.Min, s1.Max);
        section.Add(s10.Min, s10.Max);
        section.Add(((curval - 100000) * 0.04), ((curval - 100000) * 0.05));
        IntMoney = section.Calculate();
    }

        //50万元以上100万元以下(含100万元)的部分 4%-3%
    else if (curval > 500000 && curval <= 1000000) {
        var s1 = stage1();
        var s10 = stage10();
        var s50 = stage50();
        section.Add(s1.Min, s1.Max);
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(((curval - 500000) * 0.03), ((curval - 500000) * 0.04));
        IntMoney = section.Calculate();
    }


        // 100万元以上500万元以下(含500万元)的部分 3%-2%
    else if (curval > 1000000 && curval <= 5000000) {
        var s1 = stage1();
        var s10 = stage10();
        var s50 = stage50();
        var s100 = stage100();
        section.Add(s1.Min, s1.Max);
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(((curval - 1000000) * 0.02), ((curval - 1000000) * 0.03));
        IntMoney = section.Calculate();
    }

        //   500万元以上-1000万元(含) 的部分 2%-1%
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
        section.Add(((curval - 5000000) * 0.01), ((curval - 5000000) * 0.02));
        IntMoney = section.Calculate();
    }
        //     1000万元以上部分              0.5%～1%
    else if (curval > 10000000) {
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
        section.Add(((curval - 10000000) * 0.005), ((curval - 10000000) * 0.01));
        IntMoney = section.Calculate();
    }
    if (!important) {

        return IntMoney.Min == 0 ? IntMoney.Max : IntMoney.Min.toFixed(2) + "-" + IntMoney.Max.toFixed(2);
    }
    else {
        return (IntMoney.Min * 3).toFixed(2) + "-" + (IntMoney.Max * 3).toFixed(2);
    }

    function stage1() {
        return { Min: 1000, Max: 1000 };
    }
    // 1—10万元部分  5%～6%
    function stage10() {
        return { Min: 90000 * 0.05, Max: 90000 * 0.06 };
    }

    //10—50万元部分  4%～5%
    function stage50() {
        return { Min: 400000 * 0.04, Max: 400000 * 0.05 };
    }

    //50—100万元部分  3%～4%
    function stage100() {
        return { Min: 500000 * 0.03, Max: 500000 * 0.04 };
    }
    //100—500万元部分  2%～3%
    function stage500() {
        return { Min: 4000000 * 0.02, Max: 4000000 * 0.03 };
    }
    //500—1000万元部分  1.5%～2%
    function stage1000() {
        return { Min: 5000000 * 0.015, Max: 5000000 * 0.02 };
    }
}

module.exports.RatioFees = RatioFees
exports.TimeArea = TimeArea
exports.TimeFreeTitle = TimeFreeTitle
exports.RiskFreeTitle = RiskFreeTitle
exports.FreeRule = FreeRule
exports.JiJianArr = JiJianArr