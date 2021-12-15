---
title: MySql 手机号、邮箱等加密后数据模糊搜索
categories: Mysql
description:  MySql 手机号、邮箱等加密后数据模糊搜索
date: 2021-12-14 16:32:14
tags: mysql
---
[toc]

#### 1.需求

数据库中邮箱、手机号加密存储，而且后续要求支持对其进行模糊搜索。

#### 2.解决方式

将密文十六进制化，再存入varchar/char列。

插入：

```sql
INSERT` `INTO` `t_passwd_2 ``VALUES` `(HEX(AES_ENCRYPT(``'hello world'``, `秘钥`)));
```

查询：

```sql
 ``SELECT` `AES_DECRYPT(UNHEX(pass1), `秘钥`) ``FROM` `t_passwd_2;
```

如果含有中文需要做下特殊处理：

```sql
AND CAST(binary(AES_DECRYPT(UNHEX(pass1),"加密密钥"))
        AS CHAR CHARACTER SET UTF8)
        LIKE CONCAT('%',手机号/邮箱,'%')
```

参考链接：
> [mysql数据查询，对加密字段进行模糊查询_夜一-CSDN博客_mysql加密后模糊查询](https://blog.csdn.net/weixin_42691149/article/details/119797142)
>
> [MySQL利用AES_ENCRYPT()与AES_DECRYPT()加解密的正确方法示例_gw的博客-CSDN博客_aes_decrypt()](https://blog.csdn.net/gw5205566/article/details/81083446)

<!--more-->

每文一图：

#### ![infinity-2633340](https://s2.loli.net/2021/12/14/IqSDyF56biuH2dU.jpg)
