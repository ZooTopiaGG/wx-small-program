var app = getApp()
var common = require('../../utils/common.js')
var page = 1;
var that

Page({
  data:{
    caseArray:"",
    lawyerSayUserInfo: ""
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    
  },
  onReady:function(){
    that = this;

    app.getLawyerSayUserInfo(function(lawyerSayUserInfo){
      //更新数据
      that.setData({
        lawyerSayUserInfo:lawyerSayUserInfo
      })
    })

    // 页面渲染完成
    
    //案例列表
    that.refresh()
  },
  onShow:function(){
    // 页面显示
    
  },
  onHide:function(){
    // 页面隐藏
    
  },
  onUnload:function(){
    // 页面关闭
    
  },

  //下拉刷新
  onPullDownRefresh: function() {
     that.refresh()
  },

  refresh: function() {
    page = 1;
    app.func.reqPost('/advice/get_list/public', {
      page: page,
      law_code: "0"
    },function(res){ 
      wx.stopPullDownRefresh();
      if (res.isSuc) {
        that.setData({
          caseArray: res.result
        })
      } else{
        common.showToast(res.message,'loading')
      }
    }); 
  },

  goToConsultation: function() {
    wx.navigateTo({
        url: '../consultation/consultation'
    })
  },

  lower: function() {
    that.loadMore()
  },

  loadMore: function() {
    page++;
    common.showToast("加载中", "loading")
    app.func.reqPost('/advice/get_list/public', {
      page: page,
      law_code: "0"
    },function(res) {
        if (res.isSuc) {
            that.setData({
                caseArray: that.data.caseArray.concat(res.result)
            })
        } else{
          page--
        }
    })
  },
})

