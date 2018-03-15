// business_card.js
var app = getApp()
var common = require('../../utils/common.js')
var https = require('../../utils/https.js')
var openID
var user
var userID
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    user = wx.getStorageSync('user')
  },
  goAndCreateCard:function(){
    // wx.navigateTo({
    //   url: '../write_card_info/write_card_info',
    // })


 
          openID = user.openid
          app.func.reqPost('/user/getinfobyopenid', {
            OpenId: openID
          }, function (res) {
            if (res.state == 0) {
              if (res.result.ID) {
                wx.setStorageSync('userID', res.result.ID)
                // userID = res.result.ID
                wx.navigateTo({
                  url: '../my_card/my_card?userID=' + res.result.ID,
                })
              }
            }
            else {
              wx.showModal({
                title: '提示',
                content: '您还没有名片，点击确定创建！',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.navigateTo({
                      url: '../write_card_info/write_card_info?openID=' + openID,
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
        

    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  navBar:function(){
    
  }
  
})