var TimeArea = { Min: 200, Max: 3000 };
var TimeFreeTitle = " ";
var RiskFreeTitle = "风险代理收费的金额不得高于收费合同约定标的的30%。";
var FreeRule = "收费标准的3倍计算";
//计件收费
var JiJianArr = [{
    cases: "刑事案件", desArr: [
        { name: "侦查阶段", price: "3000元/件;可以下浮，但每件不低于300元" },
        { name: "审查起诉阶段", price: "5000元/件;可以下浮，但每件不低于500元" },
        { name: "审判阶段", price: "6000元/件;可以下浮，但每件不低于600元" },
      { name: "办理自诉案件", price: "5000元/件;可以下浮，但每件不低于500元" },
    ],
    CivilAction: [
        { type: "民事、行政诉讼案件", name: "立案", price: "6000元/件。可以下浮，但每件不低于600元" }
    ],
    Important: 0 //非重大案件
}, {
    cases: "刑事案件", desArr: [
         { name: "侦查阶段", price: "9000元/件;可以下浮，但每件不低于300元" },
        { name: "审查起诉阶段", price: "15000元/件;可以下浮，但每件不低于500元" },
        { name: "审判阶段", price: "18000元/件;可以下浮，但每件不低于600元" },
      { name: "办理自诉案件", price: "15000元/件;可以下浮，但每件不低于500元" },
    ],
    CivilAction: [
       { type: "民事、行政诉讼案件", name: "立案", price: "18000元/件。可以下浮，但每件不低于600元" }
    ]
    ,
    Important: 1 //重大案件
}];


/**
RatioFees ：比例收费
@val : 输入金额,
@important : 是否重大案件 bool true=是 false= 否 收费标准的3倍收费 , 这里设置最大3
   10万元(含10万元)以下 5.5%
100001元—200000元的部分 5%
200001元—500000元的部分 4.5%
500001元—1000000元的部分 3.5%
1000001元—2000000元的部分 3%
2000001元—5000000元的部分 2%
5000001元以上 1%
**/
function RatioFees (val, important) {

    //当前输入的值
    var curval = parseFloat(val);
    var IntMoney = 0;
    if (curval <= 100000) {
        IntMoney = parseFloat(stage10());
    }
        // 100001元—200000元的部分 5%
    else if (curval > 100001 && curval <= 200000) {
        IntMoney += parseFloat(stage10()) + parseFloat(((curval - 100001) * 0.05));
    }
        // 200001元—500000元的部分 4.5%
    else if (curval > 200001 && curval <= 500000) {
        IntMoney += parseFloat(stage10()) + parseFloat(stage20()) + parseFloat(((curval - 200001) * 0.045));
    }
        // 500001元—1000000元的部分 3.5%
    else if (curval > 500001 && curval <= 1000000) {
        IntMoney += parseFloat(stage10()) + parseFloat(stage20()) + parseFloat(stage50()) + parseFloat(((curval - 500001) * 0.035));
    }
        // 1000001元—2000000元的部分 3%
    else if (curval > 1000001 && curval <= 2000000) {

        IntMoney += parseFloat(stage10()) + parseFloat(stage20()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(((curval - 1000001) * 0.03));
    }
        // 2000001元—5000000元的部分 2%
    else if (curval > 2000001 && curval <= 5000000) {
        IntMoney += parseFloat(stage10()) + parseFloat(stage20()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(stage200()) + parseFloat(((curval - 2000001) * 0.02));
    }
        //  500万元以上	1.00%
    else if (curval > 5000000) {
        IntMoney += parseFloat(stage10()) + parseFloat(stage20()) + parseFloat(stage50()) + parseFloat(stage100()) + parseFloat(stage200()) + parseFloat(stage500()) + parseFloat(((curval - 5000000) * 0.01));
    }

    if (!important) {
        return IntMoney;
    }
    else {
        //刑事案件因时间或地域跨度极大、属集团犯罪和其他案情重大的、复杂的，但最高不得超过前述最高标准的5倍
        return IntMoney * 3;
    }

    // 10万元(含10万元)以下 5.5%
    function stage10() {
        if (curval <= 100000) {
            return curval * 0.055;
        } else {
            return 100000 * 0.055;
        }
    }
    //  100001元—200000元的部分 5%
    function stage20() {
        return 99999 * 0.05;
    }
    // 200001元—500000元的部分 4.5%
    function stage50() {
        return 299999 * 0.045;
    }
    //  500001元—1000000元的部分 3.5%
    function stage100() {
        return 499999 * 0.035;
    }
    //   1000001元—2000000元的部分 3%
    function stage200() {
        return 999999 * 0.03;
    }
    //  2000001元—5000000元的部分 2%
    function stage500() {
        return 2999999 * 0.02;
    }

}

module.exports.RatioFees = RatioFees
exports.TimeArea = TimeArea
exports.TimeFreeTitle = TimeFreeTitle
exports.RiskFreeTitle = RiskFreeTitle
exports.FreeRule = FreeRule
exports.JiJianArr = JiJianArr