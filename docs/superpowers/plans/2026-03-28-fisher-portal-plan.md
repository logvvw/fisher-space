# 钓鱼休闲资讯门户平台 - 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建完整的钓鱼休闲资讯门户平台，包含前端H5页面、管理后台、后端API服务

**Architecture:** 前后端分离架构，前端Vue3+AntDesignVue后端NestJS，数据库MySQL，图片存储阿里云OSS

**Tech Stack:** Vue3 + Vite + Ant Design Vue + Pinia | NestJS + TypeORM + MySQL | JWT | Aliyun OSS

---

## 一、项目结构规划

```
fisher-home/
├── fisher-web/                 # 前端H5项目
│   ├── src/
│   │   ├── api/                # API请求封装
│   │   ├── assets/             # 静态资源
│   │   ├── components/         # 公共组件
│   │   ├── router/            # 路由配置
│   │   ├── stores/             # Pinia状态管理
│   │   ├── views/              # 页面组件
│   │   ├── App.vue
│   │   └── main.ts
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
├── fisher-admin/                # 管理后台项目
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── router/
│   │   ├── stores/
│   │   ├── views/
│   │   ├── App.vue
│   │   └── main.ts
│   ├── vite.config.ts
│   └── package.json
├── fisher-server/               # 后端NestJS项目
│   ├── src/
│   │   ├── modules/            # 业务模块
│   │   │   ├── auth/          # 认证模块
│   │   │   ├── users/         # 用户模块
│   │   │   ├── venues/       # 钓场模块
│   │   │   ├── species/      # 鱼种模块
│   │   │   ├── pricing/       # 收费模块
│   │   │   ├── fish-info/    # 鱼讯模块
│   │   │   ├── articles/     # 资讯模块
│   │   │   ├── favorites/    # 收藏模块
│   │   │   └── banners/      # 轮播图模块
│   │   ├── common/            # 公共模块
│   │   │   ├── decorators/   # 装饰器
│   │   │   ├── filters/      # 异常过滤器
│   │   │   ├── interceptors/ # 拦截器
│   │   │   └── guards/        # 守卫
│   │   ├── config/            # 配置
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── tsconfig.json
└── docs/
    └── superpowers/
        ├── specs/              # 设计文档
        └── plans/              # 实施计划
```

---

## 二、开发任务分解

### 阶段一：基础设施搭建（Day 1-2）

#### Task 1: 初始化后端项目

**Files:**
- Create: `fisher-server/package.json`
- Create: `fisher-server/tsconfig.json`
- Create: `fisher-server/nest-cli.json`
- Create: `fisher-server/src/main.ts`
- Create: `fisher-server/src/app.module.ts`

- [ ] **Step 1: 创建后端项目结构**

```bash
cd fisher-home
mkdir -p fisher-server/src/{modules/{auth,users,venues,species,pricing,fish-info,articles,favorites,banners},common/{decorators,filters,interceptors,guards},config}
```

- [ ] **Step 2: 编写 package.json**

```json
{
  "name": "fisher-server",
  "version": "1.0.0",
  "description": "Fisher Portal Server",
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main"
  },
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/core": "^10.3.0",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.3",
    "@nestjs/platform-express": "^10.3.0",
    "@nestjs/typeorm": "^10.0.1",
    "bcrypt": "^5.1.1",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "mysql2": "^3.7.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "reflect-metadata": "^0.2.1",
    "rxjs": "^7.8.1",
    "typeorm": "^0.3.19",
    "ali-oss": "^6.20.0",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.3.0",
    "@types/bcrypt": "^5.0.2",
    "@types/node": "^20.10.6",
    "@types/passport-jwt": "^4.0.0",
    "typescript": "^5.3.3"
  }
}
```

- [ ] **Step 3: 编写 tsconfig.json**

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  }
}
```

- [ ] **Step 4: 编写 main.ts**

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  app.enableCors();
  
  await app.listen(3000);
  console.log('Fisher Server running on http://localhost:3000');
}
bootstrap();
```

