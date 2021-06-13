const App = getApp();

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
      active: 0,
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
        let curentPath = this.getCurrentPath()
        let pageNavMap = {
          'pages/index/index': 0,
          'pages/my/index': 1
        }
        let active = pageNavMap[curentPath]
        console.log('curentPath', curentPath)
        console.log('active', active)
        this.setData({ active });
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
      onChange(event) {
        // event.detail 的值为当前选中项的索引
        this.setData({ active: event.detail });
      },
      // 是否是当前页面？
      getCurrentPath() {
        let urlStack = getCurrentPages()
        let curentPath = urlStack && urlStack[urlStack.length - 1] && urlStack[urlStack.length - 1].route
        return curentPath
      },
      // 路由跳转
      handleGoRouter(ev) {
        let url = ev.currentTarget.dataset.id
        let curentPath = this.getCurrentPath()
        let isCurrentPath = `/${curentPath}` === url
        if( !isCurrentPath ) {
          wx.switchTab({
            url
          })
        }
      }
    }
})