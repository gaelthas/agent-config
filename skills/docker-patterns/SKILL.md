---
name: docker-patterns
description: Docker 容器化最佳实践，包括 Go、Node.js、Vue 的 Dockerfile 模板、多阶段构建、镜像优化和 docker-compose 编排模式。
origin: UCC
---

# Docker 容器化模式

Docker 容器化最佳实践和常用模板，覆盖 Go、Node.js 和 Vue 前端项目。

## 何时激活

- 为项目创建 Dockerfile
- 优化 Docker 镜像大小
- 配置 docker-compose 多服务编排
- 排查容器化相关问题
- 配置生产环境容器部署

## Go 项目 Dockerfile

```dockerfile
# 多阶段构建 - Go 后端
FROM golang:1.22-alpine AS builder

WORKDIR /app

# 先复制依赖文件利用缓存
COPY go.mod go.sum ./
RUN go mod download

# 复制源码并构建
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /app/server ./cmd/server

# 生产镜像 - 使用 scratch 或 distroless
FROM gcr.io/distroless/static-debian12

COPY --from=builder /app/server /server
COPY --from=builder /app/configs /configs

EXPOSE 8080

ENTRYPOINT ["/server"]
```

**要点：**
- 使用 `CGO_ENABLED=0` 生成静态链接二进制
- 使用 `-ldflags="-s -w"` 减小二进制体积
- 生产镜像使用 `distroless` 或 `scratch`（约 10-20MB）
- 先复制 `go.mod/go.sum`，利用 Docker 层缓存

## Node.js 项目 Dockerfile

```dockerfile
# 多阶段构建 - Node.js 后端
FROM node:20-alpine AS builder

WORKDIR /app

# 先复制依赖文件
COPY package.json package-lock.json ./
RUN npm ci --only=production

# 复制源码
COPY . .

# 生产镜像
FROM node:20-alpine

WORKDIR /app

# 非 root 用户运行
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY --from=builder --chown=nodejs:nodejs /app .

USER nodejs

EXPOSE 3000

CMD ["node", "src/index.js"]
```

## Vue 前端 Dockerfile

```dockerfile
# 多阶段构建 - Vue 前端
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# 生产镜像 - Nginx 静态服务
FROM nginx:1.25-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## docker-compose 编排模板

```yaml
# docker-compose.yml
version: "3.8"

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
    depends_on:
      mysql:
        condition: service_healthy
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=${DB_NAME}
      - MYSQL_USER=${DB_USER}
      - MYSQL_PASSWORD=${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./db/init:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  mysql_data:
```

## 镜像优化技巧

| 技巧 | 效果 | 说明 |
|------|------|------|
| 多阶段构建 | 减少 50-90% | 只保留运行时必要文件 |
| Alpine 基础镜像 | 减少 80% | 5MB vs 100MB+ |
| `.dockerignore` | 加速构建 | 排除 node_modules、.git 等 |
| 层缓存优化 | 加速构建 | 依赖文件先于源码复制 |
| 非 root 用户 | 提高安全 | 避免容器内 root 权限 |

## .dockerignore 模板

```
node_modules
.git
.gitignore
*.md
.env
.env.*
dist
coverage
.vscode
.idea
```

## 安全检查清单

- [ ] 使用特定版本标签（避免 `latest`）
- [ ] 非 root 用户运行
- [ ] 不复制密钥文件到镜像
- [ ] 使用 `.dockerignore` 排除敏感文件
- [ ] 定期更新基础镜像
- [ ] 多阶段构建避免泄露源码
