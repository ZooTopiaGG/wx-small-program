// pages/conferenceData/conferenceData.js
var app = getApp()
var common = require('../../utils/common.js')
var https = require('../../utils/https.js')
var fileUrlHead = 'http://119.29.251.187:8057'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noFile:0,
    fileList:[],
    fileDes:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var meetID = options.meetID
    console.log(options.meetID)
    // 获取会议资料
    var that = this
    app.func.reqPost('/meet/getfiles',{
      MeetingID: meetID
    },function(res){
      console.log(res)
      if(res.state == 0){
        if (res.total>0){
          common.showToast1('正在加载资料...','loading',1000)
          that.setData({
            fileList:res.result
          })
          console.log(res.result)

        }
        else{
          common.showToast1('没有会议资料...', 'loading', 1000)
          that.setData({
            noFile:1
          })
        }
      }
    })
  },
  openFile:function(e){
    var filePathThis = e.currentTarget.id
    wx.showLoading({
      title: '加载中',
    })
    wx.downloadFile({
      url: fileUrlHead + filePathThis,
      success: function (res) {
        console.log(res)
        var filePath = res.tempFilePath 
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
            wx.hideLoading()
          },
         fail:function(res){
           console.log(res)
         }
        })
        console.log(filePath)
        // console.log(res.tempFilePath)
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
  
  }
})