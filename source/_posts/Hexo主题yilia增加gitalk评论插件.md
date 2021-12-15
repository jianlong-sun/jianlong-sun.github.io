---
layout: post
title: Hexo主题yilia增加gitalk评论插件
categories: 教程
date: 2021-12-15 08:35:14
tags:
  - hexo
  - yilia
  - gitalk
---

### Hexo主题yilia增加gitalk评论插件

#### 1.在`layout/_partial/post`目录下新增**gitalk.ejs**文件

```html
<div id="gitalk-container" style="padding: 0px 30px 0px 30px;"></div> 

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css">
<script src="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js"></script>
<script type="text/javascript">

if(<%=theme.gitalk.enable%>){
	var gitalk = new Gitalk({
  	clientID: '<%=theme.gitalk.ClientID%>',
  	clientSecret: '<%=theme.gitalk.ClientSecret%>',
  	repo: '<%=theme.gitalk.repo%>',
  	owner: '<%=theme.gitalk.githubID%>',
  	admin: ['<%=theme.gitalk.adminUser%>'],
  	id: '<%= page.date %>',
  	distractionFreeMode: '<%=theme.gitalk.distractionFreeMode%>'
})
gitalk.render('gitalk-container') 
}
</script>

```

#### 2.修改`source-src/css`/目录下**comment.scss**文件

```
#disqus_thread, .duoshuo, .cloud-tie-wrapper, #SOHUCS, #gitment-ctn, #gitalk-container {
	padding: 0 30px !important;
	min-height: 20px;
}

#SOHUCS {
	#SOHU_MAIN .module-cmt-list .block-cont-gw {
		border-bottom: 1px dashed #c8c8c8 !important;
	}
}
```

#### 3.在`layout/_partial`目录下的**article.ejs**文件内新增gitalk相关的配置代码：

```
<% if (theme.gitalk.enable){ %>
       <div id="gitalk-container"></div>
       <%- include post/gitalk.ejs %>
  <% } %>
```

#### 4.最后在`yilia`主题配置文件中新增`gitalk`相关的配置：

```
#gitalk评论
gitalk:
  enable:  true
  githubID: 写自己github的ID
  repo: 新建存放评论的仓库名
  ClientID:  下面讲述如何书写 需要注册 OAuth Application
  ClientSecret:  下面讲述如何书 需要注册 OAuth Application
#不这样书写容易报错
  adminUser: "['仓库名','仓库名']"
  labels: gitalk
  perPage: 15
  pagerDirection: last
  createIssueManually: true
  distractionFreeMode: true
```

#### 5.第四步的ClientId 和ClientSecret获取方式

https://github.com/settings/applications/new

![image-20211215084255150](https://raw.githubusercontent.com/jianlong-sun/PicBed/main/img/202112150842566.png)

![image-20211215084419015](https://raw.githubusercontent.com/jianlong-sun/PicBed/main/img/202112150844098.png)

#### 6.遇到的问题

##### 6.1 如果自己的博客用的是***.github.io，那么不再需要重新建评论库，需要稍微注意下。

##### 6.2 未找到相关的issue评论，请联系xxx初始化创建

这个问题还是要看下第四步的配置是否正确



> [博客集成评论功能---Gitalk - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/260781932)
>
> [Hexo主题yilia增加gitalk评论插件_爱吃芒果的西瓜-CSDN博客](https://blog.csdn.net/qq_40651535/article/details/94850535)

