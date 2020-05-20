const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const Util = require('../../../utils/util.js');
const Base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
         qrcodeUrl: 'https://xcxdemo2.mrxdtech.com/api/public//upload/image/20200426/5ea55eae3b926.jpg',
        statusArr:['待支付','待兑换','已完成','已关闭']
    }
}

VM.init = function(query) {}

VM.onLoad = function(query) {
    this.init(query)
    Base.onLoad(this)
}

VM.cancelOrder = function() {}
VM.deleteOrder = function() {}
VM.payOrder = function() {}

Page(VM)
