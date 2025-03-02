# 贵州风景旅游介绍系统

基于 uni-app 和 uniCloud 开发的贵州风景旅游介绍系统，用于展示贵州省内的特色景点、文化和旅游资源。

## 项目详细介绍

贵州风景旅游介绍系统是一款为游客和本地居民提供全面贵州旅游信息服务的移动应用，致力于展示贵州丰富多彩的自然风光、民族文化、特色美食和实用旅游攻略。

### 系统特色与价值

1. **全面展示贵州旅游资源**
   - 收录贵州各地知名景点，包括自然风光、人文景观、历史遗迹等
   - 深入介绍贵州多彩民族文化，如苗族、侗族、布依族等民族特色文化
   - 推荐贵州特色美食，如酸汤鱼、丝娃娃、折耳根等地方特色菜肴
   - 提供实用旅游攻略，包括最佳旅游季节、交通路线、住宿推荐等

2. **便捷的信息检索与浏览**
   - 分类浏览功能，支持按照景点类型、文化类别、美食种类等多维度筛选
   - 智能搜索功能，快速定位所需信息
   - 详情展示功能，提供图文并茂的内容介绍
   - 用户评论功能，获取真实体验反馈

3. **个性化用户体验**
   - 用户收藏功能，保存感兴趣的内容
   - 评价打分功能，分享个人体验
   - 景点预订功能，在线预订门票
   - 个人信息管理，定制个性化服务

4. **促进贵州旅游发展**
   - 提升贵州旅游资源的曝光度和知名度
   - 优化游客旅游体验，增强旅游满意度
   - 促进贵州旅游业的数字化转型
   - 带动贵州文化旅游经济发展

### 用户可进行的操作

1. **普通游客**
   - 浏览首页推荐的热门景点、特色文化和美食
   - 查看贵州各地景点详细信息、图片和评价
   - 了解贵州民族文化特色和历史背景
   - 发现贵州特色美食和品尝建议
   - 阅读实用旅游攻略和出行建议

2. **注册用户**
   - 创建个人账户，管理个人资料
   - 收藏喜欢的景点、文化、美食和攻略内容
   - 对景点、文化、美食进行评价和打分
   - 预订景点门票，管理订单
   - 查看个人收藏、评价和订单历史

3. **潜在合作伙伴**
   - 了解贵州旅游资源和市场潜力
   - 发现潜在的业务合作机会
   - 获取旅游相关的数据和洞察

## 项目简介

本系统采用 uni-app 跨平台开发框架，结合 uniCloud 云开发，实现了一个轻量级的贵州旅游资源展示和服务平台。系统支持景点浏览、文化展示、美食推荐、攻略分享等功能，并提供用户注册、登录、收藏、评价等交互功能。

### 主要功能

- 用户系统
  - 手机号+验证码登录注册
  - 个人资料管理
  - 收藏管理
  - 评价管理
  - 订单管理

- 景点模块
  - 景点分类浏览
  - 景点详情展示
  - 景点图片展示
  - 景点收藏
  - 景点评价
  - 门票预订

- 文化模块
  - 特色文化展示
  - 文化分类浏览
  - 文化收藏
  - 文化评价

- 美食模块
  - 美食分类浏览
  - 美食详情展示
  - 美食收藏
  - 美食评价

- 攻略模块
  - 攻略浏览
  - 攻略收藏
  - 攻略评价

### 技术架构

- 前端框架：uni-app (Vue 3)
- 后端服务：uniCloud
- 数据库：uniCloud 数据库
- UI 框架：uni-ui
- 开发工具：HBuilderX

## 项目结构

