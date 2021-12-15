---
title: GitHubSSH
categories: java
description: 附加一段文章摘要，字数最好在140字以内，会出现在meta的description里面
date: 2020-04-20 17:09:20
tags: github
---
### 1.问题
刚在github ->settings->SSH keys中发现Added on 21 Oct 2020 Never used — Read/write,sshkey放上去后好像一直没有使用(never used)
### 2.解决
经过查看是在clone仓库时选的协议不对，应使用ssh协议，而不是https协议,如果本地已使用https协议克隆，可将本地git链接的远程地址修改为ssh,具体方式见参考。
### 3.参考
[stackoverflow](https://stackoverflow.com/questions/33880832/github-ssh-key-claiming-it-is-not-used)