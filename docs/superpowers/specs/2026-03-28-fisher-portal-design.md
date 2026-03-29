# 钓鱼休闲资讯门户平台 - 设计规格文档

## 项目概述

### 项目背景
现代化钓鱼休闲资讯门户网站，为钓场经营者提供钓场管理、鱼群管理、鱼讯发布等经营工具，为休闲垂钓者提供最新鱼讯、钓场推荐、垂钓知识等内容服务。

### 项目定位
- **B端**：钓场老板管理钓场、发布鱼讯、查看经营数据
- **C端**：休闲垂钓者获取资讯、搜索钓场、收藏预约

### 技术栈选型
| 模块 | 技术方案 |
|------|----------|
| 前端框架 | Vue3 + Vite |
| UI组件库 | Ant Design Vue |
| 状态管理 | Pinia |
| 后端框架 | NestJS |
| 认证方案 | JWT |
| 数据库 | MySQL (127.0.0.1:3306/fisher) |
| 图片存储 | 阿里云 OSS |

---

## 功能模块

### 第一期核心功能（Phase 1）

#### 1. 用户系统
- **用户角色**：
  - 超级管理员（super_admin）：平台所有权限
  - 钓场管理员（venue_admin）：管理自己钓场
  - 垂钓者（angler）：普通用户
- **功能**：
  - 注册 / 登录（手机号+验证码 or 用户名+密码）
  - 个人信息管理（头像、昵称、性别、地区）
  - 收藏钓场
  - 浏览历史

#### 2. 钓场管理
- **钓场基本信息**：
  - 名称、地址（省市区+详细地址）
  - 面积（水面面积，单位：亩）
  - 配套设施（停车、餐饮、WiFi、空调、卫生间等）
  - 营业时间
  - 联系方式（电话）
  - 封面图片
- **功能**：
  - CRUD 钓场
  - 钓场审核（超管审批后上线）
  - 钓场上架/下架

#### 3. 鱼群管理
- **鱼种数据**：
  - 鱼种名称（鲫鱼、鲤鱼、草鱼、罗非等）
  - 鱼种分类（淡水鱼/海水鱼）
  - 平均体重
  - 投放数量
  - 当前存塘量
- **功能**：
  - 添加/编辑/删除鱼种
  - 批量投放记录

#### 4. 收费模式
- **支持模式**：
  - 按斤计价（元/斤）
  - 按天计价（元/天）
  - 按小时计价（元/小时）
  - 会员制（包月/包年）
- **功能**：
  - 多种模式组合设置
  - 特殊节假日价格

#### 5. 鱼讯发布
- **内容**：
  - 鱼情描述（开口情况、活跃度）
  - 上鱼率
  - 限钓规则（限竿数、限尺寸、禁钓鱼种）
  - 配图（最多9张）
- **功能**：
  - 发布/编辑/删除鱼讯
  - 置顶（超管/钓场主可操作）
  - 时间倒序展示

#### 6. 资讯频道
- **分类**：
  - 垂钓学堂（技巧文章、教学视频）
  - 鱼类百科（鱼种知识）
  - 行业动态（新闻、活动）
- **功能**：
  - 文章 CRUD（超管/编辑发布）
  - 分类浏览
  - 搜索

#### 7. 首页内容分发
- **双频道切换**：
  - 右上角 Tab 切换
  - 默认"休闲钓"（80%内容）
  - "钓场经营"（20%内容）
- **休闲钓首页**：
  - 轮播图（活动/公告）
  - 精选钓场推荐
  - 最新鱼讯列表
  - 快捷入口（钓场搜索、鱼讯查询）
- **钓场经营首页**：
  - 养护知识
  - 经营案例
  - 科学养殖技巧

### 非核心功能（后期迭代）
- 钓具商城（电商模块）
- 养护记录（水质管理、投喂日志）
- 评论区（用户评论互动）

---

## 页面结构

### 前端（H5）

```
src/
├── views/
│   ├── home/
│   │   ├── index.vue          # 休闲钓首页
│   │   └── business.vue       # 钓场经营首页
│   ├── venue/
│   │   ├── list.vue           # 钓场列表（筛选+地图）
│   │   └── detail.vue         # 钓场详情
│   ├── fish-info/
│   │   └── list.vue           # 鱼讯列表
│   ├── info/
│   │   ├── list.vue           # 资讯列表
│   │   └── detail.vue         # 资讯详情
│   ├── user/
│   │   ├── login.vue          # 登录
│   │   ├── register.vue       # 注册
│   │   ├── profile.vue        # 个人资料
│   │   ├── favorites.vue      # 我的收藏
│   │   └── history.vue        # 浏览历史
│   └── common/
│       ├── 404.vue
│       └── forbidden.vue
├── components/
├── router/
├── stores/
└── api/
```

### 管理后台