```
├── pages                     // 页面文件夹
│   ├── index                // 首页
│   │   └── index.vue       // 首页内容，展示轮播图、热门景点、特色文化等
│   ├── login               // 登录页
│   │   └── login.vue      // 用户登录界面
│   ├── register           // 注册页
│   │   └── register.vue  // 用户注册界面
│   ├── scenic             // 景点相关页面
│   │   ├── list.vue     // 景点列表页，支持分类筛选和搜索
│   │   └── detail.vue   // 景点详情页，展示景点介绍、图片、评价等
│   ├── culture            // 文化相关页面
│   │   ├── list.vue     // 文化列表页，支持分类筛选和搜索
│   │   └── detail.vue   // 文化详情页，展示文化介绍、图片、评价等
│   ├── food              // 美食相关页面
│   │   ├── list.vue    // 美食列表页，支持分类筛选和搜索
│   │   └── detail.vue  // 美食详情页，展示美食介绍、图片、评价等
│   ├── guide             // 攻略相关页面
│   │   ├── list.vue    // 攻略列表页，支持搜索
│   │   └── detail.vue  // 攻略详情页，展示攻略内容、图片、评价等
│   └── user              // 用户中心相关页面
│       ├── profile.vue  // 个人中心主页，展示用户信息和功能入口
│       ├── edit.vue     // 编辑个人资料
│       ├── collections.vue // 我的收藏页
│       ├── reviews.vue  // 我的评价页
│       └── orders.vue   // 我的订单页
├── static                    // 静态资源
│   ├── logo.png            // 应用logo
│   ├── default-avatar.png  // 默认头像
│   ├── banner              // 轮播图资源
│   │   ├── 1.jpg
│   │   ├── 2.jpg
│   │   └── 3.jpg
│   ├── nav                 // 导航图标
│   │   ├── scenic.png
│   │   ├── food.png
│   │   ├── culture.png
│   │   └── guide.png
│   ├── tabbar              // 底部标签栏图标
│   │   ├── home.png
│   │   ├── home-active.png
│   │   ├── scenic.png
│   │   ├── scenic-active.png
│   │   ├── user.png
│   │   └── user-active.png
│   ├── scenic              // 景点相关图片
│   ├── culture             // 文化相关图片
│   ├── food                // 美食相关图片
│   └── guide               // 攻略相关图片
├── uni_modules              // uni-app 插件
├── uniCloud-aliyun          // 云开发目录
│   ├── cloudfunctions      // 云函数
│   │   ├── user-center    // 用户中心
│   │   ├── scenic-center  // 景点中心
│   │   ├── culture-center // 文化中心
│   │   ├── food-center   // 美食中心
│   │   └── guide-center  // 攻略中心
│   └── database           // 数据库
│       └── schema         // 数据库模型
├── utils                    // 工具函数
│   └── date.js            // 日期格式化工具
└── components              // 公共组件
    ├── booking-popup      // 预订弹窗组件
    │   └── booking-popup.vue
    └── review-popup       // 评价弹窗组件
        └── review-popup.vue
```

## 系统功能详解

### 首页功能

首页是用户进入系统的第一个界面，提供了丰富的信息展示和功能入口：

1. **轮播图展示**：展示贵州精选景点和活动的宣传图
2. **功能导航**：提供景点、文化、美食、攻略等主要功能的快捷入口
3. **热门景点推荐**：展示近期热门或精选的景点信息
4. **特色文化展示**：介绍贵州特色民族文化
5. **美食推荐**：推荐贵州特色美食
6. **攻略精选**：展示热门旅游攻略

### 景点模块功能

景点模块是系统的核心功能之一，提供了全面的景点信息服务：

1. **景点分类浏览**：支持按照自然风光、人文景观、历史遗迹等分类浏览
2. **景点搜索**：支持按名称、地点等关键词搜索景点
3. **景点详情展示**：
   - 基本信息：名称、位置、开放时间、票价等
   - 详细介绍：景点历史、文化背景、特色亮点等
   - 图片展示：高质量景点图片浏览
   - 交通指南：到达方式、路线推荐等
   - 游玩攻略：最佳游览时间、路线建议等
4. **收藏功能**：用户可收藏感兴趣的景点
5. **评价功能**：用户可对景点进行评分和评论
6. **门票预订**：在线预订景点门票，管理订单

### 文化模块功能

文化模块展示贵州丰富多彩的民族文化和历史传统：

1. **文化分类浏览**：按照民族文化、历史传统、民俗活动等分类
2. **文化详情展示**：
   - 文化介绍：详细介绍文化的起源、特点、意义等
   - 图片/视频：展示相关的图片和视频资料
   - 相关活动：介绍与文化相关的节日、活动等
3. **收藏与评价**：用户可收藏和评价感兴趣的文化内容

### 美食模块功能

美食模块推荐贵州特色美食，帮助游客了解和品尝当地美食：

1. **美食分类浏览**：按照菜系、地域、特点等分类
2. **美食详情展示**：
   - 美食介绍：详细介绍美食的起源、做法、特点等
   - 图片展示：展示美食的外观和制作过程
   - 推荐店铺：推荐提供此美食的优质餐厅
   - 价格参考：提供价格区间参考
3. **收藏与评价**：用户可收藏和评价美食

### 攻略模块功能

攻略模块提供实用的旅游建议和经验分享：

1. **攻略浏览**：按照主题、季节、行程天数等分类
2. **攻略详情展示**：
   - 攻略内容：详细的旅游建议、行程安排等
   - 图片展示：相关景点、活动的图片
   - 作者信息：攻略作者的简介和联系方式
