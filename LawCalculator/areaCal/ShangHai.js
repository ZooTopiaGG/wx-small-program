/// <reference path="../LegalFreeComponents.js" />
var TimeArea = { Min: 200, Max: 3000 };
var TimeFreeTitle = "*政府指导价200-3000元/小时";
var RiskFreeTitle = "风险代理收费的金额不得高于收费合同约定标的的30%。";
var FreeRule = "收费标准的5倍计算";
//计件收费
var JiJianArr = [{
    cases: "刑事案件", desArr: [
        { name: "侦查阶段", price: "1500-10000元/件" },
        { name: "审查起诉阶段", price: "2000-10000元/件" },
        { name: "一审阶段", price: "3000-30000元/件" }
    ],
    CivilAction:  [{ type: "民事、行政诉讼和国家赔偿案件", name: "立案", price: "3000-12000元/件" }],
    Important: 0
}, {
    cases: "刑事案件", desArr: [
        { name: "侦查阶段", price: "7500-50000元/件" },
        { name: "审查起诉阶段", price: "10000-50000元/件" },
        { name: "一审阶段", price: "15000-150000元/件" }
    ],
    CivilAction:  [{ type: "民事、行政诉讼和国家赔偿案件", name: "立案", price: "15000-60000元/件" }],
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
        //10万元至100万元  5%-7%
    else if (curval > 100000 && curval <= 1000000) {
        var s10 = stage10();
        section.Add(s10.Min, s10.Max);
        section.Add(((curval - 100000) * 0.05), ((curval - 100000) * 0.07));
        IntMoney = section.Calculate();
    }
    //100万元至1000万元（含1000万元）	3%-5%
    else if (curval > 1000000 && curval <= 10000000) {
        var s10 = stage10();
        var s100 = stage100();
        section.Add(s10.Min, s10.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(((curval - 1000000) * 0.03), ((curval - 1000000) * 0.05));
        IntMoney = section.Calculate();
    }

    else if (curval > 10000000 && curval <= 100000000) {
        //1%-3%
        var s10 = stage10();
        var s100 = stage100();
        var s1000 = stage1000();
        section.Add(s10.Min, s10.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s1000.Min, s1000.Max);
        section.Add(((curval - 10000000) * 0.01), ((curval - 10000000) * 0.03));
        IntMoney = section.Calculate();
    }
    else if (curval > 100000000) {
        //0.5%-1%
        var s10 = stage10();
        var s100 = stage100();
        var s1000 = stage1000();
        var s10000 = stage10000();
        section.Add(s10.Min, s10.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s1000.Min, s1000.Max);
        section.Add(s10000.Min, s10000.Max);
        section.Add(((curval - 100000000) * 0.005), ((curval - 100000000) * 0.01));
        IntMoney = section.Calculate();
    }
    if (!important) {

        return IntMoney.Min == 0 ? IntMoney.Max : IntMoney.Min.toFixed(2) + "-" + IntMoney.Max.toFixed(2);
    }
    else {
        return (IntMoney.Min * 5).toFixed(2) + "-" + (IntMoney.Max * 5).toFixed(2);
    }
    //10以下算法  8%-12%（收费不足300元的，可按3000元）收取
    function stage10() {
        if (curval <= 100000) {
           var min= curval * 0.08
           var max = curval * 0.12;
           if (min < 3000)
           {
               return { Min: 0, Max: 3000 };
           }
           return { Min: min, Max: max };
        } else {
            return { Min: 100000 * 0.08, Max: 100000 * 0.12 };
        }
    }
    //  10万元至100万元（含100万元）	5%-7%
    function stage100() {
        return { Min: 900000 * 0.05, Max: 900000 * 0.07 };
    }
    //100万元至1000万元（含1000万元）	3%-5%
    function stage1000() {
        return { Min: 9000000 * 0.03, Max: 9000000 * 0.05 };
    }
    //1000万元至1亿（含1亿）	1%-3%
    function stage10000() {
        return { Min: 90000000 * 0.01, Max: 90000000 * 0.03 };
    }
 
}
 
module.exports.RatioFees = RatioFees
exports.TimeArea = TimeArea
exports.TimeFreeTitle = TimeFreeTitle
exports.RiskFreeTitle = RiskFreeTitle
exports.FreeRule = FreeRule
exports.JiJianArr = JiJianArr