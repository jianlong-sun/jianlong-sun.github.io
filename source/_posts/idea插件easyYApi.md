---
title: '''idea插件easyYApi'''
categories: idea
description: 附加一段文章摘要，字数最好在140字以内，会出现在meta的description里面
date: 2021-04-20 16:24:35
tags: idea
---
## 1.前提
团队使用[yapi](https://github.com/YMFE/yapi)做为接口文档管理工具，由于api接口初期变化较大而且需要分别维护代码注释及yapi文档，导致yapi文档更新不及时或漏更新，
后发现idea插件easyYapi.经过实际使用这种几乎对代码无侵入或者少侵入以及可以灵活配置符合我的使用要求。
### 2.使用方式
1.File →setting → Plugins → Marketplace → 搜索“EasyYapi” → 安装该插件 → 重启IDE
2.支持以下使用方法
>打开项目中的包含api/rpc的文件或者在I.DEA的左边项目文件区域选择文件或者文件夹 使用快捷键alt shift E(windows)/ctrl E(mac) 然后选择要导出的API,选择导出渠道Yapi/Markdown/Postman 点击[✔]按钮或者按回车键完成导出


>打开项目中的包含api/rpc的文件 右键文件内容选择Generate...或者用[Alt + Insert]/[Ctrl+Enter](快捷键可能不一样)" 然后选择ExportYapi/ExportPostman/ExportMarkdown


> 在IDEA的左边项目文件区域选择文件或者文件夹 鼠标点击最上方Code > ExportYapi/ExportPostman/ExportMarkdown

> 鼠标点击最上方Code > YapiDashBoard 然后就可以用鼠标将左边的API拖动到右边yapi目录中，完成API导出到Yapi

> 鼠标点击最上方Code > ApiDashBoard 然后就可以用鼠标将左边的API拖动到右边postman目录中，完成API导出到Postman

>打开项目中的包含api/rpc的文件 右键文件内容选择Generate...或者用[Alt + Insert]/[Ctrl+Enter] (快捷键可能不一样)" 然后选择Call,就可以发起对当前文件中的API的请求

**在初次使用的时候需要输入yapi部署地址及项目token,去如下位置寻找**
![yapi服务器及token位置](https://raw.githubusercontent.com/jianlong-sun/PicBed/main/img/202112141931024.png)

### 3.参考资料
> [easyyapi官方文档](https://easyyapi.com/index.html)
> [IDEA 插件 EasyYapi](https://www.cnblogs.com/allennote/articles/13154966.html)