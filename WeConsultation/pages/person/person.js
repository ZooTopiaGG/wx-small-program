var app = getApp()
var common = require('../../utils/common.js')
var openId;
var unionId;
var nickName;
var that;

Page({
  data:{
    lawyerSayUserInfo: "",
    role:"",
    userInfo: "",
    isHiddenBind: true,
    userPhoneNum: "",
    userNickName: ""
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    that = this;
    
    app.getLawyerSayUserInfo(function(lawyerSayUserInfo){
      //更新数据
      that.setData({
        lawyerSayUserInfo:lawyerSayUserInfo
      })
    });
    app.getUserInfo(function(userInfo, code, iv, encryptedData){
      //更新数据
      if (userInfo) {
        that.setData({
          userInfo:userInfo,
          userNickName: userInfo.nickName
        })
        //判断是否已经绑定
        app.func.reqPost('/wxProgram/onLogin', {
           code: code,
           IV:iv,
           encryptedData:encryptedData
        }, function(res) {
          if (res.isSuc) {
            var wxInfo = JSON.parse(res.result)
            wx.setStorageSync('openId', wxInfo.openId)
            wx.setStorageSync('unionId', wxInfo.unionId)
            openId = wxInfo.openId;
            unionId = wxInfo.unionId;
            nickName = wxInfo.nickName;
            app.func.reqPost('/passport/quick_login', {
              para: {
                platform: 9,
                openId: wxInfo.openId,
                unionID: wxInfo.unionId,
                token: '123',
                avatar: wxInfo.avatarUrl,
                appId: wxInfo.watermark.appid,
                nickName: wxInfo.nickName
              }
            }, function(res){
                if (res.result) {
                  that.setData({
                    isHiddenBind: true,
                    userPhoneNum: res.result.PhoneNum
                  })
                  
                  app.globalData.lawyerSayUserInfo = res.result;
                  //token缓存到本地
                  try {
                      wx.setStorageSync('token', res.result.Token)
                      wx.setStorageSync('lawyerSayUserInfo', res.result)
                  } catch (e) {    
                    console.log(e)
                  }               
                } else {
                  that.setData({
                    isHiddenBind: false,
                    userPhoneNum: "绑定手机号，享受便捷服务",
                    userNickName: "未绑定手机"
                  })
                }
            })
          } else {
            common.showToast(res.message,'loading')
          }
        })
      } else{
        common.showToast('登录授权失败','loading')
        that.setData({
          isHiddenBind: true,
        })
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
    
  },
  onShow:function(){
    // 页面显示
    wx.getStorage({
      key: 'token',
      success: function(res){
        that.setData({
          isHiddenBind: true,
        })
        wx.getStorage({
          key: 'lawyerSayUserInfo',
          success: function (res) {
            that.setData({
              userNickName: res.data.TrueName,
              userPhoneNum: res.data.PhoneNum
            })
          },
        })
      },
      fail: function() {
        that.setData({
          isHiddenBind: false,
        })
      },
    })


  },
  onHide:function(){
    // 页面隐藏
    
  },
  onUnload:function(){
    // 页面关闭
    
  },
  goToMyCase: function() {
    wx.navigateTo({
          url: '../myCase/myCase'
        })
  },

  //退出登录
  logout: function() {
    app.globalData.lawyerSayUserInfo = null;
    wx.clearStorage({
      key: 'token',
      success: function(res){
        // success
        common.showToast('退出登录成功','success')
        wx.redirectTo({
          url: '../index/index',
        })
      },
      fail: function() {
        // fail
        common.showToast('退出登录失败','success')
      },
      complete: function() {
        // complete
      }
    })
  },

  consultation: function() {
    wx.navigateTo({
          url: '../consultation/consultation'
        })
  },
  //跳转到绑定手机界面
  gotoBindPhone: function() {
    wx.navigateTo({
        url: '../register/register?openId=' + openId + "&unionId=" + unionId + "&nickName=" + nickName,
    })
  },
  //跳转到用户反馈页面
  goToFadeBack:function(){
    wx.navigateTo({
        url: '../fadeback/fadeback'
    })
  },

  makePhoneCall: function() {
    wx.makePhoneCall({
      phoneNumber: '02886667536' //仅为示例，并非真实的电话号码
    })
  },

  goToHelp: function() {
    wx.navigateTo({
      url: '../help/help',
    })
  }
})