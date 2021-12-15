---
title: websocket 遇到的问题
categories: java
description: 附加一段文章摘要，字数最好在140字以内，会出现在meta的description里面
date: 2021-06-01 17:23:41
tags: websocket
---
# 总结下在使用websocket中遇到的问题及解决方法
下面都是在下面都是在@onOpen 方法中设置的
### 1.使用websocket发送10000字的文本，导致掉线。
解决方法：调整websocket缓冲区大小，websocket中MaxTextMessageBufferSize默认为 **8192** （8*1024）
```java
    // 200K
    private static int MAX_SIZE = 200 * 1024;
    // 最大缓冲区
    session.setMaxTextMessageBufferSize(MAX_SIZE);
```
### 2.客户端断网断电等异常情况，服务端session感知不到，其他客户端及服务端认为其仍在线，session open 仍为true
一开始是将客户端发送的ping消息保存到数据库中，服务器定时查询看有多久没发ping消息了，这样的实现不好
解决方法：客户端发送ping消息，维持与服务端心跳，服务端设置session的MaxIdleTimeout超时时间，我这客户端设置了每60s发送ping消息，服务端设置了90s超时时间。
```java
 session.setMaxIdleTimeout(TimeUnit.SECONDS.toMillis(90));

```

> 由于水平有限，所使用的的方法可能有误，仅供参考