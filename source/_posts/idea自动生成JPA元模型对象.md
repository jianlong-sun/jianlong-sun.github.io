---
title: idea自动生成JPA元模型对象
categories: idea
description: idea自动生成JPA元模型对象
date: 2020-07-13 11:35:16
tags: idea
---
## 1.问题
项目使用Jpa Model，编译各种报错，需要生成各种Area_类似这样的类
## 2.解决
### 2.1 在pom中加入依赖,记得刷新下pom
```
<dependency>
    <groupId>org.hibernate</groupId>
    <artifactId>hibernate-jpamodelgen</artifactId>
    <version>5.2.10.Final</version>
</dependency>
```
### 2.2 设置
在idea File -> settings 在搜索框中输入“Annotation Processors”，选择Enable annotation processing 打勾表示启用。
![jpamodel](https://raw.githubusercontent.com/jianlong-sun/PicBed/main/img/202112141941871.png)
```
org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor
```