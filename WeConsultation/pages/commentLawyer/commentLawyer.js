// commentLawyer.js
var isAnonymousf = true
var isAnonymouss = true

var that
var caseInfo
var app = getApp()
var common = require('../../utils/common.js')

var id

var content_one = "这个律师解答不错"
var content_two = "这个律师解答不错"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stars: [0, 1, 2, 3, 4],
    stars2: [0, 1, 2, 3, 4],
    normalSrc: '../../images/normal.png',
    selectedSrc: '../../images/selected.png',
    halfSrc: '../../images/half.png',
    key: 4,//评分
    key2: 4,
    checkPic: '../../images/19.png',
    checkPics: '../../images/19.png',
    firstReplyInfo: {},
    secondReplyInfo: {},
    para: {
      question_id: '',
      lawyer_user_id_one: '',
      score_one: '',
      anonymity_one: '',
      content_one: '',
      lawyer_user_id_two: '',
      score_two: '',
      anonymity_two: '',
      content_two: '',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    id = options.id;
    that = this

    app.func.reqPost('/advice/get_info', {
      question_id: id,
      with_details: false,
      with_lawyers: true
    }, function (res) {
      caseInfo = res.result;

      that.setData({
        firstReplyInfo: caseInfo.first_reply_info,
        secondReplyInfo: caseInfo.second_reply_info,
        caseInfo: caseInfo,
      })
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
  onShareAppMessage: function () {
  
  },

  //点击右边,半颗星
  selectLeft: function (e) {
    var key = e.currentTarget.dataset.key
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    this.setData({
      key: key
    })

  },
  //点击左边,整颗星
  selectRight: function (e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      key: key
    })
  },

  //点击右边,半颗星
  selectLeft2: function (e) {
    var key = e.currentTarget.dataset.key
    if (this.data.key2 == 0.5 && e.currentTarget.dataset.key == 0.5) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    this.setData({
      key2: key
    })

  },
  //点击左边,整颗星
  selectRight2: function (e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      key2: key
    })
  },

  isAnonymousf: function(e) {
    if (isAnonymousf) {
      isAnonymousf = false;
      this.setData({
        checkPic: '../../images/20.png'
      })
    } else{
      isAnonymousf = true;
      this.setData({
        checkPic: '../../images/19.png'
      })
    }
  },

  isAnonymousS: function(e) {
    if (isAnonymouss) {
      isAnonymouss = false;
      this.setData({
        checkPics: '../../images/20.png'
      })
    } else {
      isAnonymouss = true;
      this.setData({
        checkPics: '../../images/19.png'
      })
    }
  },

  comment: function(e) {

    if (caseInfo.second_reply_info.lawyer_info) {
      that.setData({
        para: {
          question_id: parseInt(id),
          lawyer_user_id_one: caseInfo.first_reply_info.lawyer_info.user_id,
          score_one: that.data.key,
          anonymity_one: isAnonymousf,
          content_one: content_one,
          lawyer_user_id_two: caseInfo.second_reply_info.lawyer_info.user_id,
          score_two: that.data.key2,
          anonymity_two: isAnonymouss,
          content_two: content_two,
        }
      })
    } else{
      that.setData({
        para: {
          question_id: parseInt(id),
          lawyer_user_id_one: caseInfo.first_reply_info.lawyer_info.user_id,
          score_one: that.data.key,
          anonymity_one: isAnonymousf,
          content_one: content_one,
          lawyer_user_id_two: 0,
          score_two: 0,
          anonymity_two: false,
          content_two: '',
        }
      })
    }



    app.func.reqPost('/advice/reviewall', {
      para: that.data.para
    }, function (res) {
      if (res.isSuc) {
        wx.redirectTo({
          url: '../completeComment/completeComment',
        })
      } else{
        common.showToast(res.message, "loading")
      }
    })
  },

  commentContent1: function(e) {
    content_one = e.detail.value
  },

  commentContent2: function (e) {
    content_two = e.detail.value
  },
})