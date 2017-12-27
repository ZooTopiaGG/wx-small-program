// assignedMoney.js
var id
var app = getApp()
var caseInfo
var that

var ratio = 0.5

var common = require('../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    proportion: ["1 : 9", "2 : 8", "3 : 7", "4 : 6", "5 : 5", "6 : 4", "7 : 3", "8 : 2", "9 : 1"],
    pickerNum: [4],
    firstReplyInfo: {},
    secondReplyInfo: {},
    caseInfo: {},
    price1: 0,
    price2: 0,
    proportion1: 5,
    proportion2: 5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    id = options.id

    app.func.reqPost('/advice/get_info', {
      question_id: id,
      with_details: false,
      with_lawyers: true
    }, function (res) {
      caseInfo = res.result;

      that.setData({
        firstReplyInfo: caseInfo.first_reply_info,
        secondReplyInfo: caseInfo.second_reply_info,
        caseInfo: caseInfo,
        price1: new Number(caseInfo.price / 2).toFixed(2),
        price2: new Number(caseInfo.price / 2).toFixed(2)
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  bindProportionChange: function(e) {
    
    var proportion = that.data.proportion[e.detail.value[0]]
    var str = proportion.split(":")
    
    that.setData({
      proportion1: str[0].trim(),
      proportion2: str[1].trim()
    })

    that.setData({
      price1: new Number(caseInfo.price * (that.data.proportion1 / 10)).toFixed(2),
      price2: new Number(caseInfo.price * (that.data.proportion2 / 10)).toFixed(2)
    })
  },

  sure: function(e) {
    ratio = that.data.proportion1 / 10

    // wx.showModal({
    //   title: '确认解答',
    //   content: '确认之后将结束咨询,下载使用[律师说]可免费继续追问',
    //   cancelText: '再等等',
    //   success: function(res) {
    //     if (res.confirm) {
    app.func.reqPost('/advice/share_bonus_v213',{
      para: {
        question_id: id,
        share_ratio: ratio,
        first_user_id: that.data.firstReplyInfo.lawyer_info.user_id,
        first_user_bonus: that.data.price1,
        second_user_id: that.data.secondReplyInfo.lawyer_info.user_id,
        second_user_bonus: that.data.price2,
      }
    }, function(res) {
      if (res.isSuc) {
        common.showToast("确认解答成功","success")
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
        })
      } else{
        common.showToast(res.message,"loading")
      }
    })
    //     }
    //   }
    // }) 
  }
})