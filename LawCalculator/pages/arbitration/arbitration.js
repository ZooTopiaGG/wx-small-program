var that

Page({
  data:{
    result: null,
    money: null,
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    that = this
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
    
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
    
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
    
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
    
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
    
  },

  inputMoney: function(e) {
    that.setData({
      money: e.detail.value
    })
  },

  calculate: function() {
    if (that.data.money) {
      that.setData({
        result: RatioFees(that.data.money)
      })
    }
  },

  reset: function() {
      that.setData({
          money: null,
          result: null
      })
  }
})

function RatioFees(val) {
    /*
    争议金额（人民币）     仲裁案件受理费（人民币）
　　l000元以下的部分              40～100元
　　1001元至50000元的部分        4%～5％交纳
　　50001元至100000元的部分      3%～4％交纳
　　100001元至200000元的部分     2%～3％交纳
　　20000l元至500000元的部分     1%～2％交纳
　　500001元至1000000元的部分    0.5%～1％交纳
　　1000001元以上的部分           0.25%～0.5％交纳
    */

    //当前输入的值
    //初始化区间算法
    var section = new SectionOper();
    var curval = parseFloat(val);
    var IntMoney = 0;
    section.Clear();

    //  l000元以下的部分              40～100元
    if (curval <= 1000) {
        IntMoney = stage1000();
    }
        //1001元至50000元的部分        4%～5％交纳
    else if (curval > 1000 && curval <= 50000) {
        var s1000 = stage1000();
        section.Add(s1000.Min, s1000.Max);
        section.Add(((curval - 1000) * 0.04), ((curval - 1000) * 0.05));
        IntMoney = section.Calculate();
    }
        // 50001元至100000元的部分      3%～4％交纳
    else if (curval > 50000 && curval <= 100000) {
        var s1000 = stage1000();
        var s50000 = stage50000();
        section.Add(s1000.Min, s1000.Max);
        section.Add(s50000.Min, s50000.Max);
        section.Add(((curval - 50000) * 0.03), ((curval - 50000) * 0.04));
        IntMoney = section.Calculate();
    }
        //  100001元至200000元的部分     2%～3％交纳
    else if (curval > 100000 && curval <= 200000) {
        var s1000 = stage1000();
        var s50000 = stage50000();
        var s100000 = stage100000();
        section.Add(s1000.Min, s1000.Max);
        section.Add(s50000.Min, s50000.Max);
        section.Add(s100000.Min, s100000.Max);
        section.Add(((curval - 100000) * 0.02), ((curval - 100000) * 0.03));
        IntMoney = section.Calculate();
    }
        //   20000l元至500000元的部分     1%～2％交纳
    else if (curval > 200000 && curval <= 500000) {
        var s1000 = stage1000();
        var s50000 = stage50000();
        var s100000 = stage100000();
        var s200000 = stage200000();
        section.Add(s1000.Min, s1000.Max);
        section.Add(s50000.Min, s50000.Max);
        section.Add(s100000.Min, s100000.Max);
        section.Add(s200000.Min, s200000.Max);
        section.Add(((curval - 200000) * 0.01), ((curval - 200000) * 0.02));
        IntMoney = section.Calculate();
    }
        //   500001元至1000000元的部分    0.5%～1％交纳
    else if (curval > 500000 && curval <= 1000000) {
        var s1000 = stage1000();
        var s50000 = stage50000();
        var s100000 = stage100000();
        var s200000 = stage200000();
        var s500000 = stage500000();
        section.Add(s1000.Min, s1000.Max);
        section.Add(s50000.Min, s50000.Max);
        section.Add(s100000.Min, s100000.Max);
        section.Add(s200000.Min, s200000.Max);
        section.Add(s500000.Min, s500000.Max);
        section.Add(((curval - 500000) * 0.005), ((curval - 500000) * 0.01));
        IntMoney = section.Calculate();
    }

        //  1000001元以上的部分           0.25%～0.5％交纳
    else if (curval > 1000000) {
        var s1000 = stage1000();
        var s50000 = stage50000();
        var s100000 = stage100000();
        var s200000 = stage200000();
        var s500000 = stage500000();
        var s1000000 = stage1000000();
        section.Add(s1000.Min, s1000.Max);
        section.Add(s50000.Min, s50000.Max);
        section.Add(s100000.Min, s100000.Max);
        section.Add(s200000.Min, s200000.Max);
        section.Add(s500000.Min, s500000.Max);
        section.Add(s1000000.Min, s1000000.Max);
        section.Add(((curval - 1000000) * 0.025), ((curval - 1000000) * 0.005));
        IntMoney = section.Calculate();
    }

    return IntMoney.Min == 0 ? IntMoney.Max : IntMoney.Min.toFixed(2) + "-" + IntMoney.Max.toFixed(2);

    //   l000元以下的部分        40～100元
    function stage1000() {
        return { Min: 40, Max: 100 };
    }
    // 1001元至50000元的部分        4%～5％交纳
    function stage50000() {
        return { Min: (50000 - 1000) * 0.04, Max: (50000 - 1000) * 0.05 };
    }
    //  50001元至100000元的部分      3%～4％交纳
    function stage100000() {
        return { Min: (100000 - 50000) * 0.03, Max: (100000 - 50000) * 0.04 };
    }
    //  100001元至200000元的部分     2%～3％交纳
    function stage200000() {
        return { Min: (200000 - 100000) * 0.02, Max: (200000 - 100000) * 0.03 };
    }
    //  20000l元至500000元的部分     1%～2％交纳
    function stage500000() {
        return { Min: (500000 - 200000) * 0.01, Max: (500000 - 200000) * 0.02 };
    }
    // 500001元至1000000元的部分    0.5%～1％交纳
    function stage1000000() {
        return { Min: (1000000 - 500000) * 0.005, Max: (1000000 - 500000) * 0.01 };
    }
}

/**
律和仲裁费计算器
YP
2016.11.25
*/
function SectionOper() {
    var array = new Array();
    //添加最大值和最小值区间
    this.Add = function (min, max) {
        if (isNaN(min) || isNaN(max)) {
            alert("添加数据类型出错");
            return;
        }
        array.push({ Min: min, Max: max });
    }
    //区间运算
    this.Calculate = function () {
        var minVal = 0;
        var maxVal = 0;
        for (var i = 0; i < array.length; i++) {
            if (array[i]) {
                minVal += parseFloat(array[i].Min);
                maxVal += parseFloat(array[i].Max);
            }
        }
        return { Min: minVal, Max: maxVal };
    }
    //清空
    this.Clear = function () {
        for (var i = 0; i < array.length; i++) {
            delete array[i];
        }
    }
}