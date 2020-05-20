const app = getApp();
const Util = require('../../utils/util.js');
const Base = require('../../utils/base.js');
const Req = require('../../utils/request.js');
const VM = {
    data: {}
}

VM.init = function(query) {}

VM.onLoad = function(query) {
    this.init(query)
    Base.onLoad(this)
}

// 用户授权
VM.getUserInfo = function(e) {
    if (e.detail.userInfo) { //用户按了允许授权按钮
        // todo
        console.log('允许授权');
    } else { //用户取消授权
        console.log('拒绝授权');
        Util.showModal('提示', '请授权使用该小程序', false, '', '知道了');
    }
}
Page(VM)
