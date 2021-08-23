# feixiongshop
飞熊网的商城小程序
# 个人公众号
微信搜索 - 飞熊网

# 技术栈

+ 前端
  + 小程序原生技术栈
  + weapp

+ 后端
  + koa相关技术栈
  + mysql
  + sequelize
  + sequelize-cli
  + docker

+ 项目启动
  + 前端
    + 微信开发者工具，引入client文件夹
  + 服务端
    + npm run serve
    + 数据库
      + 本地安装mysql
      + mysql端口为3306
      + 也可通过docker拉取镜像，创建容器， 可以关注 飞熊网公众号， 文章为: 飞熊商城--后端--docker部署mysql
      + mock数据库数据
        + 在servece目录下执行: node mock-data/index.js

+ 备注
  + config目录下有个 key-config，因为涉及小程序Secret 暂不对外开放, 开放者可自己配置自己的appid 和 secret

+ 资料列表
  + sequelize参考文档  https://blog.qianxiaoduan.com/archives/776
  + sequelize事务     https://www.jianshu.com/p/5d63cdc103e4
  + sequelize常见api  https://blog.csdn.net/lvyuan1234/article/details/87010463
  + sequelize操作符   https://www.cnblogs.com/anglezjl/p/14856462.html
  + sku表结构设计      https://www.jianshu.com/p/86f9596d6234