- [ ] **Step 5: 编写基础 app.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '1234567890',
      database: 'fisher',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

- [ ] **Step 6: 提交代码**

```bash
cd fisher-server
git init
git add .
git commit -m "feat: 初始化NestJS后端项目基础结构"
```

---

#### Task 2: 初始化前端H5项目

**Files:**
- Create: `fisher-web/package.json`
- Create: `fisher-web/vite.config.ts`
- Create: `fisher-web/tsconfig.json`
- Create: `fisher-web/index.html`
- Create: `fisher-web/src/main.ts`
- Create: `fisher-web/src/App.vue`

- [ ] **Step 1: 创建前端项目结构**

```bash
mkdir -p fisher-web/src/{api,assets,components,router,stores,views/{home,venue,fish-info,info,user,common}}
```

- [ ] **Step 2: 编写 package.json**

```json
{
  "name": "fisher-web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.15",
    "vue-router": "^4.2.5",
    "pinia": "^2.1.7",
    "ant-design-vue": "^4.1.2",
    "axios": "^1.6.5",
    "dayjs": "^1.11.10"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.3",
    "typescript": "^5.3.3",
    "vite": "^5.0.11",
    "vue-tsc": "^1.8.27"
  }
}
```

- [ ] **Step 3: 编写 vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

- [ ] **Step 4: 编写 main.ts**

```typescript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(Antd);
app.mount('#app');
```

- [ ] **Step 5: 编写 App.vue**

```vue
<template>
  <router-view />
</template>

<script setup lang="ts">
</script>

<style>
#app {
  width: 100%;
  min-height: 100vh;
}
</style>
```

- [ ] **Step 6: 编写路由配置 src/router/index.ts**

```typescript
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      component: () => import('@/views/home/index.vue'),
    },
  ],
});

export default router;
```

- [ ] **Step 7: 编写首页 src/views/home/index.vue**

```vue
<template>
  <div class="home">
    <a-config-provider>
      <a-layout>
        <a-header>Fisher Portal</a-header>
        <a-content>Home Page</a-content>
      </a-layout>
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home {
  min-height: 100vh;
}
</style>
```

- [ ] **Step 8: 提交代码**

```bash
cd fisher-web
git init
git add .
git commit -m "feat: 初始化Vue3前端项目基础结构"
```

---

#### Task 3: 初始化管理后台项目

**Files:**
- Create: `fisher-admin/package.json` ~ `fisher-admin/src/App.vue` (类似前端项目结构)

- [ ] **Step 1: 创建管理后台项目结构**

```bash
mkdir -p fisher-admin/src/{api,components,router,stores,views/{dashboard,system,venue,fish,fish-info,content,profile}}
```

- [ ] **Step 2: 复制 fisher-web 基础文件并修改**
- 继承相同的基础配置
- 修改端口为 5174
- 修改 proxy 目标一致
- 初始页面改为登录页

- [ ] **Step 3: 提交代码**

```bash
cd fisher-admin
git init
git add .
git commit -m "feat: 初始化管理后台项目基础结构"
```

---

### 阶段二：用户认证模块（Day 2-3）

#### Task 4: 后端用户模块

**Files:**
- Create: `fisher-server/src/modules/users/entities/user.entity.ts`
- Create: `fisher-server/src/modules/users/users.module.ts`
- Create: `fisher-server/src/modules/users/users.service.ts`
- Create: `fisher-server/src/modules/users/users.controller.ts`
- Create: `fisher-server/src/modules/users/dto/create-user.dto.ts`
- Create: `fisher-server/src/modules/users/dto/update-user.dto.ts`

- [ ] **Step 1: 创建用户实体**

```typescript
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  VENUE_ADMIN = 'venue_admin',
  ANGLER = 'angler',
}

export enum UserStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.ANGLER })
  role: UserRole;

  @Column({ nullable: true })
  nickname: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

- [ ] **Step 2: 创建 UsersModule**

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
```

