 #### 简答题

##### 1、谈谈你对工程化的初步认识，结合你之前遇到过的问题说出三个以上工程化能够解决问题或者带来的价值

- 解决前端开发规范，效率，质量的方法，主要解决问题：
  - 传统语言的弊端
  - 无法使用模块化/组件化
  -  重复的机械式工作  *
  - 代码风格统一、质量保证
  - 依赖后端服务接口支持
  - 整体依赖后端项目
- 工程化能解决的实际问题
  - 项目开发中机械式工作内容，小程序中创建新页面，固定文件 wxml、wxss、josn、js内固定内容，可通过工程化创建提高效率。
  - 开发完成，部署上线前自动压缩代码，压缩图片等，实现代码优化的效果。
  - 后端开发未完成时，利用Moke提前模拟后端接口，提高联调效率。
  - Git Hooks解决项目质量把控的目的，保证多人开发时的项目质量。

##### 2、你认为脚手架除了为我们创建项目结构，还有什么更深的意义？

- 提供项目规范，保证代码质量，提高开发效率，工具话解决重复复杂的工作。



#### 编程题

##### 1、概述脚手架实现的过程，并使用 NodeJS 完成一个自定义的小型脚手架工具

- 项目说明：
  - 使用 yarn init 初始化 package.json，并在 package.json 中配置 bin 字段，作为 node 的入口脚本文件。
  - 通过 npm link 命令把模块 link 到全局
  - 通过 inquirer 模块发起命令行询问
  - 新建模板文件，html文件关联询问环节用户输入
  - 通过fs模块读取模板文件内容，路径
  - 通过ejs模板引擎，渲染路径对应的文件，通过文件写入功能，将模板生成内容生成到新目录中。
- 代码路径： [my-scaffolding](https://github.com/ChengLK/fed-e-task-02-01/tree/master/my-scaffolding "my-scaffolding")

##### 2、使用 Gulp 完成 项目 的自动化构建

- 代码路径： [my-gulp](https://github.com/ChengLK/fed-e-task-02-01/tree/master/my-gulp "my-gulp")

##### 3、使用 Grunt 完成 项目 的自动化构建

- 代码路径： [pages-boilerplate](https://github.com/ChengLK/fed-e-task-02-01/tree/master/pages-boilerplate "pages-boilerplate")
