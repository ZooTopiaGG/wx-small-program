var TimeArea = { Min: 100, Max: 2500 };
var TimeFreeTitle = "*政府指导价1000-3000元/小时";
var RiskFreeTitle = "风险代理收费的金额不得高于收费合同约定标的的30%。";
var FreeRule = "收费标准的2倍计算";
//计件收费
var JiJianArr = [{
    cases: "", desArr: [
        // { name: "提供法律咨询", price: "200元/件" },
        // { name: "侦查阶段(含申请取保候审)", price: "2000元/件" },
        // { name: "审查起诉阶段", price: "3000元/件" },
        // { name: "一审审判阶段", price: "5000元/件" }
    ],
    CivilAction: [
        { type: "民事诉讼、仲裁案件", name: "不涉及财产关系", price: "5000-20000元/件" }
        // { type: "刑事二审、死刑复核案件", name: "不涉及财产关系", price: "5000元/件" },
        // { type: "国家赔偿案件", name: "立案", price: "4000元/件" },
        // { type: "代理各类诉讼案件", name: "不涉及财产关系", price: "3000元/件" },
        // { type: "不涉及财产关系的案件", name: "立案", price: "3000元/件" }
    ],
    Important: 0 //非重大案件
}, {
    cases: "", desArr: [
        //  { name: "提供法律咨询", price: "1000元/件" },
        //  { name: "侦查阶段(含申请取保候审)", price: "10000元/件" },
        //  { name: "审查起诉阶段", price: "15000元/件" },
        //  { name: "一审审判阶段", price: "25000元/件" }
    ],
    CivilAction: [
        { type: "民事诉讼、仲裁案件", name: "不涉及财产关系", price: "10000-40000元/件" }
        // { type: "刑事自诉案件和公诉案件被害人代理", name: "不涉及财产关系", price: "15000元/件" },
        // { type: "刑事二审、死刑复核案件", name: "不涉及财产关系", price: "25000元/件" },
        // { type: "国家赔偿案件", name: "立案", price: "20000元/件" },
        // { type: "代理各类诉讼案件", name: "不涉及财产关系", price: "15000元/件" },
        // { type: "不涉及财产关系的案件", name: "立案", price: "15000元/件" }
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
标的额	律师费
1万元以下（含1万元）	500元—1500元/件
1万元-10万元(含10万元)	2%—5%
10万元-50万元(含50万元)	1.7%—3.5%
50万元-100万元(含100万元)	1.4%—2.8%
100万元-500万元(含500万元)	0.7%—1.5%
500万元-1000万元(含1000万元)	0.4%—0.8%
1000万元以上	按最高不超过0.4%，双方协商确定
**/
function RatioFees (val, important) {
    //初始化区间算法
    var section = new SectionOper();
    //当前输入的值
    var curval = parseFloat(val);
    var IntMoney = 0;
    //10万元以下（含10万元）	500元—1500元/件
    if (curval <= 100000) {
        IntMoney = stage1();
    }
        //10万元-50万元(含10万元)	7%—9%
    else if (curval > 100000 && curval <= 500000) {
        var s1 = stage1();
        section.Add(s1.Min, s1.Max);
        section.Add(((curval - 100000) * 0.07), ((curval - 100000) * 0.09));
        IntMoney = section.Calculate();
        //IntMoney += parseFloat(stage1()) + parseFloat(((curval - 10000) * 0.05));
    }
    //50万元-100万元(含50万元)	6%—8%
    else if (curval > 500000 && curval <= 1000000) {
        var s1 = stage1();
        var s10 = stage10();
        section.Add(s1.Min, s1.Max);
        section.Add(s10.Min, s10.Max);
        section.Add(((curval - 500000) * 0.06), ((curval - 500000) * 0.08));
        IntMoney = section.Calculate();
      //  IntMoney += parseFloat(stage1()) + parseFloat(stage10()) + parseFloat(((curval - 100000) * 0.035));
    }
        //100万元-500万元(含100万元)	5%—7%
    else if (curval > 1000000 && curval <= 5000000) {
        var s1 = stage1();
        var s10 = stage10();
        var s50 = stage50();
        section.Add(s1.Min, s1.Max);
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(((curval - 1000000) * 0.05), ((curval - 1000000) * 0.07));
        IntMoney = section.Calculate();
       // IntMoney += parseFloat(stage1()) + parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(((curval - 500000) * 0.028));
    }
        //500万元-1000万元(含500万元)	4%—6%
    else if (curval > 5000000 && curval <= 10000000) {
        var s1 = stage1();
        var s10 = stage10();
        var s50 = stage50();
        var s100 = stage100();
        section.Add(s1.Min, s1.Max);
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(((curval - 5000000) * 0.04), ((curval - 5000000) * 0.06));
        IntMoney = section.Calculate();
       // IntMoney += parseFloat(stage1()) + parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(((curval - 1000000) * 0.015));
    }
        // 1000万元-2000万元(含1000万元)	3%—5%
    else if (curval > 10000000 && curval <= 20000000) {
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
        section.Add(((curval - 10000000) * 0.03), ((curval - 10000000) * 0.05));
        IntMoney = section.Calculate();
       // IntMoney += parseFloat(stage1()) + parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(stage500()) + parseFloat(((curval - 5000000) * 0.008));
    }
        // 2000万元-5000万元(含1000万元)	2%—4%
    else if (curval > 20000000 && curval <= 50000000) {
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
        section.Add(((curval - 20000000) * 0.02), ((curval - 20000000) * 0.04));
        IntMoney = section.Calculate();
       // IntMoney += parseFloat(stage1()) + parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(stage500()) + parseFloat(((curval - 5000000) * 0.008));
    }
    //2000万元以上	按最高不超过0.4%，双方协商确定
    else if (curval > 50000000) {
        var s1 = stage1();
        var s10 = stage10();
        var s50 = stage50();
        var s100 = stage100();
        var s500 = stage500();
        var s1000 = stage1000();
        var s2000 = stage2000();
        section.Add(s1.Min, s1.Max);
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s500.Min, s500.Max);
        section.Add(s1000.Min, s1000.Max);
        section.Add(s2000.Min, s2000.Max);
        section.Add(((curval - 50000000) * 0.01), ((curval - 50000000) * 0.03));
        IntMoney = section.Calculate();
       // IntMoney += parseFloat(stage1()) + parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(stage500()) + parseFloat(stage1000()) + parseFloat(((curval - 10000000) * 0.004));
    }
    if (!important) {
        return IntMoney.Min == 0 ? IntMoney.Max : IntMoney.Min.toFixed(2) + "-" + IntMoney.Max.toFixed(2);
    }
    else {
        //刑事案件因时间或地域跨度极大、属集团犯罪和其他案情重大的、复杂的，可以在不高于规定标准5倍之内协商确定收费标准。
        return (IntMoney.Min * 2).toFixed(2) + "-" + (IntMoney.Max * 2).toFixed(2);
    }

    // 10万元以下（含10万元） 5000元—10000元/件
    function stage1() {
        return { Min: 5000, Max: 10000 };
    }
    // //10万元-50万元(含10万元)	7%—9%
    function stage10() {
        return { Min: 400000 * 0.07, Max: 400000 * 0.09 };
    }
    // 50万元-100万元(含50万元)	6%—8%
    function stage50() {
        return { Min: 500000 * 0.06, Max: 500000 * 0.08 };
    }
    // 100万元-500万元(含100万元)	5%—7%
    function stage100() {
        return { Min: 4000000 * 0.05, Max: 4000000 * 0.07 };
    }
    //  500万元-1000万元(含500万元)	4%—6%
    function stage500() {
        return { Min: 5000000 * 0.04, Max: 5000000 * 0.06 };
    }
    // 1000万元-2000万元(含1000万元)	3%—5%
    function stage1000() {
        return { Min: 10000000 * 0.03, Max: 10000000 * 0.05 };
    }
    // 2000万元-5000万元(含1000万元)	2%—4%
    function stage2000() {
        return { Min: 30000000 * 0.02, Max: 30000000 * 0.04 };
    }
 
}
 
module.exports.RatioFees = RatioFees
exports.TimeArea = TimeArea
exports.TimeFreeTitle = TimeFreeTitle
exports.RiskFreeTitle = RiskFreeTitle
exports.FreeRule = FreeRule
exports.JiJianArr = JiJianArr