3. **收藏与评价**：用户可收藏和评价攻略

### 用户系统功能

用户系统提供个人账户管理和个性化服务：

1. **注册与登录**：支持手机号+验证码注册和登录
2. **个人资料管理**：修改昵称、头像等个人信息
3. **收藏管理**：查看和管理收藏的景点、文化、美食和攻略
4. **评价管理**：查看和管理发表的评价
5. **订单管理**：查看和管理景点门票预订订单

## 数据库设计

### ER图（实体关系图）

以下是系统的实体关系图，展示了各数据表之间的关系：

```
┌───────────────┐                          ┌───────────────┐
│               │                          │               │
│  users_info   │                          │    scenics    │
│   (用户信息)   │                          │   (景点信息)   │
│               │                          │               │
└───────┬───────┘                          └───────┬───────┘
        │                                          │
        │ 1                                        │ 1
        │                                          │
        ▼ N                                        ▼ N
┌───────────────┐     N      1     ┌───────────────┐
│               │◄─────────────────┤               │
│ user_collections                 │ scenic_reviews │
│  (用户收藏表)   │                  │  (景点评论表)   │
│               │                  │               │
└───────────────┘                  └───────────────┘
        ▲                                  ▲
        │                                  │
        │ N                                │ N
        │                                  │
        │ 1                                │ 1
┌───────────────┐                  ┌───────────────┐
│               │                  │               │
│   cultures    │                  │    foods      │
│  (文化信息表)   │                  │  (美食信息表)   │
│               │                  │               │
└───────┬───────┘                  └───────┬───────┘
        │                                  │
        │ 1                                │ 1
        │                                  │
        ▼ N                                ▼ N
┌───────────────┐                  ┌───────────────┐
│               │                  │               │
│ culture_reviews│                  │  food_reviews  │
│  (文化评论表)   │                  │  (美食评论表)   │
│               │                  │               │
└───────────────┘                  └───────────────┘
        ▲                                  ▲
        │                                  │
        │                                  │
        │                                  │
        └─────────────┐                    │
                     │                    │
                     │ 1                  │
                     │                    │
              ┌───────────────┐           │
              │               │           │
              │  verify_codes │           │
              │  (验证码表)    │           │
              │               │           │
              └───────────────┘           │
                                          │
┌───────────────┐                         │
│               │                         │
│    guides     │                         │
│  (攻略信息表)   │                         │
│               │                         │
└───────┬───────┘                         │
        │                                 │
        │ 1                               │
        │                                 │
        ▼ N                               │
┌───────────────┐                         │
│               │                         │
│ guide_reviews  │                         │
│  (攻略评论表)   │                         │
│               │◄────────────────────────┘
└───────────────┘
        ▲
        │
        │
        │
┌───────┴───────┐
│               │
│scenic_bookings │
│  (景点预订表)   │
│               │
└───────────────┘
```

图中的箭头表示实体之间的引用关系，例如：
- users_info 与 user_collections、scenic_reviews、food_reviews 等表之间存在一对多关系
- scenics 与 user_collections、scenic_reviews、scenic_bookings 之间存在一对多关系
- cultures 与 culture_reviews、user_collections 之间存在一对多关系
- foods 与 food_reviews、user_collections 之间存在一对多关系
- guides 与 guide_reviews、user_collections 之间存在一对多关系

### 数据流图

以下是系统的数据流图，展示了系统中数据的流动：

```
                       ┌─────────────────────┐
                       │                     │
                       │    用户注册/登录     │
                       │                     │
                       └───────────┬─────────┘
                                  │
                                  ▼
┌─────────────┐       ┌─────────────────────┐        ┌─────────────┐
│             │       │                     │        │             │
│    游客     ├──────►│      浏览内容       │◄───────┤  注册用户   │
│             │       │                     │        │             │
└─────────────┘       └──┬──────────────┬───┘        └──────┬──────┘
                         │              │                    │
                         ▼              ▼                    │
                ┌─────────────┐  ┌─────────────┐            │
                │             │  │             │            │
                │   景点信息  │  │  文化信息   │            │
                │             │  │             │            │
                └──────┬──────┘  └──────┬──────┘            │
                       │                │                    │
                       │                │                    ▼
                       │                │           ┌─────────────────┐
                       │                │           │                 │
                       │                │           │  用户操作管理   │
                       │                │           │                 │
                       │                │           └───┬──────┬──────┘
                       │                │               │      │
                       ▼                ▼               ▼      ▼
                ┌─────────────┐  ┌─────────────┐ ┌──────────┐ ┌──────────┐
                │             │  │             │ │          │ │          │
                │  美食信息   │  │  攻略信息   │ │ 收藏内容 │ │ 评价内容 │
                │             │  │             │ │          │ │          │
                └─────────────┘  └─────────────┘ └──────────┘ └──────────┘
                                                               │
                                                               │
                                                               ▼
                                                      ┌──────────────────┐
                                                      │                  │
                                                      │    预订门票      │
                                                      │                  │
                                                      └─────────┬────────┘
                                                                │
                                                                ▼
                                                      ┌──────────────────┐
                                                      │                  │
                                                      │    管理订单      │
                                                      │                  │
                                                      └──────────────────┘
```

