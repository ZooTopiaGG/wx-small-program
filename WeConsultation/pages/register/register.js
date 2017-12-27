
var app = getApp()
var common = require('../../utils/common.js')

var nums = 60; //倒计时时间
var that;
var clock; //计时器
var role = 1;
var name; //姓名
var password; //密码
var invitationCode = ""; //邀请码
var verificationCode; //验证码
var openId;
var nickName;
var unionId;

Page({
  data:{
    mobile: "",
    getVerificationCodeBtnText: "立即获取",
    btnEnable: true,
    userInfo: ""
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    that = this;

    openId = options.openId;
    nickName = options.nickName;
    unionId = options.unionId;

    app.getUserInfo(function(userInfo){
        console.log(userInfo)
        //更新数据
        that.setData({
          userInfo:userInfo
        })
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

  radioChange: function(e) {
    role = e.detail.value;
  },


  //获取验证码
  getVerificationCode: function(e) {
    if (!that.data.btnEnable) {
      return
    }

    if (!that.data.mobile) {
      common.showToast("请输入手机号", "loading");
      return
    }

    app.func.reqPost('/smscode/send',{
      areaCode: 86,
      mobile: that.data.mobile,
      codeType: "4",
      isLocal: "0"
    },function(res) {
      if (res.isSuc) {
        common.showToast("发送成功", "success");
        clock = setInterval(that.doLoop, 1000);
      } else{
        common.showToast(res.message, "loading")
      }
    })
  },

  //设置验证码按钮文字
  doLoop: function() {
    nums--;
    if(nums > 0){
      that.setData({
        getVerificationCodeBtnText: nums+'秒',
        btnEnable: false
      });
      
    }else{
      clearInterval(clock); //清除js定时器
      that.setData({
        btnEnable: true,
        getVerificationCodeBtnText: "获取验证码"
      })
      nums = 60; //重置时间
    }   
  },

  //监听手机号输入
  EventHandle: function(e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  //监听姓名输入
  EventHandleName: function(e) {
    name = e.detail.value
  },

  //监听密码输入
  EventHandlePwd: function(e) {
    password = e.detail.value
  },

  //监听邀请码
  EventHandleInvitationCode: function(e) {
    invitationCode = e.detail.value
  },

  //监听验证码输入
  EventHandleVerificationCode: function(e) {
    verificationCode = e.detail.value
  },

  //注册
  register:function() {
    if (!that.data.mobile) {
      common.showToast("请输入手机号", "loading");
      return
    }

    if (!verificationCode) {
      common.showToast("请输入验证码", "loading");
      return
    }

    app.func.reqPost('/wxProgram/signup_bing',{
      areaCode: 86,
      mobile: that.data.mobile,
      smsCode: verificationCode,
      platform: 9,
      Source: 1,
      role: 1,
      unionID: unionId,
      openId: openId,
      nickName: nickName
    },function(res) {
      var userInfo = res;
      if (res.isSuc) {
        wx.showModal({
          title: '绑定成功',
          content: '您可以向律师咨询问题了',
          showCancel: false,
          confirmColor: '#00c200',
          success: function(res) {
            if (res.confirm) {
              common.showToast1("加载中","loading", 5000)
              app.getUserInfo(function(userInfo, code, iv, encryptedData){
                // app.func.reqPost('/passport/quick_login', {
                //   para: {
                //     platform: 9,
                //     openId: openId,
                //     unionID: '',
                //     token: '123',
                //     avatar: userInfo.avatarUrl,
                //     appId: '123',
                //     nickName: userInfo.nickName
                //   }
                // }, function(res) {
                //   if (res.result) {
                //     try {
                //         wx.setStorageSync('token', res.result.Token)
                //         wx.setStorageSync('lawyerSayUserInfo', res.result)
                //     } catch (e) {    
                //       console.log(e)
                //     }
                //     wx.navigateBack({
                //       delta: 1, // 回退前 delta(默认为1) 页面
                //     })
                //   } else{
                //     common.showToast(res.message, "loading")
                //   }
                // })
                console.log(userInfo + code + iv + encryptedData)
                app.func.reqPost('/wxProgram/onLogin', {
                  code: code,
                  IV:iv,
                  encryptedData:encryptedData
                }, function(res) { 
                  console.log(res)
                  var wxInfo = JSON.parse(res.result)
                  wx.setStorageSync('openId', wxInfo.openId)
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
                      wx.hideToast()
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
                        wx.navigateBack({
                          delta: 1, // 回退前 delta(默认为1) 页面
                        })
                        // wx.switchTab({
                        //   url: '../person/person',
                        //   success: function(res){
                        //     // success
                        //   },
                        //   fail: function() {
                        //     // fail
                        //   },
                        //   complete: function() {
                        //     // complete
                        //   }
                        // })
                      } else {
                        common.showToast(res.message, "loading")
                      }
                  })
                })              
              })
            }
          }
        })  
      } else{
          common.showToast(res.message, "loading")
      }  
    })
    

  }
})