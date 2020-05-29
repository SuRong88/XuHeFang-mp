const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const Util = require('../../../utils/util.js');
const Base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        query: null,
        id: '',
        downtime: '', //待支付倒计时
        index: -1, //操作订单下标
        showCancel: false,
        showDelete: false,
        orderInfo: null,
        date: '',
        time: '',
        qrcodeUrl: 'https://xcxdemo2.mrxdtech.com/api/public//upload/image/20200426/5ea55eae3b926.jpg',
        iconArr: [32, 33, 34, 35],
        statusArr: ['待支付', '待兑换', '已完成', '已关闭']
    }
}

VM.init = function(query) {
    let id = query.id
    let index = query.index
    if (!id) {
        Util.Toast('缺少必要参数')
        return setTimeout(() => {
            wx.navigateBack({
                delta: 1
            })
        }, 1500)
    }
    this.setData({
        query: query,
        id: id,
        index: index
    })
    Req.request('getOrderDetail', {
        id: id
    }, {
        method: 'get'
    }, (res) => {
        let orderInfo = res.data
        console.log(orderInfo);
        let date = orderInfo.detail[0].spec_type.substring(0, 10)
        let time = orderInfo.detail[0].spec_type.substring(10).trim()
        if (orderInfo.status == 1) {
            console.log('待支付 触发倒计时');
            if (orderInfo.current_time < 0) {
                Util.Toast('订单已关闭', 1500, true)
                return setTimeout(() => {
                    wx.navigateBack({
                        delta: 1
                    })
                }, 1500)
            }
            this.countTime(orderInfo.current_time)
        }
        this.setData({
            orderInfo: orderInfo,
            date: date,
            time: time
        })
    })
}

VM.onLoad = function(query) {
    this.init(query)
    Base.onLoad(this)
}

//取消mask 
VM.showCancelMask = function() {
    this.setData({
        showCancel: true
    })
}
// 删除mask
VM.showDeleteMask = function(e) {
    this.setData({
        showDelete: true
    })
}

// 确认“取消订单”
VM.confirmCancel = function() {
    let id = this.data.id
    let index = this.data.index
    Req.request('cancelOrder', {
        id: id
    }, {
        method: 'put'
    }, (res) => {
        Util.Toast('取消成功')
        this.setData({
            showCancel: false
        })
        // 更新本页面
        this.init(this.data.query);
        // 更新上一页
        let pages = getCurrentPages()
        let prevPage = pages[pages.length - 2]
        let status = prevPage.status
        prevPage.init({
            status: status
        })
    })
}

VM.cancelCancel = function() {
    this.setData({
        showCancel: false
    })
}

// 确认“删除订单”
VM.confirmDelete = function() {
    let index = this.data.index
    let id = this.data.id
    Req.request('deleteOrder', {
        id: id
    }, {
        method: 'delete'
    }, (res) => {
        Util.Toast('删除成功')
        this.setData({
            showDelete: false
        })
        // 更新上一页
        let pages = getCurrentPages()
        let prevPage = pages[pages.length - 2]
        let prevList = prevPage.data.list
        prevList.splice(index, 1)
        prevPage.setData({
            list: prevList
        })
        setTimeout(() => {
            wx.navigateBack({
                delta: 1
            })
        }, 1500)
    })
}

VM.cancelDelete = function() {
    this.setData({
        showDelete: false
    })
}

// 支付订单
VM.payOrder = function() {
    Req.request('payOrder', {
        id: this.data.id
    }, {
        method: 'post'
    }, (res) => {
        console.log(res.data);
        let payData = res.data.paydata.xcx
        // 微信支付
        app.wxpay(payData, () => {
            Util.successToast('支付成功')
            // 更新本页面
            this.init(this.data.query);
            // 更新上一页
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 2]
            let status = prevPage.status
            prevPage.init({
                status: status
            })
        }, () => {
            Util.Toast('支付失败')
        });
    })
}

// 倒计时
VM.countTime = function(second) {
    let h = parseInt(second / (60 * 60)).toString().padStart(2, '0');
    let m = parseInt((second - h * 60 * 60) / 60).toString().padStart(2, '0');
    let s = parseInt(second - 3600 * h - 60 * m).toString().padStart(2, '0');
    let downtime = `${h}:${m}:${s}`
    this.setData({
        downtime: downtime
    })
    let timer = setInterval(() => {
        if (second > 0) {
            second -= 1
            h = parseInt(second / (60 * 60)).toString().padStart(2, '0');
            m = parseInt((second - h * 60 * 60) / 60).toString().padStart(2, '0');
            s = parseInt(second - 3600 * h - 60 * m).toString().padStart(2, '0');
            downtime = `${h}:${m}:${s}`
            this.setData({
                downtime: downtime
            })
        } else {
            clearInterval(timer)
            this.init({
                id: this.data.id
            })
        }
    }, 1000)
}
Page(VM)