图中展示了主要数据流向：
1. 游客可以浏览内容（景点、文化、美食、攻略）和注册/登录
2. 注册用户可以收藏内容、评价内容、预订门票和管理订单
3. 所有用户操作都会涉及到相应的数据库实体
4. 数据流构成了一个完整的闭环，支持系统的各项功能

### users_info（用户信息表）
```json
{
  "bsonType": "object",
  "required": ["phone", "password", "created_at"],
  "properties": {
    "_id": {
      "description": "ID，系统自动生成"
    },
    "phone": {
      "bsonType": "string",
      "description": "手机号",
      "pattern": "^1[3-9]\\d{9}$"
    },
    "password": {
      "bsonType": "string",
      "description": "加密后的密码"
    },
    "nickname": {
      "bsonType": "string",
      "description": "用户昵称",
      "minLength": 1,
      "maxLength": 32
    },
    "avatar": {
      "bsonType": "string",
      "description": "头像URL",
      "pattern": "^https?://\\S+$"
    },
    "created_at": {
      "bsonType": "timestamp",
      "description": "创建时间"
    }
  }
}
```

### verify_codes（验证码表）
```json
{
  "bsonType": "object",
  "required": ["phone", "code", "expired_at"],
  "properties": {
    "_id": {
      "description": "ID，系统自动生成"
    },
    "phone": {
      "bsonType": "string",
      "description": "手机号"
    },
    "code": {
      "bsonType": "string",
      "description": "验证码"
    },
    "created_at": {
      "bsonType": "timestamp",
      "description": "创建时间"
    },
    "expired_at": {
      "bsonType": "timestamp",
      "description": "过期时间"
    }
  }
}
```

### user_collections（用户收藏表）
```json
{
  "bsonType": "object",
  "required": ["user_id", "scenic_id", "created_at"],
  "properties": {
    "_id": {
      "description": "ID，系统自动生成"
    },
    "user_id": {
      "bsonType": "string",
      "description": "用户ID"
    },
    "scenic_id": {
      "bsonType": "string",
      "description": "景点ID"
    },
    "type": {
      "bsonType": "string",
      "description": "类型"
    },
    "created_at": {
      "bsonType": "timestamp",
      "description": "创建时间"
    }
  }
}
```

### scenics（景点信息表）
```json
{
  "bsonType": "object",
  "required": ["name", "price", "location", "category", "created_at"],
  "properties": {
    "_id": {
      "description": "ID，系统自动生成"
    },
    "name": {
      "bsonType": "string",
      "description": "景点名称"
    },
    "price": {
      "bsonType": "number",
      "description": "门票价格"
    },
    "location": {
      "bsonType": "string",
      "description": "地理位置"
    },
    "category": {
      "bsonType": "int",
      "description": "景点分类"
    },
    "images": {
      "bsonType": "array",
      "description": "景点图片"
    },
    "description": {
      "bsonType": "string",
      "description": "景点介绍"
    },
    "score": {
      "bsonType": "number",
      "description": "评分"
    },
    "created_at": {
      "bsonType": "timestamp",
      "description": "创建时间"
    }
  }
}
```

### cultures（文化信息表）
```json
{
  "bsonType": "object",
  "required": ["name", "category", "content", "created_at"],
  "properties": {
    "_id": {
      "description": "ID，系统自动生成"
    },
    "name": {
      "bsonType": "string",
      "description": "名称"
    },
    "category": {
      "bsonType": "int",
      "description": "分类"
    },
    "content": {
      "bsonType": "string",
      "description": "内容"
    },
    "images": {
      "bsonType": "array",
      "description": "图片列表"
    },
    "videos": {
      "bsonType": "array",
      "description": "视频列表"
    },
    "created_at": {
      "bsonType": "timestamp",
      "description": "创建时间"
    }
  }
}
```

