const app = getApp();
const formcheck = require('../../utils/formcheck.js');
const Util = require('../../utils/util.js');
const Base = require('../../utils/base.js');
const Req = require('../../utils/request.js');
const VM = {
    data: {
        swiperIndex: 0,
        bannerList: [],

        statusArr: [{
                className: 'status01',
                txt: '未开始'
            },
            {
                className: 'status02',
                txt: '进行中'
            },
            {
                className: 'status03',
                txt: '已结束'
            }
        ],
        // pagination
        list: [],
        current: 0,
        rownum: 10,
        totalPage: 1,
        total: 0,
        isEmpty: false,

        isVip: true //是否vip 默认不显示
    }
}

VM.init = function() {
    Req.request('getBannerList', null, {
        method: 'get'
    }, res => {
        console.log(res);
        this.setData({
            bannerList: res.data
        })
    })
    this.getList()
    let token = wx.getStorageSync('token')
    if (token) {
        app.checkAuthorize(null,()=>{
            wx.reLaunch({url:'/pages/login/login'})
        })
        Req.request('getUserInfo', null, {
            method: 'get'
        }, (res) => {
            this.setData({
                isVip: res.data.root == 1 ? false : true
            })
        })
    }
}

VM.onLoad = function(query) {
    this.init()
    Base.onLoad(this)
    if (wx.getStorageSync('token')) {
        app.globalData.isLogined = true
    }
}

VM.onReachBottom = function() {
    this.getList()
}

VM.onShareAppMessage = function() {
    return {
        title: "分享标题",
        path: '/pages/index/index',
        imageUrl: ''
    }
}

// 轮播
VM.changeSwiper = function(e) {
    let current = e.detail.current
    this.setData({
        swiperIndex: current
    })
}

// 获取活动列表
VM.getList = function() {
    if (this.data.current >= this.data.totalPage) {
        return Util.Toast('没有更多啦~')
    }
    Req.request('getActivityList', {
        page: this.data.current + 1,
        rownum: this.data.rownum,
    }, {
        method: 'get'
    }, (res) => {
        let oldList = this.data.list
        let newList = res.data.list
        let pagination = res.data.pagination
        newList.forEach(item => {
            item.start_date = item.start_date.substr(0, 11)
            item.end_date = item.end_date.substr(0, 11)
        })
        this.setData({
            list: oldList.concat(newList),
            current: pagination.page * 1,
            rownum: pagination.rownum * 1,
            total: pagination.total * 1,
            totalPage: pagination.total_page * 1,
            isEmpty: pagination.total * 1 <= 0 ? true : false
        })
    })
}

Page(VM)
