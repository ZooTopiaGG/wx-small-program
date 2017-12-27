/*适配移动设备 关键代码*/
var deviceWidth = document.documentElement.clientWidth;
if (deviceWidth > 768) deviceWidth = 768;
document.documentElement.style.fontSize = deviceWidth / 7.5 + "px";


/*测试网站点 以及测试网后台站点*/
var href= location.href.split(":")[0];
if(href === "http"){
	var dominsite = 'http://test2.lawyer-says.cn',
	    apisite = 'http://test2.lawyer-says.cn/api',
	    companysite = 'http://company.lawyer-says.cn';
}else{
	var dominsite = 'https://test2.lawyer-says.cn',
	    apisite = 'https://test2.lawyer-says.cn/api',
	    companysite = 'https://company.lawyer-says.cn';
}
/*正式网站点以及正式网后台站点*/
/*var dominsite = 'http://pc2.lawyer-says.cn';
var apisite = 'http://pc2.lawyer-says.cn/api';
var companysite = 'http://company.lawyer-says.com';*/
/*var dominsite = 'http://pc2.lawyer.lc';
var apisite = 'http://pc2.lawyer.lc/api';*/
/*有参数请求*/
function callPost(url, para, callback) {
    $.ajax({
        url: apisite + url,
        type: "POST",
        cache: false,
        data: JSON.stringify(para),
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            if (data.isSuc) {
                if (callback) callback(data);
            }
            else {
                mui.alert(data.message);
                $(".bg2").remove();
            }
        },
        error:function(res){
        	var bug = '<div class="serverBug">'+
					'<div class="error">'+
						'<img src="images/website/error.png"/>'+
						'<p>'+res.status+' 抱歉，你访问的链接出错了！</p>'+
						'<a href="javascript:;" class="backApp">返回</a>'+
					'</div>'+
			'</div>'
			$("body").html(bug);
			$(".backApp").on('tap',function(){
				if(mui.os.android){
					window.location.href = "toAndroid";
				}else{
					window.location.href = "wxd://toIos";
				}
			});
        },
        headers: {
            'appkey': 'MTU4ODEwNTMyNTI=',
            'Content-Type': 'application/json',
            'DeviceType': '2',
            'token': localStorage.getItem("token")
        }
    });
}

function callPostToken(url, para,token,callback){
	$.ajax({
        url: apisite + url,
        type: "POST",
        cache: false,
        data: JSON.stringify(para),
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            if (callback) callback(data);
        },
        error:function(){
        	layer.msg("The server is dead!");
        },
        headers: {
            'appkey': 'MTU4ODEwNTMyNTI=',
            'Content-Type': 'application/json',
            'DeviceType': '2',
            'token': token
        }
    });
}
function callGet(url, callback) {
    $.getJSON(apisite + url, function(data) {
            if (data == null || data == "") {
                console.log("执行命令失败");
                return;
            }
            if (data.isSuc) {
                if (callback) callback(data);
            } else {
                console.log(data.message);
            }
        });
}

//js获取url参数值

function getParam(paramName){
    paramValue = "";
    isFound = false;
    if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
        arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&");
        i = 0;
        while (i < arrSource.length && !isFound) {
            if (arrSource[i].indexOf("=") > 0) {
                if (arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase()) {
                    paramValue = arrSource[i].split("=")[1];
                    isFound = true;
                }
            }
            i++;
        }
    }
    return paramValue;
}
/*js 时间转换*/
function createTime(tt){
    tt.replace(/Date\([\d+]+\)/, function(a) { eval('d = new '+a) });
	var time = new Date(d);
	var time_ = new Date();
	var time1 = time.getTime(time);//发布时间
	var time_1 = time_.getTime(time_);//现在时间
	var jTime = time_1 - time1;
	var days    = jTime / 1000 / 60 / 60 / 24;
	var daysRound   = Math.floor(days);
	var hours    = jTime/ 1000 / 60 / 60 - (24 * daysRound);
	var hoursRound   = Math.floor(hours);
	var minutes   = jTime / 1000 /60 - (24 * 60 * daysRound) - (60 * hoursRound);
	var minutesRound  = Math.floor(minutes);
	var seconds   = jTime/ 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
	var secondsRound = Math.floor(seconds);
	if(daysRound>0){
		return daysRound+"天前";
	}else{
		if(hoursRound>0){
			return hoursRound+"小时前";
		}else{
			if(minutesRound>0){
				return minutesRound+"分钟前";
			}else{
				if(secondsRound>0){
					return "1分钟内";
				}
			}
		}
	}
 }
