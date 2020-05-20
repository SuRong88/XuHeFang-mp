const app = getApp();
const Util = require('../../utils/util.js');
const Base = require('../../utils/base.js');
const Req = require('../../utils/request.js');
const VM = {
    data: {
        contactTel: '400-0000-0000',
        qrcodeUrl: 'https://xcxdemo2.mrxdtech.com/api/public//upload/image/20200426/5ea55eae3b926.jpg',
    }
}

VM.init = function(query) {}

VM.onLoad = function(query) {
    this.init(query)
    Base.onLoad(this)
}

VM.makePhoneCall = function(){
    wx.makePhoneCall({
      phoneNumber: this.data.contactTel 
    })
}

Page(VM)