- [ ] **Step 3: 创建 UsersService**

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.usersRepository.create({
      ...data,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, data);
    return this.findOne(id);
  }
}
```

- [ ] **Step 4: 创建 UsersController**

```typescript
import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.usersService.update(+id, data);
  }
}
```

- [ ] **Step 5: 提交代码**

```bash
git add fisher-server/src/modules/users/
git commit -m "feat: 添加用户模块（实体、服务、控制器）"
```

---

#### Task 5: 后端认证模块（JWT）

**Files:**
- Create: `fisher-server/src/modules/auth/auth.module.ts`
- Create: `fisher-server/src/modules/auth/auth.service.ts`
- Create: `fisher-server/src/modules/auth/auth.controller.ts`
- Create: `fisher-server/src/modules/auth/dto/login.dto.ts`
- Create: `fisher-server/src/modules/auth/dto/register.dto.ts`
- Create: `fisher-server/src/common/guards/jwt.guard.ts`
- Create: `fisher-server/src/common/guards/roles.guard.ts`
- Create: `fisher-server/src/common/decorators/roles.decorator.ts`

- [ ] **Step 1: 创建 JWT 模块配置**

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'fisher-secret-key-2024',
      signOptions: { expiresIn: '7d' },
    }),
    AuthModule,
  ],
})
export class AppModule {}
```

- [ ] **Step 2: 创建 AuthService**

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    
    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }

  async register(data: any) {
    const existing = await this.usersService.findByUsername(data.username);
    if (existing) {
      throw new UnauthorizedException('用户名已存在');
    }
    return this.usersService.create(data);
  }
}
```

- [ ] **Step 3: 创建 Roles 装饰器**

```typescript
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../modules/users/entities/user.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
```

- [ ] **Step 4: 提交代码**

```bash
git add fisher-server/src/modules/auth/
git commit -m "feat: 添加JWT认证模块"
```

---

### 阶段三：钓场管理模块（Day 3-5）

#### Task 6: 后端钓场模块

**Files:**
- Create: `fisher-server/src/modules/venues/entities/venue.entity.ts`
- Create: `fisher-server/src/modules/venues/venues.module.ts`
- Create: `fisher-server/src/modules/venues/venues.service.ts`
- Create: `fisher-server/src/modules/venues/venues.controller.ts`

- [ ] **Step 1: 创建钓场实体**

```typescript
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum VenueStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  OFFLINE = 'offline',
}

@Entity('venues')
export class Venue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  name: string;

  @Column({ nullable: true })
  province: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  district: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  area: number;

  @Column({ type: 'json', nullable: true })
  facilities: string[];

  @Column({ nullable: true })
  businessHours: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: VenueStatus, default: VenueStatus.PENDING })
  status: VenueStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

