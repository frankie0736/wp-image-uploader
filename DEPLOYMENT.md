# WordPress 图片上传工具 - 部署说明

## Docker Hub 镜像
```
docker pull frankie0736/wp-image-uploader:latest
```

## 快速部署

### 1. 下载配置文件
```bash
# 下载docker-compose配置
curl -O https://raw.githubusercontent.com/frankie0736/wp-image-uploader/main/docker-compose.prod.yml

# 下载环境变量模板
curl -O https://raw.githubusercontent.com/frankie0736/wp-image-uploader/main/.env.example
```

### 2. 配置环境变量
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑端口配置（可选，默认3001）
# vim .env
```

### 3. 创建必要目录
```bash
mkdir -p uploads logs
```

### 4. 启动服务
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 5. 查看日志
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

## 配置说明

### 环境变量
- `NODE_ENV`: 运行环境 (production)
- `PORT`: 容器内部端口 (3001)
- `HOST_PORT`: 宿主机端口 (默认3001，可在.env文件中修改)

### 端口配置示例
```bash
# .env 文件内容
HOST_PORT=8080  # 使用8080端口
# 或者
HOST_PORT=3333  # 使用3333端口
```

### 数据卷
- `./uploads`: 图片上传临时存储目录
- `./logs`: 应用日志目录

### 端口映射
- `${HOST_PORT:-3001}:3001`: 主服务端口（默认3001，可配置）

## API接口

### 域名验证
- **接口**: `POST /validate-domain`
- **用途**: 验证WordPress域名是否有权限使用

### 图片处理
- **接口**: `POST /process-image`
- **用途**: 处理和压缩图片

### 域名管理 (需要API Token)
- **添加域名**: `POST /api/add-domain`
- **查看域名**: `GET /api/domains`
- **Token**: `wp-img-auth-2024-fx-token-9k8j7h6g5f4d3s2a1z`

## 不同端口部署示例

### 使用8080端口
```bash
echo "HOST_PORT=8080" > .env
docker-compose -f docker-compose.prod.yml up -d
# 访问地址: http://localhost:8080
```

### 使用3333端口
```bash
echo "HOST_PORT=3333" > .env
docker-compose -f docker-compose.prod.yml up -d
# 访问地址: http://localhost:3333
```

### 临时指定端口（不创建.env文件）
```bash
HOST_PORT=9000 docker-compose -f docker-compose.prod.yml up -d
# 访问地址: http://localhost:9000
```

## 监控和维护

### 健康检查
容器自带健康检查功能，每30秒检查一次服务状态。

### 查看容器状态
```bash
docker ps | grep wp-image-uploader
```

### 重启服务
```bash
docker-compose -f docker-compose.prod.yml restart
```

### 停止服务
```bash
docker-compose -f docker-compose.prod.yml down
```

### 更新镜像
```bash
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## 反向代理配置 (可选)

### Nginx 配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;  # 根据实际HOST_PORT调整
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Caddy 配置示例
```
your-domain.com {
    reverse_proxy localhost:3001  # 根据实际HOST_PORT调整
}
```

## 故障排除

### 查看容器日志
```bash
docker logs wp-image-uploader
```

### 进入容器调试
```bash
docker exec -it wp-image-uploader sh
```

### 检查端口占用
```bash
# 检查端口是否被占用
netstat -tlnp | grep :3001

# 或者使用ss命令
ss -tlnp | grep :3001
```

### 检查数据库连接
确保Neon数据库连接字符串正确且网络可达。

## 安全建议

1. 使用HTTPS访问
2. 定期更新镜像
3. 限制API Token的访问权限
4. 配置防火墙规则
5. 定期备份数据库
6. 避免使用默认端口（推荐修改HOST_PORT） 