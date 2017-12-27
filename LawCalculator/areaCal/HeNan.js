var TimeArea = { Min: 1, Max: 1 };
var TimeFreeTitle = "100元-3000元/有效工作小时";
var RiskFreeTitle = "风险代理收费的金额不得高于收费合同约定标的的30%。";
var FreeRule = "收费标准的5倍计算";
//计件收费
var JiJianArr = [{
    cases: "刑事案件", desArr: [
        { name: "侦查阶段", price: "3000-15000元/件" },
        { name: "审查起诉阶段", price: "5000-20000元/件" },
        { name: "审判阶段", price: "5000-30000元/件" },
        { name: "刑事自诉案件代理或刑事案件被害人代理", price: "5000-30000元/件" }
    ],
    CivilAction: [
        { type: "民事、行政诉讼案件", name: "立案", price: "2000-10000元/件" },
        { type: "行政案件", name: "立案", price: "3000-20000元/件" }
    ],
    Important: 0 //非重大案件
}, {
    cases: "刑事案件", desArr: [
        { name: "侦查阶段", price: "15000-75000元/件" },
        { name: "审查起诉阶段", price: "25000-100000元/件" },
        { name: "审判阶段", price: "25000-150000元/件" },
        { name: "刑事自诉案件代理或刑事案件被害人代理", price: "25000-150000元/件" }
    ],
    CivilAction: [
        { type: "民事、行政诉讼案件", name: "立案", price: "10000-50000元/件" },
        { type: "行政案件", name: "立案", price: "15000-100000元/件" }
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
 10万元以下部分（含10万元），收费3000-5000元；
 10万元至100万元部分（含100万元），3-5%；
 100万元至1000万元部分（含1000万元），2-4%；
 1000万元至5000万元部分（含5000万元），1-3%；
 5000万元以上部分， 0.5—2%。      
 */



function RatioFees (val, important) {

    //当前输入的值
    //初始化区间算法
    var section = new SectionOper();
    var curval = parseFloat(val);
    var IntMoney = 0;

    //  10万元以下部分（含10万元），收费3000-5000元；
    if (curval <= 100000) {
        IntMoney = stage();
    }
        //   10万元至100万元部分（含100万元），3-5%；
    else if (curval > 100000 && curval <= 1000000) {
        var s1 = stage();
        section.Add(s1.Min, s1.Max);
        section.Add(((curval - 100000) * 0.03), ((curval - 100000) * 0.05));
        IntMoney = section.Calculate();
    }
        //100万元至1000万元部分（含1000万元），2-4%；
    else if (curval > 1000000 && curval <= 10000000) {
        var s1 = stage();
        var s10 = stage10();
        section.Add(s1.Min, s1.Max);
        section.Add(s10.Min, s10.Max);
        section.Add(((curval - 1000000) * 0.02), ((curval - 1000000) * 0.04));
        IntMoney = section.Calculate();
    }
        // 1000万元至5000万元部分（含5000万元），1-3%；
    else if (curval > 10000000 && curval <= 50000000) {
        var s1 = stage();
        var s10 = stage10();
        var s100 = stage100();
        section.Add(s1.Min, s1.Max);
        section.Add(s10.Min, s10.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(((curval - 10000000) * 0.01), ((curval - 10000000) * 0.03));
        IntMoney = section.Calculate();
    }
        // 5000万元以上部分， 0.5—2%。   
    else if (curval > 50000000) {
        var s1 = stage();
        var s10 = stage10();
        var s100 = stage100();
        var s1000 = stage1000();
        section.Add(s1.Min, s1.Max);
        section.Add(s10.Min, s10.Max);
        section.Add(s100.Min, s100.Max);
        section.Add(s1000.Min, s1000.Max);
        section.Add(((curval - 50000000) * 0.005), ((curval - 50000000) * 0.02));
        IntMoney = section.Calculate();
    }
    if (!important) {
        return IntMoney.Min == 0 ? IntMoney.Max : IntMoney.Min.toFixed(2) + "-" + IntMoney.Max.toFixed(2);
    }
    else {
        return (IntMoney.Min * 5).toFixed(2) + "-" + (IntMoney.Max * 5).toFixed(2);
    }
    //    10万元以下部分（含10万元），收费3000-5000元；
    function stage() {

        return { Min: 3000, Max: 5000 };
    }
    //    10万元至100万元部分（含100万元），3-5%；
    function stage10() {
        return { Min: 900000 * 0.03, Max: 900000 * 0.05 };
    }
    //100万元至1000万元部分（含1000万元），2-4%；
    function stage100() {
        return { Min: 9000000 * 0.02, Max: 9000000 * 0.04 };
    }

    //    1000万元至5000万元部分（含5000万元），1-3%；
    function stage1000() {
        return { Min: 40000000 * 0.01, Max: 40000000 * 0.03 };
    }

   

}

module.exports.RatioFees = RatioFees
exports.TimeArea = TimeArea
exports.TimeFreeTitle = TimeFreeTitle
exports.RiskFreeTitle = RiskFreeTitle
exports.FreeRule = FreeRule
exports.JiJianArr = JiJianArr