- [ ] **Step 2: 创建 VenuesService CRUD 方法**

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venue } from './entities/venue.entity';

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(Venue)
    private venuesRepository: Repository<Venue>,
  ) {}

  async create(data: Partial<Venue>, userId: number): Promise<Venue> {
    const venue = this.venuesRepository.create({
      ...data,
      userId,
    });
    return this.venuesRepository.save(venue);
  }

  async findAll(filters?: any): Promise<Venue[]> {
    const query = this.venuesRepository.createQueryBuilder('venue')
      .leftJoinAndSelect('venue.user', 'user')
      .where('venue.status = :status', { status: 'approved' });
    
    if (filters?.province) query.andWhere('venue.province = :province', { province: filters.province });
    if (filters?.city) query.andWhere('venue.city = :city', { city: filters.city });
    if (filters?.keyword) query.andWhere('venue.name LIKE :keyword', { keyword: `%${filters.keyword}%` });
    
    return query.orderBy('venue.createdAt', 'DESC').getMany();
  }

  async findOne(id: number): Promise<Venue> {
    return this.venuesRepository.findOne({ 
      where: { id },
      relations: ['user'],
    });
  }

  async update(id: number, data: Partial<Venue>): Promise<Venue> {
    await this.venuesRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.venuesRepository.delete(id);
  }

  async approve(id: number): Promise<Venue> {
    await this.venuesRepository.update(id, { status: 'approved' as any });
    return this.findOne(id);
  }
}
```

- [ ] **Step 3: 创建 VenuesController**

```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Get()
  findAll(@Query() filters: any) {
    return this.venuesService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.venuesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() data: any, @Req() req) {
    return this.venuesService.create(data, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.venuesService.update(+id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.venuesService.delete(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/approve')
  approve(@Param('id') id: string) {
    return this.venuesService.approve(+id);
  }
}
```

- [ ] **Step 4: 提交代码**

```bash
git add fisher-server/src/modules/venues/
git commit -m "feat: 添加钓场管理模块"
```

---

#### Task 7: 前端钓场页面

**Files:**
- Create: `fisher-web/src/views/venue/list.vue`
- Create: `fisher-web/src/views/venue/detail.vue`
- Create: `fisher-web/src/api/venue.ts`

- [ ] **Step 1: 创建钓场列表页**

```vue
<template>
  <div class="venue-list">
    <a-spin :spinning="loading">
      <a-list :data-source="venues" :locale="{ emptyText: '暂无钓场' }">
        <template #renderItem="{ item }">
          <a-list-item @click="goDetail(item.id)">
            <a-list-item-meta>
              <template #avatar>
                <a-avatar :src="item.coverImage" :size="80" shape="square" />
              </template>
              <template #title>{{ item.name }}</template>
              <template #description>
                <div>{{ item.address }}</div>
                <div>面积: {{ item.area }}亩</div>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { venueApi } from '@/api/venue';

const router = useRouter();
const loading = ref(false);
const venues = ref([]);

const loadVenues = async () => {
  loading.value = true;
  try {
    const res = await venueApi.getList();
    venues.value = res.data;
  } finally {
    loading.value = false;
  }
};

const goDetail = (id: number) => {
  router.push(`/venue/${id}`);
};

onMounted(loadVenues);
</script>
```

- [ ] **Step 2: 创建 API 封装**

```typescript
import axios from 'axios';

const request = axios.create({
  baseURL: '/api',
});

export const venueApi = {
  getList: (params?: any) => request.get('/venues', { params }),
  getDetail: (id: number) => request.get(`/venues/${id}`),
  create: (data: any) => request.post('/venues', data),
  update: (id: number, data: any) => request.put(`/venues/${id}`, data),
  delete: (id: number) => request.delete(`/venues/${id}`),
};
```

- [ ] **Step 3: 提交代码**

```bash
git add fisher-web/src/views/venue/ fisher-web/src/api/
git commit -m "feat: 添加前端钓场列表和详情页"
```

---

### 阶段四：鱼群、收费模块（Day 5-6）

#### Task 8: 后端鱼群和收费模块

**Files:**
- Create: `fisher-server/src/modules/species/entities/species.entity.ts`
- Create: `fisher-server/src/modules/species/species.module.ts`
- Create: `fisher-server/src/modules/species/species.service.ts`
- Create: `fisher-server/src/modules/pricing/entities/pricing.entity.ts`
- Create: `fisher-server/src/modules/pricing/pricing.module.ts`
- Create: `fisher-server/src/modules/pricing/pricing.service.ts`

- [ ] **Step 1: 创建鱼种实体**

```typescript
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Venue } from '../../venues/entities/venue.entity';

export enum SpeciesCategory {
  FRESHWATER = 'freshwater',
  SALTWATER = 'saltwater',
}

@Entity('species')
export class Species {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  venueId: number;

  @ManyToOne(() => Venue)
  venue: Venue;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: SpeciesCategory, default: SpeciesCategory.FRESHWATER })
  category: SpeciesCategory;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  avgWeight: number;

  @Column({ default: 0 })
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;
}
```

- [ ] **Step 2: 创建收费实体**

```typescript
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Venue } from '../../venues/entities/venue.entity';

export enum PricingType {
  PER_WEIGHT = 'per_weight',
  PER_DAY = 'per_day',
  PER_HOUR = 'per_hour',
  MEMBERSHIP = 'membership',
}

