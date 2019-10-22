---
title: Thread volatile
categories: java
description: 多线程中volatile的简单使用
date: 2019-08-23 11:35:16
tags: Thread
---
# 1.Thread 中 volatile 的解析
## 先上一段代码，猜猜会输出什么
```java
    public class VolatileTest {
    
        private static int INIT_VALUE = 0;
    
        private final static int MAX_LIMIT = 50;
    
        public static void main(String[] args) {
            new Thread(() -> {
                int localValue = INIT_VALUE;
                while (localValue < MAX_LIMIT) {
                    if (localValue != INIT_VALUE) {
                        System.out.printf("The value updated to [%d]\n", INIT_VALUE);
                        localValue = INIT_VALUE;
                    }
                }
            }, "READER").start();
    
            new Thread(() -> {
                int localValue = INIT_VALUE;
                while (INIT_VALUE < MAX_LIMIT) {
                    System.out.printf("Update the value to [%d]\n", ++localValue);
                    INIT_VALUE = localValue;
                    try {
                        Thread.sleep(500);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }, "UPDATER").start();
        }
    }

```
## 然后加上volatile会与上面的有何不同
```java
    public class VolatileTest {
    
        private static volatile int INIT_VALUE = 0;
    
        private final static int MAX_LIMIT = 50;
    
        public static void main(String[] args) {
            new Thread(() -> {
                int localValue = INIT_VALUE;
                while (localValue < MAX_LIMIT) {
                    if (localValue != INIT_VALUE) {
                        System.out.printf("The value updated to [%d]\n", INIT_VALUE);
                        localValue = INIT_VALUE;
                    }
                }
            }, "READER").start();
    
            new Thread(() -> {
                int localValue = INIT_VALUE;
                while (INIT_VALUE < MAX_LIMIT) {
                    System.out.printf("Update the value to [%d]\n", ++localValue);
                    INIT_VALUE = localValue;
                    try {
                        Thread.sleep(500);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }, "UPDATER").start();
        }
    }
```
<!--more-->
### 第一段代码只会输出第二个线程中 Update the value to 1-50 然后程序不会退出
```
    Update the value to [1]
    Update the value to [2]
    Update the value to [3]
    Update the value to [4]
    Update the value to [5]
    Update the value to [6]
    Update the value to [7]
    Update the value to [8]
    Update the value to [9]
    Update the value to [10]
    Update the value to [11]
    Update the value to [12]
    Update the value to [13]
    Update the value to [14]
    Update the value to [15]
    Update the value to [16]
    Update the value to [17]
    Update the value to [18]
    Update the value to [19]
    Update the value to [20]
    Update the value to [21]
    Update the value to [22]
    Update the value to [23]
    Update the value to [24]
    Update the value to [25]
    Update the value to [26]
    Update the value to [27]
    Update the value to [28]
    Update the value to [29]
    Update the value to [30]
    Update the value to [31]
    Update the value to [32]
    Update the value to [33]
    Update the value to [34]
    Update the value to [35]
    Update the value to [36]
    Update the value to [37]
    Update the value to [38]
    Update the value to [39]
    Update the value to [40]
    Update the value to [41]
    Update the value to [42]
    Update the value to [43]
    Update the value to [44]
    Update the value to [45]
    Update the value to [46]
    Update the value to [47]
    Update the value to [48]
    Update the value to [49]
    Update the value to [50]

```
### 第二段代码中两个线程都会有输出，最后程序退出。
```
    Update the value to [1]
    The value updated to [1]
    Update the value to [2]
    The value updated to [2]
    Update the value to [3]
    The value updated to [3]
    Update the value to [4]
    The value updated to [4]
    Update the value to [5]
    The value updated to [5]
    Update the value to [6]
    The value updated to [6]
    Update the value to [7]
    The value updated to [7]
    Update the value to [8]
    The value updated to [8]
    Update the value to [9]
    The value updated to [9]
    Update the value to [10]
    The value updated to [10]
    Update the value to [11]
    The value updated to [11]
    Update the value to [12]
    The value updated to [12]
    Update the value to [13]
    The value updated to [13]
    Update the value to [14]
    The value updated to [14]
    Update the value to [15]
    The value updated to [15]
    Update the value to [16]
    The value updated to [16]
    Update the value to [17]
    The value updated to [17]
    Update the value to [18]
    The value updated to [18]
    Update the value to [19]
    The value updated to [19]
    Update the value to [20]
    The value updated to [20]
    Update the value to [21]
    The value updated to [21]
    Update the value to [22]
    The value updated to [22]
    Update the value to [23]
    The value updated to [23]
    Update the value to [24]
    The value updated to [24]
    Update the value to [25]
    The value updated to [25]
    Update the value to [26]
    The value updated to [26]
    Update the value to [27]
    The value updated to [27]
    Update the value to [28]
    The value updated to [28]
    Update the value to [29]
    The value updated to [29]
    Update the value to [30]
    The value updated to [30]
    Update the value to [31]
    The value updated to [31]
    Update the value to [32]
    The value updated to [32]
    Update the value to [33]
    The value updated to [33]
    Update the value to [34]
    The value updated to [34]
    Update the value to [35]
    The value updated to [35]
    Update the value to [36]
    The value updated to [36]
    Update the value to [37]
    The value updated to [37]
    Update the value to [38]
    The value updated to [38]
    Update the value to [39]
    The value updated to [39]
    Update the value to [40]
    The value updated to [40]
    Update the value to [41]
    The value updated to [41]
    Update the value to [42]
    The value updated to [42]
    Update the value to [43]
    The value updated to [43]
    Update the value to [44]
    The value updated to [44]
    Update the value to [45]
    The value updated to [45]
    Update the value to [46]
    The value updated to [46]
    Update the value to [47]
    The value updated to [47]
    Update the value to [48]
    The value updated to [48]
    Update the value to [49]
    The value updated to [49]
    Update the value to [50]
    The value updated to [50]
```
## 这是为什么呢？
``` 
这就是用到了volatile的特性
1.保证了不同线程对这个变量进行操作时的可见性，即一个线程修改了某个变量的值，这新值对其他线程来说是立即可见的。（实现可见性）
2.禁止进行指令重排序。（实现有序性）
3.volatile 只能保证对单次读/写的原子性。i++ 这种操作不能保证原子性。
```