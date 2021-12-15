---
title: SpringCloud
categories: java
description: 通过一个项目来学习SpringCloud
date: 2020-06-02 17:42:47
tags: SpringCloud
---
## 1.前言

对SpringCloud进行一下学习，希望可以学会初步使用，然后逐步运用到项目中去。

## 2.今日内容
项目地址：[轻松阅读](https://github.com/Zealon159/light-reading-cloud)     
 >基于SpringCloud生态开发的阅读类APP微服务实战项目，涉及 SpringCloud-Config、Eureka、OpenFeign、Hystrix、Jwt、SpringCloud-Gateway、ElasticSearch 等技术栈的应用  

今日主要是将项目客户端及服务端clone了下来，并各自导入到了开发工具。通过阅读项目的readme.md文档
对项目有个初步的了解并修改其中的相关配置将项目运行了起来。在运行项目过程中也遇到了一些小问题，稍后进行一下记录。

## 3.先展示一下运行结果

![socket](https://raw.githubusercontent.com/jianlong-sun/PicBed/main/img/202112141941055.png)
<!--more-->

## 4.遇到的问题
整个项目的后端如下图：  
![socket](https://raw.githubusercontent.com/jianlong-sun/PicBed/main/img/202112141941199.png)  
在启动 **reading-cloud-gateway**这个服务的时候，遇到了报错，报错信息：
```
Description:

An attempt was made to call a method that does not exist. The attempt was made from the following location:

    org.springframework.boot.autoconfigure.condition.OnBeanCondition.getMatchOutcome(OnBeanCondition.java:114)

The following method did not exist:

    org.springframework.core.type.AnnotatedTypeMetadata.getAnnotations()Lorg/springframework/core/annotation/MergedAnnotations;

The method's class, org.springframework.core.type.AnnotatedTypeMetadata, is available from the following locations:

    jar:file:/C:/Users/XXX/.m2/repository/org/springframework/spring-core/5.1.7.RELEASE/spring-core-5.1.7.RELEASE.jar!/org/springframework/core/type/AnnotatedTypeMetadata.class

It was loaded from the following location:

    file:/C:/Users/XXX/.m2/repository/org/springframework/spring-core/5.1.7.RELEASE/spring-core-5.1.7.RELEASE.jar


Action:

Correct the classpath of your application so that it contains a single, compatible version of org.springframework.core.type.AnnotatedTypeMetadata

2020-06-02 18:02:02.207 ERROR 22156 --- [           main] o.s.boot.SpringApplication               : Application run failed

java.lang.NoSuchMethodError: org.springframework.core.type.AnnotatedTypeMetadata.getAnnotations()Lorg/springframework/core/annotation/MergedAnnotations;

```
解决：将如下版本信息注释掉，然后reimport project 问题得以解决
```
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-autoconfigure</artifactId>
<!--            <version>2.2.2.RELEASE</version>-->
            <scope>compile</scope>
        </dependency>
```