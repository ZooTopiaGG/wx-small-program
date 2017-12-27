var app = getApp()
var common = require('../../utils/common.js')
var page = 1;
var that;
var role;

Page({
  data:{
    caseArray:"",
    lawyerSayUserInfo: "",
    orderType:[]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    that = this;
  },
  onReady:function(){
    // 页面渲染完成
    page = 1;

    app.getLawyerSayUserInfo(function(lawyerSayUserInfo){
      //更新数据
      that.setData({
        lawyerSayUserInfo:lawyerSayUserInfo
      })
    })

    role = that.data.lawyerSayUserInfo.Role;
    
    //案例列表·
    //不区分用户、律师
    //if(role == 1){
    app.func.reqPost('/uc/publish_history_list', { 
      para: {
        order_type: 0,
        page_index: page,
        page_size: 10
      }
    },function(res){
      console.log(1)
      console.log(res)
      if (res.isSuc) {
        that.setArrayData(res.result);
      } else{
        common.showToast(res.message,'loading')
      }
    });
    // } else {
    //   app.func.reqPost('/uc/grab_history_list', {
    //     para: {
    //       order_type: 0,
    //       page_index: page,
    //       page_size: 10
    //     }
    //   },function(res){ 
    //     console.log(2)
    //     console.log(res)
    //     if (res.isSuc) {
    //       that.setArrayData(res.result);
    //     } else{
    //       common.showToast(res.message,'loading')
    //     }
    //   })
    //}  
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
    page = 1;
    if (role == 1) {
      app.func.reqPost('/uc/publish_history_list', { 
        para: {
          order_type: 0,
          page_index: page,
          page_size: 10
        }
      },function(res){ 
        wx.stopPullDownRefresh();
        if (res.isSuc) {
          that.setArrayData(res.result);
        } else{
          common.showToast(res.message,'loading')
        }
      });  
    }  else {
      app.func.reqPost('/uc/grab_history_list', {
        para: {
          order_type: 0,
          page_index: page,
          page_size: 10
        }
      },function(res){ 
        if (res.isSuc) {
          that.setArrayData(res.result);
        } else{
          common.showToast(res.message,'loading')
        }
      })
    }  
  },

  // lower: function(e) {
  //   console.log("lower" + e)
  // },

  //上拉加载更多
  onReachBottom: function() {
    page++;
    if (role == 1) {
      app.func.reqPost('/uc/publish_history_list', { 
        para: {
          order_type: 0,
          page_index: page,
          page_size: 10
        }
      },function(res){ 
        wx.stopPullDownRefresh();
        if (res.isSuc) {
          if (res.result && res.result.length > 0) {
            for (var i=0; i<res.result.length; i++) {
              res.result[i].create_time = common.createTime(res.result[i].create_time);
            }
            that.setData({
              caseArray: that.data.caseArray.concat(res.result)
            })
          } else {
            common.showToast('没有更多了','loading')
            page--
          }
        } else{
          common.showToast(res.message,'loading')
          page--
        }
      });  
    }  else {
      app.func.reqPost('/uc/grab_history_list', {
        para: {
          order_type: 0,
          page_index: page,
          page_size: 10
        }
      },function(res){ 
        if (res.isSuc) {
          if (res.result && res.result.length > 0) {
            for (var i=0; i<res.result.length; i++) {
              res.result[i].create_time = common.createTime(res.result[i].create_time);
            }
            that.setData({
              caseArray: that.data.caseArray.concat(res.result)
            })
          } else {
            common.showToast('没有更多了','loading')
            page--
          }
        } else{
          common.showToast(res.message,'loading')
          page--
        }
      })
    } 
  },

  //设置订单状态
  setArrayData: function(array) {
    for (var i=0; i<array.length; i++) {
          array[i].create_time = common.createTime(array[i].create_time);
          switch(array[i].state) {
            case -1:
              array[i].state="已撤单";
              break;
            case 1:
              array[i].state="未付款";
              break;
            case 2:
              array[i].state="未接单";
              break;
            case 3:
              array[i].state="待解决";
              break;
            case 4:
              array[i].state="已解答";
              break;
            case 5:
              array[i].state="待评价";
              break;
            case 6:
              array[i].state="未分配";
              break;
            case 7:
              array[i].state="已解决";
              break;
            case 8:
              array[i].state="已解决";
              break;
          }
        }

        that.setData({
          caseArray: array
        })
  },

  //跳转到订单详情
  goToCaseDetail: function(e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../getCaseDetail1/getCaseDetail1?id=' + id +"&cate=" + 1,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  }
})

