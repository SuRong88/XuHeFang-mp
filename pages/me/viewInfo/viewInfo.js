const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const Util = require('../../../utils/util.js');
const Base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
       userInfo:null 
    }
}

VM.init = function(query) {
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    let userInfo = prevPage.data.userInfo
    this.setData({
        userInfo
    })
}

VM.onLoad = function(query) {
    this.init(query)
    Base.onLoad(this)
}

Page(VM)