```
admin/
├── views/
│   ├── dashboard/
│   ├── system/
│   │   ├── user-manage.vue    # 用户管理
│   │   └── role-manage.vue    # 角色权限
│   ├── venue/
│   │   ├── list.vue           # 钓场审核
│   │   └── manage.vue         # 钓场管理（钓场主）
│   ├── fish/
│   │   ├── species.vue        # 鱼种管理
│   │   └── pricing.vue        # 收费设置
│   ├── fish-info/
│   │   └── publish.vue        # 鱼讯发布
│   ├── content/
│   │   ├── article.vue        # 资讯管理
│   │   └── category.vue       # 分类管理
│   └── profile/
│       └── index.vue          # 个人中心
```

---

## 数据库设计

### ER 图概要

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    users    │     │   venues    │     │   species   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id          │────<│ user_id     │     │ id          │
│ username    │     │ name        │     │ name        │
│ phone       │     │ province    │     │ category    │
│ password    │     │ city        │     │ avg_weight  │
│ role        │     │ address     │     │ quantity    │
│ avatar      │     │ area        │     │ venue_id    │
│ created_at  │     │ facilities │     └─────────────┘
└─────────────┘     │ status     │       │
       │            │ created_at  │       │
       │            └─────────────┘       │
       │                  │                │
       │            ┌─────┴─────┐          │
       │            │           │          │
       │     ┌──────┴────┐  ┌───┴──────┐  │
       │     │fish_infos │  │pricing   │  │
       │     ├───────────┤  ├──────────┤  │
       │     │ id        │  │ id       │  │
       │     │ venue_id  │  │ venue_id │  │
       │     │ content   │  │ type     │  │
       │     │ images    │  │ price    │  │
       │     │ is_top    │  └──────────┘  │
       │     │ created_at│                │
       │     └───────────┘                │
       │                                    │
┌──────┴──────┐                      ┌─────┴─────┐
│  favorites  │                      │ articles  │
├─────────────┤                      ├───────────┤
│ id          │                      │ id        │
│ user_id     │                      │ title     │
│ venue_id    │                      │ content   │
│ created_at  │                      │ category  │
└─────────────┘                      │ cover     │
                                     │ author    │
                                     │ created_at│
                                     └───────────┘
```

### 核心表结构

#### 1. users（用户表）
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  email VARCHAR(100),
  password VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'venue_admin', 'angler') DEFAULT 'angler',
  nickname VARCHAR(50),
  avatar VARCHAR(255),
  gender ENUM('male', 'female', 'unknown') DEFAULT 'unknown',
  province VARCHAR(50),
  city VARCHAR(50),
  status ENUM('active', 'banned') DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. venues（钓场表）
```sql
CREATE TABLE venues (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  province VARCHAR(50),
  city VARCHAR(50),
  district VARCHAR(50),
  address VARCHAR(255),
  area DECIMAL(10,2),  -- 亩
  facilities JSON,     -- ['parking', 'restaurant', 'wifi']
  business_hours VARCHAR(100),
  phone VARCHAR(20),
  cover_image VARCHAR(255),
  description TEXT,
  status ENUM('pending', 'approved', 'rejected', 'offline') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 3. species（鱼种表）
```sql
CREATE TABLE species (
  id INT PRIMARY KEY AUTO_INCREMENT,
  venue_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  category ENUM('freshwater', 'saltwater') DEFAULT 'freshwater',
  avg_weight DECIMAL(10,2),
  quantity INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_id) REFERENCES venues(id)
);
```

#### 4. pricing（收费模式表）
```sql
CREATE TABLE pricing (
  id INT PRIMARY KEY AUTO_INCREMENT,
  venue_id INT NOT NULL,
  type ENUM('per_weight', 'per_day', 'per_hour', 'membership') NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20),  -- 斤/天/小时/月/年
  description VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_id) REFERENCES venues(id)
);
```

#### 5. fish_infos（鱼讯表）
```sql
CREATE TABLE fish_infos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  venue_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  images JSON,  -- ['url1', 'url2']
  bite_rate VARCHAR(50),  -- 上鱼率描述
  rules TEXT,  -- 限钓规则
  is_top BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_id) REFERENCES venues(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 6. articles（资讯文章表）
```sql
CREATE TABLE articles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  summary VARCHAR(500),
  cover VARCHAR(255),
  category ENUM('technique', 'encyclopedia', 'news') NOT NULL,
  tags JSON,
  author_id INT,
  status ENUM('draft', 'published') DEFAULT 'draft',
  view_count INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id)
);
```

#### 7. favorites（收藏表）
```sql
CREATE TABLE favorites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  venue_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (venue_id) REFERENCES venues(id),
  UNIQUE KEY uk_user_venue (user_id, venue_id)
);
```

#### 8. banners（轮播图表）
```sql
CREATE TABLE banners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100),
  image VARCHAR(255) NOT NULL,
  link VARCHAR(255),
  position ENUM('home_leisure', 'home_business') DEFAULT 'home_leisure',
  sort_order INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 权限矩阵

