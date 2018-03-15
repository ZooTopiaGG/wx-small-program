// pages/linkme/linkme.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addrInfo: {},
    // 加载地图时获得的标记
    markers: [{
      iconPath: "../../images/position.png",
      id: 0,
      latitude: 23.10229,
      longitude: 113.3245211
    }],
    // 指定一系列坐标点，从数组第一项连线至最后一项 图中红色虚线
    // polyline: [{
    //   points: [{
    //     longitude: 113.3245211,
    //     latitude: 23.10229
    //   }, {
    //     longitude: 113.324520,
    //     latitude: 23.21229
    //   }],
    //   color: "#FF0000DD",
    //   width: 2,
    //   dottedLine: true
    // }],
    // 在地图上显示控件，比如 + - 放大缩小地图等logo也可以
    // controls: [{
    //   id: 1,
    //   iconPath: '../../images/position.png',
    //   position: {
    //     left: 0,
    //     top: 300 - 50,
    //     width: 50,
    //     height: 50
    //   },
    //   clickable: true
    // }],
    // 在地图上显示一个范围（圆）
    // circles: [{
    //   latitude: 23.099994,
    //   longitude: 113.324520,
    //   color: '#FF0000DD',
    //   fillColor: '#7cb5ec88',
    //   radius: 200, // 范围
    //   strokeWidth: 1
    // }]
  },
  // 30.6564439320,104.0803047282
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.setNavigationBarTitle({
      title: '联系我',
    })
    // 获取拜访信息
    app._http.http_get('/user/getvisitinfo?lawyerid=' + app.globalData.lawyerid, res => {
      // console.log(res)
      var lat = Number(res.result.lat - 0.005821068)
      var lng = Number(res.result.lng - 0.0068372718)
      that.setData({
        addrInfo: res.result,
        // 设置地图初始化坐标
        markers: [{
          iconPath: "../../images/position.png",
          id: 0,
          latitude: lat,
          longitude: lng,
          width: 30,
          height: 48,
          title: res.result.practicelaw +'\n'+ res.result.address
        }],
      })
    })
  },
  markertap (e) {
    var that = this
    var lat = Number(that.data.addrInfo.lat - 0.005821068)
    var lng = Number(that.data.addrInfo.lng - 0.0068372718)
    // 打开地图 设置参数
    wx.openLocation({
      latitude: lat,
      longitude: lng,
      scale: 18,
      name: that.data.addrInfo.practicelaw,
      address: that.data.addrInfo.address
    })
  },
  regionchange (e) {
    console.log(e.type)
  },
  // markertap(e) {
  //   console.log(e.markerId)
  // },
  controltap (e) {
    console.log(e.controlId)
  },
  // 拨打电话
  calltap (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.addrInfo.tel,
      success: function (e) {
        console.log(e)
      },
      fail: function (e) {
        console.log(e)
      },
      complete: function (e) {
        console.log(e)
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
  onShareAppMessage: function (res) {
    var that = this
    return {
      title: '联系方式',
      path: 'pages/linkme/linkme',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})