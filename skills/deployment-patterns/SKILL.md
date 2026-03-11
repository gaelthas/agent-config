---
name: deployment-patterns
description: 部署策略和模式，包括蓝绿部署、滚动更新、Nginx 配置、环境变量管理和健康检查。
origin: UCC
---

# 部署模式

部署策略、运维最佳实践和常用配置模板。

## 何时激活

- 配置生产环境部署
- 选择部署策略
- 配置 Nginx 反向代理
- 设计健康检查和监控
- 管理环境变量和密钥

## 部署策略对比

| 策略 | 停机时间 | 风险 | 回滚速度 | 适用场景 |
|------|----------|------|----------|----------|
| **直接替换** | 有 | 高 | 慢 | 开发/测试环境 |
| **滚动更新** | 无 | 中 | 中 | 无状态服务 |
| **蓝绿部署** | 无 | 低 | 快（秒级） | 关键业务系统 |
| **金丝雀发布** | 无 | 最低 | 快 | 大规模用户系统 |

## Nginx 反向代理配置

### 基础配置

```nginx
upstream backend {
    server 127.0.0.1:8080;
    keepalive 32;
}

server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate     /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # 前端静态文件
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;

        # 缓存策略
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }

    # API 反向代理
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 超时设置
        proxy_connect_timeout 10s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # 健康检查端点
    location /health {
        proxy_pass http://backend/health;
        access_log off;
    }
}
```

## 环境变量管理

### 分层策略

```
.env                  # 默认值（提交到 Git）
.env.development      # 开发环境（提交到 Git）
.env.production       # 生产环境模板（提交到 Git，值为占位符）
.env.local            # 本地覆盖（不提交到 Git）
```

### 必须的环境变量

```bash
# 应用
APP_PORT=8080
APP_ENV=production    # development | staging | production
APP_SECRET=           # 应用密钥，不能为空

# 数据库
DB_HOST=localhost
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=

# Redis（如使用）
REDIS_HOST=localhost
REDIS_PORT=6379

# 日志
LOG_LEVEL=info        # debug | info | warn | error
LOG_FORMAT=json       # json | text
```

### 启动时验证

```go
// Go 示例 - 启动时验证必需的环境变量
func validateEnv() error {
    required := []string{"DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME", "APP_SECRET"}
    var missing []string
    for _, key := range required {
        if os.Getenv(key) == "" {
            missing = append(missing, key)
        }
    }
    if len(missing) > 0 {
        return fmt.Errorf("missing required env vars: %s", strings.Join(missing, ", "))
    }
    return nil
}
```

## 健康检查

### HTTP 健康检查端点

```go
// Go 示例
func healthHandler(w http.ResponseWriter, r *http.Request) {
    checks := map[string]string{
        "status": "ok",
        "db":     checkDB(),
        "redis":  checkRedis(),
    }
    json.NewEncoder(w).Encode(checks)
}
```

### 健康检查层级

| 层级 | 端点 | 检查内容 | 用途 |
|------|------|----------|------|
| 存活检查 | `/healthz` | 进程存活 | 容器重启判断 |
| 就绪检查 | `/readyz` | DB + 缓存连接 | 流量切入判断 |
| 详细检查 | `/health` | 全部依赖 | 监控和诊断 |

## 部署检查清单

### 部署前

- [ ] 所有测试通过
- [ ] 数据库迁移脚本已准备
- [ ] 环境变量已配置
- [ ] SSL 证书有效
- [ ] 备份已执行

### 部署中

- [ ] 数据库迁移成功
- [ ] 应用启动正常
- [ ] 健康检查通过
- [ ] 日志无异常

### 部署后

- [ ] 核心功能验证
- [ ] 性能指标正常
- [ ] 监控告警正常
- [ ] 通知相关人员
