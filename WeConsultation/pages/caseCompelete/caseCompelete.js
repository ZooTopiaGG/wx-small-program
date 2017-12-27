var that

Page({
  data:{

  },
  onLoad:function(options){
    that = this;
  },
  onReady:function(){

  },

  onShow:function(){
    // 页面显示
    
  },

  gotoMyCase: function() {
    wx.redirectTo({
      url: '../myCase/myCase'
    })
  },

  goHome: function() {
    wx.switchTab({
      url: '../home/home',
    })
  }

})

