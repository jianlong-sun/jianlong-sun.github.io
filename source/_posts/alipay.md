---
title: alipay
categories: java
description: 支付宝支付接口的使用
date: 2019-10-22 14:45:24
tags: 支付
---
# 对支付宝支付接口的使用做一个简单总结
#### 1、条件有限，我是在支付宝的沙箱环境下进行开发测试的，整个流程就是用户下单，然后跳转到支付页面，用户扫二维码，跳转回系统，完成下单操作。demo地址在文章结尾。
>产品特点：
 用户仅出示手机扫码即可完成付款，方便快捷；
 资金实时到账，无现金流压力。
 
#### 首先要有支付宝账号，然后访问[支付宝开放平台沙箱环境](https://openhome.alipay.com/platform/appDaily.htm?tab=info)
#### 2、在沙箱环境中会自动生成一个沙箱应用，会显示出APPID和支付宝网关等信息，点击设置RSA2(SHA256)密钥(推荐），在弹出的窗口中选择公钥。通过下面的签名工具生成公钥填入页面，然后会生成应用公钥（商户公钥）和支付宝公钥
#### 3、介绍几个概念 ①商户appid  ②商户公钥、私钥  ③支付宝公钥  ④支付宝网关地址
                                                   
> 1.商户appid是识别商户的唯一ID，是让支付宝识别，我们到底是哪一个商户，这样支付宝就能识别商户对应的账号、用户号、收款账号...等等一系列信息。  
 2.商户公钥、私钥以及支付宝公钥这3个参数是对商户系统与支付宝进行信息交互的数字签名用的我们需要对发送之前的信息加把锁（用商户私钥进行签名），然后再发送给支付宝。支付宝收到商户发送的信息之后，发现上了把锁，那肯定得要一把钥匙（商户公钥）来解锁对吧，所以商户在跟支付宝签约APP支付功能的时候，就得把这把钥匙上传给支付宝了，支付宝就可以用商户的公钥进行解锁了。反过来也是一样，支付宝需要发送信息给商户信息，先用支付宝的私钥进行签名，再发送给商户系统，商户系统收到支付宝反馈过来的信息后，再用支付宝的公钥进行解密。在这里我们并没有用到支付宝的私钥，所以我们并不需要得到支付宝的私钥。这里放一个生成私钥公钥的[支付宝官方工具](http://p.tb.cn/rmsportal_6680_secret_key_tools_RSA_win.zip)  
  3.支付宝网关地址，是用来配置发送给支付宝的网关地址的。

#### ４、在下载钱包处选择下载沙箱钱包，这样基本的准备工作就做好了,沙箱钱包会提供账号密码，里面有资金可以供测试使用，\(0^◇^0)/ 假装自己有好多好多money。
#### 5、基本的流程
![](https://gw.alipayobjects.com/zos/skylark-tools/public/files/89f16c1633dd657952dba97d9e12ba92.png)
需要特别说明的是**最终的支付结果是以异步通知为准，以及对返回的数据进行验签处理，以保证是支付宝返回的数据**,
<!--more-->
#### 6.一些代码
pom.xml
```
	<dependency>  
            <groupId>org.springframework.boot</groupId>  
            <artifactId>spring-boot-starter-web</artifactId>  
        </dependency>  

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
		
		<dependency>
            <groupId>com.alipay.sdk</groupId>
            <artifactId>alipay-sdk-java</artifactId>
            <version>3.0.1</version>
        </dependency>
        <dependency>
            <groupId>commons-logging</groupId>
            <artifactId>commons-logging</artifactId>
            <version>1.1.1</version>
        </dependency>
		<dependency>
		    <groupId>com.alibaba</groupId>
		    <artifactId>fastjson</artifactId>
		    <version>1.2.47</version>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-freemarker</artifactId>
			</dependency>
        <dependency>
            <groupId>org.assertj</groupId>
            <artifactId>assertj-core</artifactId>
            <version>3.9.1</version>
        </dependency>
```
clientconfig
```
@Configuration
public class AlipayConfigurtion {
    @Autowired
    private Environment environment;

    @Bean
    public AlipayClient alipayClient() {
        AlipayConfig alipayConfig = AlipayConfig.getInstance();
        alipayConfig.setAlipay_public_key(environment.getProperty("alipay.alipay_public_key"));
        alipayConfig.setApp_id(environment.getProperty("alipay.app_id"));
        alipayConfig.setCharset(environment.getProperty("alipay.charset"));
        alipayConfig.setGatewayUrl(environment.getProperty("alipay.gatewayUrl"));
        alipayConfig
            .setMerchant_private_key(environment.getProperty("alipay.merchant_private_key"));
        alipayConfig.setNotify_url(environment.getProperty("alipay.notify_url"));
        alipayConfig.setReturn_url(environment.getProperty("alipay.return_url"));
        alipayConfig.setSign_type(environment.getProperty("alipay.sign_type"));
        alipayConfig.setPayer_show_name(environment.getProperty("alipay.payer_show_name"));
        
        // 获得初始化的AlipayClient
        AlipayClient alipayClient = new DefaultAlipayClient(alipayConfig.getGatewayUrl(),
            alipayConfig.getApp_id(), alipayConfig.getMerchant_private_key(), "json",
            alipayConfig.getCharset(), alipayConfig.getAlipay_public_key(),
            alipayConfig.getSign_type());
        return alipayClient;
    }
}
```

这一步返回的是一个自动提交的form表单，返回给前台后可以自动进行跳转到支付宝支付页面
```
        @Autowired
        private AlipayClient        alipayClient;
        /**
         * 网页支付
         * @param tradeNo   交易编号
         * @param payAmount 实付金额
         * @param goodsName 订单信息 例：交易猫租号平台租号交易
         * @param goodsDesc 商品名称、套餐信息
         * @return 返回html，直接回显使用
         */
        public String pcPay(String tradeNo, String payAmount, String goodsName, String goodsDesc) {
            //设置请求参数
        	 AlipayConfig alipayConfig = AlipayConfig.getInstance();
            AlipayTradePagePayRequest alipayRequest = new AlipayTradePagePayRequest();
            alipayRequest.setReturnUrl(alipayConfig.getReturn_url());
            alipayRequest.setNotifyUrl(alipayConfig.getNotify_url());
            AlipayTradePagePayModel model = new AlipayTradePagePayModel();
            model.setOutTradeNo(tradeNo);
            model.setTotalAmount(payAmount);
            model.setSubject(goodsName);
            model.setBody(goodsDesc);
            model.setProductCode("FAST_INSTANT_TRADE_PAY");
            model.setGoodsType("0");
            model.setTimeoutExpress("15m");
            alipayRequest.setBizModel(model);
            try {
                Date now = Calendar.getInstance().getTime();
                //请求
                AlipayTradePagePayResponse response = alipayClient.pageExecute(alipayRequest);
                String result = response.getBody();
                return result;
            } catch (AlipayApiException e) {
                LOGGER.error("网页预支付失败，tradeNo:{},payAmount:{},orderName:{},goodsName:{},msg:{}",
                    tradeNo, payAmount, goodsName, goodsDesc, e.getErrMsg(), e);
            }
            return "支付失败";
        }
```
一个简单的查询
```
      AlipayTradeQueryRequest alipayTradeQueryRequest = new AlipayTradeQueryRequest();

        alipayTradeQueryRequest.setBizContent("{" +

                "\"out_trade_no\":\""+orderNo+"\"" +

                "}");

        try {
            AlipayTradeQueryResponse alipayTradeQueryResponse = alipayClient.execute(alipayTradeQueryRequest);
            if(alipayTradeQueryResponse.isSuccess()){
                return alipayTradeQueryResponse.getTradeStatus();
            }
        } catch (AlipayApiException e) {
            e.printStackTrace();
        }
```

>更多相关信息参考:   
[官方文档](https://docs.open.alipay.com/194/105322/)  
[支付宝支付接口、支付宝订单查询接口 前端为APP](https://blog.csdn.net/qq_34139510/article/details/83009977)  
[原作者源码地址](https://github.com/sqf576052249/alipayTest.git)  
[fork后在基础上加上了查询](https://github.com/jianlong-sun/alipayTest.git)