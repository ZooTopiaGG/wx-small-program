// hotConsultation.js
var app = getApp()
var common = require('../../utils/common.js')
var util = require('../../utils/util.js')
var that

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lawTypeArray: new Array,
    isLoding: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    that.loadData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 获取热门咨询列表
   */
  loadData: function() {
    app.func.reqGet('/shared/lawyer_typeList_wchat',
      function (res) {
        that.setData({ isLoding: false })
        if (res.isSuc) {
          that.setData({
            lawTypeArray: res.result
          })
        } else {
          common.showToast(res.message, 'loading')
        }
      }); 
  },

  /**
   * 跳转到订单列表
   */
  gotoCaseList: function(e) {
    var idstr = e.currentTarget.id;
    var id = idstr.split(";")[0]
    var typename = idstr.split(";")[1]
    var desc = idstr.split(";")[2]
    wx.navigateTo({
      url: '../caselist/caselist?lawCode=' + id + '&lawType=' + typename + '&desc=' + desc,
    })
  },
})