/*js 标准时间转换成date日期格式*/
function createTime1(tt){
	tt.replace(/Date\([\d+]+\)/, function(a) { eval('d = new '+a) });
	var time = new Date(d);
	var y = time.getFullYear();
    var m = time.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = time.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = time.getHours();
    var minute = time.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var seconds = time.getSeconds();
    seconds = seconds < 10 ? ('0' + seconds) : seconds;
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+seconds;
}
function createTime2(tt){
	tt.replace(/Date\([\d+]+\)/, function(a) { eval('d = new '+a) });
	var time = new Date(d);
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

function createTime3(tt){
	tt.replace(/Date\([\d+]+\)/, function(a) { eval('d = new '+a) });
	var time = new Date(d);
	var y = time.getFullYear();
    var m = time.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = time.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = time.getHours();
    var minute = time.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    return m + '/' + d;
}
function createTime4(){
	var time = new Date();
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

function tenderTime(){
	var time = new Date();
	var y = time.getFullYear();
    var m = time.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = time.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = time.getHours();
    var minute = time.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second = time.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    return h + ':' + minute + ':' + second;
}
/*动画函数*/
function anim(e0){
	 e0.toggleClass('flipInX animated');
	 e0.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e){
		 $(e.target).removeClass('flipInX animated');
	 });
}
function anim1(e1){
	  e1.toggleClass('fadeInRightBig animated1');
	  e1.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e){
	    $(e.target).removeClass('fadeInRightBig animated1');
	  
	});
}
function anim2(e2){
	  e2.toggleClass('fadeInLeftBig animated2');
	  e2.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e){
	    $(e.target).removeClass('fadeInLeftBig animated2');
	});
}
function anim3(e3){
	  e3.toggleClass('fadeInUp animated3');
	  e3.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e){
	    $(e.target).removeClass('fadeInUp animated3');
	});
}
function anim4(e4){
	  e4.toggleClass('fadeInDown animated4');
	  e4.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e){
	    $(e.target).removeClass('fadeInDown animated4');
	});
}

function downapp(){
	var doc = '<div class="onlyWeixin">'+
		'<div class="wxContent">'+
			'<p class="point">'+
				'<img src="images/website/point.png" alt="律师说" />'+
			'</p>'+
			'<p>'+
				'<span class="ranger">1</span> <span>点击右上方的 <i class="btnStyle2"></i> 按钮</span>'+
			'</p>'+
			'<p>'+
				'<span class="ranger">2</span> <span>选择 <i class="btnStyle3"></i> 在Safari中打开</span>'+
			'</p>'+
		'</div>'+
	'</div>';
	return doc;
}

/*weixinfenxiang*/
/*微信分享功能**********************/
function sharefromwx(arg){
	var url = location.href.split('#')[0];
	var para = {
		url:url
	};
	callPost("/pay/GetWXShareInfo", para, function (res) {
	    if(res.isSuc){
	    	console.log(res.result);
	    	var data = JSON.parse(res.result);
	    	wx.config({
			    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			    appId: data.appId, // 必填，公众号的唯一标识
			    timestamp: data.timestamp, // 必填，生成签名的时间戳
			    nonceStr: data.noncestr, // 必填，生成签名的随机串
			    signature: data.signature,// 必填，签名，见附录1
			    jsApiList: ['onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone','onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
			wx.ready(function(){
				//分享到朋友圈
				wx.onMenuShareTimeline({
				    title: arg.title, // 分享标题
				    link: data.url, // 分享链接
				    imgUrl: arg.pic, // 分享图标
				    success: function () { 
				        // 用户确认分享后执行的回调函数
				        layer.msg('分享成功');
				    },
				    cancel: function () { 
				        // 用户取消分享后执行的回调函数
				         layer.msg('分享失败');
				    }
				});
				//分享给好友
				wx.onMenuShareAppMessage({
				    title: arg.title, // 分享标题
				    desc: arg.desc, // 分享描述
				    link: data.url, // 分享链接
				    imgUrl: arg.pic, // 分享图标
				    type: '', // 分享类型,music、video或link，不填默认为link
				    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				    success: function () { 
				        // 用户确认分享后执行的回调函数
				        layer.msg('分享成功');
				    },
				    cancel: function () { 
				        // 用户取消分享后执行的回调函数
				       layer.msg('分享失败');
				    }
				});
				//分享到qq
				wx.onMenuShareQQ({
				    title: arg.title, // 分享标题
				    desc: arg.desc, // 分享描述
				    link:data.url, // 分享链接
				    imgUrl: arg.pic, // 分享图标
				    success: function () { 
				       // 用户确认分享后执行的回调函数
				      layer.msg('分享成功');
				    },
				    cancel: function () { 
				       // 用户取消分享后执行的回调函数
				      layer.msg('分享失败');
				    }
				});
				//分享到QQ空间
				wx.onMenuShareQZone({
				    title: arg.title, // 分享标题
				    desc: arg.desc, // 分享描述
				    link: data.url, // 分享链接
				    imgUrl: arg.pic, // 分享图标
				    success: function () { 
				       // 用户确认分享后执行的回调函数
				       layer.msg('分享成功');
				    },
				    cancel: function () { 
				        // 用户取消分享后执行的回调函数
				        layer.msg('分享失败');
				    }
				});
			});
			
			wx.error(function(res){
				console.log(res);
			});
	    }else{
	    	layer.msg("服务器无响应");
	    }
	});
	
}