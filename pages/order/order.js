// 菜单接口
const GET_MENU_URL = '/applet/item/foodList'
const SAVE_ORDER_URL = '/applet/order/saveOrder'
var common = require('../../utils/common.js')
var tool = require('/tool/ArrayTool.js')

const app = getApp()

Page({
  data: {
    listdata: [],
    selectedmenu: [], // 已选菜单
    listmenu: [],
    toView: 'v0',
    index: 0,
    shoppingCartPrice: 0,
    foodcount: 0,
    showcart: true,
  },

  /**
   * 生命周期函数，监听页面加载
   */
  onLoad: function () {
    //var sysinfo = wx.getSystemInfoSync().windowHeight;
    //console.log(sysinfo)
    wx.showLoading({
      title: ' 努力加载中',
    })
    wx.request({
      url: app.data.baseUrl + GET_MENU_URL,
      method: 'GET',
      data: {shopId: app.data.shopId},
      header: {
        'Accept': 'application/json'
      },
      success: (res) => {
        wx.hideLoading()
        console.log(res.data);
        // 判断是否请求数据成功
        if(res.data.status == '0') {
          console.log('请求数据成功，且格式正确');
          // 更新页面数据
          this.setData({
            listdata: res.data
          })
        } else {
          console.log('数据格式错误');
        }
       
      }
    })
  },

  /**
   * 左侧-商品类别选中事件
   */
  clickView: function (event) {
    var goto = event.currentTarget.id
    this.setData({
      toView: goto,
      // index: goto.substring('1')
    })
    // console.log(this.data.toView)
  },
  
  /**
   * 向购物车添加
   */
  addfood: function (event) {
    var foodid = event.currentTarget.id                       // 获取商品ID
    var foodprice = event.currentTarget.dataset.price         //food price
    var i = event.currentTarget.dataset.i                    //group for  [i] 
    var index = event.currentTarget.dataset.index     //group[i]foods[index]
    var foodname = event.currentTarget.dataset.foodname //foodname
    // 在原购物车的基础上新增此商品
    var newdata = tool.AddCount(this.data.selectedmenu, foodid, foodprice, foodname, i, index)
    var newobj = tool.GroupCount(this.data.listdata, i, index, "plus")
    this.setData({
      selectedmenu: newdata
      ,listdata: newobj
    })
    this.setData({
      shoppingCartPrice: common.upshopping(this.data.selectedmenu), // 更新购物车 显示的价格
      foodcount: tool.FoodCount(this.data.selectedmenu),  //刷新 商品 总数
      listmenu: tool.HashTointArray(this.data.selectedmenu) // 刷新购物车列表
    })
  },

  /**
   * 购物车删除商品
   */
  deletefood: function (event) {
    var foodid = event.currentTarget.id   // 获取商品ID
    var i = event.currentTarget.dataset.i                    //group for  [i] 
    var index = event.currentTarget.dataset.index     //group[i]foods[index]
    if (this.data.selectedmenu[foodid] != null && this.data.selectedmenu[foodid].count <= 1) {
      //food 数量 <=1 从selectedmenu 中 delete foodid 
      this.setData({
        selectedmenu: tool.DeleteHashArray(this.data.selectedmenu, foodid)  // 从购物车中删除一个food
      })
      this.setData({
        listdata: tool.GroupCount(this.data.listdata, i, index, "less"),             // group table count updata 
        foodcount: tool.FoodCount(this.data.selectedmenu),                               //  更新商品总数
        shoppingCartPrice: common.upshopping(this.data.selectedmenu),         // updata foods price
      })
      var newlistmenu = tool.HashTointArray(this.data.selectedmenu)
      //console.log(newlistmenu)
      this.setData({
        listmenu: newlistmenu   //购物车列表更新
      })
      if (this.data.listmenu.length == 0) { //购物车列表空了 自动关闭
        this.setData({
          showcart: true
        })
      }

      // console.log(this.data.selectedmenu)
      // console.log(this.data.listdata)
      // console.log(this.data.foodcount)
      // console.log(this.data.listmenu)
      // console.log(this.data.shoppingCartPrice)
      // 刷新购物车列表
      return
    }
    if (this.data.selectedmenu[foodid] != null && this.data.selectedmenu[foodid].count > 1) {
      this.data.selectedmenu[foodid].count -= 1
      this.setData({
        listdata: tool.GroupCount(this.data.listdata, i, index, "less"),   // group table count updata
        shoppingCartPrice: common.upshopping(this.data.selectedmenu),  // updata foods price
        foodcount: tool.FoodCount(this.data.selectedmenu),                        // 更新商品计数
        listmenu: tool.HashTointArray(this.data.selectedmenu) // 刷新购物车列表
      })
      return
    }

  },
  
  /**
   * 菜单滚动时触发
   */
  leftmenu: function (event) {
    // 获取商品类型的数量
    var temp = tool.LaftMenu(this.data.listdata.data)
    var len = temp.length
    var index = 0
    for (var i = 0; i < len; i++) {
      if (temp[i] > event.detail.scrollTop) {
        // console.log('temp['+i+']=' + temp[i] + '---event.detail.scrollTop=' + event.detail.scrollTop);
        // 在第i个类型的范围内
        index = i
        break
      }
    }
    // console.log('this.data.index=' + this.data.index);
    if (index != this.data.index) {
      this.setData({
        index: index
      })
    }
  },
  // 点击购物车框 列表显示出已经选择的商品，提供增加删除功能
  showcart: function () {
    if (this.data.listmenu.length == 0) {
      wx.showModal({
        content: '购物车空空如也 Σ( ° △ °|||)',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            //console.log('点击确定')
          }
        }
      });
      return
    }


    this.setData({
      showcart: !this.data.showcart
    })
    if (this.data.showcart == false) {
      this.setData({
        listmenu: tool.HashTointArray(this.data.selectedmenu)
      })
    }
  },
  test:function(){
    
  },

/**
 * 提交订单校验
 */
  checkSubmit: function() {
    if(this.data.foodcount <= 0) {
      console.log('购物车没有商品')
      return
    }

    // 购物车有商品，弹出提示框
    // wx.showModal({
    //   title: '提示',
    //   content: '这是一个模态弹窗',
    //   success(res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })

    // 获取购物车数据
    var menus = this.data.listmenu
    console.log(menus)
    var shoppingCart = []
    for(let i = 0; i < menus.length; i++) {
      var data = {"foodId": menus[i].foodid, "count": menus[i].count};
      shoppingCart.push(data);
    }
    console.log(shoppingCart);
    // 下单请求
    wx.request({
      url: app.data.baseUrl + SAVE_ORDER_URL,
      method: 'POST',
      data: shoppingCart,
      header: {
        'Accept': 'application/json'
      },
      success: (res) => {
        wx.hideLoading()
        console.log(res.data);
        // 判断是否请求数据成功
        if(res.data.status == '0') {
          console.log('请求数据成功，且格式正确');
          // 更新页面数据
          this.setData({
            listdata: res.data
          })
        } else {
          console.log('数据格式错误');
        }
       
      }
    })

  }

})  