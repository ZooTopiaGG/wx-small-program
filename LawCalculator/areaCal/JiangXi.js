var TimeArea = { Min: 50, Max: 1000 };
var TimeFreeTitle = "政府指导价50—1000元/小时";
var RiskFreeTitle = "风险代理收费的金额不得高于收费合同约定标的的10%-30%。";
var FreeRule = "收费标准的5倍计算";
//计件收费
var JiJianArr = [{
    cases: "刑事案件", desArr: [
        { name: "侦查阶段", price: "800--5000元/件" },
        { name: "审查起诉阶段", price: "800--5000元/件" },
        { name: "审判阶段", price: "1600--15000元/件" },
        { name: "未办一审而办二审的案件", price: "600--8000元/件" },
        { name: "曾办一审又办二审的案件", price: "1000--5000元/件" }
    ],
    CivilAction: [
        { type: "民事、行政诉讼、行政复议、国家赔偿案件", name: "不涉及财产", price: "1000--6000/件" }
    ],
    Important: 0 //非重大案件
}, {
    cases: "刑事案件", desArr: [
      { name: "侦查阶段", price: "4000--25000元/件" },
        { name: "审查起诉阶段", price: "4000--25000元/件" },
        { name: "审判阶段", price: "8000--75000元/件" },
        { name: "未办一审而办二审的案件", price: "30000-40000元/件" },
        { name: "曾办一审又办二审的案件", price: "5000--25000元/件" }
    ],
    CivilAction: [
       { type: "民事、行政诉讼、行政复议、国家赔偿案件", name: "不涉及财产", price: "3000--18000/件" }
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
    50，000元 以下免收
    50，001至100，000元 1.5%--5%
    100，001元至1，000，000元 1.2%--4%
    1，000，001元至5，000，000元 1%--3%
    5，000，001元至10，000，000元 0.5%--2%
    10，000，001元至50，000，000元 0.2%--1.5%
    50，000，001元以上部分 0.1--1%
**/
function RatioFees (val, important) {
    //初始化区间算法
    var section = new SectionOper();
    //当前输入的值
    var curval = parseFloat(val);
    var IntMoney = 0;
    if (curval <= 50000) {
        IntMoney = 0;
    }
        //  50，001至100，000元 1.5%--5%
    else if (curval > 50000 && curval <= 100000) {
        var s10 = stage10();
        section.Add(s10.Min, s10.Max);
        IntMoney = section.Calculate();
    }
        // 100，001元至1，000，000元 1.2%--4%
    else if (curval > 100000 && curval <= 1000000) {
        var s10 = stage10();
        section.Add(s10.Min, s10.Max);
        section.Add(((curval - 100000) * 0.012), ((curval - 100000) * 0.04));
        IntMoney = section.Calculate();
    }
        //  1，000，001元至5，000，000元 1%--3%
    else if (curval > 1000000 && curval <= 5000000) {
        var s10 = stage10();
        var s100 = stage100();
        section.Add(s10.Min, s10.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(((curval - 1000000) * 0.01), ((curval - 1000000) * 0.03));
        IntMoney = section.Calculate();
    }
        //  5，000，001元至10，000，000元 0.5%--2%
    else if (curval > 5000000 && curval <= 10000000) {
        var s10 = stage10();
        var s100 = stage100();
        var s500 = stage500();
        section.Add(s10.Min, s10.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s500.Min, s500.Max);
        section.Add(((curval - 5000000) * 0.005), ((curval - 5000000) * 0.02));
        IntMoney = section.Calculate();
    }

   // 10，000，001元至50，000，000元 0.2%--1.5%
    else if (curval > 10000000 && curval <= 50000000) {
        var s10 = stage10();
        var s100 = stage100();
        var s500 = stage500();
        section.Add(s10.Min, s10.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s500.Min, s500.Max);
        section.Add(((curval - 10000000) * 0.002), ((curval - 10000000) * 0.015));
        IntMoney = section.Calculate();
    }
        // 50，000，001元以上部分 0.1--1%
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
    if (IntMoney == 0)
    {
        return 0;
    }
    if (!important) {

        return IntMoney.Min == 0 ? IntMoney.Max : IntMoney.Min.toFixed(2) + "-" + IntMoney.Max.toFixed(2);
    }
    else {
        
        return (IntMoney.Min * 5).toFixed(2) + "-" + (IntMoney.Max * 5).toFixed(2);
    }

    /*
     50，000元 以下免收
    50，001至100，000元 1.5%--5%
    100，001元至1，000，000元 1.2%--4%
    1，000，001元至5，000，000元 1%--3%
    5，000，001元至10，000，000元 0.5%--2%
    10，000，001元至50，000，000元 0.2%--1.5%
    50，000，001元以上部分 0.1--1%
    */

    // 50，001至100，000元 1.5%--5%
    function stage10() {
        return { Min: 50000 * 0.015, Max: 50000 * 0.05 };
    }
    // 10万元-100万元	 1.2%--4%
    function stage100() {
        return { Min: 900000 * 0.012, Max: 900000 * 0.04 };
    }
    //    100万元-500万元	1%--3%
    function stage500() {
        return { Min: 4000000 * 0.01, Max: 4000000 * 0.03 };
    }
    //   500万元-1000万元	0.5%--2%
    function stage1000() {
        return { Min: 5000000 * 0.005, Max: 5000000 * 0.02 };
    }
    //   1000万元-5000万元	0.2%--1.5%
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