const app = getApp();
const Util = require('../../utils/util.js');
const Base = require('../../utils/base.js');
const Req = require('../../utils/request.js');
var WxParse = require('../../wxParse/wxParse');
const VM = {
    data: {}
}

VM.init = function(query) {}

VM.onLoad = function(query) {
    this.init(query)
    Base.onLoad(this)
}


// todo
// WxParse.wxParse('richTxt', 'html', res.data.content, this, 5);

Page(VM)
