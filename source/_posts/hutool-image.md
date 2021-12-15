---
title: hutool-image
categories: java
description: 使用hutool工具包进行拼图
date: 2020-12-02 09:05:17
tags: hutool
---
### 1.开始
吾爱破解相应的帖子：[帖子](https://www.52pojie.cn/thread-1318625-1-1.html)
大概需求：提供证件模板照片、成员照片以及成员基本信息表格，将照片、成员信息内容弄到照片模板上。
### 2.代码
#### 2.1 maven
```xml
       <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-poi</artifactId>
            <version>5.5.1</version>
        </dependency>
```
<!--more-->
```java
package com.sun;

import cn.hutool.core.img.ImgUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.poi.excel.ExcelReader;
import cn.hutool.poi.excel.ExcelUtil;

import java.awt.*;
import java.io.File;
import java.util.Arrays;
import java.util.List;

/**
 * @ClassName: image
 */
public class Iimage {
    private static void addText(File copyFile, String text, int y){
        ImgUtil.pressText(
                copyFile,
                copyFile,
                text, Color.black,
                //字体
                new Font("黑体", Font.BOLD, 50),
                //x坐标修正值。 默认在中间，偏移量相对于中间偏移
                50,
                //y坐标修正值。 默认在中间，偏移量相对于中间偏移
                y,
                //透明度：alpha 必须是范围 [0.0, 1.0] 之内（包含边界值）的一个浮点数字
                1f
        );
    }
    private static void addPic(File copyFile, File file){
        ImgUtil.pressImage(
                copyFile,
                copyFile,
                //水印图片
                ImgUtil.read(file),
                //x坐标修正值。 默认在中间，偏移量相对于中间偏移
                5,
                //y坐标修正值。 默认在中间，偏移量相对于中间偏移
                -220,
                1f
        );
    }

    public static void main(String[] args) {
        //读取照片列表
        List<File> files = Arrays.asList(FileUtil.ls("D:\\idm下载\\Compressed\\photos\\工作证照片"));
        //读取人员信息
        ExcelReader reader = ExcelUtil.getReader("D:\\idm下载\\Compressed\\photos\\工作证信息.xlsx");
        List<ExcelEmp> excelEmp = reader.readAll(ExcelEmp.class);
        //填充数据
        for (int i = 0; i < excelEmp.size(); i++) {
            ExcelEmp emp = excelEmp.get(i);
            File copyFile = FileUtil.copy("D:\\idm下载\\Compressed\\photos\\工作证.png", "D:\\idm下载\\Compressed\\photos\\" + emp.getName() + ".png", false);
            // 姓名
            addText(copyFile,emp.getName(),30);
            // 部门
            addText(copyFile,emp.getDepart(),130);
            // 工作
            addText(copyFile,emp.getJob(),220);
            // 照片
            addPic(copyFile,files.get(i));
        }
    }
}
class ExcelEmp{
    private String name;
    private String depart;
    private String job;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDepart() {
        return depart;
    }

    public void setDepart(String depart) {
        this.depart = depart;
    }

    public String getJob() {
        return job;
    }

    public void setJob(String job) {
        this.job = job;
    }
}
```
### 3成效
![成果](https://raw.githubusercontent.com/jianlong-sun/PicBed/main/img/202112141939616.png)
![所需文件](https://raw.githubusercontent.com/jianlong-sun/PicBed/main/img/202112141937176.png)