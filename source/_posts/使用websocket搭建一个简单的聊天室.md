---
title: 使用websocket搭建一个简单的聊天室
categories: java
description: 使用websocket搭建一个简单的聊天室
date: 2020-06-01 15:18:48
tags: websocket
---
## 1.上半年回顾
```
    现在时间是2020年6月1日，2020年的上半年，大部分人因为疫情的影响在家憋了好长时间，2020年的春节也没有再走亲访友，开始上班后，一开始也是只能在家办公。今天公司全体员工终于可以正常上班了，继续记录一下工作中用到的一些东西和学习的东西，以备后续之用。
```
## 2.websocket
### 2.1 websocket简单介绍
**websocket** 百度百科解释：
> WebSocket是一种在单个TCP连接上进行全双工通信的协议。  WebSocket通信协议于2011年被IETF定为标准RFC 6455，并由RFC7936补充规范。WebSocket API也被W3C定为标准。  
WebSocket使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。在WebSocket API中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。

### 2.2 传统“即使通讯”
 *HTTP 协议有一个缺陷：通信只能由客户端发起。*  
很多网站为了实现即时通讯(real-time)，所用的技术都是轮询(polling)。轮询是在特定的的时间间隔(time interval)（如每1秒），由浏览器对服务器发出HTTP request，然后由服务器返回最新的数据给客服端的浏览器。这种传统的HTTP request d的模式带来很明显的缺点 – 浏览器需要不断的向服务器发出请求(request)，然而HTTP request 的header是非常长的，里面包含的数据可能只是一个很小的值，这样会占用很多的带宽。
<!--more-->
### 2.3 两者的比较
![socket](/images/socket/socket.png)

特点：
> （1）建立在 TCP 协议之上，服务器端的实现比较容易。  
  （2）与 HTTP 协议有着良好的兼容性。默认端口也是80和443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。  
  （3）数据格式比较轻量，性能开销小，通信高效。  
  （4）可以发送文本，也可以发送二进制数据。  
  （5）没有同源限制，客户端可以与任意服务器通信。  
  （6）协议标识符是ws（如果加密，则为wss），服务器网址就是 URL。  

