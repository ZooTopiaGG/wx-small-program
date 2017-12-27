// techUse.js
var that

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [
      { 
        title: "•	咨询后多久解答？", 
        content: "支付并发布成功后，正常作息时间内， 律师会在10分钟以内响应，30分钟内即可得到律师解答；如果深夜发布咨询，偶尔会有延后。",
        hidd: false,
      },
      {
        title: "•	没有律师解答怎么办？",
        content: "如果您的咨询在24小时内都无任何律师响应解答，我们将自动为您办理全额退款，最迟下一个工作日到达您支付的账户中，使您的权益得到保障。",
        hidd: false,
      },
      {
        title: "•	解答咨询的都是律师么？",
        content: "律师说平台所有律师，均经过严格的法律从业资质审核后，才能为您提供解答咨询的服务；",
        hidd: false,
      },
      {
        title: "•	担心解答不满意怎么办？",
        content: "我们引入了最多两位律师参与解答的机制，您可以根据解答对您的有用程度分配不同比例的咨询费，咨询完成后还能给予律师客观的评价；同时其他用户对律师的评价也会帮助你选择更合适的律师进行咨询解答。",
        hidd: false,
      },
      {
        title: "•	什么是一对一电话咨询？",
        content: "优选律师为您提供一对一的电话+文字解答的咨询服务，除去必须的文字解答，还将由律师发起的对双方电话加密的通话，能更方便快捷的解决问题。 ",
        hidd: false,
      },
      {
        title: "•	我不想我咨询的问题被别人看到",
        content: "律师说平台使用了业界领先的SHA-256高强度加密标准，为用户隐私保驾护航；您发布咨询时，只有接单律师和您本人才能看到咨询的问题。咨询结束后，我们将对展示案例中涉及个人隐私的部分进行处理，当然您也可以随时进入订单中心，将咨询订单设置为不公开展示。",
        hidd: false,
      },
      {
        title: "咨询小技巧，如何更聪明的提问",
        content: '',
        hidd: false,
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
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
  onShareAppMessage: function () {
  
  },

  showOrHiddenContent: function (e) {
    var idx = e.currentTarget.id

    if (idx == 6) {
      wx.previewImage({
        urls: ['http://file.lawyer-says.com/singlePage/images/zxts.png'],
      })
    }

    var newArray = that.data.array
    newArray[idx].hidd = that.data.array[idx].hidd? false : true

    that.setData({
      array: newArray
    })
  }
})