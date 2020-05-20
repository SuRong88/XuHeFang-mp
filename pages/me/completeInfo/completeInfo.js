const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const Util = require('../../../utils/util.js');
const Base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        disabled: true,
        name: '',
        gender: '',
        phone: '',
        genderIndex: 0,
        genderArr: ['男', '女']
    }
}

VM.init = function(query) {}

VM.onLoad = function(query) {
    this.init(query)
    Base.onLoad(this)
}
// 性别修改
VM.genderEdit = function(e) {
    let genderIndex = e.detail.value
    let _data = this.data
    this.setData({
        gender: _data.genderArr[_data.genderIndex],
        genderIndex: genderIndex
    })
}
VM.changeInput = function(e) {
    let key = Util.dataset(e, 'key')
    if (key === 'name') {
        let name = e.detail.value
        let disabled = !(name.trim() && this.data.gender && this.data.phone)
        this.setData({
            name: name,
            disabled: disabled
        })
    } else if (key === 'phone') {
        let phone = e.detail.value
        let disabled = !(phone.trim() && this.data.name && this.data.gender)
        this.setData({
            phone: phone,
            disabled: disabled
        })
    }
}
VM.subimtInfo = function() {
    if (this.data.disabled) {
        return;
    }
    if (!formcheck.check_phone(this.data.phone)) {
        return Util.Toast('手机号码格式有误')
    }
    // todo


    Util.Toast('提交成功，恭喜您已成为会员')
}
Page(VM)
