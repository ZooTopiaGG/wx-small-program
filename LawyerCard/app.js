//app.js
// 引入 common.js
var _http = require('./utils/http.js')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 监听所有页面授权
    this.getUserInfo()
  },
  getUserInfo: function (cb) {
    var that = this
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code
        // 获取用户信息
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // console.log('已经授权...')
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  // console.log('jinlaile?')
                  that.globalData.userInfo = res.userInfo
                  // 获取openid
                  that.getOpenId(that.globalData.userInfo, that.globalData.lawyerid, code)
                  typeof cb == "function" && cb(res.userInfo, that.globalData.lawyerid, code)
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (that.userInfoReadyCallback) {
                    that.userInfoReadyCallback(res)
                  }
                },
                fail: res => {
                  typeof cd == "function" && cb(null)
                }
              })
            } else {
              // console.log('未授权...')
              wx.login({
                success: res => {
                  var code = res.code
                  wx.getUserInfo({
                    success: res => {
                      that.globalData.userInfo = res.userInfo
                      // console.log(res.userInfo)
                      that.getOpenId(res.userInfo, that.globalData.lawyerid, code)
                    }
                  })
                }
              })
            }
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    lawyerid: 1,
    setImg: {
      caseImg: '../../images/case.png',
      introImg: '../../images/jj.png',
      introAvatar: '../../images/introAvatar.png',
      homeAvatar: '../../images/avatar.png',
      homeImg: '../../images/bj.png'
    }
  },
  // 绑定全局律师信息
  getOpenId: function (userInfo, lawyerid, code) {
    // console.log('hhhh')
    var that = this
    this._http.http_post('/weixin/getopenid', {
      lawyerid: lawyerid,
      nickname: userInfo.nickName,
      headurl: userInfo.avatarUrl,
      jscode: code
    }, res => {
      // console.log(res)
      wx.setStorageSync('_openid', res.result)
    })
  },
  // 注册到app中
  _http: _http
})