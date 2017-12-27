var TimeArea = { Min: 10, Max: 5000 };
var TimeFreeTitle = "暂未收集到政府指导价";
var RiskFreeTitle = "风险代理收费的金额不得高于收费合同约定标的的30%。";
var FreeRule = "不低于基础标准";
//计件收费
var JiJianArr = [{
    cases: "刑事案件", desArr: [
        { name: "侦查阶段,提供法律咨询", price: "50—500元/件" },
        { name: "侦查阶段,代理起诉和控告", price: "30—3000元/件" },
        { name: "侦查阶段,申请取保候审", price: "1000元/件" },
        { name: "审查起诉阶段", price: "500—5000元/件" },
        { name: "审判阶段", price: "1000—5000元/件" },
        { name: "担任刑事案件自诉人代理人的", price: "500—5000元/件" },
        { name: "担任被害人代理人", price: "500—2000元/件" },
        { name: "代理刑事案件申诉", price: "50—2000元/件" }
    ],
    CivilAction: [
        { type: "民事、经济诉讼或仲裁案件", name: "不涉及财产关系", price: "1000-2000元/件，代理民事案件申诉的：每件收取50-2000元" },
        { type: "行政诉讼", name: "不涉及财产关系", price: "每件收取500-5000元，代理行政案件申诉的：每件收取50-2000元" }
    ],
    Important: 0 //非重大案件
}, {
    cases: "刑事案件", desArr: [
        { name: "侦查阶段,提供法律咨询", price: "不低于50—500元/件" },
        { name: "侦查阶段,代理起诉和控告", price: "不低于30—3000元/件" },
        { name: "侦查阶段,申请取保候审", price: "不低于1000元/件" },
        { name: "审查起诉阶段", price: "不低于500—5000元/件" },
        { name: "审判阶段", price: "不低于1000—5000元/件" },
        { name: "担任刑事案件自诉人代理人的", price: "不低于500—5000元/件" },
        { name: "担任被害人代理人", price: "不低于500—2000元/件" },
        { name: "代理刑事案件申诉", price: "不低于50—2000元/件" }
    ],
    CivilAction: [
        { type: "民事、经济诉讼或仲裁案件", name: "不涉及财产关系", price: "不低于1000-2000元/件，代理民事案件申诉的：每件收取不低于50-2000元" },
        { type: "行政诉讼", name: "不涉及财产关系", price: "每件收取不低于500-5000元，代理行政案件申诉的：每件收取不低于50-2000元" }
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
@important : 是否重大案件 bool true=是 false= 否 收费标准不低于基本标准
    1万元以下 500-2000元
    10001元至100000元以下 5%
    100001元至500000元部分 4%
    500001元至 1000000元部分 3%
    100000l元至5000000元部分 2%
    500o00l元至10000000元部分 1%
    10000001元以上 0.5%
**/
function RatioFees (val, important) {
    //初始化区间算法
    var section = new SectionOper();
    //当前输入的值
    var curval = parseFloat(val);
    var IntMoney = 0;

    //1万元以下(含1万元)　　　收取办案手续费500-2000元
    if (curval <= 10000) {
        IntMoney = stage1();
    }
        //    1～10万元(含10万元) 　　 　　　　　　 5%
    else if (curval > 10000 && curval <= 100000) {
        var s1 = stage1();
        section.Add(s1.Min, s1.Max);
        section.Add(((curval - 10000) * 0.05), ((curval - 10000) * 0.06));
        IntMoney = section.Calculate();
    }
        //   10万元～50万元(含50万元) 　　　　　　 4%
    else if (curval > 100000 && curval <= 500000) {
        var s1 = stage1();
        var s10 = stage10();
        section.Add(s1.Min, s1.Max);
        section.Add(s10.Min, s10.Max);
        section.Add(((curval - 100000) * 0.04), ((curval - 100000) * 0.05));
        IntMoney = section.Calculate();
    }
        //  50万元～100万元(含100万元) 　　　　 3%
    else if (curval > 500000 && curval <= 1000000) {
        var s1 = stage1();
        section.Add(s1.Min, s1.Max);
        var s10 = stage10();
        section.Add(s10.Min, s10.Max);
        var s50 = stage50();
        section.Add(s50.Min, s50.Max);
        section.Add(((curval - 500000) * 0.03), ((curval - 500000) * 0.04));
        IntMoney = section.Calculate();
    }
        //  100万元～500万元(含500万元) 　　　　 　2%
    else if (curval > 1000000 && curval <= 5000000) {
        var s1 = stage1();
        section.Add(s1.Min, s1.Max);
        var s10 = stage10();
        var s50 = stage50();
        var s100 = stage100();
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(((curval - 1000000) * 0.02), ((curval - 1000000) * 0.03));
        IntMoney = section.Calculate();
    }
        //   500万元～1000万元(含1000万元) 　　 　　1%
    else if (curval > 5000000 && curval <= 10000000) {
        var s1 = stage1();
        section.Add(s1.Min, s1.Max);
        var s10 = stage10();
        var s50 = stage50();
        var s100 = stage100();
        var s500 = stage500();
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s500.Min, s500.Max);
        section.Add(((curval - 5000000) * 0.01), ((curval - 5000000) * 0.02));
        IntMoney = section.Calculate();
    }
        //     1000万元以上 　　　　　　　　　 0.5%
    else if (curval > 10000000) {
        var s1 = stage1();
        section.Add(s1.Min, s1.Max);
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
        section.Add(((curval - 10000000) * 0.005), ((curval - 10000000) * 0.01));
        IntMoney = section.Calculate();
    }
    if (!important) {

        return IntMoney.Min == 0 ? IntMoney.Max : IntMoney.Min.toFixed(2) + "-" + IntMoney.Max.toFixed(2);
    }
    else {
        return "不低于" + (IntMoney.Min).toFixed(2) + "-" + (IntMoney.Max).toFixed(2);
    }

    /*
    1万元以下 500-2000元
    10001元至100000元以下 5%
    100001元至500000元部分 4%
    500001元至 1000000元部分 3%
    100000l元至5000000元部分 2%
    500o00l元至10000000元部分 1%
    10000001元以上 0.5%
    */

    // 1万元以下(含1万元)　　　收取办案手续费500-2000元
    function stage1() {
        return { Min: 500, Max: 2000 };
    }
    // 1～10万元(含10万元) 　　 5%
    function stage10() {
        return { Min: (100000 - 10000) * 0.05, Max: (100000 - 10000) * 0.05 };
    }
    // 10万元～50万元(含50万元) 　4%
    function stage50() {
        return { Min: (500000 - 100000) * 0.04, Max: (500000 - 100000) * 0.04 };
    }
    //  50万元～100万元(含100万元) 　3%
    function stage100() {
        return { Min: (1000000 - 500000) * 0.03, Max: (1000000 - 500000) * 0.03 };
    }
    // 100万元～500万元(含500万元)  2%
    function stage500() {
        return { Min: (5000000 - 1000000) * 0.02, Max: (5000000 - 1000000) * 0.02 };
    }
    //  500万元～1000万元(含1000万元) 　1%
    function stage1000() {
        return { Min: (10000000 - 5000000) * 0.01, Max: (10000000 - 5000000) * 0.01 };
    }

}

module.exports.RatioFees = RatioFees
exports.TimeArea = TimeArea
exports.TimeFreeTitle = TimeFreeTitle
exports.RiskFreeTitle = RiskFreeTitle
exports.FreeRule = FreeRule
exports.JiJianArr = JiJianArr