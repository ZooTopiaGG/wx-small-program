/// <reference path="../LegalFreeComponents.js" />
var TimeArea = { Min: 50, Max: 1000 };
var TimeFreeTitle = "*政府指导价500-5000元/小时";
var RiskFreeTitle = "风险代理收费的金额不得高于收费合同约定标的的30%。";
var FreeRule = "收费标准的3倍计算";
//计件收费
var JiJianArr = [{
    cases: "", desArr: [
        // { name: "侦查阶段", price: " 800—3000元/件" },
        // { name: "审查起诉阶段", price: "800—5000元/件" },
        // { name: "一审审理阶段", price: "1000—6000元/件" },
        // { name: "办理刑事自诉案件", price: "800—5000元/件" },
        //  { name: "担任刑事自诉案件的原告", price: "800—3000元/件" },
        //  { name: "公诉案件被害人的代理人参加诉讼", price: "800—3000元/件" },
        //  { name: "办理死刑复核案件", price: "1000—5000元/件" },
    ],
    CivilAction: [{ type: "民事诉讼案件", name: "不涉及财产关系", price: "5000元- 50000元/件" }],
    Important: 0
},{ cases: "", desArr: [
        // { name: "侦查阶段", price: " 800—3000元/件" },
        // { name: "审查起诉阶段", price: "800—5000元/件" },
        // { name: "一审审理阶段", price: "1000—6000元/件" },
        // { name: "办理刑事自诉案件", price: "800—5000元/件" },
        //  { name: "担任刑事自诉案件的原告", price: "800—3000元/件" },
        //  { name: "公诉案件被害人的代理人参加诉讼", price: "800—3000元/件" },
        //  { name: "办理死刑复核案件", price: "1000—5000元/件" },
    ],
    CivilAction: [{ type: "民事诉讼案件", name: "不涉及财产关系", price: "15000元- 150000元/件" }],
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
function RatioFees  (val, important) {
    /*
    收费额不足5,000元的	每件按5,000元收取
    10万元以下部分(含10万元)	收费比例为8%-10%
    10万元至50万元部分(含50万元)	为7%-9%
    50万元至l00万元部分(含100万元)	为6%-8%
    100万元至500万元部分(含500万元)	为5%-7%
    500万元至1,000万元部分(含1,000万元)	为4%-6%
    1,000万元至2,000万元部分(含2,000万元)	为3%-5%
    2,000万元至5,000万元部分(含5,000万元)	为2%-4%
    5,000万元以上部分	为1%-3%
    */
    //当前输入的值
    //初始化区间算法
    var section = new SectionOper();
    var curval = parseFloat(val);
    var IntMoney = 0;
   
    //  10万元以下部分(含10万元)	收费比例为8%-10%  收费额不足5,000元的	每件按5,000元收取
    if (curval <= 100000) {
        var s10 = stage10();
        section.Add(s10.Min, s10.Max);
        IntMoney = section.Calculate();
    }
     //  10万元至50万元部分(含50万元)	为7%-9%
    else if (curval > 100000 && curval <= 500000) {
        var s10 = stage10();
        section.Add(s10.Min, s10.Max);
        section.Add(((curval - 100000) * 0.07), ((curval - 100000) * 0.09));
        IntMoney = section.Calculate();
    }
        //  50万元至l00万元部分(含100万元)	为6%-8%
    else if (curval > 500000 && curval <= 1000000) {
        var s10 = stage10();
        var s50 = stage50();
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(((curval - 500000) * 0.06), ((curval - 500000) * 0.08));
        IntMoney = section.Calculate();
    }
        //    100万元至500万元部分(含500万元)	为5%-7%
    else if (curval > 1000000 && curval <= 5000000) {
        var s10 = stage10();
        var s50 = stage50();
        var s100 = stage100();
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(((curval - 1000000) * 0.05), ((curval - 1000000) * 0.07));
        IntMoney = section.Calculate();
    }
        //  500万元至1,000万元部分(含1,000万元)	为4%-6%
    else if (curval > 5000000 && curval <= 10000000) {
        var s10 = stage10();
        var s50 = stage50();
        var s100 = stage100();
        var s500 = stage500();
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s500.Min, s500.Max);
        section.Add(((curval - 5000000) * 0.04), ((curval - 5000000) * 0.6));
        IntMoney = section.Calculate();
    }
        //  1,000万元至2,000万元部分(含2,000万元)	为3%-5%
    else if (curval > 10000000 && curval <= 50000000) {
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
        section.Add(((curval - 10000000) * 0.03), ((curval - 10000000) * 0.05));
        IntMoney = section.Calculate();
    }
        //     5,000万元至100,000万元部分(含5,000万元)	为2%-4%
    else if (curval > 50000000 && curval <= 100000000) {
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
        section.Add(((curval - 50000000) * 0.03), ((curval - 50000000) * 0.02));
        IntMoney = section.Calculate();
    }
        //      10,000万元以上部分	为1%-2%
    else if (curval > 100000000 ) {
        var s10 = stage10();
        var s50 = stage50();
        var s100 = stage100();
        var s500 = stage500();
        var s1000 = stage1000();
        var s5000 = stage5000();
        var s10000 = stage10000();
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s500.Min, s500.Max);
        section.Add(s1000.Min, s1000.Max);
        section.Add(s2000.Min, s2000.Max);
        section.Add(s5000.Min, s5000.Max);
        section.Add(s10000.Min, s10000.Max);
        section.Add(((curval - 100000000) * 0.01), ((curval - 100000000) * 0.02));
        IntMoney = section.Calculate();
    }
    if (!important) {

        return IntMoney.Min == 0 ? IntMoney.Max : IntMoney.Min.toFixed(2) + "-" + IntMoney.Max.toFixed(2);
    }
    else {
        return (IntMoney.Min * 5).toFixed(2) + "-" + (IntMoney.Max * 5).toFixed(2);
    }

    /*
    收费额不足5,000元的	每件按5,000元收取
    10万元以下部分(含10万元)	收费比例为8%-10%
    10万元至50万元部分(含50万元)	为7%-9%
    50万元至l00万元部分(含100万元)	为6%-8%
    100万元至500万元部分(含500万元)	为5%-7%
    500万元至1,000万元部分(含1,000万元)	为4%-6%
    1,000万元至2,000万元部分(含2,000万元)	为3%-5%
    2,000万元至5,000万元部分(含5,000万元)	为2%-4%
    5,000万元以上部分	为1%-3%
    */

    //    10万元以下部分(含10万元)	收费比例为8%-10%  收费额不足5,000元的	每件按5,000元收取
    function stage10() {
        if (curval <= 100000) {
            var min = curval * 0.08
            var max = curval * 0.1;
            if (min < 3000) {
                return { Min: 0, Max: 3000 };
            }
            return { Min: min, Max: max };
        } else {
            return { Min: 100000 * 0.07, Max: 100000 * 0.09 };
        }
    }
    //    10万元至50万元部分(含50万元)	为7%-9%
    function stage50() {
        return { Min: 400000 * 0.07, Max: 400000 * 0.09 };
    }
    //    50万元至l00万元部分(含100万元)	为6%-8%
    function stage100() {
        return { Min: 500000 * 0.06, Max: 500000 * 0.08};
    }
    //    100万元至500万元部分(含500万元)	为5%-7%
    function stage500() {
        return { Min: 4000000 * 0.05, Max: 4000000 * 0.07 };
    }
    //     500万元至1,000万元部分(含1,000万元)	为4%-6%
    function stage1000() {
        return { Min: 5000000 * 0.04, Max: 5000000 * 0.06 };
    }
    //    1,000万元至5,000万元部分(含2,000万元)	为3%-5%
    function stage5000() {
        return { Min: 40000000 * 0.03, Max: 40000000 * 0.5 };
    }
    //     5,000万元至10,000万元部分(含5,000万元)	为2%-4%
    function stage10000() {
        return { Min: 50000000 * 0.02, Max: 50000000 * 0.4 };
    }

}
module.exports.RatioFees = RatioFees
exports.TimeArea = TimeArea
exports.TimeFreeTitle = TimeFreeTitle
exports.RiskFreeTitle = RiskFreeTitle
exports.FreeRule = FreeRule
exports.JiJianArr = JiJianArr