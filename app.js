//app.js
// 换取 openId, sessionKey, unionId接口地址
const GETOPENID_URL = '/small/user/'
App({

  data:{
    baseUrl: 'http://localhost:8081/rest',
    shopId: '155462025952137',
    userInfo:{}
  },

  /**
   * 小程序启动之后触发
   */
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // wx.request({
        //   url: ''
        // })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              console.log(res);

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
            fail: res => {
              console.log("获取用户信息失败");
            } 
          })
        }
      },
      fail: res => {
        console.log("获取用户当前设置失败");
      }
    })
  },
  globalData: {
    userInfo: null
  }
})