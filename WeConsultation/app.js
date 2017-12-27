//app.js
var http = require('utils/https.js')

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    // if(this.globalData.userInfo){
    //   typeof cb == "function" && cb(this.globalData.userInfo)
    // }else{
      //调用登录接口
      wx.login({
        success: function (res) {
          var code = res.code
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo, code, res.iv, res.encryptedData)
            },
            fail: function(res) {
              typeof cb == "function" && cb(null)
            }
          })
        },
      })
    // }
  },

  getLawyerSayUserInfo:function(cb) {
    var that = this
    if(this.globalData.lawyerSayUserInfo){
      typeof cb == "function" && cb(this.globalData.lawyerSayUserInfo)
    }
  },
  globalData:{
    userInfo:null,
    lawyerSayUserInfo: null
  },
  
  func:{  
    reqPost:http.reqPost,
    reqGet:http.reqGet
  }
})
