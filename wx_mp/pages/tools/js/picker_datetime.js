var pickerDatetime = function(obj) {
  //初始化参数
  var _this = this;
  this.page = obj.page;
  this.height = obj.height != undefined ? obj.height : 600;
  this.success = obj.success != undefined ? obj.success : function(){};
  var pickerToolHeight = 100;
  this.page.setData({pickerViewHeight:this.height - pickerToolHeight});
  //是否有动画效果，设置属性，按钮
  this.pickerTimeout = null;
  if (obj.animation == 'slide' || obj.animation == 'fade') {
    this.animationType = 'slide';
    this.duration = obj.duration != undefined ? obj.duration : 500;
    this.TimingFunction = obj.timingFunction != undefined ? obj.timingFunction : 'linear';
    this.thisDelay = obj.delay != undefined ? obj.delay : 0;
    this.animation = obj.animation;
    this.page.pickerClear = function(){
      var newObj = {};
      newObj[_this.pickerName] = '';
      newObj['pickerAnimation'] = _this.pickerHideAnimation.export();
      clearTimeout(_this.pickerTimeout);
      _this.pickerTimeout = setTimeout(function() {
        _this.page.setData({pickerViewShow:false});
      },_this.duration);
      this.setData(newObj);
    };
    this.page.pickerOk = function(){
      var newObj = {};
      newObj['pickerAnimation'] = _this.pickerHideAnimation.export();
      this.setData(newObj);
      clearTimeout(_this.pickerTimeout);
      _this.pickerTimeout = setTimeout(function() {
        _this.page.setData({pickerViewShow:false});
      },_this.duration);
      _this.success();
    };
  } else {
    this.animation = '';
    this.page.pickerClear = function(){
      var newObj = {};
      newObj[_this.pickerName] = '';
      newObj['pickerViewShow'] = false;
      this.setData(newObj);
    };
    this.page.pickerOk = function(){
      this.setData({pickerViewShow:false});
      _this.success();
    };
  }
  
};
//启用时间选择器的方法
pickerDatetime.prototype.setPicker = function(pickerName) {
  var _this = this;
  var pickerPreFlag = false;
  if (this.page.data[pickerName] == undefined || this.page.data[pickerName] == '') {
    //未有原先值，不处理
    var pickerPreDate = new Date();
    var pickerPreYear = pickerPreDate.getFullYear();
    var pickerPreMonth = pickerPreDate.getMonth()+1;
    var pickerPreDay = pickerPreDate.getDate();
    var pickerPreHour = pickerPreDate.getHours();
    var pickerPreMinute = pickerPreDate.getMinutes();
    var obj = new Object();
    obj[pickerName] = pickerPreYear + '-' + pickerPreMonth + '-' + pickerPreDay +' '+ addDatetimeZero(pickerPreHour)+':' + addDatetimeZero(pickerPreMinute);
    this.page.setData(obj);
  } else {
    var pickerPreDate = new Date(Date.parse(this.page.data[pickerName].replace('年','/').replace('月','/').replace('日','/')));
    var pickerPreYear = pickerPreDate.getFullYear();
    var pickerPreMonth = pickerPreDate.getMonth()+1;
    var pickerPreDay = pickerPreDate.getDate();
    var pickerPreHour = pickerPreDate.getHours();
    var pickerPreMinute = pickerPreDate.getMinutes();
    
  }
  this.pickerName = pickerName;
  this.pickerDateTextArr = [];
  this.pickerDateValueArr = [];
  this.pickerHourTextArr = [];
  this.pickerHourValueArr = [];
  this.pickerMinuteTextArr = [];
  this.pickerMinuteValueArr = [];
  var pickerNowDate = new Date();
  var pickerNowYear = pickerNowDate.getFullYear();
  var pickerNowHour = pickerNowDate.getHours();
  var pickerNowMinute = pickerNowDate.getMinutes();
  var pickerOldYearDate = new Date (pickerNowYear - 1,2,0);
  var pickerOldYearDayNum = 365;
  if (pickerOldYearDate.getDate() == 29 ) pickerOldYearDayNum=366;
  var pickerNowMonth = pickerNowDate.getMonth() + 1;
  var pickerNowDay = pickerNowDate.getDate();
  var pickerWeekArr = ["日","一","二","三","四","五","六"];
  var pickerDateIndex=0;
  var pickerHourIndex=0;
  var pickerMinuteIndex=0;
  //获取年月日选择数组
  for (let y = pickerNowYear-1; y <= pickerNowYear+1; y++) {
    for (let m = 1 ; m <= 12; m++) {
      let newDate = new Date(y,m,0);
      let m_days = newDate.getDate();
      for (let d = 1; d <= m_days; d++){
        let newDate = new Date(y,m-1,d);
        let w = pickerWeekArr[newDate.getDay()];
        if (d == pickerPreDay && m == pickerPreMonth && y==pickerPreYear) {
          pickerDateIndex = parseInt((new  Date(y+'/'+m+'/'+d) - new Date((pickerNowYear-1)+'/1/1'))/1000/60/60/24);
        }
        if (d == pickerNowDay && m == pickerNowMonth && y==pickerNowYear) {
          this.pickerDateTextArr.push('今日');
        } else {
          this.pickerDateTextArr.push(m+'月'+d+'日 星期' + w);
        }
        this.pickerDateValueArr.push(y+'-'+m+'-'+d+'');
      } 
    }
  }
  //获取小时和分钟的数组，设置默认值
  if (pickerPreFlag) {
    for (let i=0;i < 24; i++ ) {
      this.pickerHourValueArr.push(i);
      this.pickerHourTextArr.push(addDatetimeZero(i));
      if (pickerPreHour == i) pickerHourIndex=i;
    }
    for (let i=0;i < 60; i++ ) {
      this.pickerMinuteValueArr.push(i);
      this.pickerMinuteTextArr.push(addDatetimeZero(i));
      if (pickerPreMinute == i) pickerMinuteIndex = i;
    }
  } else {
    for (let i=0;i < 24; i++ ) {
      this.pickerHourValueArr.push(i);
      this.pickerHourTextArr.push(addDatetimeZero(i));
      if (pickerNowHour == i) pickerHourIndex=i;
    }
    for (let i=0;i < 60; i++ ) {
      this.pickerMinuteValueArr.push(i);
      this.pickerMinuteTextArr.push(addDatetimeZero(i));
      if (pickerNowMinute == i) pickerMinuteIndex = i;
    }
  }
  //setData调用页面的选择器值、默认值
  var newObj = {};
  newObj['pickerDateTextArr'] = this.pickerDateTextArr;
  newObj['pickerHourTextArr'] = this.pickerHourTextArr;
  newObj['pickerMinuteTextArr'] = this.pickerMinuteTextArr;
  newObj['pickDatetimeValue'] = [pickerDateIndex, pickerHourIndex, pickerMinuteIndex];
  this.page.setData(newObj);
  if (this.animation == '') {
    //无动画
    this.page.setData({pickerViewShow:true});
  } else {
    //创建动画（由于只创建一个调用测试有问题，这里创建两个各自使用）
    var pickerShowAnimationType = wx.createAnimation({
      duration: _this.duration,
      timingFunction: _this.thisTimingFunction,
      delay: _this.thisDelay,
      transformOrigin: '50% 50% 0',
      success: function(res) {
      }
    });
    
    var pickerHideAnimationType = wx.createAnimation({
      duration: _this.duration,
      timingFunction: _this.TimingFunction,
      delay: _this.Delay,
      transformOrigin: '50% 50% 0',
      success: function(res) {

      }
    });
    clearTimeout(this.pickerTimeout);
    if (this.animation == 'slide') {
      this.pickerShowAnimation = pickerShowAnimationType.height(this.height + 'rpx').step();
      this.pickerHideAnimation = pickerHideAnimationType.height(0).step();
      this.page.setData({pickerViewShow:true,pickerViewStyle:'height:0;'});
    } else {
      this.pickerShowAnimation = pickerShowAnimationType.opacity(1).step();
      this.pickerHideAnimation = pickerHideAnimationType.opacity(0).step();
      this.page.setData({pickerViewShow:true,pickerViewStyle:'opacity:0;'});
      
      
    }
    this.page.setData({
      pickerAnimation:_this.pickerShowAnimation.export()
    })
  }

  //设置bindChange事件
  this.page.bindChange = function(e) {
    var val = e.detail.value
    var newObj = {};
    newObj[pickerName] = _this.pickerDateValueArr[val[0]]+ ' ' + _this.pickerHourTextArr[val[1]]+':'+ _this.pickerMinuteTextArr[val[2]];
    this.setData(newObj);
  };

};
module.exports = {
  pickerDatetime : pickerDatetime,
}

function addDatetimeZero(num){        
  return new Array(2 - num.toString().length + 1).join("0") + num;
}