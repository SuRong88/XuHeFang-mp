const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const Util = require('../../../utils/util.js');
const Base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        editIndex: -1,
        disabled: true,
        name: '',
        phone: ''
    }
}

VM.init = function(query) {
    if (query.index == 'undefined') {
        return wx.navigateBack()
    }
    let editIndex = query.index
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    let editObj = prevPage.data.list[editIndex]
    this.setData({
        editIndex: editIndex,
        disabled: false,
        name: editObj.name,
        phone: editObj.phone
    })
}

VM.onLoad = function(query) {
    this.init(query)
    Base.onLoad(this)
}
VM.changeInput = function(e) {
    let key = Util.dataset(e, 'key')
    if (key === 'name') {
        let name = e.detail.value
        let disabled = !(name.trim() && this.data.phone)
        this.setData({
            name: name,
            disabled: disabled
        })
    } else if (key === 'phone') {
        let phone = e.detail.value
        let disabled = !(phone.trim() && this.data.name)
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

    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    let list = prevPage.data.list
    list[this.data.editIndex].name = this.data.name
    list[this.data.editIndex].phone = this.data.phone
    prevPage.setData({
        list
    })
    Util.Toast('修改成功')
    setTimeout(()=>{
        this.returnBack()
    },1500)
}
Page(VM)