### foods（美食信息表）
```json
{
  "bsonType": "object",
  "required": ["name", "price", "location", "category", "created_at"],
  "properties": {
    "_id": {
      "description": "ID，系统自动生成"
    },
    "name": {
      "bsonType": "string",
      "description": "美食名称",
      "minLength": 1,
      "maxLength": 100
    },
    "price": {
      "bsonType": "number",
      "description": "价格",
      "minimum": 0
    },
    "location": {
      "bsonType": "string",
      "description": "地理位置",
      "minLength": 1,
      "maxLength": 200
    },
    "category": {
      "bsonType": "int",
      "description": "美食分类",
      "minimum": 0,
      "maximum": 4
    },
    "images": {
      "bsonType": "array",
      "description": "美食图片"
    },
    "tags": {
      "bsonType": "array",
      "description": "美食标签"
    },
    "description": {
      "bsonType": "string",
      "description": "美食介绍"
    },
    "score": {
      "bsonType": "number",
      "description": "评分",
      "minimum": 0,
      "maximum": 5
    },
    "created_at": {
      "bsonType": "timestamp",
      "description": "创建时间"
    }
  }
}
```

### guides（攻略信息表）
```json
{
  "bsonType": "object",
  "required": ["title", "content", "created_at"],
  "properties": {
    "_id": {
      "description": "ID，系统自动生成"
    },
    "title": {
      "bsonType": "string",
      "description": "标题"
    },
    "content": {
      "bsonType": "string",
      "description": "内容"
    },
    "author": {
      "bsonType": "string",
      "description": "作者"
    },
    "images": {
      "bsonType": "array",
      "description": "图片列表"
    },
    "views": {
      "bsonType": "int",
      "description": "浏览数"
    },
    "likes": {
      "bsonType": "int",
      "description": "点赞数"
    },
    "created_at": {
      "bsonType": "timestamp",
      "description": "创建时间"
    }
  }
}
```

### scenic_reviews（景点评论表）
```json
{
  "bsonType": "object",
  "required": ["user_id", "scenic_id", "content", "created_at"],
  "properties": {
    "_id": {
      "description": "ID，系统自动生成"
    },
    "user_id": {
      "bsonType": "string",
      "description": "用户ID"
    },
    "scenic_id": {
      "bsonType": "string",
      "description": "景点ID"
    },
    "content": {
      "bsonType": "string",
      "description": "评论内容"
    },
    "score": {
      "bsonType": "int",
      "description": "评分"
    },
    "created_at": {
      "bsonType": "timestamp",
      "description": "创建时间"
    }
  }
}
```

### culture_reviews（文化评论表）
```json
{
  "bsonType": "object",
  "required": ["user_id", "culture_id", "content", "score", "created_at"],
  "properties": {
    "_id": {
      "description": "ID，系统自动生成"
    },
    "user_id": {
      "bsonType": "string",
      "description": "用户ID"
    },
    "culture_id": {
      "bsonType": "string",
      "description": "文化ID"
    },
    "content": {
      "bsonType": "string",
      "description": "评论内容",
      "minLength": 1,
      "maxLength": 500
    },
    "score": {
      "bsonType": "number",
      "description": "评分，0-5分，支持一位小数"
    },
    "images": {
      "bsonType": "array",
      "description": "评论图片"
    },
    "nickname": {
      "bsonType": "string",
      "description": "用户昵称"
    },
    "avatar": {
      "bsonType": "string",
      "description": "用户头像"
    },
    "created_at": {
      "bsonType": "timestamp",
      "description": "创建时间"
    }
  }
}
```

### food_reviews（美食评论表）
```json
{
  "bsonType": "object",
  "required": ["user_id", "food_id", "content", "score", "created_at"],
  "properties": {
    "_id": {
      "description": "ID，系统自动生成"
    },
    "user_id": {
      "bsonType": "string",
      "description": "用户ID"
    },
    "food_id": {
      "bsonType": "string",
      "description": "美食ID"
    },
    "content": {
      "bsonType": "string",
      "description": "评论内容"
    },
    "score": {
      "bsonType": "number",
      "description": "评分，0-5分，支持一位小数"
    },
    "images": {
      "bsonType": "array",
      "description": "评论图片"
    },
    "nickname": {
      "bsonType": "string",
      "description": "用户昵称"
    },
    "avatar": {
      "bsonType": "string",
      "description": "用户头像"
    },
    "created_at": {
      "bsonType": "timestamp",
      "description": "创建时间"
    }
  }
}
```

