# 申小行真题产品实现方案

## 项目概述

基于现有Go+Gin后端和微信小程序前端架构，实现申论考公辅助工具的核心功能模块。

## 技术架构

```
┌─────────────┐
│  微信小程序  │
│  (前端)     │
└──────┬───────┘
       │ HTTP/HTTPS
       │
┌──────▼──────────┐
│  Gin Web Server │
│   (Go后端)      │
└──────┬──────────┘
       │
   ┌───┴───┐
   │       │
┌──▼──┐ ┌─▼───┐
│MySQL│ │Redis│
└─────┘ └─────┘
```

## 数据库设计

### 核心表结构

1. **areas** - 区域表（树形：父节点=省份，子节点=地区）
   - id (PK, 自增)
   - parent_id (0 或 NULL 表示根节点/省份；非空表示父区域 id，即地区归属的省份)
   - name - 名称
   - code (可空) - 编码
   - sort_order (可空) - 同级排序
   - 索引：idx_areas_parent_id(parent_id)，便于按父节点查子节点

2. **questions** - 题目表
   - id, province_id, region_id, year, exam_type, question_text, question_image_url, created_at, updated_at
   - province_id、region_id 均关联 areas.id（省份=根节点，地区=子节点）

3. **question_answers** - 题目答案表
   - id, question_id, source, answer_text, answer_image_url, created_at, updated_at
   - source：答案机构，使用枚举（华图 huatu / 粉笔 fenbi / 中公 zhonggong），存 code 或整型均可

4. **users** - 用户表
   - id (bigint, PK, 自增) - 用户ID
   - open_id (varchar 64, NOT NULL) - 平台用户ID(微信OpenID或支付宝UserID)
   - nickname (varchar 64, NOT NULL) - 用户昵称
   - avatar_url (varchar 255, 可空) - 头像URL
   - platform (varchar 16, 默认 wechat) - 登录平台(wechat, alipay)
   - status (int, 默认 1) - 用户状态(1:正常 0:禁用)
   - token_version (int, 默认 1) - token版本号
   - last_login_at (datetime(3), 可空) - 最后登录时间
   - last_login_ip (varchar 45, 可空) - 最后登录IP
   - login_count (int, 默认 0) - 登录次数
   - created_at, updated_at (datetime(3))
   - 索引：UNIQUE(platform, open_id), idx_users_created_at, idx_users_status_version

5. **refresh_tokens** - 刷新Token表
   - id (bigint, PK, 自增) - Token ID
   - user_id (bigint, NOT NULL, FK→users.id ON DELETE CASCADE) - 用户ID
   - token (varchar 255, NOT NULL, UNIQUE) - 刷新token
   - expires_at (datetime(3), NOT NULL) - 过期时间
   - is_revoked (tinyint(1), 默认 0) - 是否已撤销
   - user_agent (varchar 500, 可空) - 用户代理
   - client_ip (varchar 45, 可空) - 客户端IP
   - created_at, updated_at (datetime(3))
   - 索引：UNIQUE(token), idx_refresh_tokens_user_id, idx_refresh_tokens_expires_at, idx_refresh_tokens_user_expires(user_id, expires_at DESC, is_revoked)

6. **login_logs** - 登录日志表
   - id (bigint, PK, 自增) - 日志ID
   - user_id (bigint, NOT NULL, FK→users.id ON DELETE CASCADE) - 用户ID
   - login_type (varchar 32, NOT NULL) - 登录类型(wechat, refresh)
   - client_ip (varchar 45, NOT NULL) - 客户端IP
   - user_agent (varchar 500, 可空) - 用户代理
   - status (int, NOT NULL) - 登录状态(1:成功 0:失败)
   - error_msg (varchar 255, 可空) - 错误信息
   - login_at (datetime(3), NOT NULL) - 登录时间
   - created_at (datetime(3))
   - 索引：idx_login_logs_user_id, idx_login_logs_login_at, idx_login_logs_user_time(user_id, login_at DESC)

## 后端实现

### 1. 数据库模型层 (`backend/models/`)

创建GORM模型文件：
- `area.go` - 区域模型（树形：父节点=省份，子节点=地区）
- `question.go` - 题目模型
- `question_answer.go` - 答案模型（source 使用枚举：华图/粉笔/中公）
- `user.go` - 用户模型（含 open_id、昵称、头像、平台、状态、token_version、登录信息等）
- `refresh_token.go` - 刷新Token模型
- `login_log.go` - 登录日志模型

### 2. API路由层 (`backend/routes/`)

创建路由文件：
- `question_routes.go` - 题目相关路由
- `answer_routes.go` - 答案相关路由
- `ocr_routes.go` - OCR识别路由
- `admin_routes.go` - 管理后台路由（数据导入）
- `auth_routes.go` - 认证路由

