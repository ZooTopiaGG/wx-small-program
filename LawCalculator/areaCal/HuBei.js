var TimeArea = { Min: 500, Max: 1000 };
var TimeFreeTitle = "政府指导价100-2000元/小时";
var RiskFreeTitle = "风险代理收费的金额不得高于收费合同约定标的的30%。";
var FreeRule = "收费标准的5倍计算";
//计件收费
var JiJianArr = [{
    cases: "刑事案件", desArr: [
        { name: "侦查阶段", price: "1000-5000元/件" },
        { name: "审查起诉阶段", price: "1000-5000元/件" },
        { name: "审判阶段", price: "1000-10000元/件" }
    ],
    CivilAction: [
        { type: "经济类犯罪、共同犯罪案件", name: "侦查阶段", price: "1000-10000元/件" },
        { type: "经济类犯罪、共同犯罪案件", name: "审查起诉阶段", price: "1000-10000元/件" },
        { type: "经济类犯罪、共同犯罪案件", name: "一审阶段", price: "1500-15000元/件" },
        { type: "涉及安全事故、环境污染、征地拆迁赔偿（补偿）等公共利益的群体性诉讼案件", name: "不涉及财产", price: "600-8000元/件" }
    ],
    Important: 0 //非重大案件
}, {
    cases: "刑事案件", desArr: [
       { name: "侦查阶段", price: "2500-25000元/件" },
       { name: "审查起诉阶段", price: "2500-25000元/件" },
       { name: "审判阶段", price: "3000-40000元/件" }
    ],
    CivilAction: [
        { type: "经济类犯罪、共同犯罪案件", name: "侦查阶段", price: "5000-50000元/件" },
        { type: "经济类犯罪、共同犯罪案件", name: "审查起诉阶段", price: "5000-50000元/件" },
        { type: "经济类犯罪、共同犯罪案件", name: "一审阶段", price: "7500-75000元/件" },
        { type: "涉及安全事故、环境污染、征地拆迁赔偿（补偿）等公共利益的群体性诉讼案件", name: "不涉及财产", price: "3000-40000元/件" }
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
    10万元以下	600-8000元/件
    10万元-100万元	1%-5%
    100万元-500万元	0.5%-3%
    500万元-1000万元	0.3%-2%
    1000万元-5000万元	0.2%-1.5%
    5000万元以上	0.1%-1%
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
        //  10万元-100万元	1%-5%
    else if (curval > 100000 && curval <= 500000) {
        var s10 = stage10();
        section.Add(s10.Min, s10.Max);
        section.Add(((curval - 100000) * 0.01), ((curval - 100000) * 0.05));
        IntMoney = section.Calculate();
    }
        // 100万元-500万元	0.5%-3%
    else if (curval > 1000000 && curval <= 5000000) {
        var s10 = stage10();
        var s100 = stage100();
        section.Add(s10.Min, s10.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(((curval - 1000000) * 0.005), ((curval - 1000000) * 0.03));
        IntMoney = section.Calculate();
    }
        //    500万元-1000万元	0.3%-2%
    else if (curval > 5000000 && curval <= 10000000) {
        var s10 = stage10();
        var s100 = stage100();
        var s500 = stage500();
        section.Add(s10.Min, s10.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s500.Min, s500.Max);
        section.Add(((curval - 5000000) * 0.003), ((curval - 5000000) * 0.02));
        IntMoney = section.Calculate();
    }
        //  1000万元-5000万元	0.2%-1.5%
    else if (curval > 10000000 && curval <= 50000000) {
        var s10 = stage10();
        var s100 = stage100();
        var s500 = stage500();
        var s1000 = stage1000();
        section.Add(s10.Min, s10.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s500.Min, s500.Max);
        section.Add(s1000.Min, s1000.Max);
        section.Add(((curval - 10000000) * 0.002), ((curval - 10000000) * 0.015));
        IntMoney = section.Calculate();
    }
        //  5000万元以上	0.1%-1%
    else if (curval > 50000000) {
        var s10 = stage10();
        var s100 = stage100();
        var s500 = stage500();
        var s1000 = stage1000();
        var s5000 = stage5000();
        section.Add(s10.Min, s10.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s500.Min, s500.Max);
        section.Add(s1000.Min, s1000.Max);
        section.Add(s5000.Min, s5000.Max);
        section.Add(((curval - 50000000) * 0.001), ((curval - 50000000) * 0.01));
        IntMoney = section.Calculate();

    }
    if (!important) {

        return IntMoney.Min == 0 ? IntMoney.Max : IntMoney.Min.toFixed(2) + "-" + IntMoney.Max.toFixed(2);
    }
    else {
        return (IntMoney.Min * 5).toFixed(2) + "-" + (IntMoney.Max * 5).toFixed(2);
    }
  
    // 10万元以下	600-8000元/件
    function stage10() {
        return { Min: 600, Max: 8000 };
    }
    // 10万元-100万元	1%-5%
    function stage100() {
        return { Min: 900000 * 0.01, Max: 900000 * 0.05 };
    }
    //    100万元-500万元	0.5%-3%
    function stage500() {
        return { Min: 4000000 * 0.005, Max: 4000000 * 0.03 };
    }
    //   500万元-1000万元	0.3%-2%
    function stage1000() {
        return { Min: 5000000 * 0.003, Max: 5000000 * 0.02 };
    }
    //   1000万元-5000万元	0.2%-1.5%
    function stage5000() {
        return { Min: 40000000 * 0.002, Max: 40000000 * 0.015 };
    }
 
}
 
module.exports.RatioFees = RatioFees
exports.TimeArea = TimeArea
exports.TimeFreeTitle = TimeFreeTitle
exports.RiskFreeTitle = RiskFreeTitle
exports.FreeRule = FreeRule
exports.JiJianArr = JiJianArr