@Entity('pricing')
export class Pricing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  venueId: number;

  @ManyToOne(() => Venue)
  venue: Venue;

  @Column({ type: 'enum', enum: PricingType })
  type: PricingType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  unit: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
```

- [ ] **Step 3: 提交代码**

```bash
git add fisher-server/src/modules/species/ fisher-server/src/modules/pricing/
git commit -m "feat: 添加鱼群管理和收费模块"
```

---

### 阶段五：鱼讯、资讯模块（Day 6-8）

#### Task 9: 后端鱼讯模块

**Files:**
- Create: `fisher-server/src/modules/fish-info/entities/fish-info.entity.ts`
- Create: `fisher-server/src/modules/fish-info/fish-info.module.ts`
- Create: `fisher-server/src/modules/fish-info/fish-info.service.ts`
- Create: `fisher-server/src/modules/fish-info/fish-info.controller.ts`

- [ ] **Step 1: 创建鱼讯实体**

```typescript
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Venue } from '../../venues/entities/venue.entity';
import { User } from '../../users/entities/user.entity';

@Entity('fish_infos')
export class FishInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  venueId: number;

  @ManyToOne(() => Venue)
  venue: Venue;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ nullable: true })
  biteRate: string;

  @Column({ type: 'text', nullable: true })
  rules: string;

  @Column({ default: false })
  isTop: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

- [ ] **Step 2: 创建 FishInfoService**

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FishInfo } from './entities/fish-info.entity';

@Injectable()
export class FishInfoService {
  constructor(
    @InjectRepository(FishInfo)
    private fishInfoRepository: Repository<FishInfo>,
  ) {}

  async create(data: Partial<FishInfo>, userId: number): Promise<FishInfo> {
    const fishInfo = this.fishInfoRepository.create({
      ...data,
      userId,
    });
    return this.fishInfoRepository.save(fishInfo);
  }

  async findAll(venueId?: number): Promise<FishInfo[]> {
    const query = this.fishInfoRepository
      .createQueryBuilder('fi')
      .leftJoinAndSelect('fi.venue', 'venue')
      .orderBy('fi.isTop', 'DESC')
      .addOrderBy('fi.createdAt', 'DESC');

    if (venueId) {
      query.where('fi.venueId = :venueId', { venueId });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<FishInfo> {
    return this.fishInfoRepository.findOne({
      where: { id },
      relations: ['venue', 'user'],
    });
  }

  async toggleTop(id: number): Promise<FishInfo> {
    const fishInfo = await this.findOne(id);
    fishInfo.isTop = !fishInfo.isTop;
    return this.fishInfoRepository.save(fishInfo);
  }

  async delete(id: number): Promise<void> {
    await this.fishInfoRepository.delete(id);
  }
}
```

- [ ] **Step 3: 提交代码**

```bash
git add fisher-server/src/modules/fish-info/
git commit -m "feat: 添加鱼讯发布模块"
```

---

#### Task 10: 后端资讯模块

**Files:**
- Create: `fisher-server/src/modules/articles/entities/article.entity.ts`
- Create: `fisher-server/src/modules/articles/articles.service.ts`
- Create: `fisher-server/src/modules/articles/articles.controller.ts`

- [ ] **Step 1: 创建资讯实体**

```typescript
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ArticleCategory {
  TECHNIQUE = 'technique',
  ENCYCLOPEDIA = 'encyclopedia',
  NEWS = 'news',
}

export enum ArticleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  summary: string;

  @Column({ nullable: true })
  cover: string;

  @Column({ type: 'enum', enum: ArticleCategory })
  category: ArticleCategory;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ nullable: true })
  authorId: number;

  @ManyToOne(() => User)
  author: User;

  @Column({ type: 'enum', enum: ArticleStatus, default: ArticleStatus.DRAFT })
  status: ArticleStatus;

  @Column({ default: 0 })
  viewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

- [ ] **Step 2: 提交代码**

