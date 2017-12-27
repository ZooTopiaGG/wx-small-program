var app = getApp()
var common = require('../../utils/common.js')
var page = 1;
var that;
var role;

Page({
  data:{
    caseArray:"",
    lawyerSayUserInfo: "",
    orderType:[],
    click: -1,
    publicIcon: "../../images/10.png",
    privateIcon: "../../images/11.png"
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    that = this;
  },
  onReady:function(){
    
  },
  onShow:function(){
    // 页面显示
    // 页面渲染完成
    page = 1;

    app.getLawyerSayUserInfo(function (lawyerSayUserInfo) {
      //更新数据
      that.setData({
        lawyerSayUserInfo: lawyerSayUserInfo
      })
    })

    role = that.data.lawyerSayUserInfo.Role;

    //案例列表·
    //不区分用户、律师
    //if(role == 1){
    app.func.reqPost('/uc/publish_history_list', {
      para: {
        order_type: 0,
        page_index: page,
        page_size: 10
      }
    }, function (res) {
      console.log(1)
      console.log(res)
      if (res.isSuc) {
        that.setArrayData(res.result);
      } else {
        common.showToast(res.message, 'loading')
      }
    });
    // } else {
    //   app.func.reqPost('/uc/grab_history_list', {
    //     para: {
    //       order_type: 0,
    //       page_index: page,
    //       page_size: 10
    //     }
    //   },function(res){ 
    //     console.log(2)
    //     console.log(res)
    //     if (res.isSuc) {
    //       that.setArrayData(res.result);
    //     } else{
    //       common.showToast(res.message,'loading')
    //     }
    //   })
    //}  
  },
  onHide:function(){
    // 页面隐藏
    
  },
  onUnload:function(){
    // 页面关闭
    
  },

  //下拉刷新
  onPullDownRefresh: function() {
    page = 1;
    app.func.reqPost('/uc/publish_history_list', { 
      para: {
        order_type: 0,
        page_index: page,
        page_size: 10
      }
    },function(res){ 
      wx.stopPullDownRefresh();
      if (res.isSuc) {
        that.setArrayData(res.result);
      } else{
        common.showToast(res.message,'loading')
      }
    });  
  },


  //上拉加载更多
  onReachBottom: function() {
    page++;
    if (role == 1) {
      app.func.reqPost('/uc/publish_history_list', { 
        para: {
          order_type: 0,
          page_index: page,
          page_size: 10
        }
      },function(res){ 
        wx.stopPullDownRefresh();
        if (res.isSuc) {
          if (res.result && res.result.length > 0) {
            for (var i=0; i<res.result.length; i++) {
              res.result[i].create_time = common.createTime(res.result[i].create_time);
            }
            that.setData({
              caseArray: that.data.caseArray.concat(res.result)
            })
          } else {
            common.showToast('没有更多了','loading')
            page--
          }
        } else{
          common.showToast(res.message,'loading')
          page--
        }
      });  
    }  else {
      app.func.reqPost('/uc/grab_history_list', {
        para: {
          order_type: 0,
          page_index: page,
          page_size: 10
        }
      },function(res){ 
        if (res.isSuc) {
          if (res.result && res.result.length > 0) {
            for (var i=0; i<res.result.length; i++) {
              res.result[i].create_time = common.createTime(res.result[i].create_time);
            }
            that.setData({
              caseArray: that.data.caseArray.concat(res.result)
            })
          } else {
            common.showToast('没有更多了','loading')
            page--
          }
        } else{
          common.showToast(res.message,'loading')
          page--
        }
      })
    } 
  },

  //设置订单状态
  setArrayData: function(array) {
    for (var i=0; i<array.length; i++) {
      array[i].create_time = common.createTime(array[i].create_time);
      // switch(array[i].state) {
      //   case -1:
      //     array[i].state="已撤单";
      //     break;
      //   case 1:
      //     array[i].state="未付款";
      //     break;
      //   case 2:
      //     array[i].state="未接单";
      //     break;
      //   case 3:
      //     array[i].state="待解决";
      //     break;
      //   case 4:
      //     array[i].state="已解答";
      //     break;
      //   case 5:
      //     array[i].state="待评价";
      //     break;
      //   case 6:
      //     array[i].state="未分配";
      //     break;
      //   case 7:
      //     array[i].state="已解决";
      //     break;
      //   case 8:
      //     array[i].state="已解决";
      //     break;
      // }
    }

    that.setData({
      caseArray: array
    })
  },

  //跳转到订单详情
  goToCaseDetail: function(e) {

    if (that.data.click != -1) {
      that.setData({
        click: -1
      })
      return
    }

    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../getCaseDetail1/getCaseDetail1?id=' + id +"&cate=" + 1,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  //跳转到评价律师界面
  gotoCommentLawyer: function(e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../commentLawyer/commentLawyer?id=' + id,
    })
  },

  //重新编辑
  editConsultation: function(e) {
    var id = e.currentTarget.id;

    app.func.reqPost('/advice/get_info', {
      question_id: id,
      with_details: true,
      with_lawyers: true
    }, function (res) {

      var isCall = res.result.PhonePrizeUser >= 0? true : false

      if (res.result.first_reply_info.lawyer_info) {
        wx.navigateTo({
          url: '../consultation/consultation?user_id=' + res.result.first_reply_info.lawyer_info.lawyer_id + '&name=' + res.result.first_reply_info.lawyer_info.lawyer_name + '&content=' + res.result.description + '&price=' + res.result.price + '&isCall=' + isCall
        })
      } else {
        wx.navigateTo({
          url: '../consultation/consultation?content=' + res.result.description + '&price=' + res.result.price + '&isCall=' + isCall
        })
      }
    })    
  },

  //取消订单
  cancelCase: function(e) {
    var id = e.currentTarget.id;

    wx.showModal({
      title: '撤销后律师将无法接单为您解答',
      content: '为您解答的每个律师均经严格汁液审核，律师接单的响应时间不会超过3分钟',
      success: function(res) {
        if (res.confirm) {
          app.func.reqPost('/advice/cancel_question', {
            question_id: id
          }, function (res) {
            that.onPullDownRefresh()
          })
        }
      }
    })
  },

  //确认解答
  confirm: function(e) {
    var id = e.currentTarget.id;

    app.func.reqPost('/advice/get_info', {
      question_id: id,
      with_details: true,
      with_lawyers: true
    }, function (res) {

      var caseInfo = res.result

      if (caseInfo.first_reply_info.answer && !caseInfo.second_reply_info.answer) {
        wx.showModal({
          title: '确认解答',
          content: '确认之后将结束咨询,下载使用[律师说]可免费继续追问',
          success: function (res) {
            if (res.confirm) {
              app.func.reqPost('/advice/share_bonus_v213', {
                para: {
                  question_id: id,
                  share_ratio: 1,
                  first_user_id: caseInfo.first_reply_info.lawyer_info.user_id,
                  first_user_bonus: caseInfo.money,
                  second_user_id: 0,
                  second_user_bonus: 0,
                }
              }, function (res) {
                if (res.isSuc) {
                  common.showToast("确认解答成功", "success")
                  that.onPullDownRefresh()
                } else {
                  common.showToast(res.message, "loading")
                }
              })
            }
          }
        })
      } else if (caseInfo.first_reply_info.answer && caseInfo.second_reply_info.answer) {
        wx.navigateTo({
          url: '../assignedMoney/assignedMoney?id=' + id,
        })
      }

    })
  },

  //设置是否公开
  setPublic: function(e) {
    var target = e.currentTarget.id;

    var id = target.split(";")[0]
    var idx = target.split(";")[1]

    console.log(target)

    that.setData({
      click: idx
    })
  },

  //设置案例公开
  setPublicItem: function(e) {

    var id = e.currentTarget.id;

    app.func.reqPost('/advice/set_public', {
      question_id: id,
      is_public: true
    }, function(res) {
      if (res.isSuc) {
        that.setData({ click: -1 })
      }

      that.onPullDownRefresh()
    })
  },

  //设置案例不公开
  setPrivateItem: function (e) {

    var id = e.currentTarget.id;

    app.func.reqPost('/advice/set_public', {
      question_id: id,
      is_public: false
    }, function (res) {
      if (res.isSuc) {
        that.setData({click: -1})
      }

      that.onPullDownRefresh()
    })
  },

  //立即支付
  pay: function(e) {
    var id = e.currentTarget.id.split(":")[0]
    var price 

    if (parseFloat(e.currentTarget.id.split(":")[1]) >= 0) {
      price = parseFloat(e.currentTarget.id.split(":")[1]) + parseFloat(e.currentTarget.id.split(":")[2])
    } else {
      price = parseFloat(e.currentTarget.id.split(":")[2])
    }
    var openid = wx.getStorageSync('openId');

  
    app.func.reqPost('/wxProgram/UnifiedOrder', {
      openid: openid,
      total_fee: Number(price * 100).toFixed(0),
      questionId: id
    }, function (res) {
      if (res.isSuc) {
        common.showToast1('加载中', 'loading', 10000)
        wx.hideToast()
        var para = JSON.parse(res.result);
        //悬赏支付
        wx.requestPayment({
          'timeStamp': para.timeStamp,
          'nonceStr': para.nonceStr,
          'package': para.package,
          'signType': 'MD5',
          'paySign': para.paySign,
          'success': function (res) {
            wx.redirectTo({
              url: '../caseCompelete/caseCompelete',
            })
          },
          'fail': function (res) {
            console.log('fail' + res)
          }
        })
      } else {
        common.showToast(res.message, 'loading')
      }
    })
  }
})

