---
title: Cannot add foreign key constraint 错误解决办法
categories: mysql
description: 附加一段文章摘要，字数最好在140字以内，会出现在meta的description里面
date: 2020-08-18 14:51:30
tags: mysql
---
## 
产生这个错误的多数原因有以下几点：   
```
1、两张表里要设主键和外键的字段的数据类型或者数据长度不一样 （例如这个是int 另外一个是tinyint，或者都是int，但是设置的长度不同）

2、要添加foreign key constraint的表里已经有记录了

3、两个表的引擎不一样，InnoDB OR MyISAM

4、要设置外键的字段不能为主键

5、外键字段参考字段必须为参考表的主键

6、两个字段必须具有相同的数据类型和约束

7、注意一下表的字符集以及要使用字段用的字符集两个表是否一致
```


我遇到的情况就是第7条。