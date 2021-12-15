---
title: 'Sharding-JDBC实现读写分离,Springboot,docker,mysql8(二)'
categories: java
description: 附加一段文章摘要，字数最好在140字以内，会出现在meta的description里面
date: 2021-04-20 15:40:18
tags: 读写分离
---
## 1.前提

在 [Sharding-JDBC实现读写分离,Springboot,docker,mysql8(一)](https://jianlong-sun.github.io/2021/04/20/Sharding-JDBC%E5%AE%9E%E7%8E%B0%E8%AF%BB%E5%86%99%E5%88%86%E7%A6%BB-Springboot-docker-mysql8/)中主要介绍了数据库读写分离中关于数据库同步方面的问题，本篇主要介绍shardingJDBC与SpringBoot整合
## 2. 遇到的小问题
1.与SpringBoot整合基本比较顺利，主要注意数据库地址、账号、密码不要填错。
2.由于使用了mysql8,springboot使用了1.5.1.RELEASE ,mysql-connector-java依赖默认版本较低，对其做了修改
```xml
		<dependency>
			<groupId>mysql</groupId>
			<artifactId>mysql-connector-java</artifactId>
            <version>8.0.20</version>
		</dependency>
```
### 3.步骤(分三步)
### 3.1 修改pom文件 增加sharding-jdbc依赖
```xml
        <dependency>
            <groupId>io.shardingjdbc</groupId>
            <artifactId>sharding-jdbc-core</artifactId>
            <version>2.0.3</version>
        </dependency>
```
### 3.2 修改yml配置,**xxx**部分替换成自己的配置
```yaml
server:
  port: 8081
sharding.jdbc:
  data-sources:
    ds_master:
      driverClassName: com.mysql.jdbc.Driver
      jdbcUrl: xxx
      username: xxx
      password: xxx
      #hikari:
      maximumPoolSize: 60
      minimumIdle: 3
      idleTimeout: 500000
      maxLifetime: 1500000
      connectionTimeout: 5000
      validationTimeout: 3000
    ds_slave_1:
      driverClassName: com.mysql.jdbc.Driver
      jdbcUrl: xxx
      username: xxx
      password: xxx
      #hikari:
      readOnly: true
      maximumPoolSize: 120
      minimumIdle: 3
      idleTimeout: 500000
      maxLifetime: 1500000
      connectionTimeout: 5000
      validationTimeout: 3000
  masterSlaveRule:
    load-balance-algorithm-type: round_robin
    name: db_ms
    masterDataSourceName: ds_master
    slaveDataSourceNames: ds_slave_1
  props:
    sql-show: true
```
### 3.3 增加sharding-jdbc配置

```java
@Component
@ConfigurationProperties(prefix = "sharding.jdbc")
public class ShardingDataSourceConfig {

    private Map<String, HikariDataSource> dataSources = new HashMap<>();

    private MasterSlaveRuleConfiguration masterSlaveRule;

    @Bean("masterSlaveDataSource")
    public DataSource masterSlaveDataSource() throws SQLException {
        Map<String, DataSource> dm = new HashMap<>();
        dataSources.forEach((k, v) -> configDataSource(v));
        dm.putAll(dataSources);
        DataSource dataSource = MasterSlaveDataSourceFactory.createDataSource(dm, masterSlaveRule, new HashMap<>());
        return dataSource;
    }

    private void configDataSource(HikariDataSource hikariDataSource) {
    }

    public Map<String, HikariDataSource> getDataSources() {
        return dataSources;
    }

    public void setDataSources(Map<String, HikariDataSource> dataSources) {
        this.dataSources = dataSources;
    }

    public MasterSlaveRuleConfiguration getMasterSlaveRule() {
        return masterSlaveRule;
    }

    public void setMasterSlaveRule(MasterSlaveRuleConfiguration masterSlaveRule) {
        this.masterSlaveRule = masterSlaveRule;
    }

}

```

