// selectCase.js
var app = getApp()
var common = require('../../utils/common.js')
var util = require('../../utils/util.js')
var that
var page = 1

Page({

  /**
   * 页面的初始数据
   */
  data: {
    caseArray: new Array,
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
    this.refresh()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    that.refresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 获取精选案例
   */
  refresh: function () {
    page = 1;
    app.func.reqPost('/advice/get_good_wchat/public', {
      page: page,
    }, function (res) {
      that.setData({isLoding: false})
      wx.stopPullDownRefresh()
      if (res.isSuc) {
        that.setData({
          caseArray: res.result
        })
      } else {
        common.showToast(res.message, 'loading')
      }
    });
  },

  /**
   * 跳转到案例详情界面
   */
  gotoCaseDetail: function(e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../getCaseDetail/getCaseDetail?id=' + id,
    })
  }
})