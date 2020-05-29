const app = getApp();
const Util = require('../../utils/util.js');
const Base = require('../../utils/base.js');
const Req = require('../../utils/request.js');
const VM = {
    data: {
        contactInfo: null,
        orderParams: null,
        orderInfo: null
    }
}

VM.init = function(query) {
    this.setData({
        orderParams: query.orderParams
    })
    Req.request('beforeConfirmOrder', {
        goods_json: this.data.orderParams,
    }, {
        method: 'get'
    }, (res) => {
        console.log(res.data);
        let inf = res.data
        inf.detail.forEach(item => {
            item.date = item.spec_type.substring(0, 10)
            item.time = item.spec_type.substring(10)
        })
        this.setData({
            orderInfo: inf,
            contactInfo: inf.user_contact
        })
    })
}

VM.onLoad = function(query) {
    this.init(query)
    Base.onLoad(this)
}

VM.submitOrder = function() {
    let {
        contactInfo,
        orderParams
    } = this.data
    if (contactInfo === null) {
        return Util.Toast('请选择联系人')
    }
    Req.request('confirmOrder', {
        user_contact: contactInfo.id,
        goods_json: orderParams
    }, {
        method: 'post'
    }, (res) => {
        console.log(res.data);
        let orderId = res.data.order_id
        let payData = res.data.paydata.xcx
        // 微信支付
        app.wxpay(payData, () => {
            wx.redirectTo({
                url: '/pages/payResult/payResult?status=success&orderId=' + orderId
            })
        }, () => {
            wx.redirectTo({
                url: '/pages/payResult/payResult?status=fail&=orderParams' + this.data.orderParams
            })
        });
    })
}

Page(VM)
