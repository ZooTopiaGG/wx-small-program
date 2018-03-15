// conference.js
var app = getApp()
var common = require('../../utils/common.js')
var https = require('../../utils/https.js')
var meetID
Page({
  data: {
    // text:"这是一个页面"
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    meetID = options.meetID

    var user = wx.getStorageSync('user')
    var qdUserID
    app.func.reqPost('/user/getinfobyopenid', {
      OpenId: user.openid
    }, function (res) {
      if (res.state == 0) {
        qdUserID = res.result.ID
        app.func.reqPost('/meet/sign', {
          UserID: qdUserID,
          MeetingID: meetID,
        }, function (data) {
          if (data.state == 0) {
            common.showToast1('签到成功！', 'success', 600)
          }
          else {
            if (data.state == -1102001){
              common.showToast1('账户已签到！', 'loading', 600)
            }
            else{
              common.showToast1('签到失败！', 'loading', 600)
            }
          
          }
          console.log(data)
        })
      }
    })
  },
  goMeetingDetail:function(){
    wx.navigateTo({
      url: '../conferenceDetail/conferenceDetail?meetID=' + meetID,
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})