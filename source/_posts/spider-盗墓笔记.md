---
title: spider_盗墓笔记(单文件版,Springboot、jpa整合版(源码包))
categories: 爬虫
description: 练习使用webmagic 对盗墓笔记进行爬取
date: 2020-12-03 11:20:20
tags: spider
---
## 1.爬取目标：
url:http://seputu.com/biji1/  
单文件版期望结果：将爬取到的内容输出到控制台并保存到excel表格中
整合版期望结果：将爬取到的内容输出到控制台并保存到数据库中
## 2.收获
### 2.1.webmagic
#### 2.1.1 webmagic_formatter格式转换
[webmagic_formatter](http://webmagic.io/docs/zh/posts/ch5-annotation/formatter.html)

> 5.5.2 显式指定转换类型  
  一般情况下，Formatter会根据字段类型进行转换，但是特殊情况下，我们会需要手动指定类型。这主要发生在字段是List类型的时候。
 ```java
  @Formatter(value = "",subClazz = Integer.class)
  @ExtractBy(value = "//div[@class='id']/text()", multi = true)
  private List<Integer> ids;
```
#### 2.1.2 不使用class中list
类属性不使用list方式接收，这样导出到表或者数据库中的时候就不用再创建一个对应的类，更加方便了，代码放到下面。
#### 2.1.3 使用正则对获取的字符串，比如对时间进行提取

```java
    // [所属目录：    发布时间：2012-5-22    作者：南派三叔]
    class NoListPrintPipeline implements PageModelPipeline<DaoMuBiJiSpiderNoList> {
        public static final  List<DaoMuBiJiSpiderNoList> rows = new ArrayList<>();
        private static Pattern NUMBER_PATTERN = Pattern.compile("\\d+-\\d+-\\d+");
        @Override
        public void process(DaoMuBiJiSpiderNoList daoMuBiJiSpiderNoList, Task task) {
            System.out.println(daoMuBiJiSpiderNoList);
            String date = daoMuBiJiSpiderNoList.getDate();
            Matcher matcher = NUMBER_PATTERN.matcher(date);
            if(matcher.find()){
                daoMuBiJiSpiderNoList.setDate(matcher.group());
            }
            rows.add(daoMuBiJiSpiderNoList);
        }
    }
```

### 2.2.hutool-poi
> 对输出的表格进行别名的处理 这个顺序好像也是输出到表格顺序
> writer.addHeaderAlias("index", "序号");  
      writer.addHeaderAlias("origin", "来源");

疑问：写出的时候能对别名进行处理，那么读取的时候是不是也可以？？
经过测试是可以的
```java
        //读取人员信息
        ExcelReader reader = ExcelUtil.getReader("D:\\idm下载\\Compressed\\photos\\工作证信息.xlsx");
        Map<String,String> map = new HashMap<String,String>(){{
           // 这么写证明是可以的put("表格标题字段"，"类属性字段名")
            put("姓名", "name");
            put("部门", "depart");
            put("职务", "job");
        }};
        reader.setHeaderAlias(map);

        List<ExcelEmp> excelEmp = reader.readAll(ExcelEmp.class);
```
<!--more-->
## 3.盗墓笔记爬虫代码
```xml
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
```
### 3.1不使用list接收（更方便）
```java
package com.sun;

import cn.hutool.poi.excel.ExcelUtil;
import cn.hutool.poi.excel.ExcelWriter;
import com.sun.down.HttpClientDownloader;
import us.codecraft.webmagic.Site;
import us.codecraft.webmagic.Spider;
import us.codecraft.webmagic.Task;
import us.codecraft.webmagic.model.OOSpider;
import us.codecraft.webmagic.model.annotation.*;
import us.codecraft.webmagic.pipeline.PageModelPipeline;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 盗墓笔记Spider
 *
 * @ClassName: DaoMuBiJiSpider
 * @Author: sunji
 * @CreateTime: 2020/12/3 10:08
 */
@TargetUrl("http://seputu.com/biji1/*")
@HelpUrl("http://seputu.com/biji1/")
public class DaoMuBiJiSpiderNoList {
    @ExtractBy("/html/body/div/div[5]/h1/text()")
    private String title;
    @ExtractBy("/html/body/div/div[5]/div[1]/a/text()")
    private String origin;
    @ExtractBy("/html/body/div/div[5]/div[1]/text()")
    private String date;

    @Formatter(value = "",subClazz = Integer.class)
    @ExtractByUrl(value = ".*/biji1/(\\d+).html",notNull = true)
    private Integer index;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Integer getIndex() {
        return index;
    }

    public void setIndex(Integer index) {
        this.index = index;
    }

    @Override
    public String toString() {
        return "DaoMuBiJiSpiderNoList{" +
                "title='" + title + '\'' +
                ", origin='" + origin + '\'' +
                ", date=" + date +
                ", index=" + index +
                '}';
    }

    public static void main(String[] args) throws InterruptedException {
        HttpClientDownloader httpClientDownloader = new HttpClientDownloader();

        Spider thread = OOSpider.create(Site.me().setSleepTime(1000)
                , new NoListPrintPipeline(), DaoMuBiJiSpiderNoList.class)
                .addUrl("http://seputu.com/biji1/").thread(5).setDownloader(httpClientDownloader);
        thread.run();

        // 通过工具类创建writer
        ExcelWriter writer = ExcelUtil.getWriter("d:/盗墓笔记5.xlsx");
        writer.addHeaderAlias("index", "序号");
        writer.addHeaderAlias("origin", "来源");
        writer.addHeaderAlias("date", "日期");
        writer.addHeaderAlias("title", "标题");
// 合并单元格后的标题行，使用默认标题样式
        writer.merge(3, "盗墓笔记1");
// 一次性写出内容，使用默认样式，强制输出标题
        writer.write(NoListPrintPipeline.rows, true);
// 关闭writer，释放内存
        writer.close();
        System.out.println("一共："+NoListPrintPipeline.rows.size());
    }
}

class NoListPrintPipeline implements PageModelPipeline<DaoMuBiJiSpiderNoList> {
    public static final  List<DaoMuBiJiSpiderNoList> rows = new ArrayList<>();
    private static Pattern NUMBER_PATTERN = Pattern.compile("\\d+-\\d+-\\d+");
    @Override
    public void process(DaoMuBiJiSpiderNoList daoMuBiJiSpiderNoList, Task task) {
        System.out.println(daoMuBiJiSpiderNoList);
        String date = daoMuBiJiSpiderNoList.getDate();
        Matcher matcher = NUMBER_PATTERN.matcher(date);
        if(matcher.find()){
            daoMuBiJiSpiderNoList.setDate(matcher.group());
        }
        rows.add(daoMuBiJiSpiderNoList);
    }
}
```

### 3.2使用list接收
```java
package com.sun;

import cn.hutool.poi.excel.ExcelUtil;
import cn.hutool.poi.excel.ExcelWriter;
import com.sun.down.HttpClientDownloader;
import us.codecraft.webmagic.Site;
import us.codecraft.webmagic.Spider;
import us.codecraft.webmagic.Task;
import us.codecraft.webmagic.model.OOSpider;
import us.codecraft.webmagic.model.annotation.*;
import us.codecraft.webmagic.pipeline.PageModelPipeline;

import java.util.ArrayList;
import java.util.List;

/**
 * 盗墓笔记Spider
 *
 * @ClassName: DaoMuBiJiSpider
 * @Author: sunji
 * @CreateTime: 2020/12/3 10:08
 */
@TargetUrl("http://seputu.com/biji1/*")
@HelpUrl("http://seputu.com/biji1/")
public class DaoMuBiJiSpider {
    @ExtractBy("/html/body/div/div[5]/h1/text()")
    private List<String> title;
    @ExtractBy("/html/body/div/div[5]/div[1]/a/text()")
    private List<String> origin;
    @ExtractBy("/html/body/div/div[5]/div[1]/text()")
    private List<String> date;

    @Formatter(value = "",subClazz = Integer.class)
    @ExtractByUrl(".*/biji1/(\\d+).html")
    private List<Integer> indexs;

    public List<String> getTitle() {
        return title;
    }

    public void setTitle(List<String> title) {
        this.title = title;
    }

    public List<String> getOrigin() {
        return origin;
    }

    public void setOrigin(List<String> origin) {
        this.origin = origin;
    }

    public List<String> getDate() {
        return date;
    }

    public void setDate(List<String> date) {
        this.date = date;
    }

    public List<Integer> getIndexs() {
        return indexs;
    }

    public void setIndexs(List<Integer> indexs) {
        this.indexs = indexs;
    }

    @Override
    public String toString() {
        return "DaoMuBiJiSpider{" +
                "title=" + title +
                ", origin=" + origin +
                ", date=" + date +
                ", indexs=" + indexs +
                '}';
    }

    public static void main(String[] args) throws InterruptedException {
        // 这是我重写了下源码的 HttpClientDownloader 也可以直接用自带
        HttpClientDownloader httpClientDownloader = new HttpClientDownloader();

        Spider thread = OOSpider.create(Site.me().setSleepTime(1000)
                , new PrintPipeline(), DaoMuBiJiSpider.class)
                .addUrl("http://seputu.com/biji1/").thread(5)
                // 不写下面那行 就是用自带的
                .setDownloader(httpClientDownloader);
        // 可以加个监听器 我这没加
        thread.run();
      
        // 通过工具类创建writer
        ExcelWriter writer = ExcelUtil.getWriter("d:/盗墓笔记2.xlsx");
        writer.addHeaderAlias("index", "序号");
        writer.addHeaderAlias("origin", "来源");
        writer.addHeaderAlias("date", "日期");
        writer.addHeaderAlias("title", "标题");
// 合并单元格后的标题行，使用默认标题样式
        writer.merge(3, "盗墓笔记1.2");
// 一次性写出内容，使用默认样式，强制输出标题
        writer.write(PrintPipeline.rows, true);
// 关闭writer，释放内存
        writer.close();
        System.out.println("一共："+PrintPipeline.rows.size());
    }
}
class PrintPipeline implements PageModelPipeline<DaoMuBiJiSpider>{
    public static final  List<DaoMuBiJi> rows = new ArrayList<>();

    @Override
    public void process(DaoMuBiJiSpider spider, Task task) {
        for (int i = 0; i < spider.getIndexs().size(); i++) {
            DaoMuBiJi biji = new DaoMuBiJi();
            biji.setTitle(spider.getTitle().get(i));
            biji.setOrigin(spider.getOrigin().get(i));
            biji.setDate(spider.getDate().get(i));
            Integer integer = spider.getIndexs().get(i);
            biji.setIndex(integer);
            System.out.println(biji);
            rows.add(biji);
        }
    }
}
class DaoMuBiJi{
    private Integer index;
    private String title;
    private String origin;
    private String date;


    public DaoMuBiJi() {
    }

    public DaoMuBiJi(String title, String origin, String date, Integer index) {
        this.title = title;
        this.origin = origin;
        this.date = date;
        this.index = index;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Integer getIndex() {
        return index;
    }

    public void setIndex(Integer index) {
        this.index = index;
    }

    @Override
    public String toString() {
        return "DaoMuBiJi{" +
                "title='" + title + '\'' +
                ", origin='" + origin + '\'' +
                ", date='" + date + '\'' +
                ", index=" + index +
                '}';
    }
}
```
## 4.webmagic 与 springboot、jpa 进行整合，保存数据到数据库中
[整合版下载地址](/public_down/webmagicCode.zip)
