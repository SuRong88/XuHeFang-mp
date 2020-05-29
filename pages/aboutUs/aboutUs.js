const app = getApp();
const Util = require('../../utils/util.js');
const Base = require('../../utils/base.js');
const Req = require('../../utils/request.js');
const WxParse = require('../../wxParse/wxParse');
const VM = {
    data: {

    }
}

VM.init = function(query) {
    Req.request('getServiceInfo', {
        params: JSON.stringify(["about_me", "qrcode_ph", "customer_service_phone"])
    }, {
        method: 'get'
    }, (res) => {
        WxParse.wxParse('aboutContent', 'html', res.data.about_me, this, 5);

    })
}

VM.onLoad = function(query) {
    this.init(query)
    Base.onLoad(this)
}

Page(VM)
