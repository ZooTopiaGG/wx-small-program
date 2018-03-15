// pages/conferenceDetail/conferenceDetail.js
var app = getApp()
var common = require('../../utils/common.js')
var https = require('../../utils/https.js')
var meetID
var openID
var user
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
    meetTitle:'',
    startTime:'',
    location:'',
    meetType:'',
    addPersonArray:[]
  },
  onLoad: function (options) {
    meetID = options.meetID
    var that = this
    user = wx.getStorageSync('user')
    app.func.reqPost('/meet/getmeetinfo',{
      MeetingID: meetID
    },function(res){
      if (res.state == 0) {
        that.setData({
          meetTitle: res.result.Title,
          location: res.result.Location,
          startTime: res.result.StartTime,
          meetID: res.result.ID
        })
        wx.setStorageSync('enrollMeetID', res.result.ID)
      }
    })
    
    // 参会人员-----
    app.func.reqPost('/meet/getmeetingusers', {
      MeetingID: meetID
    }, function (res) {
      if (res.state == 0) {
        console.log(res)
        if (res.total > 0) {
          that.setData({
            addNum: res.total,
            addPersonArray: res.result
          })
        }

      }
    })
  },
  // 跳转通讯录------
  goMaillist:function(res){
    openID = user.openid
    app.func.reqPost('/meet/getmeetingusers', {
      MeetingID: this.data.meetID
    }, function (res) {
      console.log(res)
      if (res.state == 0){
        for(var i=0; i<res.result.length;i++){
          if (res.result[i].OpenID == openID){
            if (res.result[i].UserType == 0){
              console.log("我是主办方")
              wx.navigateTo({
                url: '../maillistadmin/maillistadmin?meetID=' + meetID
              })
            //   that.setData({
            //     url: '../maillistadmin/maillistadmin?meetID=' + meetID
            //  })
            }
            else{
              console.log("我是其他类型")
              wx.navigateTo({
                url: '../mailList/mailList?meetID=' + meetID
              })
              // that.setData({
              //   url: '../mailList/mailList?meetID=' + meetID
              // })
            }
          }
        }
      }
      
             
      // console.log(res.result)
    })
  },

  upper: function (e) {
    console.log(e)
  },
  lower: function (e) {
    console.log(e)
  },
  scroll: function (e) {
    console.log(e)
  },
  scrollToTop: function (e) {
    this.setAction({
      scrollTop: 0
    })
  },
  tap: function (e) {
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1],
          scrollTop: (i + 1) * 200
        })
        break
      }
    }
  },
  tapMove: function (e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  }
})