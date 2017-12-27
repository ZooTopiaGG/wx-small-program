var TimeArea = { Min: 1, Max: 2000 };
var TimeFreeTitle = "计时收费的标准为300元-3,000元/小时";
var RiskFreeTitle = "实行风险代理收费，最高收费金额不得高于收费合同约定标的额的30%。";
var FreeRule = "最高不能超过标准规定的5倍";
//计件收费
var JiJianArr = [{
    cases: "", desArr: [
        // { name: "侦查阶段", price: "不超过3000元/件" },
        // { name: "起诉阶段", price: "不超过4000元/件" },
        // { name: "审判阶段", price: "不超过20000元/件" },
        // { name: "代理申请取保候审", price: "不超过1500元/件" },
    ],
    CivilAction: [
        { type: "民事诉讼、仲裁案件", name: "不涉及财产关系", price: "5000-30000元/件" },
        // { type: "行政诉讼案件", name: "收费", price: "不超过5000元/件" },
    ],
    Important: 0 //非重大案件
}, {
    cases: "", desArr: [
        // { name: "侦查阶段", price: "不超过15000元/件" },
        // { name: "起诉阶段", price: "不超过12000元/件" },
        // { name: "审判阶段", price: "不超过60000元/件" },
        // { name: "代理申请取保候审", price: "不超过7500元/件" },
    ],
    CivilAction: [
        { type: "民事诉讼、仲裁案件", name: "不涉及财产关系", price: "25000-150000元/件" },
        // { type: "行政诉讼案件", name: "收费", price: "不超过25000元/件" },
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
    10万元以下（含10万元）	6.00%
    10万元-50万元(含50万元)	5.00%
    50万元-100万元(含100万元)	4.00%
    100万元-500万元(含500万元)	3.00%
    500万元-1000万元(含1000万元)	2.00%
    1000万元-5000万元（含5000万元）	1.50%
    5000万元以上	1.00%
**/
function RatioFees (val, important) {

    //当前输入的值
    var curval = parseFloat(val);
    var IntMoney = 0;
    if (curval <= 100000) {
        IntMoney = parseFloat(stage10());
    }
        // 10万元-50万元(含50万元)	4.20%
    else if (curval > 100000 && curval <= 500000) {
        IntMoney += parseFloat(stage10()) + parseFloat(((curval - 100000) * 0.042));
    }
        // 50万元-100万元(含100万元)	4.00%
    else if (curval > 500000 && curval <= 1000000) {
        IntMoney += parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(((curval - 500000) * 0.04));
    }
        //  100万元-500万元(含500万元)	3.00%
    else if (curval > 1000000 && curval <= 5000000) {
        IntMoney += parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(((curval - 1000000) * 0.03));
    }
        // 500万元-1000万元(含1000万元)	2.00%
    else if (curval > 5000000 && curval <= 10000000) {

        IntMoney += parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(stage500()) + parseFloat(((curval - 5000000) * 0.02));
    }
        // 1000万元-2000万元（含5000万元）	1.50%
    else if (curval > 10000000 && curval <= 20000000) {
        IntMoney += parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(stage500()) + parseFloat(stage1000()) + parseFloat(((curval - 10000000) * 0.012));
    }
        // 2000万元-5000万元（含5000万元）	1.50%
    else if (curval > 20000000 && curval <= 50000000) {
        IntMoney += parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(stage500()) + parseFloat(stage1000()) + parseFloat(stage2000()) + parseFloat(((curval - 10000000) * 0.01));
    }

        //  5000万元以上	1.00%
    else if (curval > 50000000) {
        IntMoney += parseFloat(stage10()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(stage500()) + parseFloat(stage1000()) + parseFloat(stage2000()) + parseFloat(stage5000()) + parseFloat(((curval - 50000000) * 0.01));
    }
    if (!important) {
        return IntMoney;
    }
    else {
        //刑事案件因时间或地域跨度极大、属集团犯罪和其他案情重大的、复杂的，但最高不得超过前述最高标准的5倍
        return IntMoney * 5;
    }
 
    //  10万元以下（含10万元）	6.00%
    function stage10() {
        if (curval <= 100000) {
            if (curval * 0.05 < 5000) {
                return 5000;
            } else {
                return curval * 0.05;
            }
        } else {
            return 100000 * 0.06;
        }
    }
    // 10万元-50万元(含50万元)	4.20%
    function stage50() {
        return 400000 * 0.042;
    }
    //50万元-100万元(含100万元)	4.00%
    function stage100() {
        return 500000 * 0.04;
    }
    //  100万元-500万元(含500万元)	3.00%
    function stage500() {
        return 4000000 * 0.03;
    }
    //  500万元-1000万元(含1000万元)	2.00%
    function stage1000() {
        return 5000000 * 0.02;
    }
    // 1000万元-2000万元（含2000万元）	1.20%
    function stage2000() {
        return 10000000 * 0.012;
    }
    // 2000万元-5000万元（含2000万元）	1.00%
    function stage5000() {
        return 30000000 * 0.01;
    }

}

module.exports.RatioFees = RatioFees
exports.TimeArea = TimeArea
exports.TimeFreeTitle = TimeFreeTitle
exports.RiskFreeTitle = RiskFreeTitle
exports.FreeRule = FreeRule
exports.JiJianArr = JiJianArr