### guide_reviews（攻略评论表）
```json
{
  "bsonType": "object",
  "required": ["user_id", "guide_id", "content", "score", "created_at"],
  "properties": {
    "_id": {
      "description": "ID，系统自动生成"
    },
    "user_id": {
      "bsonType": "string",
      "description": "用户ID"
    },
    "guide_id": {
      "bsonType": "string",
      "description": "攻略ID"
    },
    "content": {
      "bsonType": "string",
      "description": "评论内容"
    },
    "score": {
      "bsonType": "number",
      "description": "评分，0-5分，支持一位小数"
    },
    "images": {
      "bsonType": "array",
      "description": "评论图片"
    },
    "nickname": {
      "bsonType": "string",
      "description": "用户昵称"
    },
    "avatar": {
      "bsonType": "string",
      "description": "用户头像"
    },
    "created_at": {
      "bsonType": "timestamp",
      "description": "创建时间"
    }
  }
}
```

### scenic_bookings（景点预订表）
```json
{
  "bsonType": "object",
  "required": ["user_id", "scenic_id", "date", "created_at"],
  "properties": {
    "_id": {
      "description": "ID，系统自动生成"
    },
    "user_id": {
      "bsonType": "string",
      "description": "用户ID"
    },
    "scenic_id": {
      "bsonType": "string",
      "description": "景点ID"
    },
    "date": {
      "bsonType": "timestamp",
      "description": "预订日期"
    },
    "num": {
      "bsonType": "int",
      "description": "预订人数"
    },
    "status": {
      "bsonType": "int",
      "description": "状态(0:待支付,1:已支付,2:已取消)"
    },
    "created_at": {
      "bsonType": "timestamp",
      "description": "创建时间"
    }
  }
}
```

## 云函数说明

### user-center（用户中心）

主要功能：处理用户注册、登录、个人资料管理等功能。

接口说明：
- **sendVerifyCode**: 发送验证码
  - 参数：`{ phone }`
  - 返回：`{ code, message }`

- **register**: 用户注册
  - 参数：`{ phone, password, verifyCode }`
  - 返回：`{ code, message, token, userInfo }`

- **login**: 用户登录
  - 参数：`{ phone, password, verifyCode }`
  - 返回：`{ code, message, token, userInfo }`

- **updateProfile**: 更新用户资料
  - 参数：`{ nickname, avatar }`
  - 返回：`{ code, message, userInfo }`

- **getCollections**: 获取用户收藏
  - 参数：`{ type }`
  - 返回：`{ code, message, data: { list, total } }`

- **getReviews**: 获取用户评论
  - 参数：`{}`
  - 返回：`{ code, message, data: { list, total } }`

### scenic-center（景点中心）

主要功能：处理景点数据的获取、收藏、评论、预订等功能。

接口说明：
- **getScenicList**: 获取景点列表
  - 参数：`{ page, pageSize, category, keyword, USERID }`
  - 返回：`{ code, message, data: { list, total } }`

- **getScenicDetail**: 获取景点详情
  - 参数：`{ scenic_id }`
  - 返回：`{ code, message, data }`

- **checkCollection**: 检查是否已收藏
  - 参数：`{ scenic_id }`
  - 返回：`{ code, message, data: { isCollected } }`

- **toggleCollection**: 切换收藏状态
  - 参数：`{ scenic_id }`
  - 返回：`{ code, message, data: { isCollected } }`

- **addReview**: 添加评论
  - 参数：`{ scenic_id, content, score }`
  - 返回：`{ code, message }`

- **createBooking**: 创建预订
  - 参数：`{ scenic_id, date, num }`
  - 返回：`{ code, message, data: { booking_id } }`

- **getBookingList**: 获取预订列表
  - 参数：`{ status }`
  - 返回：`{ code, message, data: { list, total } }`

- **cancelBooking**: 取消预订
  - 参数：`{ booking_id }`
  - 返回：`{ code, message }`

### culture-center（文化中心）

主要功能：处理文化数据的获取、收藏、评论等功能。

接口说明：
- **getCultureList**: 获取文化列表
  - 参数：`{ page, pageSize, category, keyword }`
  - 返回：`{ code, message, data: { list, total } }`

- **getCultureDetail**: 获取文化详情
  - 参数：`{ culture_id }`
  - 返回：`{ code, message, data }`

- **checkCollection**: 检查是否已收藏
  - 参数：`{ culture_id }`
  - 返回：`{ code, message, data: { isCollected } }`

- **toggleCollection**: 切换收藏状态
  - 参数：`{ culture_id }`
  - 返回：`{ code, message, data: { isCollected } }`

- **addReview**: 添加评论
  - 参数：`{ culture_id, content, score }`
  - 返回：`{ code, message }`

### food-center（美食中心）

主要功能：处理美食数据的获取、收藏、评论等功能。