### 2.4 服务端实现
```java
@ServerEndpoint(value = "/consult/{roomId}")
@RestController
public class ConsultWebSocket {
    // 使用map来收集session，key为roomId，value为同一个房间的用户集合
    private static final Map<String, Set<Session>> rooms = new ConcurrentHashMap<>();
    //缓存session对应的用户
    private static final Map<String, String> users = new ConcurrentHashMap<>();
//    //用来缓存聊天记录的
//    private ChatCacheService chatCacheService;
//    //进行文件上传具体实现细节的
//    private FileService fileService;

    /**
     * 连接创建后将上线的用户广播给组员
     */
    @OnOpen
    public void connect(@PathParam("roomId") String roomId, Session session) throws IOException {

        //目前使用随机名称，可以整合自己的session管理，如shiro之类的
        String name = randomName();

        // 将session按照房间名来存储，将各个房间的用户隔离
        if (!rooms.containsKey(roomId)) {
            // 创建房间不存在时，创建房间
            Set<Session> room = new HashSet<>();
            // 添加用户
            room.add(session);
            rooms.put(roomId, room);
        } else {
            // 房间已存在，直接添加用户到相应的房间
            rooms.get(roomId).add(session);
        }

        users.put(session.getId(), name);

        //向上线的人发送当前在线的人的列表
//        List<ChatMessage> userList = new LinkedList<>();
//        rooms.get(roomId)
//                .stream()
//                .map(Session::getId)
//                .forEach(s -> {
//                    ChatMessage chatMessage = new ChatMessage();
//                    chatMessage.setDate(new Date());
//                    chatMessage.setUserName("sys");
//                    chatMessage.setChatContent(users.get(s) + "在线");
//                    userList.add(chatMessage);
//                });
//        session.getBasicRemote().sendText(JSON.toJSONString(userList));

        //向房间的所有人广播谁上线了
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setDate(new Date());
        chatMessage.setUserName("sys");
        chatMessage.setChatContent(users.get(session.getId()) + "上线了");
        broadcast(roomId, JSON.toJSONString(chatMessage));
    }

    @OnClose
    public void disConnect(@PathParam("roomId") String roomId, Session session) {
        rooms.get(roomId).remove(session);
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setDate(new Date());
        chatMessage.setUserName("sys");
        chatMessage.setChatContent(users.get(session.getId()) + "下线了");
        users.remove(session.getId());
        broadcast(roomId, JSON.toJSONString(chatMessage));
        //log.info("<<<<<<<<<<<<<a client has disconnected!>>>>>>>>>>>>>>");
    }

    /**
     * @param msg 前台传回来的数据应为json数据
     */
    @OnMessage
    public void receiveMsg(@PathParam("roomId") String roomId,
                           String msg, Session session) {
        // 此处应该有html过滤，进行数据加工
        msg = users.get(session.getId()) + ":" + msg;
        // 接收到信息后进行广播
        broadcast(roomId, msg);
    }

//    /**
//     * 发送图片，视频，语音等
//     *
//     * @param name     用户名
//     * @param roomId 房间id
//     * @param file     上传的文件
//     */
//    @PostMapping("/consult/{roomId}/{name}")
//    public void file(@PathVariable("name") String name, @PathVariable("roomId") String roomId, MultipartFile file) {
//        ChatMessage chatMessage = new ChatMessage();
//        chatMessage.setDate(new Date());
//        chatMessage.setUserName(name);
//        chatMessage.setChatContent(fileService.upload(file, roomId));
//        broadcast(roomId, JSON.toJSONString(chatMessage));
//    }

    // 按照房间名进行广播
    private void broadcast(String roomId, String msg) {
        rooms.get(roomId).forEach(s -> {
            try {
                s.getBasicRemote().sendText(msg);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
        //将聊天记录加入缓存
        //这里需要将此服务层的bean手动注入
//        if (chatCacheService == null) {
//            chatCacheService = ApplicationContextRegister.getApplicationContext().getBean(ChatCacheService.class);
//        }
//        chatCacheService.cacheMsg(msg, roomId, CacheType.CONSULT);
    }


    //随机姓名
    private String randomName() {
        Random random = new Random();
        String str = "";
        int hightPos, lowPos;
        for (int i = 0; i < 4; ++i) {
            hightPos = (176 + Math.abs(random.nextInt(39)));
            lowPos = (161 + Math.abs(random.nextInt(93)));
            byte[] b = new byte[2];
            b[0] = (Integer.valueOf(hightPos)).byteValue();
            b[1] = (Integer.valueOf(lowPos)).byteValue();
            try {
                str += new String(b, "GB2312");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }
        return str;
    }
}
@Configuration
public class WebSocketConfig {
    // 下面关于websocket代码，打包成war包部署后，不需要这段代码，否则会报错。
//    @Bean
//    public ServerEndpointExporter aaaserverEndpointExporter() {
//        return new ServerEndpointExporter();
//    }
}
```
### 2.5 前端简单示例
```html
<!DOCTYPE html><html lang="en">
<head>
    <meta charset="UTF-8">
    <title>网络聊天室</title>
</head>
<style type="text/css">
    .msg_board {
        width: 644px;
        height: 200px;
        border: solid 1px darkcyan;
        padding: 5px;
        overflow-y: scroll;
    // 文字长度大于div宽度时换行显示
    word-break: break-all;
    }
    /*set srcoll start*/
    ::-webkit-scrollbar
    {
        width: 10px;
        height: 10px;
        background-color: #D6F2FD;
    }
    ::-webkit-scrollbar-track
    {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        /*border-radius: 5px;*/
        background-color: #D6F2FD;
    }
    ::-webkit-scrollbar-thumb
    {
        height: 20px;
        /*border-radius: 10px;*/
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color: #89D7F7;
    }
    /*set srcoll end*/
</style>
<body>
<label>房间名</label>
<input id="input_roomName" size="10" maxlength="10">
<input type="button"  value="进入聊天室" onclick="initWebSocket()" />
<input type="button" value="退出聊天室" onclick="closeWs()" /><br>
<div class="msg_board"></div>
<input id="input_msg" size="43" maxlength="40">
<input type="button" value="发送" onclick="send_msg()" />
</body>
<script type="text/javascript">
    var webSocket;

    function send_msg() {
        if (webSocket != null) {
            var input_msg = document.getElementById("input_msg").value.trim();
            if (input_msg == "") {
                return;
            }
            webSocket.send(input_msg);
            // 清除input框里的信息
            document.getElementById("input_msg").value = "";
        } else {
            alert("您已掉线，请重新进入聊天室...");
        }
    };

    function closeWs() {
        webSocket.close();
    };

    function initWebSocket() {
        var roomName = document.getElementById("input_roomName").value;
        // 房间名不能为空
        if (roomName == null || roomName == "") {
            alert("请输入房间名");
            return;
        }
        if ("WebSocket" in window) {
            if (webSocket == null) {
                //链接和端口号必须要正确，如何还是报404错误，那就是WebSocket服务没有启动
                var url = "ws://ip:8080/consult/" + roomName;
                // 打开一个 web socket
                webSocket = new WebSocket(url);
            } else {
                alert("您已进入聊天室...");
            }

            webSocket.onopen = function () {
                alert("已进入聊天室，畅聊吧...");
            };

            webSocket.onmessage = function (evt) {
                var msg_board = document.getElementsByClassName("msg_board")[0];
                var received_msg = evt.data;
                var old_msg = msg_board.innerHTML;
                msg_board.innerHTML = old_msg + received_msg + "<br>";
                // 让滚动块往下移动
                msg_board.scrollTop = msg_board.scrollTop + 40;
            };

            webSocket.onclose = function () {
                // 关闭 websocket，清空信息板
                alert("连接已关闭...");
                webSocket = null;
                document.getElementsByClassName("msg_board")[0].innerHTML = "";
            };
        }
        else {
            // 浏览器不支持 WebSocket
            alert("您的浏览器不支持 WebSocket!");
        }
    }
</script>
</html>

```