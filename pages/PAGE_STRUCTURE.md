# 页面结构说明

## 四个底部导航栏对应的页面结构

### 1. 社区广场 (Square) - `/`
- `index.vue` - 社区广场主页（保持根路径）
- `community/` - 社区相关页面
  - `[id].vue` - 社区详情
  - `setup.vue` - 社区设置
- `dao.vue` - DAO管理页面
- `market.vue` - 市场页面（重定向到tasks）

### 2. 任务 (Tasks) - `/tasks`
- `tasks/` - 任务相关页面（已存在）
  - `index.vue` - 任务列表
  - `[id].vue` - 任务详情
  - `create.vue` - 创建任务
  - `detail/` - 任务详情子页面
    - `submit.vue` - 提交任务
    - `review.vue` - 审核任务

### 3. 活动 (Activities) - `/activities-feed`
- `activities-feed.vue` - 活动流主页（保持根路径）
- `activities/` - 活动相关页面
  - `index.vue` - 活动列表
  - `[id].vue` - 活动详情
  - `create.vue` - 创建活动

### 4. 我的 (Member) - `/member/1`
- `member/` - 成员相关页面
  - `[id].vue` - 成员详情/个人主页
- `profile/` - 个人资料设置
  - `setup.vue` - 个人资料设置
- `wallet.vue` - 钱包页面（重定向到member页面）

### 5. 认证相关 (Auth)
- `login.vue` - 登录页面
- `verify.vue` - 验证页面
- `verifyphone.vue` - 手机验证页面

## 路由路径保持不变
为了保持现有路由路径不变，主要入口页面保持在根目录：
- `/` → `index.vue` (社区广场)
- `/tasks` → `tasks/index.vue` (任务列表)
- `/activities-feed` → `activities-feed.vue` (活动流)
- `/member/[id]` → `member/[id].vue` (个人主页)

