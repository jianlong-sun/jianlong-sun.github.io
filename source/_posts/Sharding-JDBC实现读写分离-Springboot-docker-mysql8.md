---
title: 'Sharding-JDBC实现读写分离,Springboot,docker,mysql8(一)'
categories: java
description: 附加一段文章摘要，字数最好在140字以内，会出现在meta的description里面
date: 2021-04-20 13:56:55
tags: 读写分离
---
### 1.前提
根据项目需要对数据库进行读写分离，主库负责处理事务性的增删改操作，从库负责处理查询操作，改善查询性能，使用 mysql的主从同步配置实现数据同步
### 2 首先说一下遇到的小问题，防止再次入坑。
##### 2.1 mysql版本
使用docker拉去的是mysql8的版本，关于密码验证这部分有了较大变动，详见[Mysql8](https://zhuanlan.zhihu.com/p/65638193),
创建用户的时候可以用
```sql
CREATE USER superadmin@'%' IDENTIFIED WITH mysql_native_password BY '123456';
```

mysql8有新的安全要求，不能像之前的版本那样一次性创建用户并授权需要先创建用户，再进行授权操作


### 3 步骤
##### 3.1 使用docker拉取mysql,创建容器,这里使用3307(主数据库) 3308（从数据库） 
```
docker run -itd --name mysql-3307 -p 3310:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql
docker run -itd --name mysql-3308 -p 3310:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql
```
![docker容器](https://raw.githubusercontent.com/jianlong-sun/PicBed/main/img/202112141935271.png)
<!--more-->

##### 3.2修改数据库配置文件

1.进入容器
```
docker exec -it mysql-3307 /bin/bash
```
2.查看一下当前配置文件（截图是已经配置好了的）
![docker容器](https://raw.githubusercontent.com/jianlong-sun/PicBed/main/img/202112141935077.png)
主要添加以下内容

```sql
#开启 MySQL 日志
log-bin = mysql-bin
#设置服务 id  主从不能一致
server-id = 1
#设置需要主从同步的数据库名称
binlog-do-db = user_db
#屏蔽系统数据库同步
binlog-ignore-db = mysql
binlog-ignore-db = information_schema
binlog-ignore-db = performance_schema
```
3.相对应的修改从库数据库配置文件
/etc/mysql/my.cnf
```
docker exec -it mysql-3308 /bin/bash
```
![docker容器](https://raw.githubusercontent.com/jianlong-sun/PicBed/main/img/202112141935516.png)
```sql
#开启 MySQL 日志
log-bin = mysql-bin
#设置服务 id  主从不能一致
server-id = 2
#设置需要主从同步的数据库
binlog-do-db = user_db
#屏蔽系统数据库同步
binlog-ignore-db = mysql.%
binlog-ignore-db = information_schema.%
binlog-ignore-db = performance_schema.%
```
4.修改完后，退出容器，重启容器
退出：使用exit命令退出
```sql
exit
```
重启：
```sql
docker restart mysql-3307
docker restart mysql-3308
```
##### 3.3 配置主从复制账号并授予权限
1.进入容器
```
docker exec -it mysql-3307 /bin/bash
```
2.使用root账号登入mysql,按照要求输入初始密码：123456（这是在启动镜像的时候设置的）
```sql
mysql -u root -p
```
3.创建一个用来主从同步的账号
```sql
CREATE USER sync_user@'%' IDENTIFIED WITH mysql_native_password BY '123456';
```
4.授予权限 REPLICATION SLAVE:允许用户使用复制从站从主机读取二进制日志事件
[grant](https://www.yiibai.com/mysql/grant.html)
```sql
GRANT REPLICATION SLAVE ON *.* TO sync_user@'%';
```
5.刷新权限
```sql
FLUSH PRIVILEGES;
```
6.查看位点
执行以下命令，并记住**箭头指向的两个值**
```sql
show master status;
```
![](https://raw.githubusercontent.com/jianlong-sun/PicBed/main/img/202112141935696.png)

##### 3.4 配置从库，使从库可以向主库拉去操作日志

1.进入容器
```
docker exec -it mysql-3308 /bin/bash
```
2.使用root账号登入mysql,按照要求输入初始密码：123456（这是在启动镜像的时候设置的）
```sql
mysql -u root -p
```
3.修改从库指向主库配置,需要使用**上面箭头指向的两个值**,修改下面配置，并在mysql中执行
```sql
CHANGE MASTER TO 
	 	master_host = '172.17.0.2',  #指定主库 IP 地址,可以通过 docker inspect mysql-3307 命令查看主库 IPAdress
	 	master_port = 3306,  #这个端口为主库容器内的 mysql 端口,不是宿主机映射容器的端口
		master_user = 'sync_user',  #主库创建的复制用户
		master_password = '123456', #复制用户密码
	    master_log_file = 'mysql‐bin.000005',  #主库文件名
	    master_log_pos = 42854;  #主库位点
```
4.启动同步
```sql
start slave;
```
5.查看启动是否成功,查看Slave_IO_Runing和Slave_SQL_Runing都为Yes说明同步成功
```sql
show slave status;
```
如下表示已成功
![](https://raw.githubusercontent.com/jianlong-sun/PicBed/main/img/202112141935981.png)

参考：
> [Sharding-JDBC实现读写分离,使用 mysql 配置主从同步](https://blog.csdn.net/TimeQuantum/article/details/107206849)
>
>[易百教程-mysql](https://www.yiibai.com/mysql/grant.html)
>[菜鸟教程](https://www.runoob.com/docker/docker-container-usage.html)
>[知乎-mysql](https://zhuanlan.zhihu.com/p/65638193)