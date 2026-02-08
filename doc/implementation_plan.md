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

1. **provinces** - 省份表
   - id, name, code, sort_order

2. **regions** - 地区表  
   - id, province_id, name, code

3. **exam_questions** - 题目表
   - id, province_id, region_id, year, exam_type, question_text, question_image_url, created_at, updated_at

4. **answer_sources** - 答案机构表
   - id, name (华图/粉笔/中公), code, sort_order

5. **question_answers** - 题目答案表
   - id, question_id, source_id, answer_text, answer_image_url, created_at, updated_at

6. **users** - 用户表（复用JWT认证）
   - id, open_id, platform, nickname, created_at

## 后端实现

### 1. 数据库模型层 (`backend/models/`)

创建GORM模型文件：
- `province.go` - 省份模型
- `region.go` - 地区模型  
- `exam_question.go` - 题目模型
- `answer_source.go` - 答案机构模型
- `question_answer.go` - 答案模型
- `user.go` - 用户模型（如需要扩展）

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

- **search/** - 题目搜索页
  - `index.js/wxml/wxss` - 省份/年份/地区三级筛选
  - 题目列表展示

- **scan/** - 扫码识别页
  - `index.js/wxml/wxss` - 相机调用、图片上传、OCR识别

- **detail/** - 题目详情页
  - `index.js/wxml/wxss` - 题目内容、多机构答案对比展示

- **login/** - 登录页
  - `index.js/wxml/wxss` - 微信授权登录

### 2. 工具类 (`front/minigram/utils/`)

- `api.js` - API请求封装
- `auth.js` - 认证相关工具
- `ocr.js` - OCR调用封装

### 3. 配置文件

- `app.json` - 添加新页面路由配置
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

