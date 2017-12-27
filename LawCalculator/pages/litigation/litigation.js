var that

Page({
  data:{
    result: null,
    chooseCate: '',
    money: '',
    isShowActionSheet: false,
    currentTab: 1,
    litigation_cate: '---请选择诉讼受理费类型---' ,

    cate: [],
    
    cate1: ["离婚案件", "侵害人格权案件", "知识产权案件", "其他非财产案件" ,
    "财产案件" ,"劳动争议案件", "商标、专利、海事行政案件", "其他行政案件", "管辖权异议"],
    
    cate2: ["申请执行", "申请财产保全", "申请支付令", "申请公示催告" ,
    "申请撤销仲裁裁决或者认定仲裁协议效力" ,"申请破产", "申请设立海事赔偿责任限制基金", 
    "申请海事强制令", "申请海事债权登记", "申请共同海损理算"],

    desc: '请选择诉讼受理费类型'
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    that = this;

    var list
    var cate = that.data.currentTab
    if (cate == 1) {
      list = that.data.cate1
    } else if (cate == 2) {
      list = that.data.cate2
    }
    that.setData({
        cate: list
    })
  },

  tab1: function() {
    if (that.data.currentTab == 2) {
      that.setData({
        chooseCate: '',
      })
    }
    that.setData({
      currentTab: 1,
      cate: that.data.cate1,
      desc: '请选择诉讼受理费类型'
    })
  },

  tab2: function() {
    if (that.data.currentTab == 1) {
      that.setData({
        chooseCate: ''
      })
    }
    that.setData({
      currentTab: 2,
      cate: that.data.cate2,
      desc: '请选择诉讼申请费类型'
    })
  },

//   chooseCate: function() {
//     var tab = that.data.currentTab;
//     if (tab == 1) {
//       that.showAction(1)
//     } else if (tab == 2) {
//       that.showAction(2)
//     }
//   },

  bindCatePickerChange: function(e) {
      var index = e.detail.value
      that.setData({
        chooseCate: that.data.cate[index]
      })
  },

//   showAction: function(cate) {
//     var list
//     if (cate == 1) {
//       list = that.data.cate1
//     } else if (cate == 2) {
//       list = that.data.cate2
//     }
//     that.setData({
//       isShowActionSheet: true,
//       cate: list
//     })
//   },

//   chooseType: function(e) {
//     var cate = e.target.id;
//     that.setData({
//       isShowActionSheet: false,
//       chooseCate: cate
//     })
//   },

  Calculate: function() {
    var tab = that.data.currentTab
    var money = that.data.money
    var chooseCate = that.data.chooseCate
    var caseType

    if (money) {
      if (tab == 1) {
          switch(chooseCate) {
            case '离婚案件':
              caseType = 1
              break;
            case '侵害人格权案件':
              caseType = 2
              break;
            case '知识产权案件':
              caseType = 3
              break;
            case '其他非财产案件':
              caseType = 4
              break;
            case '财产案件':
              caseType = 5
              break;
            case '劳动争议案件':
              caseType = 6
              break;
            case '商标、专利、海事行政案件':
              caseType = 7
              break;
            case '其他行政案件':
              caseType = 8
              break;
            case '管辖权异议':
              caseType = 9
              break;                
          }
          that.setData({
            result: that.returnMoney(caseType, money)
          })
      } else if (tab == 2) {
          switch(chooseCate) {
            case '申请执行':
              caseType = 1
              break;
            case '申请财产保全':
              caseType = 2
              break;
            case '申请支付令':
              caseType = 3
              break;
            case '申请公示催告':
              caseType = 4
              break;
            case '申请撤销仲裁裁决或者认定仲裁协议效力':
              caseType = 5
              break;
            case '申请破产':
              caseType = 6
              break;
            case '申请设立海事赔偿责任限制基金':
              caseType = 7
              break;
            case '申请海事强制令':
              caseType = 8
              break;
            case '申请船舶优先权催告':
              caseType = 9
              break;
            case '申请海事债权登记':
              caseType = 10
              break; 
            case '申请共同海损理算':
              caseType = 11
              break;                 
          }
          that.setData({
            result: that.ApplyMoney(caseType, money)
          })
      }
    }
  },

  inputMoney: function(e) {
    that.setData({
      money: e.detail.value
    })
  },

  reset: function() {
    that.setData({
      money: null,
      result: null,
      chooseCate: ''
    })
  },

  returnMoney: function(CaseType, InputMoney) {
    //诉讼受理费用计算
    var stringMoney = ""; //返回费用变量
  
    switch (CaseType) {
        //离婚案件
        case 1:
            //离婚案件每件交纳50元至300涉及财产分割，财产总额不超过20万元的，不另行交纳
            if (InputMoney <= 200000) {
                stringMoney = "50元 - 300元";
            }
            else {
                stringMoney = 50 + ((InputMoney - 200000) * 0.005) + "元-" + (300 + ((InputMoney - 200000) * 0.005)) + "元";
            }
            break;
            //侵害人格权案件(姓名权、名称权、肖像权、名誉权、荣誉权等)
        case 2:
            if (InputMoney <= 50000) {
                stringMoney = "100元 - 500元";
            }
            else if (InputMoney > 50000 && InputMoney <= 100000) {
                stringMoney = ((InputMoney - 50000) * 0.01 + 100) + "元 - " + ((InputMoney - 50000) * 0.01 + 500) + "元";
            }
            else if (InputMoney > 100000) {
                stringMoney = (((50000 * 0.01) + ((InputMoney - 100000) * 0.005)) + 100) + "元 - " + (((50000 * 0.01) + ((InputMoney - 100000) * 0.005)) + 500) + "元";
            }
            break;
            //知识产权民事案件
        case 3:
            if (InputMoney <= 10000) {
                stringMoney = "500元 - 1000元";
            }
            else {
                stringMoney = that.ComputingStandards(InputMoney) + "元";
            }
            break;
            //非财产案件
        case 4:
            stringMoney = "50元 - 100元";
            break;
            //财产案件
        case 5:
            stringMoney = that.ComputingStandards(InputMoney) + "元";
            break;
            //劳动争议案件
        case 6:
            stringMoney = "10元";
            break;
            //商标、专利、海事行政案件
        case 7:
            stringMoney = "100元";
            break;
            //其他行政案件
        case 8:
            stringMoney = "50元";
            break;
            //管辖权异议
        case 9:
            stringMoney = "50元 - 100元";
            break;
    }
    return stringMoney;
  },


  ApplyMoney: function (cate, money) {
    // 申请费用计算
        var total = "0";
        switch (cate) {
            case 1:
                if (money <= 10000 && money > 0) {
                    total = "50";//不超过1万元的，每件交纳50元
                }
                else if (money > 10000 && money <= 500000) {
                    total = (50 + ((money - 10000) * 0.015));//超过1万元至50万元的部分，按照1.5％交纳
                }
                else if (money > 500000 && money <= 5000000) {
                    total = (50 + (490000 * 0.015) + ((money - 500000) * 0.01));//超过50万元至500万元的部分，按照1％交纳
                }
                else if (money > 5000000 && money <= 10000000)//超过500万元至1000万元的部分，按照0.5％交纳
                {
                    total = (50 + (490000 * 0.015) + (4500000 * 0.01) + ((money - 5000000) * 0.005));
                }
                else if (money > 10000000)//超过1000万元的部分，按照0.1％交纳
                {
                    total = (50 + (490000 * 0.015) + (4500000 * 0.01) + (5000000 * 0.005) + ((money - 10000000) * 0.001));
                }
                else {
                    total = "50元 - 500";//没有执行金额或者价额的，每件交纳50元至500元。
                }

                break;
            case 2:
                if (money <= 1000) {
                    total = "30";//财产数额不超过1000元或者不涉及财产数额的，每件交纳30元；
                }
                else if (money > 1000 && money <= 100000) {
                    //超过1000元至10万元的部分，按照1%交纳；
                    total = (30 + ((money - 1000) * 0.01));
                }
                else if (money > 100000) {
                    //超过10万元的部分，按照0.5％交纳。但是，当事人申请保全措施交纳的费用最多不超过5000元。
                    var temp = 30 + (99000 * 0.01) + ((money - 100000) * 0.005);
                    if (temp > 5000) {
                        temp = 5000;
                    }
                    total = temp;
                }

                break;
            case 3:

                //依法申请支付令的，比照财产案件受理费标准的1/3交纳
                total = ((that.ComputingStandards(parseInt(money))) / 3);
                break;
            case 4:
                total = "100";
                break;
            case 5:
                total = "400";
                break;
            case 6:
                //破产案件依据破产财产总额计算，按照财产案件受理费标准减半交纳，但是，最高不超过30万元
                var temp1 = (that.ComputingStandards(parseInt(money))) / 2;
                if (temp1 > 300000) {
                    temp1 = 300000;
                }
                total = temp1;
                break;
            case 7:
                total = "1000元 - 10000";
                break;
            case 8:
                total = "1000元 - 5000";
                break;
            case 9:
                total = "1000元 - 5000";
                break;
            case 10:
                total = "1000";
                break;
            case 11:
                total = "1000";
                break;
            default:
                total = "0";
                break;
        }
        return total + "元";
    },

    ComputingStandards:function (InputMoney) {
        //1.不超过1万元的，每件交纳50元；
        //2.超过1万元至10万元的部分，按照2.5％交纳；
        //3.超过10万元至20万元的部分，按照2％交纳；
        //4.超过20万元至50万元的部分，按照1.5％交纳；
        //5.超过50万元至100万元的部分，按照1％交纳；
        //6.超过100万元至200万元的部分，按照0.9％交纳；
        //7.超过200万元至500万元的部分，按照0.8％交纳；
        //8.超过500万元至1000万元的部分，按照0.7％交纳；
        //9.超过1000万元至2000万元的部分，按照0.6％交纳；
        //10.超过2000万元的部分，按照0.5％交纳。
        var IntMoney = 0; //初始化计算标准额度

        //1万元以下
        if (InputMoney <= 10000) {
            IntMoney += that.Stage1();
        }

        //1万元至10万元
        if (InputMoney > 10000 && InputMoney <= 100000) {
            IntMoney += that.Stage1() + ((InputMoney - 10000) * 0.025);
        }

        //10万元至20万元
        if (InputMoney > 100000 && InputMoney <= 200000) {
            IntMoney += that.Stage1() +that.Stage10() + ((InputMoney - 100000) * 0.020);
        }

        //20万元至50万元
        if (InputMoney > 200000 && InputMoney <= 500000) {
            IntMoney += that.Stage1() + that.Stage10() +that.Stage20() + ((InputMoney - 200000) * 0.015);
        }

        //50万元至100万元
        if (InputMoney > 500000 && InputMoney <= 1000000) {
            IntMoney += that.Stage1() + that.Stage10() + that.Stage20() + that.Stage50() + ((InputMoney - 500000) * 0.010);
        }

        //100万元至200万元
        if (InputMoney > 1000000 && InputMoney <= 2000000) {
            IntMoney += that.Stage1() + that.Stage10() + that.Stage20() + that.Stage50() + that.Stage100() + ((InputMoney - 1000000) * 0.009);
        }

        //200万元至500万元
        if (InputMoney > 2000000 && InputMoney <= 5000000) {
            IntMoney += that.Stage1() + that.Stage10() + that.Stage20() + that.Stage50() + that.Stage100() + that.Stage200() + ((InputMoney - 2000000) * 0.008);
        }

        //500万元至1000万元
        if (InputMoney > 5000000 && InputMoney <= 10000000) {
            IntMoney += that.Stage1() + that.Stage10() + that.Stage20() + that.Stage50() + that.Stage100() + that.Stage200() + that.Stage500() + ((InputMoney - 5000000) * 0.007);
        }

        //1000万元至2000万元
        if (InputMoney > 10000000 && InputMoney <= 20000000) {
            IntMoney += that.Stage1() + that.Stage10() + that.Stage20() + that.Stage50() 
            + that.Stage100() + that.Stage200() + that.Stage500() + 
            that.Stage1000() + ((InputMoney - 10000000) * 0.006);
        }

        //2000万元
        if (InputMoney > 20000000) {
          IntMoney += that.Stage1() + that.Stage10() + that.Stage20() + that.Stage50()
            + that.Stage100() + that.Stage200() + that.Stage500() 
            + that.Stage1000() + that.Stage2000() + ((InputMoney - 20000000) * 0.005);
        }

        return parseInt(IntMoney);
    },

    /// <summary>
    /// 1万元以下
    /// </summary>
    /// <returns></returns>
     Stage1:function() {
        return 50;
    },

    /// <summary>
    /// 1万元至10万元
    /// </summary>
    /// <returns></returns>
     Stage10: function() {
        return 90000 * 0.025;
    },

    /// <summary>
    /// 10万元至20万元
    /// </summary>
    /// <returns></returns>
     Stage20: function() {
        return 100000 * 0.020;
    },

    /// <summary>
    /// 20万元至50万元
    /// </summary>
    /// <returns></returns>
     Stage50: function() {
        return 300000 * 0.015;
    },

    /// <summary>
    /// 50万元至100万元
    /// </summary>
    /// <returns></returns>
    Stage100: function() {
        return 500000 * 0.010;
    },

    /// <summary>
    /// 100万元至200万元
    /// </summary>
    /// <returns></returns>
    Stage200: function() {
        return 1000000 * 0.009;
    },

    /// <summary>
    /// 200万元至500万元
    /// </summary>
    /// <returns></returns>
    Stage500: function() {
        return 3000000 * 0.008;
    },

    /// <summary>
    /// 500万元至1000万元
    /// </summary>
    /// <returns></returns>
    Stage1000: function() {
        return 5000000 * 0.007;
    },

    /// <summary>
    /// 1000万元至2000万元
    /// </summary>
    /// <returns></returns>
    Stage2000: function () {
        return 10000000 * 0.006;
    },
})