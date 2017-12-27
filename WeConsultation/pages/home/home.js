var app = getApp()
var common = require('../../utils/common.js');
var util = require('../../utils/util.js')
var that;
var page=1;
var unionId;
var nickName;

Page({
  data:{
    currentTab: 1,
    caseArray:"",
    lawTypeArray: [],
    isRolling: false,
    isloading: false
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    that = this;
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  
  onReady:function(){
    // 页面渲染完成
  },

  onShow:function(){
    // 页面显示
    
  },
  onHide:function(){
    // 页面隐藏
    
  },
  onUnload:function(){
    // 页面关闭
    
  }, 

  gotoSelectCase: function() {
    wx.navigateTo({
      url: '../selectCase/selectCase',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  gotoHotConsultation: function() {
    wx.navigateTo({
      url: '../hotConsultation/hotConsultation',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  onShareAppMessage:function () {
    console.log("hahas")
    //分享
    return {
      title: 'We法律咨询，提供专业的法律咨询服务',
      desc: '小程序版[律师说]，随时随地咨询享受专业的法律咨询服务',
      path: '/pages/home/home',
      // success: function (res) {
      //   console.log(res.shareTickets)
      // }
    }
  },
  switchTab1: function() {
    that.setData({
      currentTab: 1
    })
  },

  switchTab2: function() {
    that.setData({
      currentTab: 2
    })
  },

    //跳转到订单详情
  gotoCaseDetail: function(e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../getCaseDetail/getCaseDetail?id=' + id,
    })
  },

    //跳转到订单列表
  gotoCaseList: function(e) {
    var idstr = e.currentTarget.id;
     var id = idstr.split(";")[0]
     var typename = idstr.split(";")[1]
     var desc = idstr.split(";")[2]
     console.log(typename)
    wx.navigateTo({
      url: '../caselist/caselist?lawCode=' + id+'&lawType='+typename+'&desc='+desc,
    })
  },

  //跳转到咨询界面
  consultation: function() {
    wx.getStorage({
        key: 'token',
        success: function(res) {
          wx.navigateTo({
            url: '../consultation/consultation'
          })
        },
        fail: function() {
          that.setData({
            isloading: true
          })
          app.getUserInfo(function(userInfo, code, iv, encryptedData){
            if (userInfo){
              app.func.reqPost('/wxProgram/onLogin', {
                code: code,
                IV:iv,
                encryptedData:encryptedData
              }, function(res) { 
                that.setData({
                  isloading: false
                })
                if (res.isSuc) {
                  console.log(res)
                  var wxInfo = JSON.parse(res.result)
                  wx.setStorageSync('openId', wxInfo.openId)
                  nickName = wxInfo.nickName;
                  unionId = wxInfo.unionId;
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
                      console.log(res)
                      if (res.result) {
                        app.globalData.lawyerSayUserInfo = res.result;
                        //token缓存到本地
                        try {
                            wx.setStorageSync('token', res.result.Token)
                            wx.setStorageSync('lawyerSayUserInfo', res.result)
                        } catch (e) {    
                          console.log(e)
                        }
                        wx.navigateTo({
                          url: '../consultation/consultation'
                        })
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: '提示：咨询前请绑定手机，律师解答后将立刻通知您。',
                          success: function(res) {
                            if (res.confirm) {
                              wx.getStorage({
                                key: 'openId',
                                success: function(res) {
                                  wx.navigateTo({
                                      url: '../register/register?openId=' + res.data + "&unionId=" + unionId + "&nickName=" + nickName,
                                  })
                                } 
                              })
                            }
                          }
                        })
                      }
                  })
                } else {
                  common.showToast(res.message,'loading')
                }
              } )
            } else {
              common.showToast('登录授权失败','loading')
            }
          })
        } 
      })
  },


})

