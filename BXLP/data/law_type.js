/**
 * Created by Rebecca_Han on 16/10/26.
 */
module.exports = {

}

var lawType= {
        "data": [
        {
            "law_type": "劳动用工",
            "answer_id": 900007,
        }, {
            "law_type": "婚姻继承",
            "answer_id": 900001,
        }, {
            "law_type": "借贷纠纷",
            "answer_id": 900002,
        }, {
            "law_type": "人身损害",
            "answer_id": 900003,
        }, {
            "law_type": "交通事故",
            "answer_id": 900004,
        }, {
            "law_type": "房屋买卖",
            "answer_id": 900005,
        }, {
            "law_type": "消费维权",
            "answer_id": 900006,
        }, 
        // {
        //     "law_type": "更多...",
        //     "answer_id": -1,
        // },
        {
            "law_type": "全部",
            "answer_id": 0,
        }
        ]

}

var cityData= {
        "data": [
        {
            "city_name": "当前城市",
            "city_code": -1,
        }
        , {
            "city_name": "北京",
            "city_code": 110100,
        }, {
            "city_name": "上海",
            "city_code": 310100,
        }, {
            "city_name": "广州",
            "city_code": 440100,
        }, {
            "city_name": "深圳",
            "city_code": 440300,
        }, {
            "city_name": "重庆",
            "city_code": 500100,
        }, {
            "city_name": "杭州",
            "city_code": 330100,
        },  {
            "city_name": "成都",
            "city_code": 510100,
        }, {
            "city_name": "南京",
            "city_code": 320100,
        }, {
            "city_name": "武汉",
            "city_code": 420100,
        }, {
            "city_name": "合肥",
            "city_code": 340100,
        },
        // {
        //     "city_name": "更多...",
        //     "city_code": -2,
        // },
        {
            "city_name": "全部",
            "city_code": 0,
        }
        ]

}

module.exports.lawType = lawType;
module.exports.cityData = cityData;