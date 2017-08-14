# 技术栈
    React15.5.4   React-router4.x  redux  antd2.9  webpack2.x  immutable

# Installation 教程
    1 安装依赖包： npm i 
    2 运行demo :   npm run dev   
    3 本地运行: http://127.0.0.1:80  (webpack-dev-server)
    4 npm run build(线上打包)

# 说明
    · 该项目来源于之前项目的累积， 随着react项目版本的不断升级，扩展，形成一套功能比较完善，齐全的react 脚手架。在此单独提取出来，方便日后项目的搭建。

#  · 编写项目的tips
    · {...this.props} (不要滥用，请只传递component需要的props，传得太多，或者层次传得太深，都会加重shouldComponentUpdate里面的数据比较负担，因此，也请慎用spread attributes（<Component {...props} />）)。
    · ::this.handleChange()。(请将方法的bind一律置于constructor)  this.handleChange.bind(this,id)
    · 复杂的页面不要在一个组件里面写完。
    · 请尽量使用const element。
    · map里面添加key，并且key不要使用index（可变的）。
    · 尽量少用setTimeOut或不可控的refs、DOM操作
    · react-addons-perf  react 性能检测工具   

#todo
    · 该项目还没有测试案例
   