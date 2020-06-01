---
title: jpa OneToOne OneToMany等注解及属性的详细使用说明
categories: java
description: 附加一段文章摘要，字数最好在140字以内，会出现在meta的description里面
date: 2019-12-04 16:16:21
tags: jpa
---
## 1.OneToOne
> 一对一关系即两个数据库中的数据一一对应。

在本例子中以Book和BookDetail为例子：
```
Book.java
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "bookDetail")
    private BookDetail bookDetail;
    
BookDetail.java    
     @OneToOne(cascade = CascadeType.ALL, mappedBy = "bookDetail")
     private Book book;
```
简单说明：
Book类，会在book表中创建book_detail外键：
BookDetail类，**mappedBy** 表示由Book类的bookDetail字段维护外键：[CascadeType](#CascadeType)会在后面进行详细说明。
## 2. OneToMany和ManyToOne 
> 一对多关系即数据库中的一行数据关联另一个数据库中的多行关系。多对一与之相反。  
  一对多与多对一关系也可能会有中间表关联两者。但是我们一般不建议使用中间表。使用mapperBy可以避免系统生成中间表（会在多的一方数据库中增加一个字段记录外键）。  
  这两个关系中的mappedBy一般声明于一的一方，即一的一方为被维护方。  
  [被维护方不会主动去维护关联关系。真正的关系维护，掌握在维护方的手中。](https://www.jianshu.com/p/0ffb8ef64760)

在本例中以班级和学生为例来进行说明：
```java
    public class Student {
        @ManyToOne(cascade=CascadeType.ALL,fetch=FetchType.LAZY)
        private ClassEntity classEntity;
    }
    public class ClassEntity {
        @OneToMany(cascade=CascadeType.PERSIST,fetch=FetchType.LAZY,mappedBy="classEntity")
        private Set<Student> students= new HashSet<>();
    }
```
简单说明：
[FetchType](#FetchType)可能不太了解，和[CascadeType](#CascadeType)放到一起介绍。
<!--more-->
## 3. ManyToMany
多对多的写法参考[ManyToMany](https://www.cnblogs.com/luohaonan/p/11245646.html)
```
@Entity
@Table(name = "t_student")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
 
    @Column(name = "name")
    private String name;
 
     
    /**
     * 多对多映射关系中，需要一个中间表记录这种多对多的关系。
     *
     * 中间表通过JoinTable.name定义中间表，表名称。
     * 通过JoinTable.joinColumns定义一方的主键
     * 通过JoinTable.inverseJoincolumns定义另一方的主键
     *
     *
     * 在多对多的映射关系中，忽略某些字段的json序列化尤其特别重要，
     * 否则就会产生大量的冗余数据。
     * JsonIgnoreProperties注解，只会对被注解的属性的直接字段起作用，
     * 比如下面的@JsonIgnoreProperties({"students"})作用于courses,
     * 就会给course里面每一个course的students属性过滤掉，理解这一点显得尤其特别重要。
     *
     * -----------------------------------------------------------------------------------
     * 补充：
     * 1.joinColumns用于定义当前表主键在关系表中的外键
     * 2.inverseJoinColumns用于定义对方表的主键在关系表中的外键
     * 3.多对多映射中对方表的字段，不用也写上JoinTable注解，只需要在ManyToMany注解中加入mappedBy并指定合适的值就行了
     */
    @ManyToMany
    @JoinTable(
            name="t_course_student",
            joinColumns= {@JoinColumn(name="student_id")},
            inverseJoinColumns= {@JoinColumn(name="course_id")}
    )
    @JsonIgnoreProperties({"students"})
    private Set<Course> courses;
}
```
```java
@Entity
@Table(name="t_course")
public class Course {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;
     
    @Column(name="name")
    private String name;
     
     
//  第一种写法  
//  @ManyToMany
//  @JoinTable(
//          name="t_course_student",
//          joinColumns= {@JoinColumn(name="course_id",referencedColumnName="id")},
//          inverseJoinColumns= {@JoinColumn(name="student_id")}
//         
//  )
//  @JsonIgnoreProperties({"courses","classroom"})
     
     
//  第二种写法  
    @ManyToMany(mappedBy="courses")
    @JsonIgnoreProperties({"courses","classroom"})
    private Set<Student> students;   
}
```
## <a id ="CascadeType">4.CascadeType解释</a>
>(这是我看到的比较好的解释了，如有更好的会再次更新)
大多数情况用CascadeType.MERGE就能达到级联更新新又不报错，用CascadeType.ALL时要斟酌下CascadeType.REMOVE

大白话：**给当前设置的实体操作另一个实体的权限**  
例子:给Student实体以操作课程的权限。若Student实体持有的Course实体在数据库中不存在时，保存该Student时，系统将自动在Course实体对应的数据库中保存这条Course数据。而如果没有这个权限，则无法保存该Course数据。
```java
public class Student {
    @ManyToMany(cascade=CascadeType.PERSIST,fetch=FetchType.LAZY)
    private Set<Course> courses = new HashSet<>();
    //其他代码略。
}
```
其余类似：
```
    CascadeType.REMOVE
    Cascade remove operation，级联删除操作。
    删除当前实体时，与它有映射关系的实体也会跟着被删除。
    CascadeType.MERGE
    Cascade merge operation，级联更新（合并）操作。
    当Student中的数据改变，会相应地更新Course中的数据。
    CascadeType.DETACH
    Cascade detach operation，级联脱管/游离操作。
    如果你要删除一个实体，但是它有外键无法删除，你就需要这个级联权限了。它会撤销所有相关的外键关联。
    CascadeType.REFRESH 
    Cascade refresh operation，级联刷新操作。
    假设场景 有一个订单,订单里面关联了许多商品,这个订单可以被很多人操作,那么这个时候A对此订单和关联的商品进行了修改,与此同时,B也进行了相同的操作,但是B先一步比A保存了数据,那么当A保存数据的时候,就需要先刷新订单信息及关联的商品信息后,再将订单及商品保存。(来自良心会痛的评论)
    CascadeType.ALL
    Cascade all operations，清晰明确，拥有以上所有级联操作权限。
```
## <a id ="FetchType">5.FetchType解释</a>
### 5.1 看了好多都是两句话完事解释完事，感觉还不是很明白，到底该怎么解释好呢？
```
    如果是EAGER，那么表示取出这条数据时，它关联的数据也同时取出放入内存中
    
    如果是LAZY，那么取出这条数据时，它关联的数据并不取出来，在同一个session中，什么时候要用，就什么时候取(再次访问数据库)。
    
    但是，在session外，就不能再取了。用EAGER时，因为在内存里，所以在session外也可以取。
    
    注意：
@OneToOne、ManyToOne  FetchType 默认为EAGER

理解：如果你设置成了FetchType为LAZY 那么如果想要在service中获取多方的数据，那么这个方法要加上@Transactional否则是要报错的。
一次会话可以包含多次事务

一次事务必然属于同一会话
https://blog.csdn.net/silyvin/article/details/79322167
```
> 本文引用参考自：https://www.jianshu.com/u/edee856014f6