---
title: typora+picgo+sm.ms/github图床-实现图片自动上传
categories: 默认分类
description: Hello,World 
date: 2021-10-9 17:28:35
tags: 图床
---

##### 前提

使用hexo + github.io 上传图片时图片显示不出来，经过摸索大概有两种方式，一种是（这种不太好用:smiling_imp: ）[HEXO插入图片（详细版） - 简书 (jianshu.com)](https://www.jianshu.com/p/f72aaad7b852)，这个不再做记录，另一种是通过上传到图床的方式([sm.ms图床](#smms) ，实际体验过程中总是上传失败，也不太好用:smiling_imp:， [github图床](#github)github图床方式好用 :smile:)，这里记录下，供以后参考。

##### 1.typora设置及下载picgo(app)将安装路径配置好

![image-20211009173022139](https://i.loli.net/2021/10/09/mMWPk39tbus5xNy.png)

##### 2.设置picgo

![image-20211009173114743](https://i.loli.net/2021/10/09/97OahGgjJsDZlnz.png)

搜索并安装插件 smms-user 

##### 3.<span id="smms">sm.ms图床</span>

###### 3.1 注册并登录（github图床请看 [github图床](#github)）

[Image Upload - SM.MS - Simple Free Image Hosting](https://sm.ms/)

###### 3.2.依次点击这里

![image-20211009173237819](https://i.loli.net/2021/10/09/wkUvzuFdRSK3lTb.png)

![image-20211009173319324](https://i.loli.net/2021/10/09/6hPsiwQbVKpcCnv.png)

复制符号3部分的Secret Token,后面要用到

###### 3.3.回到pic go

点击小齿轮，将第四步骤复制的token粘贴到点击小齿轮后弹出的选项的最后两项，这里不好截图。

![image-20211009173517725](https://i.loli.net/2021/10/09/5krFpCQZfYtn4Rw.png)

上传区这里选择sm.ms 登录用户

![image-20211009173809536](https://i.loli.net/2021/10/09/YUlXyhHFnCORoWZ.png)

##### 4.<span id="github">GitHub图床</span>

###### 4.1 创建存放图片的仓库，就像平常创建仓库一样，记得是public的

###### 4.2 获取可以操作仓库的token,注意保存好token

[Personal Access Tokens (github.com)](https://github.com/settings/tokens)

![image-20211214200455845](https://raw.githubusercontent.com/jianlong-sun/PicBed/main/img/202112142004894.png)



![img](https://raw.githubusercontent.com/jianlong-sun/PicBed/main/img/202112142005969.png)

###### 4.3 配置github图床

注意github 主分支由master改成main了

自定义域名为:https://raw.githubusercontent.com/用户名/RepositoryName/分支名

这里我设置的是：https://raw.githubusercontent.com/jianlong-sun/PicBed/main

![image-20211214200646536](https://raw.githubusercontent.com/jianlong-sun/PicBed/main/img/202112142006581.png)

##### 5.回到typora进行测试
