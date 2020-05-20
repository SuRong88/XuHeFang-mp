const app = getApp();
const formcheck = require('../../utils/formcheck.js');
const Base = require('../../utils/base.js');
const Util = require('../../utils/util.js');
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 标题
        tabbarIndex: {
            type: Number,
            value: 0
        },
        // 引用该组件传入的tabbar样式
        cln: {
            type: String,
            value: ""
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        tabbarList: [{
                "pagePath": "/pages/index/index",
                "text": "首页",
                "iconPath": "/images/tabbar/icon01.png",
                "selectedIconPath": "/images/tabbar/icon01_sel.png"
            },
            {
                "pagePath": "/pages/me/index/index",
                "text": "我的",
                "iconPath": "/images/tabbar/icon02.png",
                "selectedIconPath": "/images/tabbar/icon02_sel.png"
            }
        ]
    },
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    lifetimes: {
        created: function() {},
        attached: function() {
            Base.onLoad(this);
        },
        moved: function() {},
        detached: function() {},
    },

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function() {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
    ready: function() {},

    // 组件所在页面的生命周期函数
    pageLifetimes: {
        show: function() {},
        hide: function() {},
        resize: function() {},
    },
    /**
     * 组件的方法列表
     */
    methods: {}
})
