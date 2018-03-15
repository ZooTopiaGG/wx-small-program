// meeting_list.js
var app = getApp()
var common = require('../../utils/common.js')
var https = require('../../utils/https.js')
var list 
var UserID
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['我加入的', '我创建的'],
    currentTab: 0,
    showHave:0,
    showNo:1,
    joinMeetArray:[],
    createMeetArray:[],
    createMetAvatar:'',
    userAvatar: '',
    startTime:'',
    onLoadList:''
  },
  choseList: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    var currentTab = this.data.currentTab
    // console.log(currentTab)
    if (currentTab == 0){
      // 获取加入的会议----
      var that = this
      app.func.reqPost('/meet/getjoinmeet', {
        UserID: wx.getStorageSync('userID')
      }, function (res) {
        if (res.state == 0) {
          if (res.total>0){
            common.showToast1('加载中...', 'loading', 600)
            console.log(res)

            for (var i = 0; i < res.result.length; i++) {
              var startTim = res.result[i].StartTime
              console.log(startTim)
              var jq_startT = startTim.substring(5, startTim.length - 9)
              that.setData({
                startTime: jq_startT
              })
            }
            list = res.result
            that.setData({
              joinMeetArray: res.result,
              createMetAvatar:'',
              showhave:0,
              // showNo:1,
              onLoadList: res.result
            })
          }
          else{
            common.showToast1('您还没有加入会议', 'loading', 600)
            that.setData({
              showNo: 0,
              showhave: 1,
            })
          }
         
        }
        else{
          common.showToast1('加载会议失败', 'loading', 600)
          that.setData({
            showNo: 0,
            showhave: 1,
          })
        }
      })
    }
    if(currentTab == 1){
      // 获取创建的会议----
      var that = this
      app.func.reqPost('/meet/getcreatemeet', {
        UserID: wx.getStorageSync('userID')
      }, function (res) {
        if (res.state == 0) {
          if (res.total > 0) {
            common.showToast1('加载中...', 'loading', 600)
            console.log(res)
            // var startTim = res.result.Starttime;
            for(var i=0;i<res.result.length;i++){
              var startTim = res.result[i].StartTime
              var jq_startT = startTim.substring(5, startTim.length - 9)
              that.setData({
                startTime: jq_startT
              })
            }
            list = res.result

            
            //var jq_startT = startTim.substring(5, startTim.length-9)
            var user_info = wx.getStorageSync("userInfo");
            that.setData({
              createMeetArray: res.result,
              userAvatar: user_info.avatarUrl,
              showhave: 1,
              showNo: 0,
              onLoadList: res.result
            })
          }
          else {
            common.showToast1('您还没有创建会议', 'loading', 600)
            that.setData({
              showhave: 0,
              showNo: 1,
            })
          }
        }
        else {
          common.showToast1('加载会议失败', 'loading', 600)
          that.setData({
            showhave: 0,
            showNo: 1,
          })
        }
      })
    }
  },  


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
      // 页面加载获取加入会议
    console.log(wx.getStorageSync('userID'));
      app.func.reqPost('/meet/getjoinmeet', {
        UserID: wx.getStorageSync('userID')
      }, function (res) {
        if (res.state == 0) {
          if (res.total > 0) {
            common.showToast1('加载中...', 'loading', 600)
            console.log(res)

            for (var i = 0; i < res.result.length; i++) {
              var startTim = res.result[i].StartTime
              console.log(startTim)
              var jq_startT = startTim.substring(5, startTim.length - 9)
              that.setData({
                startTime: jq_startT
              })
            }

            that.setData({
              joinMeetArray: res.result,
              createMetAvatar: '',
              showhave: 0,
              showNo: 1,
              onLoadList: res.result
            })
          }
          else {
            common.showToast1('您还没有加入任何会议', 'loading', 600)
            that.setData({
              showNo: 0,
              showhave: 1,
            })
          }

        }
        else {
          common.showToast1('加载会议失败', 'loading', 600)
          that.setData({
            showNo: 0,
            showhave: 1,
          })
        }
      })
   
   

  },
  // onShareAppMessage: function () {
  //   console.log('进入分享')
  //   return {
  //     title: '会议GO报名邀请函',
  //     path: '/pages/invitation/invitation?share=123',
  //     success: function (res) {
  //       // 转发成功
  //       console.log('转发成功！')
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //     }
  //   }
  // },
  getMeetDetail:function(e){
    // console.log(e)
    var id = e.currentTarget.id;
    var that = this
    var metName;
    var onLoadList = that.data.onLoadList
    console.log(id);
    for (var i = 0; i < onLoadList.length; i++) {
      if (id == onLoadList[i].ID) {
        metName = onLoadList[i].Title
      }
    }
    console.log(metName)
    wx.navigateTo({
      url: '../conferenceDetail/conferenceDetail?meetID=' + id ,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  getMeetInfo:function(e){
    // console.log(e)
    var id = e.currentTarget.id;
    var that = this
    var metName;
    var onLoadList = that.data.onLoadList
    console.log(id);
    for (var i = 0; i < onLoadList.length;i++){
      if (id == onLoadList[i].ID){
        metName = onLoadList[i].Title
      }
    }
    console.log(metName)
    wx.navigateTo({
      url: '../meeting_data/meeting_data?id=' + id + '&metName=' + metName,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  goCreateMeeting:function(){
    wx.navigateTo({
      url: '../create_meeting/create_meeting?UserID=' + UserID,
    })
  },
  getseq: function (e) {
    var _that = this;
    wx.scanCode({
      success: function (res) {
        console.log("成功")
        console.log(res)
        if (res.result) {
          // _that.setData({
          //   termSeq: res.result
          // })
          wx.navigateTo({
            url: "../conference/conference?meetID=170518823030000011",
          })
        }
      },
      fail: function (res) {
        // console.log("失败")
        // console.log(res)
      }
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