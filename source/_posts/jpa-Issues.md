---
title: jpa Issues
categories: java
description: jpa的使用问题,service事务中先删除后更新，主键冲突，解决方式
date: 2019-09-03 18:11:50
tags: jpa
---
# 1.问题描述
### 今天遇到了个jpa的使用问题，在一个service事务中我想先删除一条数据，然后再进行更新操作，由于数据库设置有唯一键约束，而且delete操作会在整个事务完了之后删除，会导致唯一键冲突，后经过查询资料验证后可以使用**flush()**这个方法解决。
# 2.代码如下
注意继承JpaRepository，要不没有这个flush()方法
```
    extends JpaRepository
```
```
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteByTaskIdAndQuestionIdAndRoundIndex(Long taskId, Long questionId, Integer roundIndex) {
        //删除会话时不仅要将会话删掉，而且需要将后面的会话轮数进行更新
        questionRoundRepository.deleteByTaskIdAndQuestionIdAndRoundIndex(taskId, questionId, roundIndex);
        questionRoundRepository.flush();
        questionRoundRepository.updateByTaskIdAndQuestionIdAndRoundIndex(taskId, questionId, roundIndex);
    }
```

