var TimeArea = { Min: 50, Max: 1000 };
var TimeFreeTitle = "500-2000元/小时";
var RiskFreeTitle = "实行风险代理收费，最高收费金额不得高于收费合同约定标的额的30%。";
var FreeRule = "最高不能超过标准规定的5倍";
//计件收费
var JiJianArr = [{
    cases: "刑事案件", desArr: [
        { name: "侦查阶段", price: "3000-30000元/件" },
        { name: "起诉阶段", price: "5000-50000元/件" },
        { name: "一审阶段", price: "5000-50000元/件" },
        { name: "办理死刑复核案件", price: "20000-30000元/件，但曾办理一审或二审的案件，按此标准酌减收费;" },
        { name: "担任刑事自诉案件的原告或公诉案件被害人的代理人参加诉讼的，不涉及财产关系的", price: "5000-30000元/件" },
        { name: "刑事附带民事案,涉及财产犯罪", price: "按民事案件收费标准收费" },
    ],
    CivilAction: [
        { type: "不涉及财产关系的行政案件", name: "收费", price: "1000-20000元/件" },
        { type: "不涉及财产关系的民事案件", name: "收费", price: "1000-20000元/件" },
        { type: "代理各类诉讼案件的再审(申诉)案件", name: "未办一审只办二审,代理再审(申诉),曾办一审又办二审案件", price: "按一审标准收费,代理再审(申诉)案件后发回重审的案件,按一审或二审收费标准的50%收费" },
        { type: "代理执行案件", name: "收费", price: "单独代理执行案件，按一审标准收费，曾代理一审、二审或再审(申诉)案件，再代理执行案件，按一审标准的50%收费。" }
    ],
    Important: 0 //非重大案件
}, {
    cases: "刑事案件", desArr: [
         { name: "侦查阶段", price: "15000-150000元/件" },
         { name: "起诉阶段", price: "25000-250000元/件" },
         { name: "一审阶段", price: "25000-250000元/件" },
         { name: "办理死刑复核案件", price: "100000-150000元/件，但曾办理一审或二审的案件，按此标准酌减收费;" },
         { name: "担任刑事自诉案件的原告或公诉案件被害人的代理人参加诉讼的，不涉及财产关系的", price: "25000-150000元/件" },
         { name: "刑事附带民事案,涉及财产犯罪", price: "按民事案件收费标准收费" },
    ],
    CivilAction: [
        { type: "不涉及财产关系的行政案件", name: "收费", price: "5000-100000元/件" },
        { type: "不涉及财产关系的民事案件", name: "收费", price: "5000-100000元/件" },
        { type: "代理各类诉讼案件的再审(申诉)案件", name: "未办一审只办二审,代理再审(申诉),曾办一审又办二审案件", price: "按一审标准收费,代理再审(申诉)案件后发回重审的案件,按一审或二审收费标准的50%收费" },
        { type: "代理执行案件", name: "收费", price: "单独代理执行案件，按一审标准收费，曾代理一审、二审或再审(申诉)案件，再代理执行案件，按一审标准的50%收费。" }
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
    1万元以下(含1万元)　　　　　　　收取办案手续费500-2000元
    1～10万元(含10万元) 　　 　　　　　　 5%～6%
    10万元～50万元(含50万元) 　　　　　　 4%～5%
    50万元～100万元(含100万元) 　　　　 3%～4%
    100万元～500万元(含500万元) 　　　　 　2%～3%
    500万元～1000万元(含1000万元) 　　 　　1%～2%
    1000万元以上 　　　　　　　　　 0.5%～1%
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
        //    1～10万元(含10万元) 　　 　　　　　　 8%～9%
    else if (curval > 10000 && curval <= 100000) {
        var s1 = stage1();
        section.Add(s1.Min, s1.Max);
        section.Add(((curval - 10000) * 0.08), ((curval - 10000) * 0.09));
        IntMoney = section.Calculate();
    }
        //   10万元～50万元(含50万元) 　　　　　　 6%～8%
    else if (curval > 100000 && curval <= 500000) {
        var s1 = stage1();
        var s10 = stage10();
        section.Add(s1.Min, s1.Max);
        section.Add(s10.Min, s10.Max);
        section.Add(((curval - 100000) * 0.06), ((curval - 100000) * 0.08));
        IntMoney = section.Calculate();
    }
        //  50万元～100万元(含100万元) 　　　　 4%～6%
    else if (curval > 500000 && curval <= 1000000) {
        var s1 = stage1();
        section.Add(s1.Min, s1.Max);
        var s10 = stage10();
        section.Add(s10.Min, s10.Max);
        var s50 = stage50();
        section.Add(s50.Min, s50.Max);
        section.Add(((curval - 500000) * 0.04), ((curval - 500000) * 0.06));
        IntMoney = section.Calculate();
    }
        //  100万元～500万元(含500万元) 　　　　 　2%～4%
    else if (curval > 1000000 && curval <= 5000000) {
        var s1 = stage1();
        section.Add(s1.Min, s1.Max);
        var s10 = stage10();
        var s50 = stage50();
        var s100 = stage100();
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(((curval - 1000000) * 0.02), ((curval - 1000000) * 0.04));
        IntMoney = section.Calculate();
    }
        //   500万元～1000万元(含1000万元) 　　 　　1%～2%
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
        //     1000万元以上 　　　　　　　　　 0.5%～1%
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
        return (IntMoney.Min * 5).toFixed(2) + "-" + (IntMoney.Max * 5).toFixed(2);
    }

    // 1万元以下(含1万元)　　　收取办案手续费500-2000元
    function stage1() {
        return { Min: 1000, Max: 3000 };
    }
    // 1～10万元(含10万元) 　　 8%～9%
    function stage10() {
        return { Min: (100000 - 10000) * 0.08, Max: (100000 - 10000) * 0.09 };
    }
    // 10万元～50万元(含50万元) 　4%～5%
    function stage50() {
        return { Min: (500000 - 100000) * 0.06, Max: (500000 - 100000) * 0.08 };
    }
    //  50万元～100万元(含100万元) 　3%～4%
    function stage100() {
        return { Min: (1000000 - 500000) * 0.04, Max: (1000000 - 500000) * 0.06 };
    }
    // 100万元～500万元(含500万元)  2%～3%
    function stage500() {
        return { Min: (5000000 - 1000000) * 0.02, Max: (5000000 - 1000000) * 0.04 };
    }
    //  500万元～1000万元(含1000万元) 　1%～2%
    function stage1000() {
        return { Min: (10000000 - 5000000) * 0.01, Max: (10000000 - 5000000) * 0.02 };
    }

}

module.exports.RatioFees = RatioFees
exports.TimeArea = TimeArea
exports.TimeFreeTitle = TimeFreeTitle
exports.RiskFreeTitle = RiskFreeTitle
exports.FreeRule = FreeRule
exports.JiJianArr = JiJianArr