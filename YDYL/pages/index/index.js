//index.js
//获取应用实例
var app = getApp()
var common = require('../../utils/common.js')

Page({
  data: {
    userInfo: {},
    userName:"",
    password:""
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })

  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },

  //重置
  register: function() {
    wx.navigateTo({
      url: '../register/register',
    })
  },
  
  //登录
  login: function() {
    var name = this.data.userName;
    var pwd = this.data.password;
    var result = this.data.result;
    var that = this;
    if (!name) {
      common.showToast('请输入用户名','loading')
      return
    } 
    if (!pwd) {
      common.showToast('请输入密码','loading')
      return
    } 

    //登录
    app.func.reqPost('/passport/login', {
      areaCode: "86",
      mobile: name, 
      password: pwd
    },function(res){ 
      if (res.isSuc) {
        app.globalData.lawyerSayUserInfo = res.result;
        //token缓存到本地
        try {
            wx.setStorageSync('token', res.result.Token)
        } catch (e) {    
        }
        common.showToast('登录成功','success')
        wx.switchTab({
          url: '../person/person'
        })
      } else{
        common.showToast(res.message,'loading')
      }
    });  
    
  },

  //监听账号输入
  bindAccountInput: function(e) {
    this.setData({
      userName: e.detail.value
    })
  },

  //监听密码输入
  bindPwdInput: function(e) {
    this.setData({
      password: e.detail.value
    })
  }
})
