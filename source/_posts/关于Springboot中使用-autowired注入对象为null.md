---
title: 关于Springboot中使用@autowired注入对象为null
categories: java
description: 关于Springboot中使用@autowired注入对象为null
date: 2020-12-03 15:06:29
tags: springboot
---
## 1. 问题
>今天遇到一个问题，使用 @Autowired 注解的时候，有个类怎么都注入不进来，死活不知道哪错了，按道理在类上加上了 @Component 注解，就交给 IOC 容器可以反射创建对象了
>我在这个类上使用的 @Component    然后在其他地方  new  了一个这个带有 @Component 类的对象。
这个时候看着没问题，其实已经错了。

## 2.原因
>当通过new的方式创建一个对象的时候，虽然期望使用了注解@Autowired对这个对象进行装配，但是Spring是不会这么做的，因为Spring不会对任意一个new 出来的对象进行自动装配，只有这个对象也是一个在Spring中注册过的Bean，才会获得自动装配的功能。
这时候，只需要把 new  去掉就好了

参考:[关于Springboot中使用@autowired注入对象为null](https://segmentfault.com/a/1190000021225279)