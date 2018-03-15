
function showToast(name, toastType) {
  wx.showToast({
    title: name,
    icon: toastType,
    duration: 1000,
  })
}
function showToast1(name, toastType, duration) {
  wx.showToast({
    title: name,
    icon: toastType,
    duration: duration
  })
}

function createTime2(tt) {
  tt.replace(/Date\([\d+]+\)/, function (tt) { JSON.stringify('d = new ' + tt) });
  var time = new Date(tt);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = time.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = time.getHours();
  var minute = time.getMinutes();
  minute = minute < 10 ? ('0' + minute) : minute;
  return y + '-' + m + '-' + d;
}

function createTime(tt) {
  var strs = tt.split("(")
  var strs2 = strs[1];
  var date = strs2.split("+")[0]

  var time = new Date(Number(date));
  var time_ = new Date();
  var time1 = time.getTime(time);//发布时间
  var time_1 = time_.getTime(time_);//现在时间
  var jTime = time_1 - time1;
  var days = jTime / 1000 / 60 / 60 / 24;
  var daysRound = Math.floor(days);
  var hours = jTime / 1000 / 60 / 60 - (24 * daysRound);
  var hoursRound = Math.floor(hours);
  var minutes = jTime / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
  var minutesRound = Math.floor(minutes);
  var seconds = jTime / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
  var secondsRound = Math.floor(seconds);
  if (daysRound > 0) {
    if (daysRound > 7) return "一周前";
    else return daysRound + "天前";
  } else {
    if (hoursRound > 0) {
      return hoursRound + "小时前";
    } else {
      if (minutesRound > 0) {
        return minutesRound + "分钟前";
      } else {
        if (secondsRound > 0) {
          return "刚刚";
        }
      }
    }
  }
}

function numData(n) {
  if (n / 1000 <= 1) {
    return n;
  } else {
    var b = n / 1000;
    var c = b.toFixed(2);
    return c + "k";
  }
}

function compTime(btime,etime) {
  var beginTime = btime;
  var endTime = etime;
  var beginTimes = beginTime.substring(0, 10).split('-');
  var endTimes = endTime.substring(0, 10).split('-');

  beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + beginTime.substring(10, 16);
  endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 16);
  console.log(beginTime)
  var a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
  if (a < 0) {
    return 'small'
  } else if (a > 0) {
    return 'large'
  } else if (a == 0) {
    return 'equal'
  } else {
    return 'exception'
  }
}
module.exports.showToast = showToast
module.exports.showToast1 = showToast1
module.exports.createTime = createTime
module.exports.numData = numData
module.exports.compTime = compTime