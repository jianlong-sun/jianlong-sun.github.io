---
title: 日常项目中经验积累-RequestBody
categories: java
description: RequestBody 的注意事项
date: 2019-08-13 18:28:12
tags: java
---
# 1.@RequestBody 

## 1.1注意bindingresult 位置  
使用 @RequestBody @Validated，后面**紧跟**bindingresult 可以接收到错误信息
## 1.2 一些常用的判断方式
@NotNull://CharSequence, Collection, Map 和 Array 对象不能是 null, 但可以是空集（size = 0）。  
@NotEmpty://CharSequence, Collection, Map 和 Array 对象不能是 null 并且相关对象的 size 大于 0。  
@NotBlank://String 不是 null 且去除两端空白字符后的长度（trimmed length）大于 0。

@Null  被注释的元素必须为null  
@NotNull  被注释的元素不能为null  
@AssertTrue  被注释的元素必须为true  
@AssertFalse  被注释的元素必须为false     
@Min(value)  被注释的元素必须是一个数字，其值必须大于等于指定的最小值  
@Max(value)  被注释的元素必须是一个数字，其值必须小于等于指定的最大值 
<!--more-->
@DecimalMin(value)  被注释的元素必须是一个数字，其值必须大于等于指定的最小值  
@DecimalMax(value)  被注释的元素必须是一个数字，其值必须小于等于指定的最大值  
@Size(max,min)  被注释的元素的大小必须在指定的范围内。  
@Digits(integer,fraction)  被注释的元素必须是一个数字，其值必须在可接受的范围内  
@Past  被注释的元素必须是一个过去的日期  
@Future  被注释的元素必须是一个将来的日期  
@Pattern(value) 被注释的元素必须符合指定的正则表达式。  
@Email 被注释的元素必须是电子邮件地址  
@Length 被注释的字符串的大小必须在指定的范围内  
@NotEmpty  被注释的字符串必须非空  
@Range  被注释的元素必须在合适的范围内

# 1.3 @RequestBody @Validated  ValidList<LiberaryMapping> LiberaryMapping, BindingResult result
> LiberaryMapping 实体 如下，省略setter,getter
```java
    @NotBlank(message = "任务id不能为空")
    private  String taskId;
    @NotBlank(message = "子任务id不能为空")
    private String processId;
    @NotBlank(message = "步骤id不能为空")
    private String stepId;
```
> 前台传的json如下,注意**实体属性与json中下划线的变化**
```
[
    {
        "task_id": "2",
        "process_id": "22",
        "step_id": "   "
    },
    {
        "task_id": "2",
        "process_id": "33",
        "step_id": "999"
    }
]
```
# 1.4 psaa项目中 ValidList
ValidList<E> 当用来接收类似ValidList<LiberaryMapping> LiberaryMapping，用来验证list中实体是否正确
> ValidList 如下
```java
package cn.edu.bnu.psaa.util;

import javax.validation.Valid;
import java.util.*;

/**
 * @ClassName: ValidList
 * @Author: sunji
 * @CreateTime: 2019/7/24 9:08
 * @Description: TODO 用来接收实体信息并用来验证
 */
public class ValidList<E> implements List<E> {

    @Valid
    private List<E> list = new ArrayList<>() ;//这里看需要实例化需要的List类型

    public List<E> getList() {
        return list;
    }

    public void setList(List<E> list) {
        this.list = list;
    }

    @Override
    public int size() {
        return list.size();
    }

    @Override
    public boolean isEmpty() {
        return list.isEmpty();
    }

    @Override
    public boolean contains(Object o) {
        return list.contains(o);
    }

    @Override
    public Iterator<E> iterator() {
        return list.iterator();
    }

    @Override
    public Object[] toArray() {
        return list.toArray();
    }

    @Override
    public <T> T[] toArray(T[] a) {
        return list.toArray(a);
    }

    @Override
    public boolean add(E e) {
        return list.add(e);
    }

    @Override
    public boolean remove(Object o) {
        return list.remove(o);
    }

    @Override
    public boolean containsAll(Collection<?> c) {
        return list.contains(c);
    }

    @Override
    public boolean addAll(Collection<? extends E> c) {
        return list.addAll(c);
    }

    @Override
    public boolean addAll(int index, Collection<? extends E> c) {
        return list.addAll(index, c);
    }

    @Override
    public boolean removeAll(Collection<?> c) {
        return list.removeAll(c);
    }

    @Override
    public boolean retainAll(Collection<?> c) {
        return list.retainAll(c);
    }

    @Override
    public void clear() {
        list.clear();
    }

    @Override
    public E get(int index) {
        return list.get(index);
    }

    @Override
    public E set(int index, E element) {
        return list.set(index, element);
    }

    @Override
    public void add(int index, E element) {
        list.add(index, element);
    }

    @Override
    public E remove(int index) {
        return list.remove(index);
    }

    @Override
    public int indexOf(Object o) {
        return list.indexOf(o);
    }

    @Override
    public int lastIndexOf(Object o) {
        return list.lastIndexOf(o);
    }

    @Override
    public ListIterator<E> listIterator() {
        return list.listIterator();
    }

    @Override
    public ListIterator<E> listIterator(int index) {
        return list.listIterator(index);
    }

    @Override
    public List<E> subList(int fromIndex, int toIndex) {
        return list.subList(fromIndex, toIndex);
    }
}

```