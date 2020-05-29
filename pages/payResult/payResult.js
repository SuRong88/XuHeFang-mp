const app = getApp();
const Util = require('../../utils/util.js');
const Base = require('../../utils/base.js');
const Req = require('../../utils/request.js');
const VM = {
    data: {
        orderId: '',
        orderParams: null,
        titleIndex: 0,
        titleArr: ['支付成功', '支付失败']
    }
}

VM.init = function(query) {
    if (query.status == 'success') {
        if (!query.orderId) {
            wx.navigateBack({delta:1})
        }
        this.setData({
            titleIndex: 0,
            orderId: query.orderId
        })
    } else {
        if (!query.orderParams) {
            wx.navigateBack({delta:1})
        }
        this.setData({
            titleIndex: 1,
            orderParams: query.orderParams
        })
    }
}

VM.onLoad = function(query) {
    this.init(query)
    Base.onLoad(this)
}

VM.rePay = function() {
    wx.redirectTo({
        url: '/pages/confirmOrder/confirmOrder?orderParams=' + this.data.orderParams
    })
}

Page(VM)
