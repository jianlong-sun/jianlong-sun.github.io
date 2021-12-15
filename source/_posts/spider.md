---
title: spider
categories: 爬虫
description: 使用webmagic注解模式进行的爬虫
date: 2020-12-02 08:39:03
tags: spider
---
### 1.官网地址
[webmagic 爬虫](https://webmagic.io/)
### 2.代码
通过注解方式进行爬虫，顺便将含有封面的任务的封面图片进行he了下载,将爬取到的内容通过hutool工具包保存到excel中,
通过注解方式的爬虫，还有个helpUrl 和TargetUrl 还需要再研究下
```java
package com.sun;

import cn.hutool.poi.excel.ExcelUtil;
import cn.hutool.poi.excel.ExcelWriter;
import us.codecraft.webmagic.Site;
import us.codecraft.webmagic.model.OOSpider;
import us.codecraft.webmagic.model.annotation.ExtractBy;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

/**
 * @ClassName: Psaaspider
 */
public class Psaaspider {

    @ExtractBy(value = "$..title", type = ExtractBy.Type.JsonPath)
    private List<String> name;

    @ExtractBy(value = "$..createdTimeFullString", type = ExtractBy.Type.JsonPath)
    private List<String> dates;
    @ExtractBy(value = "$..difficult", type = ExtractBy.Type.JsonPath)
    private List<String> difficults;
    @ExtractBy(value = "$..icon", type = ExtractBy.Type.JsonPath)
    private List<String> pic;

   //省略 setter/getter

    public static void main(String[] args) throws InterruptedException {
        List<String> urls = new ArrayList<>();
        IntStream.rangeClosed(1, 3).forEach(i ->{
            urls.add("http://XXXXXX/api/task/list?size=8&page="+i+"&title=&difficult=&subjectCode=&gradeCode=&sort=&isMine=false&onlyEnabled=&visibility=0&showStyle=");
        });
        OOSpider.create(Site.me().addHeader("Authorization","Bearerd63f9a98-491e-4f53-9723-896d7f6d4cee"),
                new PsaaPipeline()
                , Psaaspider.class)
                .addUrl(urls.toArray(new String[urls.size()]))//
                .thread(5)//
                .run();
       Thread.sleep(500);
        // 通过工具类创建writer
        ExcelWriter writer = ExcelUtil.getWriter("d:/writeBeanTest9.xlsx");
// 合并单元格后的标题行，使用默认标题样式
        writer.merge(2, "任务详情");
// 一次性写出内容，使用默认样式，强制输出标题
        writer.write(PsaaPipeline.rows, true);
// 关闭writer，释放内存
        writer.close();
        System.out.println("一共："+PsaaPipeline.rows.size());

    }
}

```
### maven:
```xml
    <dependencies>
        <dependency>
            <groupId>us.codecraft</groupId>
            <artifactId>webmagic-core</artifactId>
            <version>0.7.3</version>
        </dependency>
        <dependency>
            <groupId>us.codecraft</groupId>
            <artifactId>webmagic-extension</artifactId>
            <version>0.7.3</version>
        </dependency>
        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-http</artifactId>
            <version>5.5.1</version>
        </dependency>
        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-poi</artifactId>
            <version>5.5.1</version>
        </dependency>
        <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi-ooxml</artifactId>
            <version>4.1.2</version>
        </dependency>
    </dependencies>
```
