---
title: lamda
categories: 默认分类
description: java8新特性：包括lambda、stream等
date: 2019-08-21 17:14:20
tags: java8
---
> 引用自 [Java 8 函数式编程](https://www.processon.com/special/template/5c6caeefe4b03334b521f752#map)
# 1.Lambda表达式
## 1.1 去除大量模板代码，使代码变得紧凑，增强可读性
- 1.2 表现形式
    - (类型 参数) -> {方法体}
        - 例如 
        ```java 
        BinaryOperator<Long> add = (x, y) -> x + y;
        BinaryOperator<Long> addExplicit = (Long x, Long y) -> x + y;
        Runnable task = () -> {System.out.println("hello lambda");};
        ActionListener oneArgument = event -> System.out.println("button clicked");
      ```
        - 类型可选，一般javac会自动推断出参数类型（也存在无法推断的情况） 没有参数时，省略类型和参数
          有且仅有一个参数时，参数括号可省略
          方法体如果只有一行语句，可省略花括号
     - 方法引用
        - 类名::方法
        ```
           Function<Integer, String> intToStr = String::valueOf; // 等同于 e -> String.valueOf(e)
        ```
        - 当参数仅有一个，且返回值为类的一个方法(静态或非静态均可)返回值时，可省略参数，使用 类名::方法名 的方式描述
        - 使用 类名::new 来引用类的构造方法
        ```
           Function<char[], String> newStrFromCharArray = String::new; // 调用的是 new String(char[] cs)构造方法 String[]::new 来引用数组的构造方法
        ```
- 值引用
   - 同匿名内部类类似，在Lambda表达式中引用的变量，需要声明为final或在既成事实上为final 即终态变量
   ```
      String name = "Alex"; // name自声明以来仅赋值一次，
      //     虽然没有显式声明为final，但为既成事实上的final变量
      button.addActionListener(event -> System.out.println("hi " + name));
      name = "Jack"; // 再次赋值会导致上一行lambda表达式报错
    ```
    - 此特性表明lambda表达式中变量实际上为值引用
- 函数式接口
    - 一元接口
    ```
      Predicate<T>:
          boolean test(T t) 谓词函数，传入一个变量，根据一定规则进行布尔判断
      Function<T, R>
          R apply(T t) 一般函数，传入一个变量，输出另一个变量
      UnaryOperator<T>
          T apply(T t) 算子函数，输入输出同类型
          形如XXOperator的接口均为算子函数式接口，入参出参类型相同
      Consumer<T>:
           void accept(T t) 消费函数，传入一个变量，执行无返回值的操作
      Supplier<T>
            T get() 生产函数，没有输入，输出一个变量
    ```
- java