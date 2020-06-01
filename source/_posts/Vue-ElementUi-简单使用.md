---
title: Vue + ElementUi 简单使用
categories: Vue
description:  Vue,ElementUi 简单使用
date: 2020-01-20 10:54:06
tags: vue
---
## 1.前期准备
完成对node、npm、cnpm、vue-cli的安装。
nodejs: 
&emsp;下载地址: [nodejs](http://nodejs.cn/download/)
安装cnpm淘宝镜像:
  &emsp;npm install -g cnpm --registry=https://registry.npm.taobao.org
安装vuecli:
   &emsp; cnpm install vue-cli -g
   &emsp; -g :代表全局安装。如果你安装时报错，一般是网络问题，你可以尝试用cnpm来进行安装。安装完成后，可以用vue
   &emsp; -V来进行查看 vue-cli的版本号。注意这里的V是大写的。
## 2.使用vue-cli 初始化项目
```
    #如若没有安装过vue-cli,先全局安装一下vue-cli
    $ cnpm i -g vue-cli
    #到自己喜欢的目录下创建一个基于 webpack 模板的新项目
    $ vue init webpack my-project
    #
    #
    #之后会有如下询问
    ? Project name (my-project) #回车
    ? Project description  #回车，也可以写点项目描述
    ? Author #回车，或者输入作者
    ? Vue build standalone #回车
    ? Install vue-router? (Y/n) #这里是官方推荐的路由，果断yes
    ? Use ESLint to lint your code? #No
    ? Set up unit tests #No
    ? Setup e2e tests with Nightwatch? #No
    ? Should we run `npm install` for you after the project has been created? (recommended)
    > Yes, use NPM #可以按上下方向键选择，这里我选第一个NPM，按回车确认
      Yes, use Yarn
      No, I will handle that myself
    #等待完成
```
其中vue init webpack my-project 简单介绍
vue init <template-name> <project-name>
```
init：表示我要用vue-cli来初始化项目

<template-name>：表示模板名称，vue-cli官方为我们提供了5种模板，

webpack-一个全面的webpack+vue-loader的模板，功能包括热加载，linting,检测和CSS扩展。

webpack-simple-一个简单webpack+vue-loader的模板，不包含其他功能，让你快速的搭建vue的开发环境。

browserify-一个全面的Browserify+vueify 的模板，功能包括热加载，linting,单元检测。

browserify-simple-一个简单Browserify+vueify的模板，不包含其他功能，让你快速的搭建vue的开发环境。

-simple-一个最简单的单页应用模板。

<project-name>：标识项目名称，这个你可以根据自己的项目来起名字。
```
<!--more-->
## 3.进入项目，对依赖进行安装并启动
完成后可能会有警告,可以忽略
```
$ cd my-project #进入刚新建的文件夹
$ cnpm install  #这里用的是淘宝的NPM镜像,不懂可以自行搜索cnpm
$ npm run dev 
###I  Your application is running here: http://localhost:8080
```
### 3.1 对项目中各个目录进行简单介绍
|名称|说明|
|:--:|:--:|
|build	|项目构建的一些代码|
|config	|开发环境的配置|
|node_modules|	一些依赖包|
|src	|源码，我们就在这个文件夹内写代码|
|static|	静态文件|
|.babelrc	|ES6编译的一些配置|
|.editorconfig	|代码风格配置文件|
|.gitignore	git|上传时忽略的一些文件，比如node_modules这个文|
|.postcssrc.js|	听说是转换CSS样式的|
|index.html	|入口页面|
|package-lock.json	|听说是更详细的package.json|
|package.json	|项目信息，项目名称，开发的依赖的记录等，一个JSON文件|

## 4.安装ElementUI
[参考官方地址](https://element.eleme.cn/#/zh-CN/component/installation)
> npm i element-ui -S

打开main.js 引入
```
import ElementUI from 'element-ui' //新添加
import 'element-ui/lib/theme-chalk/index.css' //新添加，避免后期打包样式不同，要放在import App from './App';之前
import Vue from 'vue'
import App from './App'
import router from './router'


Vue.use(ElementUI)   //新添加
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
```

> 引用参考自：https://www.cnblogs.com/whowhere/p/9573847.html