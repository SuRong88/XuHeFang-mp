const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const Util = require('../../../utils/util.js');
const Base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        type: '',
        title: '完善信息',
        disabled: true,
        name: '',
        gender: '',
        phone: '',
        genderIndex: 0,
        genderArr: ['女', '男']
    }
}

VM.init = function(query) {
    if (query.type == 'complete') {
        this.setData({
            type: query.type,
            title: '完善信息'
        })
    } else if (query.type == 'edit') {
        let pages = getCurrentPages()
        let prevPage = pages[pages.length - 2]
        let userInfo = prevPage.data.userInfo
        let name = userInfo.realname
        let phone = userInfo.phone
        let gender = this.data.genderArr[parseInt(userInfo.sex)]
        let genderIndex = parseInt(userInfo.sex)
        this.setData({
            type: query.type,
            title: '修改信息',
            name: name,
            phone: phone,
            gender: gender,
            genderIndex: genderIndex,
            disabled: false
        })
    }
}

VM.onLoad = function(query) {
    this.init(query)
    Base.onLoad(this)
}

// 性别修改
VM.genderEdit = function(e) {
    let genderIndex = e.detail.value
    let _data = this.data
    this.setData({
        gender: _data.genderArr[genderIndex],
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
    Req.request('editUserInfo', {
        realname: this.data.name,
        phone: this.data.phone,
        sex: this.data.genderIndex
    }, {
        method: 'put'
    }, res => {
        if (this.data.type == 'complete') {
            Util.Toast('提交成功，恭喜您已成为会员', 1500, true)
        } else if (this.data.type == 'edit') {
            Util.Toast('修改成功', 1500, true)
        }
        setTimeout(() => {
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 2]
            prevPage.init()
            wx.navigateBack({delta:1})
        }, 1500)
    }, err => {
        Util.Toast(err.msg || '系统出错')
    })

}

Page(VM)
