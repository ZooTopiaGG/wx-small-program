//app.js
var http = require('utils/https.js')

App({
  globalData:{
    appid: 'wxca543f88db6b29f1',
    secret: '74ec56f5753a734599464795edb22e81',
    userInfo:null
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
      console.log(1);
    }else{
      //调用登录接口
      // wx.login({
      //   success: function () {
      //     wx.getUserInfo({
      //       success: function (res) {
      //         that.globalData.userInfo = res.userInfo
      //         typeof cb == "function" && cb(that.globalData.userInfo)
      //       }
      //     })
      //   }
      // })

      var that = this;
      var user = wx.getStorageSync('user') || {};
      var userInfo = wx.getStorageSync('userInfo') || {};
      // (!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600)) && (!userInfo.nickName)
      if (userInfo===null || {}) {   //条件判断可能有误----
        // console.log(1);
        wx.login({
          success: function (res) {
            // 获取用户对象  
            if (res.code) {
              // console.log(res);
              wx.getUserInfo({
                success: function (res) {
                  var objz = {};
                  that.globalData.userInfo = res.userInfo
                  typeof cb == "function" && cb(that.globalData.userInfo)
                  objz.avatarUrl = res.userInfo.avatarUrl;
                  objz.nickName = res.userInfo.nickName;
                  wx.setStorageSync('userInfo', objz);//存储userInfo   
                  console.log(res)
                }
              });
              var d = that.globalData; //这里存储了appid、secret、token串 
              var r_url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appid + '&secret=' + d.secret + '&js_code=' + res.code + '&grant_type=authorization_code';
              console.log(r_url);
              wx.request({
                url: r_url,
                data: {},
                method: 'GET',
                success: function (res) {
                  var obj = {};
                  obj.openid = res.data.openid;
                  obj.expires_in = Date.now() + res.data.expires_in;
                  wx.setStorageSync('user', obj);//存储openid    
                  console.log(obj);
                }
              })
            }
            else {
              console.log('获取用户登录态失败！' + res.errMsg);
            }
          }

        })
      }
      else{
        console.log('hh');
      }


    }
  },
  // globalData:{
  //   userInfo:null
  // },
  func: {
    reqPost: http.reqPost,
    reqGet: http.reqGet,
    reqPost2: http.reqPost2
  }

  
})