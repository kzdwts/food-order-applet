// pages/orderinfo/orderinfo.js
var tool = require('/tool/tool.js')
const GET_ORDER_LIST = '/applet/order/listOrderByUserId'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo:[],
    integral:0,
    showlayer:true,
    details:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var there = this
    wx.showLoading({
      title: '努力加载中',
    })
    // 从缓存获取用户id
    var userId = wx.getStorageSync("USER_ID")
    wx.request({
      url: app.data.baseUrl + GET_ORDER_LIST,
      method:'GET',
      data:{userId: userId},
      header:{
        'Accept': 'application/json'
      },
      success:function(res){
        if(res.data.status == '0') {
          // console.log(res);
          var newIntegral = tool.CountIntegral(res.data.data)
          there.setData({
            orderInfo:res.data,
            integral:newIntegral
          })
        } else {
          console.log("暂无订单信息");
        }
       
        wx.hideLoading()
        //console.log(there.data.orderInfo.OrderInfo[0])
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 订单详情点击事件
   * @param {*} event 
   */
  details:function(event){
    this.onshowlayer()
    console.log(this.data)
    var newdetails = this.data.orderInfo.data[event.currentTarget.id]
    console.log(newdetails)
    this.setData({
      details:newdetails
    })
  },
  onshowlayer:function(event){
    this.setData({
      showlayer: false
    })
  },
  oncloselayer: function (event) {
    this.setData({
      showlayer: true
    })
  }
})