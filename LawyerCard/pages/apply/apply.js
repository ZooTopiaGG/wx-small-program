// pages/apply/apply.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '', // 姓名
    phonenum: '', // 手机号
    remark: '' //备注
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  formSubmit (e) {
    var 
    val = e.detail.value,
    reg = new RegExp('^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[0|1|3|5|6|7|8]|18[0|1|2|3|5|6|7|8|9])\\d{8}$', 'g')
    if (!val.username) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'loading',
        duration: 1000
      })
      return
    }
    if (!val.phonenum) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'loading',
        duration: 1000
      })
      return
    } else if (!reg.exec(val.phonenum)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'loading',
        duration: 1000
      })
      return
    }
    wx.showLoading({
      title: '正在提交',
    })
    app._http.http_post('/feedback/createfeedback', {
      lawyerid: app.globalData.lawyerid,
      name: val.username,
      tel: val.phonenum,
      content: val.remark
    }, res => {
      console.log(res)
      wx.hideLoading()
      if (res.state == 0) {
        // wx.showToast({
        //   title: '预约成功',
        // })
        wx.redirectTo({
          url: '../successBack/successBack',
        })
      } else {
        wx.showToast({
          title: '网络繁忙',
          icon: 'loading'
        })
      }
    })
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
  onShareAppMessage: function () {
    return {
      title: '预约小程序',
      path: 'pages/apply/apply',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})