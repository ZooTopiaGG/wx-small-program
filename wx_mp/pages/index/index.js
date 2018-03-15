// index.js
var n = 1000
var app = getApp()
var common = require('../../utils/common.js')
var https = require('../../utils/https.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dotAnData: {},
    n:'',
    userInfo:{}
  },
  onLaunch:function(){

    
  },
  onLoad: function () {
    　　var i = 0
    　　var dotAnData = wx.createAnimation({
      　　duration: 1000,
      　　transformOrigin: '50% 50% 0'
    　　})
    　　var dotAnFun = setInterval(function () {
      　　dotAnData.rotate(45*(++i)).step()
      　　this.setData({
        　　dotAnData: dotAnData.export()
      　　})
    　　}.bind(this), 1000)
      var that =this;
     
      app.getUserInfo(function(res){
        that.setData({
          userInfo: res
        })
        console.log(that.data.userInfo);
        console.log(wx.getStorageSync('userInfo'))
      })
      

  　　},
  onShareAppMessage: function () {
    console.log('进入分享')
    return {
      title: '会议go',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
        console.log('转发成功！')
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  createMeeting: function () {
    var user = wx.getStorageSync("user")
    app.func.reqPost('/user/getinfobyopenid', {
      OpenId: user.openid
    }, function (res) {
      if (res.state == 0) {
        common.showToast1('你拥有名片，正在跳转...', 'success', 1500)
        console.log(res)
        wx.setStorageSync("userID", res.result.ID)
        setTimeout(function(){
          wx.navigateTo({
            url: '../create_meeting/create_meeting',
          })
        },1000)
          
      }
      else {
          wx.showModal({
            title: '提示',
            content: '您还没有名片，点击确定创建！',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateTo({
                  url: '../write_card_info/write_card_info',
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
      }
    })
  },
  getseq: function (e) {
    var _that = this;
   

    var user = wx.getStorageSync("user")
    app.func.reqPost('/user/getinfobyopenid', {
      OpenId: user.openid
    }, function (res) {
      if (res.state == 0) {
        if(res.result.ID){
          wx.scanCode({
            success: function (res) {
              console.log("扫码成功")
              console.log(res)
              if (res.result) {
                wx.navigateTo({
                  url: "../../" + res.path,
                })
              }
            },
            fail: function (res) {
              console.log("扫码失败")
            }
          })
        }
      }
      else {
        wx.showModal({
          title: '提示',
          content: '您还没有名片，点击确定创建！',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.navigateTo({
                url: '../write_card_info/write_card_info',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  },


})
