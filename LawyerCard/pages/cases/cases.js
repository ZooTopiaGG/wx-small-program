// pages/cases/cases.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   articleList: [],
   bannerList: '',
   caseImg: '',
   idx: 1,
   rippleStyle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  // 点击效果
  containerTap: function (res) {
    var that = this
    var x = res.touches[0].pageX;
    var y = res.touches[0].pageY + 85;
    this.setData({
      rippleStyle: ''
    });
    setTimeout(function () {
      that.setData({
        rippleStyle: 'top:' + y + 'px;left:' + x + 'px;animation: ripple 0.2s linear;animation:ripple 0.2s linear;'
      });
    }, 200)
  }, 
  // 获取文章与案例列表
  getDetails: function (i) {
    var that = this
    app._http.http_get('/article/getarticlelist?lawyerid=' + app.globalData.lawyerid+'&pagesize='+i+'&limit=6', res => {
      // console.log(res)
      that.setData({
        articleList: res.result,
        bannerList: Math.ceil(res.result.count / 6)
      })
    })
  },
  // 跳转文章详情
  entryCaseDetails: function(e) {
    // console.log(e.currentTarget.id)
    wx.navigateTo({
      url: '../articleDetails/articleDetails?articleid='+e.currentTarget.id,
    })
  },
  // 向前翻页
  prevBtn: function () {
    var that = this
    if (that.data.idx <= 1) {
      that.setData({
        idx: that.data.bannerList
      })
    } else {
      that.setData({
        idx: Number(that.data.idx - 1)
      })
    }
    that.getDetails(that.data.idx)
  },
  // 向hou翻页
  nextBtn: function () {
    var that = this
    if (that.data.idx >= that.data.bannerList) {
      that.setData({
        idx: 1
      })
    } else {
      that.setData({
        idx: Number(that.data.idx + 1)
      })
    }
    that.getDetails(that.data.idx)
  },
  // 点击角标
  indexBtn: function (e) {
    var that = this
    if (e.currentTarget.id == that.data.idx) {
      return
    } else {
      that.setData({
        idx: e.currentTarget.id
      })
      that.getDetails(that.data.idx)
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    that.getDetails(that.data.idx)
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
  onShareAppMessage: function (res) {
    var that = this
    return {
      title: '文章与案例',
      path: 'pages/cases/cases',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})