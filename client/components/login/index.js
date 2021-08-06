let app = getApp()
const { request } = require('../../utils/request')
Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 组件的对外属性，是属性名到属性设置的映射表
     */
    properties: {
        activePos: String,
    },

    /**
     * 组件的内部数据，和 properties 一同用于组件的模板渲染
     */
    data: {
      show: true,
    },
    // 组件数据字段监听器，用于监听 properties 和 data 的变化
    observers: {

    },
    lifetimes: {
        attached: function() {
          console.log('attached')
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
        if(app.globalData.isLogin) {
          this.setData({ show: false });
        } else {
          this.setData({ show: true });
        }
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
      async processLogin() {
        // https://developers.weixin.qq.com/community/develop/article/doc/00040885c386f81e96cbf93cf51013
        // 4月13日 用getUserProfile替换
        // wx.getUserInfo接口或者<button open-type="getUserInfo"/>
        const res = await app.wxp.getUserProfile({
          desc: '用于完善会员资料'})
        let {
          userInfo,
          encryptedData,
          iv
        } = res
        let tokenIsValid = false
        let sessionIsValid = false
        try {
          const res = await app.wxp.checkSession();
          if (res && res.errMsg === "checkSession:ok") {
            console.log('session校验成功', res)
            sessionIsValid = true
          }
        } catch(err) {
          sessionIsValid = false
          console.log('session校验失败:', err)
        }
        try {
          let token = wx.getStorageSync('token')
          if(token) {
            tokenIsValid = true
            console.log('token校验成功:', token)
          } else {
            tokenIsValid = false
            console.log('token校验失败: token为空')
          }
        } catch(err) {
          tokenIsValid = false
          console.log('token校验失败:', err)
        }
        if (!tokenIsValid || !sessionIsValid) {
          let loginRes = await app.wxp.login()
          let code = loginRes.code
          const result = await request({
            url: '/user/wx-login',
            method: 'post',
            data:{ 
              code,
              userInfo: userInfo,
              encryptedData,
              iv,
              sessionKeyIsValid:sessionIsValid
             }
          })
          let tokenRsult = result.data.authorizationToken
          wx.setStorageSync('token', tokenRsult)
          app.wxp.showToast({
            title: '登陆成功了',
          })
          this.cancelLogin()
          app.globalData.isLogin = true
          app.globalData.userInfo = userInfo
          app.globalEvent.emit('loginSuccess')
          return
        }
        app.wxp.showToast({
          title: '登陆成功了',
        })
        this.cancelLogin()
        app.globalData.isLogin = true
        app.globalData.userInfo = userInfo
        app.globalEvent.emit('loginSuccess')
     },
     cancelLogin() {
        this.setData({ show: false });
      }
    }
})