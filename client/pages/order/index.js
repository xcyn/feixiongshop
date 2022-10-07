// 主页
const app = getApp()
const qs = require('qs');
import Dialog from "@vant/weapp/dialog/dialog";
Page({
  data: {
    address: {},
    isLogin: null,
    userInfo: null,
  },
  onShow() {
    this.getUserDefaultAddress()
  },
  onLoad(options) {
    const app = getApp()
    const isLogin = app.globalData.isLogin
    const userInfo = app.globalData.userInfo
    this.getUserDefaultAddress()
    let goodInfoBriefs = []
    let resloveOptions = qs.parse(options) || {}
    let goodInfoBrief = {
      num: resloveOptions.num,
      price: resloveOptions.price,
      desc: resloveOptions.desc,
      title: resloveOptions.title,
      thumb: resloveOptions.thumb
    }
    goodInfoBrief.desc = decodeURIComponent(goodInfoBrief.desc)
    goodInfoBrief.title = decodeURIComponent(goodInfoBrief.title)
    goodInfoBrief.thumb = decodeURIComponent(goodInfoBrief.thumb)
    if(goodInfoBrief) {
      goodInfoBriefs.push(goodInfoBrief)
    }
    // 生成购物车数据 (目前只有详情页过来的数据)
    let goodsCartsIds = [
      {
        goodId: options.goodId,
        skuInfo: decodeURIComponent(qs.parse(options).skuInfo || '').split('|'),
        goodInfoBrief,
      }
    ]
    this.setData({
      totalFee: options.totalFee,
      goodInfoBriefs,
      goodsCartsIds,
      isLogin: isLogin,
      userInfo: userInfo
    })
  },
  async getUserDefaultAddress() {
    const userInfo = app.globalData.userInfo
    const res = await app.request({
      url: '/goods-c/get-user-default-address',
      method: 'get',
      data:{
        userId: userInfo.id
       }
    })
    if(res && res.data) {
      this.setData({
        address: res.data || {}
      })
    }
  },
  showPopup() {
  },
  onClose() {
  },
  handleGoAddress() {
    wx.navigateTo({
      url: `/pages/address-list/index`,
    })
  },
  setPaying(newPayingData) {
    this.setData({
      paying: newPayingData
    })
  },
  // 下单
  handleSubmit() {
    const { openId, id } = this.data.userInfo
    const { address, totalFee, goodsCartsIds, goodInfoBriefs } = this.data
    let addressDesc = '地址详情备注' //先写死，后面再开发
    if(!address) {
      app.wxp.showToast({
        title: '请选择地点...',
        icon:'error'
      })
      return
    }
    let addressId = address.id
    let goodsNameDesc = goodInfoBriefs[0].desc
    console.log('下单数据:openId',openId)
    console.log('下单数据:userId',id)
    console.log('下单数据:addressId', addressId)
    console.log('下单数据:totalFee', totalFee)
    console.log('下单数据:addressDesc', addressDesc)
    console.log('下单数据:goodsCartsIds', goodsCartsIds)
    console.log('下单数据:goodsNameDesc', goodsNameDesc)
    if(!addressId) {
      app.wxp.showToast({
        title: '请选择地址',
        icon:'error'
      })
      return
    }
    Dialog.confirm({
      title: '确认下单？',
      message: `一共支付金额为${totalFee}元`,
    })
      .then(async() => {
        const res = await app.request({
          url: '/goods-c/create-order-new',
          method: 'post',
          data:{
            openId: openId,
            userId: id,
            addressId: addressId,
            totalFee: totalFee,
            addressDesc: addressDesc,
            goodsCartsIds: goodsCartsIds,
            goodsNameDesc: goodsNameDesc
           }
        })
        console.log('res', res)
        let extraData = res && res.data && res.data.res
        if(!extraData) {
          app.wxp.showToast({
            title: '不能跳转支付',
            icon:'error'
          })
        }
        wx.onAppShow(appOptions => {
          if (!this.data.paying) return;
          console.log('appOptions', appOptions)
  
          // 恢复支付前状态
          this.setPaying(false)
          
          if (appOptions.scene === 1038 && appOptions.referrerInfo.appId === 'wx2574b5c5ee8da56b') {
            // 来源于 xunhupay 小程序返回
            console.log('确认来源于 xunhupay 回调返回')
            let extraData = appOptions.referrerInfo.extraData
            if (extraData.paySuccess) {
              app.wxp.showToast({
                title: '支付成功',
              })
              setTimeout(() => {
                // 跳转支付成功列表
                wx.redirectTo({
                  url: `/pages/order-list/index`,
                })
              }, 1000);
            } else {
              app.wxp.showToast({
                title: '支付失败',
                icon:'error'
              })
              setTimeout(() => {
                // 跳转未支付列表
                wx.redirectTo({
                  url: `/pages/order-list/index`,
                })
              }, 1000);
            }
          }
        })
        // 第三方迅虎对接流程
        wx.navigateToMiniProgram({
          appId: 'wx2574b5c5ee8da56b',
          path: 'pages/cashier/cashier',
          extraData: extraData,
          envVersion: 'release',
          success: r => {
            // 成功跳转：标记支付中状态
            this.setPaying(true)
            console.log('跳转到 xunhupay 小程序成功', r)
          },
          fail: e => {
            this.setPaying(false)
            app.wxp.showToast({
              title: '取消支付',
              icon:'error'
            })
            // 跳转失败：弹出提示组件引导用户跳转
            console.log('跳转到 xunhupay 小程序失败 - 准备弹窗提醒跳转', e)
          }
        })
        return


        // 个人商户号对接流程
        let payParmas = res && res.data && res.data.params || {}
        console.log('payParmas', payParmas)
        wx.requestPayment({
          nonceStr: payParmas.nonceStr,
          package: payParmas.package,
          paySign: payParmas.paySign,
          timeStamp: payParmas.timeStamp,
          signType: 'MD5',
          success: async(res) => {
            if(res && res.errMsg === 'requestPayment:ok') {
              app.wxp.showToast({
                title: '支付成功',
              })
              // 跳转支付成功列表
              wx.redirectTo({
                url: `/pages/order-list/index`,
              })
            } else {
              app.wxp.showToast({
                title: '支付失败',
                icon:'error'
              })
              // 跳转未支付列表
              wx.redirectTo({
                url: `/pages/order-list/index`,
              })
            }
          },
          fail: (err) => {
            app.wxp.showToast({
              title: '暂不支付',
              icon:'error'
            })
            console.log('err', err)
          }
        })
        console.log('payRes', payRes)
        // on confirm
      })
      .catch(() => {
        // on cancel
      });
  }
})
