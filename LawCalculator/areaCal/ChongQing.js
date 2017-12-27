var TimeArea = { Min: 200, Max: 2000 };
var TimeFreeTitle = "政府指导价300-4000元/小时";
var RiskFreeTitle = "风险代理收费的金额不得高于收费合同约定标的的30%。";
var FreeRule = "收费标准的1～3倍计算";
//计件收费

var JiJianArr = [{
    cases: "", desArr: [
        // { name: "侦查阶段", price: "2000-8000元/件" },
        // { name: "审查起诉阶段", price: "3000-10000元/件" },
        // { name: "一审阶段", price: "5000-30000元/件" }
    ],
    CivilAction: [
        { type: "代理民事诉讼案件", name: "不涉及财产关系", price: "5000-6000元/件" },
        { type: "代理各类申诉案件", name: "不涉及财产关系", price: "5000-20000元/件" },
        { type: "代理仲裁案件", name: "不涉及财产关系", price: "10,000-60,000元/件" },
    ],
    Important: 0 //非重大案件
}, {
    cases: "", desArr: [
        //  { name: "侦查阶段", price: "10000-40000元/件" },
        //  { name: "审查起诉阶段", price: "15000-50000元/件" },
        //  { name: "一审阶段", price: "25000-150000元/件" }
    ],
    CivilAction: [
        { type: "代理民事诉讼案件", name: "不涉及财产关系", price: "15000-18000元/件" },
        { type: "代理各类申诉案件", name: "不涉及财产关系", price: "15000-60000元/件" },
        { type: "代理仲裁案件", name: "不涉及财产关系", price: "30,000-180,000元/件" },
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
    10万元以下（含10万元）	2000—6000元
    10万元-50万元(含50万元)	5%-6%
    50万元-100万元(含100万元)	4%-5%
    100万元-500万元(含500万元)	3%-4%
    500万元-1000万元(含1000万元)	2%-3%
    1000万元以上	1%-2%
**/
function RatioFees (val, important) {
    //初始化区间算法
    var section = new SectionOper();
    //当前输入的值
    var curval = parseFloat(val);
    var IntMoney = 0;
    if (curval <= 100000) {
        IntMoney = stage10();
    }
    //  10万元-100万元(含100万元)	4%-5%
    else if (curval > 100000 && curval <= 1000000) {
        var s10 = stage10();
        section.Add(s10.Min, s10.Max);
        section.Add(((curval - 100000) * 0.04), ((curval - 100000) * 0.05));
        IntMoney = section.Calculate();
    }
        //  100万元-500万元(含500万元)	3%-4%
    else if (curval > 1000000 && curval <= 5000000) {
        var s10 = stage10();
        var s50 = stage100();
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(((curval - 1000000) * 0.03), ((curval - 1000000) * 0.04));
        IntMoney = section.Calculate();
    }
        //   500万元-1000万元(含1000万元)	2%-3%
    else if (curval > 5000000 && curval <= 10000000) {
        var s10 = stage10();
        var s50 = stage100();
        var s100 = stage500();
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(((curval - 5000000) * 0.02), ((curval - 5000000) * 0.03));
        IntMoney = section.Calculate();
    }
        //     1000万元-5000万元元以上	1%-2%
    else if (curval > 10000000 && curval <= 50000000) {
        var s10 = stage10();
        var s50 = stage100();
        var s100 = stage500();
        var s500 = stage1000();
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s500.Min, s500.Max);
        section.Add(((curval - 10000000) * 0.01), ((curval - 10000000) * 0.02));
        IntMoney = section.Calculate();
    }
    else if (curval > 50000000) {
        var s10 = stage10();
        var s50 = stage100();
        var s100 = stage500();
        var s500 = stage1000();
        var s1000 = stage5000();
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s500.Min, s500.Max);
        section.Add(s1000.Min, s1000.Max);
        section.Add(((curval - 50000000) * 0.01), ((curval - 50000000) * 0.02));
        IntMoney = section.Calculate();
    }
    if (!important) {

        return IntMoney.Min == 0 ? IntMoney.Max : IntMoney.Min.toFixed(2) + "-" + IntMoney.Max.toFixed(2);
    }
    else {
        return (IntMoney.Min * 3).toFixed(2) + "-" + (IntMoney.Max * 3).toFixed(2);
    }


    // 10万元以下（含10万元）	5000—6000元
    function stage10() {
        return { Min: 5000, Max: 6000 };
    }
    //  10万元-100万元(含100万元)	4%-5%
    function stage100() {
        return { Min: 900000 * 0.04, Max: 900000 * 0.05 };
    }
    //     100万元-500万元(含500万元)	3%-4%
    function stage500() {
        return { Min: 4000000 * 0.03, Max: 4000000 * 0.04 };
    }
    //  500万元-1000万元(含1000万元)	2%-3%
    function stage1000() {
        return { Min: 5000000 * 0.02, Max: 5000000 * 0.03 };
    }
    //  1000万元-5000万元(含1000万元)	1%-2%
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