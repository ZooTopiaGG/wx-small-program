var TimeArea = { Min: 200, Max: 2000 };
var TimeFreeTitle = "政府指导价200-2000元/小时";
var RiskFreeTitle = "风险代理收费的金额不得高于收费合同约定标的的30%。";
var FreeRule = "收费标准的5倍计算";
//计件收费
 var JiJianArr = [{
    cases: "刑事案件", desArr: [
        { name: "侦查阶段", price: "1500-8000元/件" },
        { name: "审查起诉阶段", price: "1500-10000元/件" },
        { name: "一审阶段", price: "2500-25000元/件" }
    ],
    CivilAction: [
        { type: "民事诉讼、行政诉讼、国家赔偿案件", name: "立案", price: "1500-8000元/件" }
    ],
    Important: 0 //非重大案件
 }, {
    cases: "刑事案件", desArr: [
        { name: "侦查阶段", price: "7500-40000元/件" },
        { name: "审查起诉阶段", price: "7500-50000元/件" },
        { name: "一审阶段", price: "12500-125000元/件" }
    ],
    CivilAction: [
        { type: "民事诉讼、行政诉讼、国家赔偿案件", name: "立案", price: "7500-40000元/件" }
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
    10万元以下（含10万元）	6-8%，，最低收费1500元
    10万元以上至50万元（含50万元	5-6%
    50万元以上至100万元（含100万元）	4-5%
    100万元以上至500万元（含500万元）	3-4%
    500万元以上至1000万元（含1000万元）2-3%
    1000万元以上		1-2%
    */
    //初始化区间算法
    var section = new SectionOper();
    //当前输入的值
    var curval = parseFloat(val);
    var IntMoney = 0;

    //  10万元以下（含10万元）	6-8%，最低收费2500元
    if (curval <= 100000) {
        IntMoney = stage10();
    }
        //10万元以上至50万元（含50万元	5-6%
    else if (curval > 100000 && curval <= 500000) {
        var s10 = stage10();
        section.Add(s10.Min, s10.Max);
        section.Add(((curval - 100000) * 0.04), ((curval - 100000) * 0.048));
        IntMoney = section.Calculate();
    }
        // 50万元以上至100万元（含100万元）4-5%
    else if (curval > 500000 && curval <= 1000000) {
        var s10 = stage10();
        var s50 = stage50();
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(((curval - 500000) * 0.032), ((curval - 500000) * 0.04));
        IntMoney = section.Calculate();
    }
        //  100万元以上至500万元（含500万元）	3-4%
    else if (curval > 1000000 && curval <= 5000000) {
        var s10 = stage10();
        var s50 = stage50();
        var s100 = stage100();
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(((curval - 1000000) * 0.024), ((curval - 1000000) * 0.032));
        IntMoney = section.Calculate();
    }
        //   500万元以上至1000万元（含1000万元）	2-3%
    else if (curval > 5000000 && curval <= 10000000) {
        var s10 = stage10();
        var s50 = stage50();
        var s100 = stage100();
        var s500 = stage500();
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s500.Min, s500.Max);
        section.Add(((curval - 5000000) * 0.016), ((curval - 5000000) * 0.024));
        IntMoney = section.Calculate();
    }
        // 1000万元以上	1-2%
    else if (curval > 10000000) {
        var s10 = stage10();
        var s50 = stage50();
        var s100 = stage100();
        var s500 = stage500();
        var s1000 = stage1000();
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s500.Min, s500.Max);
        section.Add(s1000.Min, s1000.Max);
        section.Add(((curval - 10000000) * 0.008), ((curval - 10000000) * 0.016));
        IntMoney = section.Calculate();
    }
    if (!important) {

        return IntMoney.Min == 0 ? IntMoney.Max : IntMoney.Min.toFixed(2) + "-" + IntMoney.Max.toFixed(2);
    }
    else {
        return (IntMoney.Min * 5).toFixed(2) + "-" + (IntMoney.Max * 5).toFixed(2);
    }
 

    /*
    10万元以下（含10万元）	6-8%，最低收费2500元
    10万元以上至50万元（含50万元	5-6%
    50万元以上至100万元（含100万元）	4-5%
    100万元以上至500万元（含500万元）	3-4%
    500万元以上至1000万元（含1000万元）	2-3%
    1000万元以上	1-2%
    */
    function stage10() {
        if (curval <= 100000) {
            var min = curval * 0.048
            var max = curval * 0.064;
            if (min < 2500) {
                return { Min: 0, Max: 2500 };
            }
            return { Min: min, Max: max };
        } else {
            return { Min: 100000 * 0.048, Max: 100000 * 0.068 };
        }

    }
    //  10万元以上至50万元（含50万元	5-6%
    function stage50() {
        return { Min: 400000 * 0.04, Max: 400000 * 0.048 };
    }
    //   50万元以上至100万元（含100万元）	4-5%
    function stage100() {
        return { Min: 500000 * 0.032, Max: 500000 * 0.04 };
    }
    //   100万元以上至500万元（含500万元）	3-4%
    function stage500() {
        return { Min: 4000000 * 0.024, Max: 4000000 * 0.032 };
    }
    //   500万元以上至1000万元（含1000万元）	2-3%
    function stage1000() {
        return { Min: 5000000 * 0.016, Max: 5000000 * 0.024 };
    }

}
 
module.exports.RatioFees = RatioFees
exports.TimeArea = TimeArea
exports.TimeFreeTitle = TimeFreeTitle
exports.RiskFreeTitle = RiskFreeTitle
exports.FreeRule = FreeRule
exports.JiJianArr = JiJianArr