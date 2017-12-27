var that

Page({
  data:{
    money: null,
    interest_rate: null,
    days: null,
    result: null,
    startDay: '',
    endDay: ''
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    that = this
  },

  reset: function() {
    that.setData({
      money: null,
      interest_rate: null,
      days: null,
      result: null,
      startDay: '',
      endDay: ''
    })
  },

  calculate: function() {
    var money = that.data.money
    var interest_rate = that.data.interest_rate
    var days
    if (that.data.startDay < that.data.endDay) {

      days = that.DateDiff(that.data.startDay, that.data.endDay)
    } else {
      return
    }

    if (!money) {i
      return
    }

    if (!interest_rate) {
      return
    }

    if (!days) {
      return
    }

    var result = money * (interest_rate / 100) * days / 360 + money * (1.75 / 10000) * days
    result = '违约天数：' + days + ',\n违约利息:' + result
    if (result) {
      that.setData({
        result: result
      })
    }
  },

  inputMoney: function(e) {
    that.setData({
      money: e.detail.value
    })
  },

  inputInterestRate: function(e) {
    that.setData({
      interest_rate: e.detail.value
    })
  },

  inputDays: function(e) {
    that.setData({
      days: e.detail.value
    })
  },

  bindStartDateChange: function(e) {
    that.setData({
      startDay: e.detail.value
    })
  },

  bindEndDateChange: function(e) {
    that.setData({
      endDay: e.detail.value
    })
  },

  DateDiff: function(sDate1,  sDate2){    //sDate1和sDate2是2002-12-18格式 
      var  aDate,  oDate1,  oDate2,  iDays 
      aDate  =  sDate1.split("-") 
      oDate1  =  new  Date(sDate1)    //转换为12-18-2002格式 
      aDate  =  sDate2.split("-") 
      oDate2  =  new  Date(sDate2) 
      iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数 
      return  iDays 
  }
})

