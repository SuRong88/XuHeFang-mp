const app = getApp();
const Util = require('../../utils/util.js');
const Base = require('../../utils/base.js');
const Req = require('../../utils/request.js');
const VM = {
    data: {
        id: '',
        showSelected: false
    }
}

VM.init = function(query) {}

VM.onLoad = function(query) {
    this.init(query)
    Base.onLoad(this)
}
// 活动未开始，请浏览其他活动
// 活动已结束，请浏览其他活动


VM.showSelect = function() {
    this.setData({
        showSelected: !this.data.showSelected
    })
}
VM.hideSelect = function() {
    this.setData({
        showSelected: !this.data.showSelected
    })
}
Page(VM)
