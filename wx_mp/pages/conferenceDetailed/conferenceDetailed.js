// pages/conferenceDetailed/conferenceDetailed.js
var app = getApp()
var common = require('../../utils/common.js')
var https = require('../../utils/https.js')
var meetID
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    meetType:'',
    startTime:'',
    location:'',
    createUser:'',
    meetIntroduce:''
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    meetID = options.meetID
    app.func.reqPost('/meet/getmeetinfo',{
      MeetingID: meetID
    },function(res){
      console.log(res)
      if(res.state == 0){
        that.setData({
          title: res.result.Title,
          location: res.result.Location,
          meetType: res.result.Nature,
          startTime: res.result.StartTime,
          createUser: res.result.UserName,
          meetIntroduce: res.result.Introduce,
          meetID: res.result.ID
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
  
  }
})