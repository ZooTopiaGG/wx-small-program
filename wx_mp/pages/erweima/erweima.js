// pages/erweima/erweima.js
var app = getApp()
var common = require('../../utils/common.js')
var https = require('../../utils/https.js')
var meetID
var imageUrlHead = 'https://jiuyihengtai.cn/Images/'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    meetID = options.meetID
    console.log(meetID)
    var that = this 
    app.func.reqPost('/weixin/getcodeurl',{
      MeetingID: meetID,
      UserID: 0,
      Path: "pages/conference/conference?meetID=" + meetID, 
      Width:430
    },function(res){
      console.log(res)
      that.setData({
        codeUrl: imageUrlHead + res.result
      })
      console.log(that.data.codeUrl)
   })
  },
  saveCodeImage: function (event){
    var mUrl = "";
    console.log(event)
    if (event.currentTarget.dataset.url != null)
      mUrl = event.currentTarget.dataset.url;
    console.log("download：" + mUrl);
    saveImage(mUrl);
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
/**
 * 保存图片
 */
function saveImage(mUrl) {
  // that.setData({
  //   hidden: false,
  //   toastHidden: true,
  //   modalHidden: true,
  //   loadingText: "下载中..."
  // });
  wx.downloadFile({
    url: mUrl,
    type: 'image',
    success: function (res) {
      console.log("download success");
      console.log(res)
      // that.setData({
      //   hidden: true,
      //   toastHidden: false,
      //   toastText: "恭喜你，图片保存成功"
      // });
      var tempFilePath = res.tempFilePath
      wx.saveFile({
        tempFilePath: tempFilePath,
        success: function (res) {
          var savedFilePath = res.savedFilePath
        }
      })
    },
    fail: function (res) {
      console.log("download fail");
      // that.setData({
      //   hidden: true,
      //   toastHidden: false,
      //   toastText: "保存失败，请稍后再试"
      // });
    },
    complete: function (res) {
      console.log("download complete");
    }
  })
}
var that;