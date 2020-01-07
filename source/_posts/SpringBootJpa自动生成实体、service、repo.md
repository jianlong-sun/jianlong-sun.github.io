---
title: SpringBoot Jpa自动生成实体、service、repo
categories: java
description: SpringBoot Jpa 自动生成实体、service、repo, mysql
date: 2019-11-01 15:10:51
tags: jpa
---
## 1.前言
正如我们知道的Spring data jpa 可以自动生成表结构，但是有时候也想通过现有的数据库表来生成实体。demo地址在文章结尾。
## 2.步骤
### 2.1 我这里用的是IDEA+MySql。
### 2.2 创建一个springboot项目
### 2.3 在IDEA中连上MySql数据库。
![连接数据库](/images/jpa/jpa1.png)
### 2.4 切换到如下目录。
![切换目录](/images/jpa/jpa2.png)
### 2.4 打开如下文件。
![打开文件](/images/jpa/jpa3.png)
<!--more-->
### 2.4 将内容替换为如下代码块1。
### 2.5 我的BaseEntity如下代码块2。
### 2.6 如下方式生成，点击后会让你选择要保存到哪个文件夹下
![生成文件](/images/jpa/jpa4.png)
##### 代码块1
```
import com.intellij.database.model.DasTable
import com.intellij.database.model.ObjectKind
import com.intellij.database.util.Case
import com.intellij.database.util.DasUtil

import java.time.LocalDate
import java.time.LocalDateTime

config = [
        impSerializable  : true,// 要不要序列化
        extendBaseEntity : true,// 要不要继承BaseEntity
        extendBaseService: false,// 要不要BaseService
        useLombok        : false, // 不使用会生成get、set方法

        // 不生成哪个就注释哪个
        generateItem     : [
                "Entity",
                "Service",
                "ServiceImpl",
                "Repository",
  //              "RepositoryCustom",
  //              "RepositoryImpl",
        ]
]

baseEntityPackage = "cn.entity.common.BaseEntity"/这里替换成自己的
baseServicePackage = "cn.service.common.BaseService"//这里替换成自己的
baseEntityProperties = ["id", "createDate", "lastModifiedDate", "version"]
time = LocalDateTime.now()
typeMapping = [
        (~/(?i)bool|boolean|tinyint/)     : "Boolean",
        (~/(?i)bigint/)                   : "Long",
        (~/int/)                          : "Integer",
        (~/(?i)float|double|decimal|real/): "Double",
        (~/(?i)datetime|timestamp/)       : "java.util.Date",
        (~/(?i)date/)                     : "java.sql.Date",
        (~/(?i)time/)                     : "java.sql.Time",
        (~/(?i)/)                         : "String"
]

FILES.chooseDirectoryAndSave("Choose directory", "Choose where to store generated files") { dir ->
    SELECTION.filter {
        it instanceof DasTable && it.getKind() == ObjectKind.TABLE
    }.each {
        generate(it, dir)
    }
}

// 生成对应的文件
def generate(table, dir) {

    def entityPath = "${dir.toString()}\\entity",
        servicePath = "${dir.toString()}\\service",
        serviceImplPath = "${dir.toString()}\\service\\data",
        repPath = "${dir.toString()}\\repository",
        repImpPath = "${dir.toString()}\\repository\\impl",
        controllerPath = "${dir.toString()}\\controller"

    mkdirs([entityPath, servicePath,serviceImplPath, repPath])

    System.out.println(table.getName())
    def entityName = javaName(table.getName(), true)
    def fields = calcFields(table)
    def basePackage = clacBasePackage(dir)

    if (isGenerate("Entity")) {
        genUTF8File(entityPath, "${entityName}.java").withPrintWriter { out -> genEntity(out, table, entityName, fields, basePackage) }
    }
    if (isGenerate("Service")) {
        genUTF8File(servicePath, "${entityName}Service.java").withPrintWriter { out -> genService(out, table, entityName, fields, basePackage) }
    }
    if (isGenerate("ServiceImpl")) {
        genUTF8File(serviceImplPath, "${entityName}ServiceImpl.java").withPrintWriter { out -> genServiceImpl(out, table, entityName, fields, basePackage) }
    }
    if (isGenerate("Repository")) {
        genUTF8File(repPath, "${entityName}Repository.java").withPrintWriter { out -> genRepository(out, table, entityName, fields, basePackage) }
    }
    if (isGenerate("RepositoryCustom")) {
        genUTF8File(repPath, "${entityName}RepositoryCustom.java").withPrintWriter { out -> genRepositoryCustom(out, entityName, basePackage) }
    }
    if (isGenerate("RepositoryImpl")) {
        genUTF8File(repImpPath, "${entityName}RepositoryImpl.java").withPrintWriter { out -> genRepositoryImpl(out, table, entityName, fields, basePackage) }
    }

}

// 是否需要被生成
def isGenerate(itemName) {
    config.generateItem.contains(itemName)
}

// 指定文件编码方式，防止中文注释乱码
def genUTF8File(dir, fileName) {
    new PrintWriter(new OutputStreamWriter(new FileOutputStream(new File(dir, fileName)), "utf-8"))
}

// 生成每个字段
def genProperty(out, field) {

    out.println ""
    out.println "\t/**"
    out.println "\t * ${field.comment}"
    out.println "\t * default value: ${field.default}"
    out.println "\t */"
    // 默认表的第一个字段为主键
    if (field.position == 1) {
        out.println "\t@Id"
    }
    out.println "\t@Column(name = \"${field.colum}\", nullable = ${!field.isNotNull})"
    out.println "\tprivate ${field.type} ${field.name};"
}

// 生成get、get方法
def genGetSet(out, field) {

    // get
    out.println "\t"
    out.println "\tpublic ${field.type} get${field.name.substring(0, 1).toUpperCase()}${field.name.substring(1)}() {"
    out.println "\t\treturn this.${field.name};"
    out.println "\t}"

    // set
    out.println "\t"
    out.println "\tpublic void set${field.name.substring(0, 1).toUpperCase()}${field.name.substring(1)}(${field.type} ${field.name}) {"
    out.println "\t\tthis.${field.name} = ${field.name};"
    out.println "\t}"
}

// 生成实体类
def genEntity(out, table, entityName, fields, basePackage) {
    out.println "package ${basePackage}.entity;"
    out.println ""
    if (config.extendBaseEntity) {
        out.println "import $baseEntityPackage;"
    }
    if (config.useLombok) {
        out.println "import lombok.Data;"
        out.println ""
    }
    if (config.impSerializable) {
        out.println "import java.io.Serializable;"
        out.println ""
    }
    out.println "import javax.persistence.*;"
    out.println ""
    out.println "/**"
    out.println "* ${table.getComment()}"
    out.println "*@author sun"
    out.println "*@Description: "
    out.println "*/"
    if (config.useLombok) {
        out.println "@Data"
    }
    out.println "@Entity"
    out.println "@Table(name = \"${table.getName()}\")"
    out.println "public class $entityName${config.extendBaseEntity ? " extends BaseEntity" : ""}${config.impSerializable ? " implements Serializable" : ""} {"

    if (config.extendBaseEntity) {
        fields = fields.findAll { it ->
            !baseEntityProperties.any { it1 -> it1 == it.name }
        }
    }

    fields.each() {
        genProperty(out, it)
    }

    if (!config.useLombok) {
        fields.each() {
            genGetSet(out, it)
        }
    }
    out.println "}"
}

// 生成Service
def genService(out, table, entityName, fields, basePackage) {
    out.println "package ${basePackage}.service;"
    out.println ""
    out.println "/**"
    out.println "*@author sun"
    out.println "*@Description: "
    out.println "*/"
    out.println "public interface ${entityName}Service{"
    out.println ""
    out.println "}"
}
// 生成ServiceImpl
def genServiceImpl(out, table, entityName, fields, basePackage) {
    out.println "package ${basePackage}.service.data;"
    out.println ""
    out.println "import ${basePackage}.service.${entityName}Service;"
    out.println ""
    out.println "import ${basePackage}.repository.${entityName}Repository;"
    if (config.extendBaseService) {
        out.println "import $baseServicePackage;"
        out.println "import ${basePackage}.entity.$entityName;"
    }
    out.println "import org.springframework.stereotype.Service;"
    out.println ""
    out.println "import javax.inject.Inject;"
    out.println ""
    out.println "/**"
    out.println "*@author sun"
    out.println "*@Description: "
    out.println " */"
    out.println "@Service"
    out.println "public class ${entityName}ServiceImpl implements ${entityName}Service${config.extendBaseService ? " extends BaseService<$entityName, ${fields[0].type}>" : ""}{"
    out.println ""
    out.println "\t@Inject"
    out.println "\tprivate ${entityName}Repository repository;"
    out.println "}"
}
// 生成Repository
def genRepository(out, table, entityName, fields, basePackage) {
    out.println "package ${basePackage}.repository;"
    out.println ""
    out.println "import ${basePackage}.entity.$entityName;"
    out.println "import org.springframework.data.jpa.repository.JpaRepository;"
    out.println "import org.springframework.stereotype.Repository;"
    out.println ""
    out.println "/**"
    out.println "*@author sun"
    out.println "*@Description: "
    out.println "*/"
    out.println "@Repository"
    out.println "public interface ${entityName}Repository extends JpaRepository<$entityName, ${fields[0].type}>{"
    out.println ""
    out.println "}"
}

// 生成RepositoryCustom
def genRepositoryCustom(out, entityName, basePackage) {
    out.println "package ${basePackage}.repository;"
    out.println ""
    out.println "public interface ${entityName}RepositoryCustom {"
    out.println ""
    out.println "}"
}

// 生成RepositoryImpl
def genRepositoryImpl(out, table, entityName, fields, basePackage) {
    out.println "package ${basePackage}.repository.impl;"
    out.println ""
    out.println "import ${basePackage}.repository.${entityName}RepositoryCustom;"
    out.println "import org.springframework.stereotype.Repository;"
    out.println ""
    out.println "import javax.persistence.EntityManager;"
    out.println "import javax.persistence.PersistenceContext;"
    out.println ""
    out.println "@Repository"
    out.println "public class ${entityName}RepositoryImpl implements ${entityName}RepositoryCustom {"
    out.println ""
    out.println "\t@PersistenceContext"
    out.println "\tprivate EntityManager em;"
    out.println "}"
}

// 生成文件夹
def mkdirs(dirs) {
    dirs.forEach {
        def f = new File(it)
        if (!f.exists()) {
            f.mkdirs()
        }
    }
}

def clacBasePackage(dir) {
    dir.toString()
            .replaceAll("^.+\\\\src\\\\main\\\\java\\\\", "")
            .replaceAll("\\\\", ".")
}

def isBaseEntityProperty(property) {
    baseEntityProperties.find { it == property } != null
}

// 转换类型
def calcFields(table) {
    DasUtil.getColumns(table).reduce([]) { fields, col ->

        def spec = Case.LOWER.apply(col.getDataType().getSpecification())
        def typeStr = typeMapping.find { p, t -> p.matcher(spec).find() }.value
        fields += [[
                           name     : javaName(col.getName(), false),
                           colum    : col.getName(),
                           type     : typeStr,
                           len      : col.getDataType().toString().replaceAll("[^\\d]", ""),
                           default  : col.getDefault(),
                           comment  : col.getComment(),
                           isNotNull: col.isNotNull(),
                           position : col.getPosition(),
                   ]]

    }
}

def javaName(str, capitalize) {
    def s = str.split(/(?<=[^\p{IsLetter}])/).collect { Case.LOWER.apply(it).capitalize() }
            .join("").replaceAll(/[^\p{javaJavaIdentifierPart}]/, "_").replaceAll(/_/, "")
    capitalize || s.length() == 1 ? s : Case.LOWER.apply(s[0]) + s[1..-1]
}
```
##### 代码块2
```java
package cn.entity.common;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;

/**
 * @ClassName: BaseEntity
 */
@MappedSuperclass
@EntityListeners({AuditingEntityListener.class})
public class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, length = 22, unique = true)
    protected Long id;

    @CreatedDate
    @Column(name = "create_date", nullable = false)
    protected Date createDate;

    @LastModifiedDate
    @Column(name = "last_modified_date")
    protected Date lastModifiedDate;

    @Version
    @Column(name = "version", nullable = false)
    protected Integer version;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Date getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(Date lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }
}
```
> 参考自：[Spring Boot JPA idea代码自动生成](https://www.jianshu.com/p/523af440eaf6)  
> 源码地址：https://github.com/jianlong-sun/generate