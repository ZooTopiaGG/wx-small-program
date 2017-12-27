var TimeArea = { Min: 10, Max: 1000 };
var TimeFreeTitle = "暂无收费标准";
var RiskFreeTitle = "实行风险代理收费，最高收费金额不得高于收费合同约定标的额的30%。";
var FreeRule = "最高不能超过标准规定的3倍";
//计件收费
var JiJianArr = [{
    cases: "刑事案件", desArr: [
        { name: "侦查阶段", price: "1000-3000元/件" },
        { name: "审查起诉阶段", price: "2000-4000元/件" },
        { name: "一审阶段", price: "3000-6000元/件" },
        { name: "未办理一审而办理二审阶段", price: "4000-10000元/件" },
        { name: "办理从一审阶段起两个以上程序的，从第二个程序起", price: "按一审阶段标准减办收费" },
        { name: "刑事附带民事案", price: "按民事案件收费标准收费" },
    ],
    CivilAction: [
        { type: "办理行政诉讼案件、国家赔偿案件、民事诉讼案件、群体性案件、执行案件收费标准、仲裁案件、执行案件收费标准", name: "不涉及财产关系的", price: "1000—2000元/件" },
    ],
    Important: 0 //非重大案件
}, {
    cases: "刑事案件", desArr: [
        { name: "侦查阶段", price: "3000-9000元/件" },
        { name: "审查起诉阶段", price: "6000-12000元/件" },
        { name: "一审阶段", price: "9000-18000元/件" },
        { name: "未办理一审而办理二审阶段", price: "12000-30000元/件" },
        { name: "办理从一审阶段起两个以上程序的，从第二个程序起", price: "按一审阶段标准减办收费" },
        { name: "刑事附带民事案", price: "按民事案件收费标准收费" },
    ],
    CivilAction: [
        { type: "办理行政诉讼案件、国家赔偿案件、民事诉讼案件、群体性案件、执行案件收费标准、仲裁案件、执行案件收费标准", name: "不涉及财产关系的", price: "1000—2000元/件" },
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
@important : 是否重大案件 bool true=是 false= 否 收费标准的3倍收费 , 这里设置最大3
    (1)100，000元以下 4%—6%
    (2)100，001元—500，000元 3.5%—5%
    (3)500，001元—100，000元 3%—4%
    (4)1，000，001元—10，000，000元 2%—3%
    (5)10，000，001元—50，000，000元 1.5%—20%
    (6)50，000，001元—100，000，000元 1%—1.5%
    (7)100，000，001元以上 0.5%
**/
function RatioFees (val, important) {
    //初始化区间算法
    var section = new SectionOper();
    //当前输入的值
    var curval = parseFloat(val);
    var IntMoney = 0;

    //10万元以下(含10万元)　4%—6%
    if (curval <= 10000) {
        IntMoney = stage10();
    }
        //   10万元～50万元(含50万元) 　3.5%—5%
    else if (curval > 100000 && curval <= 500000) {
        var s10 = stage10();
        section.Add(s10.Min, s10.Max);
        section.Add(((curval - 100000) * 0.035), ((curval - 100000) * 0.05));
        IntMoney = section.Calculate();
    }
        //  50万元～100万元(含100万元) 　3%～4%
    else if (curval > 500000 && curval <= 1000000) {
        var s10 = stage10();
        section.Add(s10.Min, s10.Max);
        var s50 = stage50();
        section.Add(s50.Min, s50.Max);
        section.Add(((curval - 500000) * 0.03), ((curval - 500000) * 0.04));
        IntMoney = section.Calculate();
    }
        //  100万元～1000万元(含1000万元)  2%～3%
    else if (curval > 1000000 && curval <= 10000000) {
        var s10 = stage10();
        var s50 = stage50();
        var s100 = stage100();
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(((curval - 1000000) * 0.02), ((curval - 1000000) * 0.03));
        IntMoney = section.Calculate();
    }
        //  1000万元～5000万元(含1000万元)  1.5%—2%
    else if (curval > 10000000 && curval <= 50000000) {
        var s10 = stage10();
        var s50 = stage50();
        var s100 = stage100();
        var s500 = stage500();
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s500.Min, s500.Max);
        section.Add(((curval - 10000000) * 0.015), ((curval - 10000000) * 0.02));
        IntMoney = section.Calculate();
    }
        //  5000万元～1亿元(含1亿元) 　1%—1.5%
    else if (curval > 10000000 && curval <= 50000000) {
        var s10 = stage10();
        var s50 = stage50();
        var s100 = stage100();
        var s500 = stage500();
        section.Add(s10.Min, s10.Max);
        section.Add(s50.Min, s50.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s500.Min, s500.Max);
        section.Add(((curval - 50000000) * 0.01), ((curval - 50000000) * 0.015));
        IntMoney = section.Calculate();
    }
        //     1亿元以上 　　　　　　　　　  0.5%
    else if (curval > 100000000) {
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
        section.Add(((curval - 100000000) * 0.005), ((curval - 100000000) * 0.05));
        IntMoney = section.Calculate();
    }
    if (!important) {

        return IntMoney.Min == 0 ? IntMoney.Max : IntMoney.Min.toFixed(2) + "-" + IntMoney.Max.toFixed(2);
    }
    else {
        return (IntMoney.Min * 3).toFixed(2) + "-" + (IntMoney.Max * 3).toFixed(2);
    }

    /*
    (1)100，000元以下 4%—6%
    (2)100，001元—500，000元 3.5%—5%
    (3)500，001元—100，000元 3%—4%
    (4)1，000，001元—10，000，000元 2%—3%
    (5)10，000，001元—50，000，000元 1.5%—20%
    (6)50，000，001元—100，000，000元 1%—1.5%
    (7)100，000，001元以上 0.5%
    */

    // 1～10万元(含10万元) 　　 4%—6%
    function stage10() {
        return { Min: 100000 * 0.05, Max: 100000 * 0.06 };
    }
    // 10万元～50万元(含50万元) 　3.5%—5%
    function stage50() {
        return { Min: (500000 - 100000) * 0.035, Max: (500000 - 100000) * 0.05 };
    }
    //  50万元～100万元(含100万元) 　3%～4%
    function stage100() {
        return { Min: (1000000 - 500000) * 0.03, Max: (1000000 - 500000) * 0.04 };
    }
    // 100万元～1000万元(含1000万元)  2%～3%
    function stage1000() {
        return { Min: (10000000 - 1000000) * 0.02, Max: (10000000 - 1000000) * 0.03 };
    }
    // 1000万元～5000万元(含1000万元)  1.5%—2%
    function stage5000() {
        return { Min: (50000000 - 10000000) * 0.015, Max: (50000000 - 10000000) * 0.02 };
    }
    //  5000万元～1亿元(含1亿元) 　1%—1.5%
    function stage1e() {
        return { Min: (100000000 - 50000000) * 0.01, Max: (100000000 - 50000000) * 0.015 };
    }

}

module.exports.RatioFees = RatioFees
exports.TimeArea = TimeArea
exports.TimeFreeTitle = TimeFreeTitle
exports.RiskFreeTitle = RiskFreeTitle
exports.FreeRule = FreeRule
exports.JiJianArr = JiJianArr