// invitation.js
var app = getApp()
var common = require('../../utils/common.js')
var https = require('../../utils/https.js')
var meetID
var radioCheckedValue
var myCreateList
Page({

  /**
   * 页面的初始数据
   */
  data: {
    met_name:"",
    met_adr:"",
    met_time:"",
    items: [
      { name: 'yes', value: '参加', checked:'false'},
          { name: 'no', value: '不参加', checked: 'true' },
        ],
    addPersonArray:[],
    btnShow:0,
    closeMcImage:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    meetID = options.meetID
    var share = options.share
   
    // 判断是否是分享的页面---------
    if(share == 123){
      that.setData({
        btnShow:1,
        closeMcImage:1
      })
    }
    console.log(that.data.btnShow)
    // 会议信息-----
    app.func.reqPost('/meet/getmeetinfo', {
      MeetingID: meetID
      },function(res){
        if(res.state == 0){
          that.setData({
            met_name: res.result.Title,
            met_adr: res.result.Location,
            met_time: res.result.StartTime
          })
          wx.setStorageSync('enrollMeetID', res.result.ID)
        }
      })
    // 参会人员-----
    app.func.reqPost('/meet/getmeetingusers',{
      MeetingID: meetID
    },function(res){
      if (res.state == 0){
          if (res.total>0){
            that.setData({
              addNum: res.total,
              addPersonArray:res.result
          })
        }
        
      }
    })
    
  },
  onShareAppMessage: function () {
    console.log('进入分享')
    var that = this
    that.setData({
      btnShow: 1,
      closeMcImage: 1
    })
    return {
      title: '会议GO报名邀请函',
      path: '/pages/invitation/invitation?meetID=' + meetID+'&share=123',
    }
  },
  enrollMeeting: function (){
    var that = this
    var items = that.data.items
    var notifyID = 0
    if (radioCheckedValue =="yes")
    {
      notifyID = 170522817620000021
    }
    // console.log(notifyID)
    var user = wx.getStorageSync('user')
    var enrollUserID
    app.func.reqPost('/user/getinfobyopenid',{
      OpenId: user.openid
    },function(res){
      if(res.state ==0){
        enrollUserID = res.result.ID
        app.func.reqPost('/meet/enroll', {
          UserID: enrollUserID,
          MeetingID: wx.getStorageSync('enrollMeetID'),
          NotifyID: notifyID
        }, function (data) {
          if(data.state == 0){
            common.showToast1('报名成功！', 'success', 1000)
          }
          else{
            common.showToast1('报名失败！', 'loading', 1000)
          }
        })
      }
      else{
        wx.showModal({
          title: '提示',
          content: '你还没有创建名片，是否创建？',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../write_card_info/write_card_info?share=123&meetID='+meetID,
              })
            }
          }
        })
      }
    })
    
  },
  radioChange: function(e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value)
    radioCheckedValue = e.detail.value
  },

  backMyMeeting:function(){
    wx.switchTab({
      url: '../meeting_list/meeting_list?myCreateList=' + myCreateList,
    })
    console.log('hhhh' + myCreateList)
  },
  closeMc:function(){
    var that = this 
    that.setData({
      closeMcImage:1
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  }
})