接口说明：
- **getFoodList**: 获取美食列表
  - 参数：`{ page, pageSize, category, keyword, USERID }`
  - 返回：`{ code, message, data: { list, total } }`

- **getFoodDetail**: 获取美食详情
  - 参数：`{ food_id }`
  - 返回：`{ code, message, data }`

- **checkCollection**: 检查是否已收藏
  - 参数：`{ food_id }`
  - 返回：`{ code, message, data: { isCollected } }`

- **toggleCollection**: 切换收藏状态
  - 参数：`{ food_id }`
  - 返回：`{ code, message, data: { isCollected } }`

- **addReview**: 添加评论
  - 参数：`{ food_id, content, score, images }`
  - 返回：`{ code, message }`

### guide-center（攻略中心）

主要功能：处理攻略数据的获取、收藏、评论等功能。

接口说明：
- **getGuideList**: 获取攻略列表
  - 参数：`{ page, pageSize, keyword }`
  - 返回：`{ code, message, data: { list, total } }`

- **getGuideDetail**: 获取攻略详情
  - 参数：`{ guide_id }`
  - 返回：`{ code, message, data }`

- **checkCollection**: 检查是否已收藏
  - 参数：`{ guide_id }`
  - 返回：`{ code, message, data: { isCollected } }`

- **toggleCollection**: 切换收藏状态
  - 参数：`{ guide_id }`
  - 返回：`{ code, message, data: { isCollected } }`

- **addReview**: 添加评论
  - 参数：`{ guide_id, content }`
  - 返回：`{ code, message }`

## 安装和部署

### 开发环境要求

- HBuilderX 3.0+
- Node.js 12.0+
- 已开通 uniCloud 服务

### 本地开发

1. 克隆项目
```bash
git clone [项目地址]
```

2. 使用 HBuilderX 打开项目

3. 关联云服务空间
   - 打开 uniCloud 目录
   - 选择/创建云服务空间
   - 关联云服务空间

4. 初始化数据库
   - 上传 database 目录下的 schema
   - 导入初始数据（scenicDataInit.json）

5. 上传云函数
   - 上传 cloudfunctions 目录下的所有云函数

6. 运行项目
   - 选择运行到内置浏览器/手机模拟器/真机调试

### 生产环境部署

1. 发布 H5 版本
```bash
# 在 HBuilderX 中选择发行 - 网站 H5
```

2. 发布小程序版本
```bash
# 在 HBuilderX 中选择发行对应的小程序平台
```

3. 发布 App 版本
```bash
# 在 HBuilderX 中选择发行 - 原生 App
```

## 项目迁移

### 数据迁移

1. 导出数据
   - 在 uniCloud web 控制台导出数据库数据
   - 保存 schema 文件