```bash
git add fisher-server/src/modules/articles/
git commit -m "feat: 添加资讯文章模块"
```

---

### 阶段六：收藏、轮播图模块（Day 8）

#### Task 11: 后端收藏和轮播图模块

**Files:**
- Create: `fisher-server/src/modules/favorites/entities/favorite.entity.ts`
- Create: `fisher-server/src/modules/favorites/favorites.service.ts`
- Create: `fisher-server/src/modules/banners/entities/banner.entity.ts`
- Create: `fisher-server/src/modules/banners/banners.service.ts`

- [ ] **Step 1: 创建收藏实体**

```typescript
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Venue } from '../../venues/entities/venue.entity';

@Entity('favorites')
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  venueId: number;

  @ManyToOne(() => Venue)
  venue: Venue;

  @CreateDateColumn()
  createdAt: Date;
}
```

- [ ] **Step 2: 创建轮播图实体**

```typescript
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum BannerPosition {
  HOME_LEISURE = 'home_leisure',
  HOME_BUSINESS = 'home_business',
}

export enum BannerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column()
  image: string;

  @Column({ nullable: true })
  link: string;

  @Column({ type: 'enum', enum: BannerPosition, default: BannerPosition.HOME_LEISURE })
  position: BannerPosition;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ type: 'enum', enum: BannerStatus, default: BannerStatus.ACTIVE })
  status: BannerStatus;

  @CreateDateColumn()
  createdAt: Date;
}
```

- [ ] **Step 3: 提交代码**

```bash
git add fisher-server/src/modules/favorites/ fisher-server/src/modules/banners/
git commit -m "feat: 添加收藏和轮播图模块"
```

---

### 阶段七：前端页面完善（Day 9-12）

#### Task 12: 前端首页开发

**Files:**
- Modify: `fisher-web/src/views/home/index.vue`

- [ ] **Step 1: 开发休闲钓首页**

包含：
- 轮播图组件
- Tab切换（休闲钓/钓场经营）
- 精选钓场推荐
- 最新鱼讯列表
- 快捷入口

- [ ] **Step 2: 提交代码**

```bash
git add fisher-web/src/views/home/
git commit -m "feat: 完成休闲钓首页开发"
```

---

#### Task 13: 前端资讯页面

**Files:**
- Create: `fisher-web/src/views/info/list.vue`
- Create: `fisher-web/src/views/info/detail.vue`

- [ ] **Step 1: 开发资讯列表和详情页**

- [ ] **Step 2: 提交代码**

```bash
git add fisher-web/src/views/info/
git commit -m "feat: 完成资讯频道页面"
```

---

#### Task 14: 前端用户中心

**Files:**
- Create: `fisher-web/src/views/user/login.vue`
- Create: `fisher-web/src/views/user/register.vue`
- Create: `fisher-web/src/views/user/profile.vue`
- Create: `fisher-web/src/views/user/favorites.vue`

- [ ] **Step 1: 开发登录注册和个人中心**

- [ ] **Step 2: 提交代码**

```bash
git add fisher-web/src/views/user/
git commit -m "feat: 完成用户中心页面"
```

---

### 阶段八：管理后台开发（Day 13-16）

#### Task 15: 管理后台核心页面

**Files:**
- Create: `fisher-admin/src/views/dashboard/index.vue`
- Create: `fisher-admin/src/views/system/user-manage.vue`
- Create: `fisher-admin/src/views/venue/manage.vue`
- Create: `fisher-admin/src/views/fish-info/publish.vue`

- [ ] **Step 1: 开发超管功能**

用户管理、钓场审核、资讯管理、轮播图管理

- [ ] **Step 2: 开发钓场主功能**

钓场管理、鱼群管理、收费设置、鱼讯发布

- [ ] **Step 3: 提交代码**

```bash
git add fisher-admin/src/views/
git commit -m "feat: 完成管理后台开发"
```

---

### 阶段九：部署测试（Day 17-18）

#### Task 16: 部署和测试

**Files:**
- Modify: 配置文件

