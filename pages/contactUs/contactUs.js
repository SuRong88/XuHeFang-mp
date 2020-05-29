const app = getApp();
const Util = require('../../utils/util.js');
const Base = require('../../utils/base.js');
const Req = require('../../utils/request.js');
const VM = {
    data: {
        contactTel: '',
        qrcodeUrl: '',
    }
}

VM.init = function(query) {
    Req.request('getServiceInfo', {
        params: JSON.stringify(["about_me", "qrcode_ph", "customer_service_phone"])
    }, {
        method: 'get'
    }, (res) => {
        this.setData({
            contactTel: res.data.customer_service_phone,
            qrcodeUrl: res.data.qrcode_ph
        })
    })
}

VM.onLoad = function(query) {
    this.init(query)
    Base.onLoad(this)
}

VM.makePhoneCall = function() {
    wx.makePhoneCall({
        phoneNumber: this.data.contactTel
    })
}

Page(VM)
