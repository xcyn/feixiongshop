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
      },
      // 是否是当前页面？
      getCurrentPath() {
      },
      // 路由跳转
      handleGoRouter(ev) {
      }
    }
})