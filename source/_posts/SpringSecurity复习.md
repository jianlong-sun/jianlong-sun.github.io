---
title: SpringSecurity复习
categories: 默认分类
description: 附加一段文章摘要，字数最好在140字以内，会出现在meta的description里面
date: 2021-10-09 16:03:56
tags:
---


# SpringSecurity

#### 1.第一章

介绍SpringSecurity并在idea上安装envfile插件及lombok

文件位置：阿里云盘

![image-20210917172546314](https://s2.loli.net/2021/12/14/ebNjsY3KFtuMgHr.png)


#### 2.第二章

##### 2.1 常见过滤器



![image-20210917171720568.png](https://s2.loli.net/2021/12/14/ferT2UKdcFSYwsH.png)

##### 2.2 今日进度-2021年9月17日17:24:29 



![image-20210917172435324.png](https://s2.loli.net/2021/12/14/bRF9yc6mEgrlwqL.png)

##### 2.3 http 请求头、响应头详解

[Http消息头中常用的请求头和响应头 - 池的巧克力 - 博客园 (cnblogs.com)](https://www.cnblogs.com/widget90/p/7650890.html)
<!--more-->
##### 2.4 基本安全配置

![image-20210918135512175](https://s2.loli.net/2021/12/14/hjox3Iq2Am5CbBL.png)

![image-20210918150914713](https://s2.loli.net/2021/12/14/zu9Gg4ByHEMC8Jv.png)

##### 2.5 登录成功/退出后的处理

![image-20210918154338609](https://s2.loli.net/2021/12/14/syouQxZzRdvMmf4.png)

##### 2.6 表单登录机制

![image-20210918160407682](https://s2.loli.net/2021/12/14/F7xZ8jy4l9q1rvd.png)

##### 2.7重写userNamePasswordAuthenticationFilter

![image-20210918162653742](https://s2.loli.net/2021/12/14/XqwCcovKpzuekUE.png)

#### 3.第三章-密码

##### 3.1系统升级后，兼容原来加密格式的密码

![image-20210918164629532](https://s2.loli.net/2021/12/14/Vn7tr8BoiLIFHug.png)

下图中id指的是上图中的“SHA-1”、“**bcrypt**”

![](https://s2.loli.net/2021/12/14/6tkTAK7jLHwWVhb.png)

##### 3.2 验证，为后面密码验证做基础

![image-20210918170219217](https://s2.loli.net/2021/12/14/QMbEpJrsLdvPYkV.png)

常用的验证注解：

![image-20210918170627221](https://s2.loli.net/2021/12/14/256VaUFPHkvxbjo.png)

![image-20210918170637199](https://s2.loli.net/2021/12/14/MOTDfdw2ypFtqme.png)

[Hibernate Validator注解大全_阿祥小王子的博客-CSDN博客_hibernate validator 注解](https://blog.csdn.net/danielzhou888/article/details/74740817)

##### 3.3自定义注解（一个interface加一个class）

验证部分可以使用hutool工具包中的验证器

```java
@Target({ TYPE, FIELD, ANNOTATION_TYPE })
@Retention(RUNTIME)
@Constraint(validatedBy = EmailValidator.class)
@Documented
public @interface ValidEmail {

    String message() default "{ValidEmail.email}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
```

```java
public class EmailValidator implements ConstraintValidator<ValidEmail, String> {
    private static final String EMAIL_PATTERN = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" + "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";

    @Override
    public void initialize(final ValidEmail constraintAnnotation) {}

    @Override
    public boolean isValid(final String username, final ConstraintValidatorContext context) {
        return (validateEmail(username));
    }

    private boolean validateEmail(final String email) {
        val pattern = Pattern.compile(EMAIL_PATTERN);
        val matcher = pattern.matcher(email);
        return matcher.matches();
    }
}
```



##### 3.4 今日进度-2021年9月18日17:49:13

<img src="https://s2.loli.net/2021/12/14/Eh7DLxUJm4eIwXg.png" alt="image-20210918174943150" style="zoom: 80%;" />

##### 3.5自定义密码验证

```xml
<passay.version>1.6.0</passay.version>

<dependency>
    <groupId>org.passay</groupId>
    <artifactId>passay</artifactId>
    <version>${passay.version}</version>
</dependency>
```

```java
@Target({ TYPE, ANNOTATION_TYPE })
@Retention(RUNTIME)
@Constraint(validatedBy = PasswordMatchesValidator.class)
@Documented
public @interface PasswordMatches {

    String message() default "{PasswordMatches.userDto}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
```

```java
@RequiredArgsConstructor
public class PasswordConstraintValidator implements ConstraintValidator<ValidPassword, String> {

    private final SpringMessageResolver messageResolver;

    @Override
    public void initialize(final ValidPassword constraintAnnotation) {}

    @Override
    public boolean isValid(final String password, final ConstraintValidatorContext context) {
        val validator = new PasswordValidator(messageResolver, Arrays.asList(
            // 长度规则：8 - 30 位
            new LengthRule(8, 30),
            // 至少有一个大写字母
            new CharacterRule(EnglishCharacterData.UpperCase, 1),
            // 至少有一个小写字母
            new CharacterRule(EnglishCharacterData.LowerCase, 1),
            // 至少有一个数字
            new CharacterRule(EnglishCharacterData.Digit, 1),
            // 至少有一个特殊字符
            new CharacterRule(EnglishCharacterData.Special, 1),
            // 不允许连续 5 个字母，按字母表顺序
            // alphabetical is of the form 'abcde', numerical is '34567', qwery is 'asdfg'
            // the false parameter indicates that wrapped sequences are allowed; e.g. 'xyzabc'
            new IllegalSequenceRule(EnglishSequenceData.Alphabetical, 5, false),
            // 不允许 5 个连续数字
            new IllegalSequenceRule(EnglishSequenceData.Numerical, 5, false),
            // 不允许 QWERTY 键盘上的5个连续相邻的按键所代表的字符
            new IllegalSequenceRule(EnglishSequenceData.USQwerty, 5, false),
            // 不允许包含空格
            new WhitespaceRule()));
        val result = validator.validate(new PasswordData(password));
        if (result.isValid()) {
            return true;
        }
        // 国际化需要 禁用原有提示
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(String.join(",", validator.getMessages(result)))
            .addConstraintViolation();
        return false;
    }
}
```





##### 3.6 验证密码与重复密码是否一致，放到对应类上面

```java
@Target({ TYPE, ANNOTATION_TYPE })
@Retention(RUNTIME)
@Constraint(validatedBy = PasswordMatchesValidator.class)
@Documented
public @interface PasswordMatches {

    String message() default "{PasswordMatches.userDto}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
```

```java
public class PasswordMatchesValidator implements ConstraintValidator<PasswordMatches, UserDto> {

    @Override
    public void initialize(final PasswordMatches constraintAnnotation) { }

    @Override
    public boolean isValid(final UserDto obj, final ConstraintValidatorContext context) {
        val user = (UserDto) obj;
        return user.getPassword().equals(user.getMatchingPassword());
    }
}
```

#### 4.第四章 深入 Spring Security 认证

![image-20210922113721169](https://s2.loli.net/2021/12/14/Bdgcs6UlPXAFRIK.png)

##### 4.1  核心组件 - SecurityContext SecurityContextHolder Authentication

![image-20210922114047661](https://s2.loli.net/2021/12/14/RbGKtP48YhfjCq5.png)

##### 4.2 今日进度-2021年9月22日13:40:12

![image-20210922134023932](https://s2.loli.net/2021/12/14/tPxdrFOzfGMZj1H.png)

##### 4.3 多密码格式-->无感知升级密码

```java
@Transactional
@RequiredArgsConstructor
@Service
public class UserDetailsPasswordServiceImpl implements UserDetailsPasswordService {

    private final UserRepo userRepo;

    @Override
    public UserDetails updatePassword(UserDetails user, String newPassword) {
        return userRepo.findOptionalByUsername(user.getUsername())
            .map(userFromDb -> userRepo.save(userFromDb.withPassword(newPassword)))
            .orElseThrow();
    }
}

```

##### 4.4 自动化测试

![image-20210923153723737](https://s2.loli.net/2021/12/14/aMUG4KwQ7t6zEpI.png)

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class SecuredRestAPIIntTests {
    @Autowired
    private WebApplicationContext context;

    private MockMvc mvc;

    @BeforeEach
    public void setup() {
        mvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();
    }

    @WithMockUser
    @Test
    public void givenAuthRequest_shouldSucceedWith200() throws Exception {
        mvc.perform(get("/api/me").contentType(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk());
    }
}

```

#### 5.第五章 构建基于Jwt认证

![image-20210924105227564](https://s2.loli.net/2021/12/14/wpFZUJDzK3n57xA.png)

##### 5.1认证过程解析

![image-20210924105304988](https://s2.loli.net/2021/12/14/79JaDuIzWKqe83n.png)

##### 5.2 多个provider整合

##### 5.3 jwt签发

![image-20210924142800278](https://s2.loli.net/2021/12/14/tYlLS1jckxn3NKR.png)

#### 6.基于用户角色的用户权限

![image-20210924153652310](https://s2.loli.net/2021/12/14/LSwbspzjA6guDHM.png)

![image-20210924153702867](https://s2.loli.net/2021/12/14/XCc6FIe7KJ8haLp.png)

![image-20210924154907610](https://s2.loli.net/2021/12/14/N8IXSULPFhfubR2.png)

##### 6.1跨域的解决(两种方式)

###### 6.1.1SpringMvc

```java
  public class WebMvcConfig implements WebMvcConfigurer
/**
     * 使用 Sprig Mvc 配置 CORS
     * @param registry Cors 注册表
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        if (environment.acceptsProfiles(Profiles.of("dev"))) {
            registry.addMapping("/**")
                .allowedHeaders("*")
                .exposedHeaders("X-Authenticate")
                .allowedOrigins("http://localhost:4001");
        } else {
            registry.addMapping("/**")
                .allowedHeaders("*")
                .exposedHeaders("X-Authenticate")
                .allowedMethods("POST", "GET", "PUT", "DELETE", "OPTIONS")
                .allowedOrigins("https://uaa.imooc.com"); // 生产主机域名
        }
    }
```



###### 6.1.2 Spring Security

```java
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .httpBasic(AbstractHttpConfigurer::disable)
            .csrf(AbstractHttpConfigurer::disable)
            .logout(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // 配置跨域
            .sessionManagement(sessionManagement -> sessionManagement
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(exceptionHandling -> exceptionHandling
                .authenticationEntryPoint(problemSupport)
                .accessDeniedHandler(problemSupport))
            .authorizeRequests(authorizeRequests -> authorizeRequests
                .mvcMatchers("/", "/authorize/**").permitAll()
                .antMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            // .addFilterBefore(new LDAPAuthorizationFilter(new AntPathRequestMatcher("/api/**")), UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
//            .addFilterAt(restAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
        ;
    }

/**
     * 我们在 Spring Boot 中有几种其他方式配置 CORS
     * 参见 https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#mvc-cors
     * Mvc 的配置方式见 WebMvcConfig 中的代码
     *
     * @return CorsConfigurationSource
     */
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 允许跨域访问的主机
        if (environment.acceptsProfiles(Profiles.of("dev"))) {
            configuration.setAllowedOrigins(Collections.singletonList("http://localhost:4001"));
        } else {
            configuration.setAllowedOrigins(Collections.singletonList("https://uaa.imooc.com"));
        }
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        configuration.addExposedHeader("X-Authenticate");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
```

##### 6.2今日进度-2021年9月24日16:11:57



![image-20210924161240492](https://s2.loli.net/2021/12/14/j6eMoIf2bdCrkPw.png)