在 `main.go` 中注册所有路由。

### 3. 控制器层 (`backend/controllers/`)

- `question_controller.go` - 题目搜索、详情查询
  - `SearchQuestions()` - 多维度搜索（省份/年份/地区）
  - `GetQuestionDetail()` - 获取题目详情
  - `GetQuestionAnswers()` - 获取题目所有机构答案

- `answer_controller.go` - 答案对比
  - `CompareAnswers()` - 对比多个机构答案

- `ocr_controller.go` - OCR识别
  - `RecognizeImage()` - 图片识别，返回匹配的题目

- `admin_controller.go` - 管理功能
  - `ImportQuestions()` - 批量导入题目（Excel/CSV）
  - `AddQuestion()` - 手动添加题目
  - `AddAnswer()` - 添加答案

### 4. 服务层 (`backend/services/`)

- `ocr_service.go` - OCR服务抽象层
  - 接口定义：`OCRService interface`
  - 实现：`WeChatOCRService`, `BaiduOCRService`, `TencentOCRService`
  - 工厂模式：根据配置选择OCR服务

- `search_service.go` - 搜索服务
  - `BuildSearchQuery()` - 构建多维度查询条件
  - `FuzzySearch()` - 模糊搜索（基于OCR结果）

- `import_service.go` - 数据导入服务
  - `ParseExcelFile()` - 解析Excel文件
  - `BatchImportQuestions()` - 批量导入题目和答案

### 5. 中间件 (`backend/middleware/`)

- `auth_middleware.go` - JWT认证中间件
  - 验证token，提取用户信息

### 6. 响应结构 (`backend/response/`)

- `response.go` - 统一响应格式
  ```go
  type Response struct {
      Code    int         `json:"code"`
      Message string      `json:"message"`
      Data    interface{} `json:"data"`
  }
  ```

## 前端实现

### 1. 页面结构 (`front/minigram/pages/`)

**底部导航（tabBar）**：共三项 —— **题目** | **扫码**（中间） | **我的**；默认展示「题目」页。

| 菜单项 | 页面路径 | 说明 |
|--------|----------|------|
| 题目 | `questions/index` | 默认首页。省份/年份/地区三级筛选 + 题目列表；点击条目进入题目详情 |
| 扫码 | `scan/index` | 中间按钮。相机调用、图片上传、OCR 识别，识别后可跳转题目列表或详情 |
| 我的 | `mine/index` | 个人中心。未登录展示微信授权登录入口；已登录展示昵称、头像等 |

**非 tabBar 子页**：

- **detail/** - 题目详情页
  - `index.js/wxml/wxss` - 题目内容、多机构答案对比展示
  - 从「题目」列表点击进入，不在底部菜单

### 2. 工具类 (`front/minigram/utils/`)

- `api.js` - API请求封装
- `auth.js` - 认证相关工具
- `ocr.js` - OCR调用封装

### 3. 配置文件

- `app.json` - 页面路由 + **tabBar** 配置（题目、扫码、我的；扫码居中；默认项为题目）
- 添加全局样式和主题配置

## 核心功能实现要点

### 1. 多维度搜索

实现三级联动筛选：
- 第一级：选择省份
- 第二级：选择年份（根据省份筛选）
- 第三级：选择地区（根据省份+年份筛选）
- 结果：展示符合条件的题目列表

### 2. OCR识别流程

```
用户拍照/选择图片 
  → 上传到后端 
  → 调用OCR服务识别文字 
  → 提取关键词 
  → 在题库中模糊匹配 
  → 返回匹配的题目列表
```

### 3. 答案对比展示

- 并排展示多个机构答案
- 支持切换查看不同机构
- 高亮显示答案差异（可选）

### 4. 数据导入

- Excel模板：省份、年份、地区、题目内容、各机构答案
- 支持批量导入，错误处理和回滚
- 导入进度反馈

## 实施步骤

1. **数据库设计** - 创建所有表结构和模型
2. **后端API开发** - 按模块逐步实现API接口
3. **OCR服务集成** - 实现OCR抽象层和具体服务
4. **前端页面开发** - 实现搜索、识别、详情页面
5. **数据导入功能** - 实现批量导入和管理功能
6. **测试和优化** - 功能测试、性能优化

## 配置文件

需要在 `backend/config/*.ini` 中添加：
- OCR服务配置（API Key、Secret等）
- 文件上传配置（大小限制、存储路径）
- 数据导入配置

## 依赖项

后端可能需要新增：
- Excel处理库（如 `github.com/xuri/excelize/v2`）
- 图片处理库（如 `github.com/nfnt/resize`）
- OCR SDK（根据选择的OCR服务）

