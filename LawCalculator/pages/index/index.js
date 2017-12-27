//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    main_func: 
    [{icon: '/imgs/1.png',text: '律师费'},
    {icon: '/imgs/11.png',text: '诉讼费'},
    {icon: '/imgs/15.png',text: '仲裁费'},
    {icon: '/imgs/16.png',text: '逾期利息'}]
    // {icon: '/imgs/3.png',text: '公证费'},
    // {icon: '/imgs/2.png',text: '违约金'},
    // {icon: '/imgs/9.png',text: '算天数'},
    // {icon: '/imgs/10.png',text: '司法鉴定'},
    // {icon: '/imgs/5.png',text: '拍卖佣金'}
  },

  onLoad: function () {
    
  },

  gotoCal: function (e) {
    var target = e.target.id
    switch (target) {
      case "仲裁费":
        wx.navigateTo({
          url: '../arbitration/arbitration',
        })
        break;
      case "律师费":
        wx.navigateTo({
          url: '../legalfee/legalfee',
        })
        break;
      case "诉讼费":
        wx.navigateTo({
          url: '../litigation/litigation',
        })
        break;
      case "公证费":
        
        break;
      case "违约金":
        
        break;
      case "算天数":
        
        break;
      case "逾期利息":
        wx.navigateTo({
          url: '../overdueInterest/overdueInterest',
        })
        break;
      case "司法鉴定":
        
        break;
      case "拍卖佣金":
        
        break;
    }
  },

  onShareAppMessage: function() {
    
  }
})
