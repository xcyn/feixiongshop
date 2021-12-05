let app = getApp()
Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 组件的对外属性，是属性名到属性设置的映射表
     */
    properties: {
        item: Object,
    },

    /**
     * 组件的内部数据，和 properties 一同用于组件的模板渲染
     */
    data: {
      active: 0,
      title: ''
    },
    // 组件数据字段监听器，用于监听 properties 和 data 的变化
    observers: {

    },
    lifetimes: {
        attached: function() {
          const item = this.properties.item
          let statusMap = {
            0: '待支付',
            1: '已支付',
            2: '取消',
          }
          const goodInfoBrief = item && item.goodsCartsIds && item.goodsCartsIds[0] && item.goodsCartsIds[0].goodInfoBrief
          let title = goodInfoBrief && goodInfoBrief.title || ''
          let desc = goodInfoBrief && goodInfoBrief.desc || ''
          let thumb = goodInfoBrief && goodInfoBrief.thumb || ''
          let price = goodInfoBrief && goodInfoBrief.price || 0
          let num = goodInfoBrief && goodInfoBrief.num || 0
          let total = price * num
          let showCloseBtn = item.payState === 0
          let outTradeNo = item.outTradeNo
          this.setData({
            outTradeNo: outTradeNo,
            showCloseBtn:showCloseBtn,
            title: title,
            desc: desc,
            num: num,
            thumb: thumb,
            price: price,
            total: total,
            status: item && statusMap[item.payState] || '未知',
            time: item && app.util.formatTime(new Date(item.createdAt))
          })
        },
        moved: function () {
          console.log('moved')
        },
        detached: function() {
          console.log('detached')
            // 在组件实例被从页面节点树移除时执行
        },
    },
    pageLifetimes: {
      // 组件所在页面的生命周期函数
      show: function () {
      },
      hide: function () { 
        console.log('hide')
      },
      resize: function () { 
        console.log('resize')
      },
    },
    /**
     * 组件的方法列表
     */
    methods: {
      // 取消订单
      handleClose(e) {
        const { outtradeno } = e.currentTarget.dataset
        wx.showModal({
          title: '提示',
          content: '确定要取消订单?',
          success:  (sm) => {
            this.triggerEvent('parentEvent', {
              outTradeNo: outtradeno
            })
          }
        })
      },
      onChange(event) {
      },
      // 是否是当前页面？
      getCurrentPath() {
      },
      // 路由跳转
      handleGoRouter(ev) {
      }
    }
})