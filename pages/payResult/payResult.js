const app = getApp();
const Util = require('../../utils/util.js');
const Base = require('../../utils/base.js');
const Req = require('../../utils/request.js');
const VM = {
    data: {
        orderId:'',
        titleIndex: 0,
        titleArr: ['支付成功', '支付失败']
    }
}

VM.init = function(query) {
    this.setData({
        titleIndex: query.status == 'success' ? 0 : 1,
        orderId:query.orderId
    })
}

VM.onLoad = function(query) {
    this.init(query)
    Base.onLoad(this)
}

Page(VM)