| 功能 | 超级管理员 | 钓场管理员 | 垂钓者 |
|------|------------|------------|--------|
| 用户管理 | ✅ 全部 | ❌ | ❌ |
| 角色权限 | ✅ 分配 | ❌ | ❌ |
| 钓场审核 | ✅ 审批 | ❌ | ❌ |
| 钓场 CRUD | ✅ 全部 | ✅ 自己 | ❌ |
| 鱼群管理 | ✅ 查看 | ✅ 自己 | ❌ |
| 收费设置 | ✅ 查看 | ✅ 自己 | ❌ |
| 鱼讯发布 | ✅ 全部 | ✅ 自己 | ❌ |
| 鱼讯置顶 | ✅ | ✅ | ❌ |
| 资讯管理 | ✅ CRUD | ❌ | ❌ |
| 首页轮播 | ✅ 管理 | ❌ | ❌ |
| 浏览钓场 | ✅ | ✅ | ✅ |
| 搜索钓场 | ✅ | ✅ | ✅ |
| 收藏钓场 | ✅ | ✅ | ✅ |
| 浏览鱼讯 | ✅ | ✅ | ✅ |
| 浏览资讯 | ✅ | ✅ | ✅ |

---

## API 接口规划

### 认证模块
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录
- `POST /api/auth/logout` - 登出
- `GET /api/auth/profile` - 获取当前用户信息

### 用户模块
- `GET /api/users` - 用户列表（超管）
- `PUT /api/users/:id` - 更新用户
- `PUT /api/users/:id/role` - 修改角色（超管）
- `PUT /api/users/:id/status` - 禁用/启用用户（超管）

### 钓场模块
- `GET /api/venues` - 钓场列表（支持筛选）
- `GET /api/venues/:id` - 钓场详情
- `POST /api/venues` - 创建钓场
- `PUT /api/venues/:id` - 更新钓场
- `DELETE /api/venues/:id` - 删除钓场
- `PUT /api/venues/:id/approve` - 审核钓场（超管）
- `PUT /api/venues/:id/status` - 上架/下架

### 鱼群模块
- `GET /api/venues/:id/species` - 鱼种列表
- `POST /api/venues/:id/species` - 添加鱼种
- `PUT /api/species/:id` - 更新鱼种
- `DELETE /api/species/:id` - 删除鱼种

### 收费模块
- `GET /api/venues/:id/pricing` - 收费列表
- `POST /api/venues/:id/pricing` - 添加收费
- `PUT /api/pricing/:id` - 更新收费
- `DELETE /api/pricing/:id` - 删除收费

### 鱼讯模块
- `GET /api/fish-infos` - 鱼讯列表（支持筛选）
- `GET /api/fish-infos/:id` - 鱼讯详情
- `POST /api/fish-infos` - 发布鱼讯
- `PUT /api/fish-infos/:id` - 更新鱼讯
- `DELETE /api/fish-infos/:id` - 删除鱼讯
- `PUT /api/fish-infos/:id/top` - 置顶/取消置顶

### 资讯模块
- `GET /api/articles` - 文章列表
- `GET /api/articles/:id` - 文章详情
- `POST /api/articles` - 创建文章
- `PUT /api/articles/:id` - 更新文章
- `DELETE /api/articles/:id` - 删除文章

### 收藏模块
- `GET /api/favorites` - 我的收藏
- `POST /api/favorites` - 添加收藏
- `DELETE /api/favorites/:venueId` - 取消收藏

### 轮播图
- `GET /api/banners` - 轮播图列表
- `POST /api/banners` - 添加轮播图
- `PUT /api/banners/:id` - 更新轮播图
- `DELETE /api/banners/:id` - 删除轮播图

---

## 部署架构

```
                    ┌─────────────┐
                    │   CDN       │
                    │ (Aliyun)    │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────┴─────┐ ┌────┴────┐ ┌─────┴─────┐
        │   H5     │ │  Admin  │ │  NestJS  │
        │  (Vue)   │ │  (Vue)  │ │  (Node)  │
        └──────────┘ └─────────┘ └─────┬─────┘
                                        │
                                ┌───────┴───────┐
                                │               │
                          ┌─────┴─────┐   ┌─────┴─────┐
                          │   MySQL   │   │  Aliyun  │
                          │   (本地)  │   │   OSS    │
                          └───────────┘   └───────────┘
```

---

## 开发计划

### Phase 1（约 2-3 周）
1. 项目初始化（前端+后端）
2. 用户系统（注册/登录/JWT）
3. 钓场 CRUD + 审核
4. 鱼群 + 收费管理
5. 鱼讯发布 + 置顶
6. 资讯管理
7. 首页 + 搜索 + 收藏
8. 部署测试

---

## 附录

### 鱼种预设清单（常见淡水鱼）
- 鲫鱼、鲤鱼、草鱼、鳙鱼（胖头）、青鱼
- 罗非鱼、白鲳、鲶鱼、黄颡鱼（黄辣丁）
- 翘嘴（翘嘴鱼）、鳜鱼（桂鱼）、黑鱼
- 鲢鱼、白条、马口

### 配套设施枚举
- parking（停车）
- restaurant（餐饮）
- wifi（无线网络）
- ac（空调）
- restroom（卫生间）
- boat（钓鱼船）
- tent（露营）
- locker（寄存柜）

### 开发账号信息
- mysql 数据库 127.0.0.1:fisher 账号/密码 root/1234567890
- aliyun oss 账号 

