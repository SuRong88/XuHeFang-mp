const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const Util = require('../../../utils/util.js');
const Base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        // 任务状态
        status: 0,
        showCancel: false,
        showDelete: false
    }
}

VM.init = function(query) {}

VM.onLoad = function(query) {
    this.init(query)
    Base.onLoad(this)
}

// tab切换状态
VM.changeStatus = function(e) {
    let status = Util.dataset(e, 'status')
    if (status == this.data.status) {
        return;
    }
    this.setData({
        status: status
    })
}

// 确认“取消订单”
VM.confirmCancel = function() {}

VM.cancelCancel = function() {}

// 确认“删除订单”
VM.confirmDelete = function() {}

VM.cancelDelete = function() {}

Page(VM)
