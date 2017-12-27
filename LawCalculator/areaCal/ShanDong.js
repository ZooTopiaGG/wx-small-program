var TimeArea = { Min: 1, Max: 1 };
var TimeFreeTitle = "100～2000元/小时";
var RiskFreeTitle = "风险代理收费的金额不得高于收费合同约定标的的30%。";
var FreeRule = "收费标准的5倍计算";
//计件收费
var JiJianArr = [{
    cases: "刑事案件", desArr: [
        { name: "侦查阶段.提供法律咨询", price: "300-500元/件" },
        { name: "侦查阶段.申请取保候审", price: "500-3000元/件" },
        { name: "侦查阶段.代理申诉和控告", price: "1000元-10000元/件" },
        { name: "审查起诉阶段,不涉及财产关系的", price: "1500-12000元/件" },
        { name: "审查起诉阶段,涉及财产关系的", price: "按照代理涉及财产关系的民事诉讼案件收费标准的70%执行，但最低不少于2000元。" },
        { name: "审判阶段,不涉及财产关系的", price: "担任被告人的辩护人：2500～20000元/件,担任自诉人、被害人的诉讼代理人：2000～15000元/件" }
    ],
    CivilAction: [
        { type: "民事案件", name: "不涉及财产关系的", price: "800～10000元/件" },
        { type: "行政案件", name: "不涉及财产关系的", price: "800～10000元/件" },
         { type: "担任公民请求国家赔偿案件的代理人", name: "不涉及财产关系的", price: "800～8000元/件" }
    ],
    Important: 0 //非重大案件
}, {
    cases: "刑事案件", desArr: [
      { name: "侦查阶段.提供法律咨询", price: "1500-2500元/件" },
      { name: "侦查阶段.申请取保候审", price: "2500-15000元/件" },
      { name: "侦查阶段.代理申诉和控告", price: "5000-50000元/件" },
       { name: "审查起诉阶段,不涉及财产关系的", price: "7500-60000元/件" },
       { name: "审查起诉阶段,涉及财产关系的", price: "按照代理涉及财产关系的民事诉讼案件收费标准的70%执行，但最低不少于2000元。" },
       { name: "审判阶段,不涉及财产关系的", price: "担任被告人的辩护人：12500～100000元/件,担任自诉人、被害人的诉讼代理人：10000～75000元/件" }
    ],
    CivilAction: [
      { type: "民事案件", name: "不涉及财产关系的", price: "4000～50000元/件" },
        { type: "行政案件", name: "不涉及财产关系的", price: "4000～50000元/件" },
         { type: "担任公民请求国家赔偿案件的代理人", name: "不涉及财产关系的", price: "4000～40000元/件" }
    ]
    ,
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
1—10万元部分                 5%～6%
10—100万元部分               4%～5%
100—500万元部分              3%～4%
500—1000万元部分             2%～3%
1000—5000万元部分            1%～2%
5000万元以上部分              0.5%～1%
**/
function RatioFees (val, important) {
    //初始化区间算法
    var section = new SectionOper();
    //当前输入的值
    var curval = parseFloat(val);
    var IntMoney = 0;
    if (curval <= 100000) {
        section.Add((curval * 0.05), (curval * 0.06));
        IntMoney = section.Calculate();
    }
        // 10—100万元部分               4%～5%
    else if (curval > 100000 && curval <= 1000000) {
        var s10 = stage10();
        section.Add(s10.Min, s10.Max);
        section.Add(((curval - 100000) * 0.04), ((curval - 100000) * 0.05));
        IntMoney = section.Calculate();
    }
        //  100—500万元部分              3%～4%
    else if (curval > 1000000 && curval <= 5000000) {
        var s10 = stage10();
        var s100 = stage100();
        section.Add(s10.Min, s10.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(((curval - 1000000) * 0.03), ((curval - 1000000) * 0.04));
        IntMoney = section.Calculate();
    }

        //   500万元-1000万元(含1000万元)	2%-3%
    else if (curval > 5000000 && curval <= 10000000) {
        var s10 = stage10();
        var s100 = stage100();
        var s500 = stage500();
        section.Add(s10.Min, s10.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s500.Min, s500.Max);
        section.Add(((curval - 5000000) * 0.02), ((curval - 5000000) * 0.03));
        IntMoney = section.Calculate();
    }
        //   1000—5000万元部分            1%～2%
    else if (curval > 10000000 && curval <= 50000000) {
        var s10 = stage10();
        var s100 = stage100();
        var s500 = stage500();
        var s1000 = stage1000();
        section.Add(s10.Min, s10.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s500.Min, s500.Max);
        section.Add(s1000.Min, s1000.Max);
        section.Add(((curval - 10000000) * 0.01), ((curval - 10000000) * 0.02));
        IntMoney = section.Calculate();
    }

        //     5000万元以上部分              0.5%～1%
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
        section.Add(((curval - 50000000) * 0.005), ((curval - 50000000) * 0.01));
        IntMoney = section.Calculate();
    }
    if (!important) {

        return IntMoney.Min == 0 ? IntMoney.Max : IntMoney.Min.toFixed(2) + "-" + IntMoney.Max.toFixed(2);
    }
    else {
        return (IntMoney.Min * 5).toFixed(2) + "-" + (IntMoney.Max * 5).toFixed(2);
    }

    // 1—10万元部分  5%～6%
    function stage10() {
        return { Min: 90000 * 0.05, Max: 90000 * 0.06 };
    }
    //10—100万元部分  4%～5%
    function stage100() {
        return { Min: 900000 * 0.04, Max: 900000 * 0.05 };
    }
    //100—500万元部分  3%～4%
    function stage500() {
        return { Min: 4000000 * 0.03, Max: 4000000 * 0.04 };
    }
    //500—1000万元部分  2%～3%
    function stage1000() {
        return { Min: 5000000 * 0.02, Max: 5000000 * 0.03 };
    }
    //1000—5000万元部分 1%～2%
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