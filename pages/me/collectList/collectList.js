const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const Util = require('../../../utils/util.js');
const Base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        delBtnWidth: 128,
        list: [{
                txtStyle: 'transform: translateX(0rpx);',
                showBtn: false
            },
            {
                txtStyle: 'transform: translateX(0rpx);',
                showBtn: false
            },
        ],
        startX: ""
    }
}

VM.init = function(query) {}

VM.onLoad = function(query) {
    this.init(query)
    Base.onLoad(this)
}
VM.touchS = function(e) {
    if (e.touches.length == 1) {
        this.setData({
            //设置触摸起始点水平方向位置
            startX: e.touches[0].clientX
        });
    }
}
VM.touchM = function(e) {
    if (e.touches.length == 1) {
        //手指移动时水平方向位置
        let moveX = e.touches[0].clientX;
        //手指起始点位置与移动期间的差值
        let disX = this.data.startX - moveX;
        let delBtnWidth = this.data.delBtnWidth;
        let txtStyle = "";
        if (disX == 0 || disX < 0) { //如果移动距离小于等于0，说明向右滑动，文本层位置不变
            txtStyle = "transform: translateX(0rpx)";
        } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
            txtStyle = "transform: translateX(" + (-disX) + "rpx)";
            if (disX >= delBtnWidth) {
                //控制手指移动距离最大值为删除按钮的宽度
                txtStyle = "transform: translateX(" + (-delBtnWidth) + "rpx)";
            }
        }
        //获取手指触摸的是哪一项
        let index = e.currentTarget.dataset.index;
        let list = this.data.list;
        let tar = 'list[' + index + '].txtStyle'
        //更新列表的状态
        this.setData({
            [tar]: txtStyle
        });
    }
}
VM.touchE = function(e) {
    if (e.changedTouches.length == 1) {
        //手指移动结束后水平位置
        let endX = e.changedTouches[0].clientX;
        //触摸开始与结束，手指移动的距离
        let disX = this.data.startX - endX;
        let delBtnWidth = this.data.delBtnWidth;
        //如果距离小于删除按钮的1/2，不显示删除按钮
        let txtStyle = disX > delBtnWidth / 2 ? "transform: translateX(" + (-delBtnWidth) + "rpx)" :
            "transform: translateX(0rpx)";
        //获取手指触摸的是哪一项
        let index = e.currentTarget.dataset.index;
        let list = this.data.list;
        list[index].txtStyle = txtStyle;
        //更新列表的状态
        this.setData({
            list: list
        });
    }
}

Page(VM)