2. 导入数据
   - 在新的云服务空间创建数据表
   - 导入之前导出的数据

   cultures表初始数据：
   [
    {
        "name": "侗族文化",
        "description": "侗族大歌等非物质文化遗产",
        "cover": "/static/culture/dong.jpg",
        "location": "黔东南州",
        "category": 1,
        "tags": [
            "民族文化",
            "非遗"
        ],
        "images": [
            "/static/culture/dong1.jpg",
            "/static/culture/dong2.jpg"
        ],
        "content": "侗族是一个具有悠久历史的少数民族，以侗族大歌闻名...",
        "created_at": 1645516800000,
        "views": 20
    },
    {
        "name": "苗族文化",
        "description": "多彩的苗族传统文化",
        "cover": "/static/culture/miao.jpg",
        "location": "黔东南州",
        "category": 2,
        "tags": [
            "民族文化",
            "非遗",
            "历史文化"
        ],
        "images": [
            "/static/culture/miao1.jpg",
            "/static/culture/miao2.jpg"
        ],
        "content": "苗族是一个历史悠久的民族，有着丰富的文化传统...",
        "created_at": 1645430400000,
        "views": 2
    }
]
   foods表初始数据：
   [
    {
        "name": "丝娃娃",
        "description": "贵阳名小吃",
        "cover": "/static/food/siwawa.jpg",
        "price": 20,
        "location": "贵阳市",
        "category": 1,
        "tags": [
            "特色小吃",
            "传统美食"
        ],
        "images": [
            "/static/food/siwawa1.jpg",
            "/static/food/siwawa2.jpg"
        ],
        "score": 4.4,
        "created_at": 1645344000000
    },
    {
        "name": "肠旺面",
        "description": "贵州特色小吃",
        "cover": "/static/food/changwangmian.jpg",
        "price": 15,
        "location": "贵阳市",
        "category": 2,
        "tags": [
            "地方菜系",
            "特色小吃",
            "面食"
        ],
        "images": [
            "/static/food/changwangmian1.jpg",
            "/static/food/changwangmian2.jpg"
        ],
        "score": 4.5,
        "created_at": 1645257600000
    }
]
   guides表初始数据：
   [
    {
        "name": "贵州三日游攻略",
        "description": "打卡贵州必去景点",
        "cover": "/static/guide/3days.jpg",
        "tags": [
            "热门",
            "精选",
            "景点"
        ],
        "content": "第一天：游览黄果树瀑布...",
        "views": 1002,
        "likes": 50,
        "created_at": 1645603200000
    },
    {
        "name": "贵州美食攻略",
        "description": "贵州特色美食打卡",
        "cover": "/static/guide/food.jpg",
        "tags": [
            "美食",
            "精选"
        ],
        "content": "贵州美食以酸辣为主...",
        "views": 821,
        "likes": 40,
        "created_at": 1645689600000
    }
]
   scenics表初始数据：
   {
    "bsonType": "object",
    "required": [
        "name",
        "price",
        "location",
        "category",
        "created_at"
    ],
    "permission": {
        "read": true,
        "create": false,
        "update": false,
        "delete": false
    },
    "properties": {
        "_id": {
            "description": "ID，系统自动生成"
        },
        "name": {
            "bsonType": "string",
            "description": "景点名称",
            "minLength": 1,
            "maxLength": 100
        },
        "price": {
            "bsonType": "number",
            "description": "门票价格",
            "minimum": 0
        },
        "location": {
            "bsonType": "string",
            "description": "地理位置",
            "minLength": 1,
            "maxLength": 200
        },
        "category": {
            "bsonType": "int",
            "description": "景点分类",
            "minimum": 0,
            "maximum": 5
        },
        "images": {
            "bsonType": "array",
            "description": "景点图片",
            "items": {
                "bsonType": "string",
                "description": "图片URL"
            }
        },
        "tags": {
            "bsonType": "array",
            "description": "景点标签",
            "items": {
                "bsonType": "string",
                "description": "标签名称"
            }
        },
        "description": {
            "bsonType": "string",
            "description": "景点介绍"
        },
        "openingHours": {
            "bsonType": "array",
            "description": "开放时间",
            "items": {
                "bsonType": "object",
                "required": [
                    "day",
                    "time"
                ],
                "properties": {
                    "day": {
                        "bsonType": "string",
                        "description": "星期几"
                    },
                    "time": {
                        "bsonType": "string",
                        "description": "开放时间段"
                    }
                }
            }
        },
        "traffic": {
            "bsonType": "array",
            "description": "交通指南",
            "items": {
                "bsonType": "object",
                "required": [
                    "type",
                    "description"
                ],
                "properties": {
                    "type": {
                        "bsonType": "string",
                        "description": "交通方式"
                    },
                    "description": {
                        "bsonType": "string",
                        "description": "交通说明"
                    }
                }
            }
        },
        "tickets": {
            "bsonType": "array",
            "description": "门票信息",
            "items": {
                "bsonType": "object",
                "required": [
                    "name",
                    "price"
                ],
                "properties": {
                    "name": {
                        "bsonType": "string",
                        "description": "票种名称"
                    },
                    "price": {
                        "bsonType": "number",
                        "description": "票价"
                    },
                    "description": {
                        "bsonType": "string",
                        "description": "说明"
                    }
                }
            }
        },
        "score": {
            "bsonType": "number",
            "description": "评分",
            "minimum": 0,
            "maximum": 5
        },
        "created_at": {
            "bsonType": "timestamp",
            "description": "创建时间"
        }
    }
}

### 云函数迁移

1. 复制云函数
   - 复制 cloudfunctions 目录到新项目

2. 更新配置
   - 更新云函数配置文件
   - 重新上传云函数

### 前端迁移

1. 复制前端代码
   - 复制整个项目目录（除了 unpackage、node_modules）

2. 更新配置
   - 更新 manifest.json 配置
   - 更新云服务空间配置

## 开发指南

### 添加新功能

1. 创建数据表
   - 在 database/schema 添加新的数据表定义
   - 上传并初始化数据表

2. 创建云函数
   - 在 cloudfunctions 创建新的云函数
   - 实现相关接口
   - 上传云函数

3. 创建页面
   - 在 pages 目录创建新的页面
   - 实现页面逻辑和 UI
   - 在 pages.json 中注册页面

### 注意事项

- 确保云函数和数据表的权限设置正确
- 遵循统一的代码风格和命名规范
- 注意数据安全和用户隐私保护
- 做好错误处理和异常捕获
- 及时更新文档和注释