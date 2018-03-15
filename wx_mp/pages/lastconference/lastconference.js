// index.js
var n = 1000
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dotAnData: {},
    n: ''
  },
  onLoad: function () {
    var i = 0

    var dotAnData = wx.createAnimation({
      duration: 1000,
      transformOrigin: '50% 50% 0'
    })
    var dotAnFun = setInterval(function () {
      dotAnData.rotate(45 * (++i)).step()
      this.setData({
        dotAnData: dotAnData.export()
      })
    }.bind(this), 1000)
  },
  getseq: function (e) {
    var _that = this;
    wx.scanCode({
      success: function (res) {
        console.log("成功")
        console.log(res)//打印res查看扫码结果
        if (res.result) {//将得到的数据放到input输入框去
          _that.setData({
            termSeq: res.result
          })
        }
      },
      fail: function (res) {
        console.log("失败")
        console.log(res)
      }
    })
  }
})