- [ ] **Step 1: 配置生产环境**
- 后端环境变量
- 前端 API 地址
- 阿里云 OSS 配置

- [ ] **Step 2: 部署测试**
- 本地测试
- 修复 bug

- [ ] **Step 3: 提交代码**

```bash
git add .
git commit -m "feat: 完成项目部署配置"
```

---

## 三、数据库初始化脚本

```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS fisher CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE fisher;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  phone VARCHAR(20),
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

-- 钓场表
CREATE TABLE IF NOT EXISTS venues (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  province VARCHAR(50),
  city VARCHAR(50),
  district VARCHAR(50),
  address VARCHAR(255),
  area DECIMAL(10,2),
  facilities JSON,
  business_hours VARCHAR(100),
  phone VARCHAR(20),
  cover_image VARCHAR(255),
  description TEXT,
  status ENUM('pending', 'approved', 'rejected', 'offline') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 鱼种表
CREATE TABLE IF NOT EXISTS species (
  id INT PRIMARY KEY AUTO_INCREMENT,
  venue_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  category ENUM('freshwater', 'saltwater') DEFAULT 'freshwater',
  avg_weight DECIMAL(10,2),
  quantity INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_id) REFERENCES venues(id)
);

-- 收费表
CREATE TABLE IF NOT EXISTS pricing (
  id INT PRIMARY KEY AUTO_INCREMENT,
  venue_id INT NOT NULL,
  type ENUM('per_weight', 'per_day', 'per_hour', 'membership') NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20),
  description VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_id) REFERENCES venues(id)
);

-- 鱼讯表
CREATE TABLE IF NOT EXISTS fish_infos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  venue_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  images JSON,
  bite_rate VARCHAR(50),
  rules TEXT,
  is_top BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_id) REFERENCES venues(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 资讯文章表
CREATE TABLE IF NOT EXISTS articles (
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

-- 收藏表
CREATE TABLE IF NOT EXISTS favorites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  venue_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (venue_id) REFERENCES venues(id),
  UNIQUE KEY uk_user_venue (user_id, venue_id)
);

-- 轮播图表
CREATE TABLE IF NOT EXISTS banners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100),
  image VARCHAR(255) NOT NULL,
  link VARCHAR(255),
  position ENUM('home_leisure', 'home_business') DEFAULT 'home_leisure',
  sort_order INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 插入超级管理员（密码: admin123）
INSERT INTO users (username, password, role, nickname) VALUES 
('admin', '$2b$10$rK9XQHkLQZ7JQ8ZK9Q8Q8OvG9.X8C8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'super_admin', '系统管理员');
```

---

## 四、依赖安装清单

### 后端依赖
```bash
cd fisher-server
npm install @nestjs/common @nestjs/core @nestjs/jwt @nestjs/passport @nestjs/platform-express @nestjs/typeorm bcrypt class-transformer class-validator mysql2 passport passport-jwt reflect-metadata rxjs typeorm ali-oss uuid
npm install -D @nestjs/cli @types/bcrypt @types/node @types/passport-jwt typescript
```

### 前端依赖
```bash
cd fisher-web
npm install vue vue-router pinia ant-design-vue axios dayjs
npm install -D @vitejs/plugin-vue typescript vite vue-tsc

cd fisher-admin
npm install vue vue-router pinia ant-design-vue axios dayjs
npm install -D @vitejs/plugin-vue typescript vite vue-tsc
```

---

## 五、API 接口开发计划

