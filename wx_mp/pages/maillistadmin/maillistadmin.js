// pages/maillistadmin/maillistadmin.js
var app = getApp()
var common = require('../../utils/common.js')
var https = require('../../utils/https.js')
var meetID
//获取应用实例  

Page({
  data: {
    // 主办方
    sponsorList:[],
    // 总参会人员列表
    addPersonArray:[],
    // 参会嘉宾列表
    guestList:[],
    // 会务人员列表
    participantList:[],
    userType:'',
    meetID:'',
    currentTab: 0,
    no_speaker:0
  },
  onLoad: function (options) {
    var that = this;
    meetID = options.meetID
    that.setData({
      meetID: meetID
    })
    wx.getUserInfo({
      withCredentials: true,
      success: function(res) {
        // console.log(res)
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    app.func.reqPost('/meet/getmeetingusers',{
      MeetingID: meetID
    },function(res){
      console.log(res)
      for(var i=0;i<res.result.length;i++){
        if (res.result[i].UserType == 0) {
          // 主办方------
          that.setData({
            sponsorList: that.data.sponsorList.concat(res.result[i])
          })
        } 
        if (res.result[i].UserType == 1 || res.result[i].UserType == 0) {
          // 会务人员------
          that.setData({
            participantList: that.data.participantList.concat(res.result[i])
          })
        } 
        if(res.result[i].UserType == 2){
          // 嘉宾------
          that.setData({
            guestList: that.data.guestList.concat(res.result[i]),
            no_speaker:1
          })
        }
      }
      
      that.setData({
        addPersonArray: res.result,
      })
      // console.log(res)
    })
  },

  cellThisPhone: function (e) {
    var phoneNum = e.currentTarget.id;
    wx.makePhoneCall({
      phoneNumber: phoneNum
    })

  },
  goThisCard:function(e){
    var userID = e.currentTarget.id;
    wx.navigateTo({
      url: '../my_card/my_card?hideMod=123&userID=' + userID,
    })
  },

  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
})  