//index.js
const APPLET_USER_LOGIN_URL = 'http://127.0.0.1:8081/rest/applet/user/login';
//获取应用实例
var common = require('../../utils/common.js')
const app = getApp()

Page({
  data: {
    userInfo: {},
    isShowLoginBtn: true,
    imgUrls: [
      {
        // link: '/pages/index/index',
        url: '/static/imgs/sw1.jpg'
      }, {
        url: '/static/imgs/sw2.jpg'
      }, {
        url: '/static/imgs/sw3.jpg'
      }
    ],
    indicatorDots: false,
    autoplay: true,
    indicatordots: true,
    interval: 5000,
    duration: 1000,
    userInfo: {}
  },
  onLoad: function () {
    console.log("onLoad 页面加载");
    console.log(this);
    // 获取用户信息
    this.getUserInfo();
  },
  goorder: function () {
    common.goorder()
  },
  gocard: function () {
    common.gocard()
  },
  goorderinfo:function(){
    common.goorderinfo()
  },
  gointegral:function(){
    common.gointegral()
  },

  /**
  * button绑定的获取用户信息的回调函数
  */
  handleGetUserInfo: function (data) {
    console.log('用户点击了', data);
    // 判断用户点击了允许还是拒绝
    if (data.detail.rawData) {
      // 点击了允许
      this.getUserInfo();
    } else {
      // 点击了拒绝
      console.log('用户点击了拒绝授权');
    }
  },

  /**
   * 获取用户信息
   */
  getUserInfo: function () {
    // 判断用户是否授权了
    wx.getSetting({
      success: (data) => {
        console.log(data);
        if (data.authSetting['scope.userInfo']) {
          // 用户授权了
          this.setData({
            isShowLoginBtn: false
          });
        } else {
          // 用户没授权
          this.setData({
            isShowLoginBtn: true
          });
        }
      }
    })

    // 获取用户信息
    wx.getUserInfo({
      success: (data) => {
        // 更新data中的userInfo
        this.setData({
          userInfo: data.userInfo
        });
        // 调用登录功能
        wx.login({
          success: (res) => {
            console.log("登录");
            console.log(res);
            console.log(this.data.userInfo);

            // 发送请求到foodorder服务器
            wx.request({
              url: APPLET_USER_LOGIN_URL,
              data: {
                code: res.code,
                wechatUser: this.data.userInfo
              },
              header: {
                'content-type': 'application/json'
              },
              success(res) {
                console.log(res.data);
                // 保存用户id到本地
                wx.setStorage({
                  key: 'USER_ID',
                  data: res.data.data,
                  success: (e) => {
                    console.log('缓存数据成功');
                  }
                })
              } 
            })
          },
          fail: (err) => {
            console.log("登录失败");
          }
        })
      },
      fail: () => {
        console.log('获取用户信息失败');
      }
    })
  },
})  