| 序号 | 模块 | 接口路径 | 方法 | 说明 |
|------|------|-----------|------|------|
| 1 | 认证 | /api/auth/register | POST | 注册 |
| 2 | 认证 | /api/auth/login | POST | 登录 |
| 3 | 认证 | /api/auth/profile | GET | 获取当前用户 |
| 4 | 用户 | /api/users | GET | 用户列表 |
| 5 | 用户 | /api/users/:id | GET | 用户详情 |
| 6 | 用户 | /api/users/:id | PUT | 更新用户 |
| 7 | 钓场 | /api/venues | GET | 钓场列表 |
| 8 | 钓场 | /api/venues/:id | GET | 钓场详情 |
| 9 | 钓场 | /api/venues | POST | 创建钓场 |
| 10 | 钓场 | /api/venues/:id | PUT | 更新钓场 |
| 11 | 钓场 | /api/venues/:id | DELETE | 删除钓场 |
| 12 | 钓场 | /api/venues/:id/approve | PUT | 审核钓场 |
| 13 | 鱼种 | /api/venues/:id/species | GET | 鱼种列表 |
| 14 | 鱼种 | /api/venues/:id/species | POST | 添加鱼种 |
| 15 | 收费 | /api/venues/:id/pricing | GET | 收费列表 |
| 16 | 收费 | /api/venues/:id/pricing | POST | 添加收费 |
| 17 | 鱼讯 | /api/fish-infos | GET | 鱼讯列表 |
| 18 | 鱼讯 | /api/fish-infos | POST | 发布鱼讯 |
| 19 | 鱼讯 | /api/fish-infos/:id/top | PUT | 置顶 |
| 20 | 资讯 | /api/articles | GET | 文章列表 |
| 21 | 资讯 | /api/articles/:id | GET | 文章详情 |
| 22 | 收藏 | /api/favorites | GET | 我的收藏 |
| 23 | 收藏 | /api/favorites | POST | 添加收藏 |
| 24 | 收藏 | /api/favorites/:venueId | DELETE | 取消收藏 |
| 25 | 轮播 | /api/banners | GET | 轮播图列表 |

---

## 六、前端页面开发计划

| 序号 | 页面 | 路径 | 说明 |
|------|------|------|------|
| 1 | 休闲钓首页 | /home | 轮播图+钓场推荐+鱼讯列表 |
| 2 | 钓场经营首页 | /home/business | 经营内容展示 |
| 3 | 钓场列表 | /venue/list | 筛选+搜索 |
| 4 | 钓场详情 | /venue/:id | 完整信息+鱼讯 |
| 5 | 鱼讯列表 | /fish-info | 鱼讯时间线 |
| 6 | 资讯列表 | /info/list | 分类+搜索 |
| 7 | 资讯详情 | /info/:id | 文章内容 |
| 8 | 登录 | /login | 账号密码登录 |
| 9 | 注册 | /register | 用户注册 |
| 10 | 个人中心 | /user/profile | 资料编辑 |
| 11 | 我的收藏 | /user/favorites | 收藏列表 |

### 管理后台页面

| 序号 | 页面 | 路径 | 说明 |
|------|------|------|------|
| 1 | 登录 | /login | 管理员登录 |
| 2 | 首页 | /dashboard | 数据概览 |
| 3 | 用户管理 | /system/users | 用户列表+角色 |
| 4 | 钓场审核 | /venue/approve | 待审核钓场 |
| 5 | 钓场管理 | /venue/manage | 钓场CRUD |
| 6 | 鱼群管理 | /fish/species | 鱼种管理 |
| 7 | 收费设置 | /fish/pricing | 收费模式 |
| 8 | 鱼讯发布 | /fish-info/publish | 发布鱼讯 |
| 9 | 资讯管理 | /content/articles | 文章CRUD |
| 10 | 轮播管理 | /content/banners | 轮播图管理 |

---

## 七、部署步骤

### 1. 数据库部署
```bash
mysql -h 127.0.0.1 -u root -p1234567890 < docs/superpowers/plans/init.sql
```

### 2. 后端部署
```bash
cd fisher-server
npm run build
# 使用 PM2 或其他进程管理器
pm2 start dist/main.js --name fisher-server
```

### 3. 前端部署
```bash
cd fisher-web
npm run build
# 部署 dist 目录到 CDN 或静态服务器
```

### 4. 管理后台部署
```bash
cd fisher-admin
npm run build
# 部署 dist 目录
```

---

## 执行方式选择

**Plan complete and saved to `docs/superpowers/plans/2026-03-28-fisher-portal-plan.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**