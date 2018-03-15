// meeting_data.js
var app = getApp()
var common = require('../../utils/common.js')
var https = require('../../utils/https.js')
var meetID
Page({

  /**
   * 页面的初始数据
   */
  data: {
    meetName:'',
    Enrollment_num:'',
    Signs:'',
    Diners:'',
    Files :''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    meetID = options.id
    var that = this
    app.func.reqPost('/meet/getmeetcount',{
      MeetingID: meetID
    },function(res){
      if(res.state == 0){
        common.showToast1('获取成功', 'success', 1000)
        console.log(res)
        that.setData({
          meetName: options.metName,
          Enrollment_num: res.result.Enrollments,
          Signs: res.result.Signs,
          Diners: res.result.Diners,
          Files: res.result.Files
        })
      }
    })
  },
  // 修改会议-----
  goModMeetInfo:function(){
    wx.navigateTo({
      url: '../mod_meeting_info/mod_meeting_info?meetID=' + meetID,
    })
  },
  // 会议资料-----
  goFilePage:function(){
    wx.navigateTo({
      url: '../conferenceData/conferenceData?meetID=' + meetID,
    })
  },
  // 签到二维码------
  goMyCode:function(){
    wx.navigateTo({
      url: '../erweima/erweima?meetID=' + meetID,
    })
  },
  // 会议邀请函------
  goMeetInvitation:function(){
    wx.navigateTo({
      url: '../invitation/invitation?meetID=' + meetID
    })
  },
  // 进入会议------
  signInMyMeeting:function(){
    wx.navigateTo({
      url: '../conferenceDetail/conferenceDetail?meetID=' + meetID,
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