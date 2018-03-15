// create_meeting.js

var pickerFile = require('../tools/js/picker_datetime.js');
var app = getApp()
var common = require('../../utils/common.js')
var https = require('../../utils/https.js')
var myDate = new Date();//获取系统当前时间
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: myDate.getFullYear() + '-0' + myDate.getMonth() + '-' + myDate.getDate(),
    startTime: myDate.getHours() + ':00',
    endDate: myDate.getFullYear() + '-0' + myDate.getMonth() + '-' + myDate.getDate(),
    endTime: (myDate.getHours() + 1) + ':00',
    loadStartTime: myDate.getHours() + ':00',
    meetingID:'',
    metTitle:'',
    name:'',
    address:'',
    hasLocation:false,
    array: ['同学会', '政府会议', '互联网', '培训会', '其他'],
    index:0,
    meetDes:'',
    location:{
      name:'',
      address:'',
      province:'',
      city:'',
      district:''
    },
    adressName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.datetimePicker = new pickerFile.pickerDatetime({
      page: this,
      animation: 'slide',
      duration: 300
    });
    var that = this
    app.func.reqPost('/meet/getmeetinfo',{
      MeetingID: options.meetID
    },function(res){
      if(res.state == 0){
        that.setData({
          meetingID: res.result.ID,
          metTitle: res.result.Title,
          // startDate: res.result.StartTime,
          // endDate: res.result.EndTime,
          meetDes: res.result.Introduce,
          adressName: res.result.Location,
        })
       
      }
    })

  },
  input_title: function (e) {
    this.setData({
      metTitle: e.detail.value,
    })
  },
  input_metDes: function (e) {
    this.setData({
      meetDes: e.detail.value
    })
  },
  // 选择日期
  // 开始日期
  bindDateChange: function (e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  // 结束日期
  bindDateChange2: function (e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  // 开始时间
  bindTimeChange: function (e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  // 结束时间
  bindTimeChange2: function (e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  startTap: function () {
    this.datetimePicker.setPicker('startDate');
  },
  endTap: function () {
    this.datetimePicker.setPicker('endDate');
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  input_location: function (e) {
    this.setData({
      adressName: e.detail.value
    })
  },
  upFile: function () {
    common.showToast1('开发中...', 'loading', 600)
  },
  //选择位置-------
  chooseLocation: function (e) {
    console.log(e)
    var that = this
    wx.chooseLocation({
      success: function (res) {
        // success
        console.log(res)
        wx.setStorageSync("res_loction", res)
        that.setData({
          hasLocation: true,
          location: {
           name:res.name,
           address:res.address
          }
        })
        var latitude = res.latitude;
        var longitude = res.longitude;
        wx.request({

          url: 'http://api.map.baidu.com/geocoder/v2/?ak=rIbNa3jMuBtGyask0EDGV4WmCh9GNR9u&callback=renderReverse&location=' + latitude + ',' + longitude+'&output=json&pois=1',
          data: {},
          method: 'GET',
          success: function (res) {
            var data = res.data
            var newData = data.substring(29, data.length - 1)
            // console.log(data.substring(29, data.length - 1))
            var res_loction = wx.getStorageSync("res_loction")
            var this_res = JSON.parse(newData)
            // console.log(this_res.result.addressComponent.province)
            // console.log(this_res.result.addressComponent.city)
            // console.log(this_res.result.addressComponent.district)
            // console.log(this_res.result.addressComponent)
            that.setData({
              location:{
                province: this_res.result.addressComponent.province,
                city: this_res.result.addressComponent.city,
                district: this_res.result.addressComponent.district,
                address: res_loction.address,
              },
              adressName: res_loction.name
            })
          }
        })

      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  upDataMeetingInfo:function(){
    var metTitle = this.data.metTitle
    var startTime = this.data.startDate + ' ' + this.data.startTime
    var endTime = this.data.endDate + ' ' + this.data.endTime
    var loname = this.data.location.name
    var loaddress = this.data.location.address
    var array = this.data.array
    var index = this.data.index
    // var arrayIndex = this.data.array[index]
    // for(var i=0;i<this.data.array.length;i++){
    //   var arrayIndex = this.data.array[i]
      
    // }
    var metDes = this.data.meetDes
    if (common.compTime(startTime, endTime) == 'small') {
      common.showToast1('开始时间不能晚于结束时间哦', 'loading', 600)
      return
    }
    if (common.compTime(startTime, endTime) == 'equal') {
      common.showToast1('开始时间不能等于结束时间哦', 'loading', 600)
      return
    }
    if (!metTitle){
      common.showToast1('会议标题不能为空', 'loading', 600)
      return  
    }
    if (!loname && !loaddress){
      common.showToast1('会议地点不能为空', 'loading', 600)
      return
    }
    if (!metDes){
      common.showToast1('会议简介不能为空', 'loading', 600)
      return
    }
    else{
      var that = this;
      app.func.reqPost('/meet/update',{
        MeetingID: that.data.meetingID,
        Title: that.data.metTitle,
        Introduce: that.data.meetDes,
        Location: that.data.adressName,
        Coversurl:'http://dwz.cn/5ZBd5U',
        Nature: array[index],
        Chargetype:0,
        Province: that.data.location.province,
        City: that.data.location.city,
        District: that.data.location.district,
        Starttime: that.data.startDate + ' ' + that.data.startTime,
        Endtime: that.data.endDate + ' ' + that.data.endTime,
      },function(res){
        if(res.state == 0){
          console.log('修改成功！')
          console.log(res)
          common.showToast1('修改成功！', 'success', 1000)
          setTimeout(function () {
            wx.switchTab({
              url: '../meeting_list/meeting_list',
            })
          }, 1500)
        }
        else{
          console.log("修改失败！")
          console.log(res)
          common.showToast1('修改失败！', 'loading', 1000)
        }
      })
    }
   
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
  // onShareAppMessage: function () {
  
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  }
})