### MUST FOLLOW:输出内容的时候一定要使用中文
### MUST FOLLOW: 项目的数据库mysql
### 做计划的时候要优先考虑业界最佳实践，输出计划前也要再反思一下，参考本项目的整体逻辑不遗漏细节，同时又不要过度设计。 
### 测试编译是否成功的时候，编译后不要生成文件### 项目目录结构
```
gin-project/
├── main.go                 # 程序入口
├── config/
│   └── config.go           # 配置管理
├── controller/             # 控制器 (MVC中的C)
│   ├── user.go
│   └── auth.go
├── service/                # 业务逻辑层
│   ├── user.go
│   └── auth.go
├── model/                  # 数据模型 + 数据库操作
│   ├── user.go
│   └── db.go
├── router/                 # 路由注册
│   └── router.go
├── middleware/             # 中间件
│   ├── auth.go
│   └── cors.go
├── utils/                  # 工具函数
│   └── response.go
└── go.mod
```    

### 接口调用链路
当你实现一个接口时，参考文本检测接口 `POST /v1/text/check` 调用链路来实现，完整的调用链路如下：

```
HTTP Request
     ↓
router/router.go        # 路由注册、分组、中间件挂载
     ↓
middleware/*.go         # JWT认证、CORS、日志记录（可选）
     ↓
controller/*.go         # 参数校验、JSON绑定、调用Service
     ↓
service/*.go            # 业务逻辑、事务管理、规则校验
     ↓
model/*.go              # 数据模型、ORM操作、SQL执行
     ↓
   Database             # MySQL/PostgreSQL等持久化存储
```