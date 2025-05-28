# WordPress图片智能上传工具

一个基于React + Node.js的WordPress图片上传和压缩工具，支持智能压缩、格式转换和域名白名单管理。

## ✨ 主要功能

- 🖼️ **智能图片压缩**: 自动压缩图片，减少文件大小
- 🔄 **格式转换**: 支持JPG、PNG、WebP等格式转换
- 🌐 **域名白名单**: 基于PostgreSQL的域名授权管理
- 📱 **响应式界面**: 现代化的用户界面，支持移动端
- 🐳 **Docker部署**: 一键部署，开箱即用

## 🚀 快速开始

### 1. 下载部署文件

```bash
# 克隆项目或下载部署文件
git clone https://github.com/frankie0736/wp-image-uploader.git
cd wp-image-uploader
```

### 2. 配置环境变量

首次运行时会自动创建`.env`配置文件，需要手动编辑以下关键配置：

```bash
# 编辑配置文件
nano .env
```

**必须配置的项目：**

- `DATABASE_URL`: Neon PostgreSQL数据库连接字符串
- `WP_AUTH_TOKEN`: API访问授权token（可自定义）

**配置示例：**
```env
# 授权Token (建议修改为自己的token)
WP_AUTH_TOKEN=your-custom-auth-token-here

# Neon数据库连接字符串
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require

# 其他配置（可选）
PORT=3001
MAX_FILE_SIZE=10485760
```

### 3. 启动服务

```bash
# 一键启动
./start.sh
```

启动后访问：`http://localhost:3001`

## 📋 功能特性

- ✅ **智能图片优化**: 自动压缩和格式转换
- ✅ **批量上传处理**: 支持多文件同时上传
- ✅ **域名授权管理**: 白名单机制保护API
- ✅ **WordPress集成**: 无缝对接WordPress网站
- ✅ **Docker部署**: 一键容器化部署
- ✅ **响应式设计**: 支持移动端操作

## 🔧 API接口

### 域名管理
```bash
# 检查域名授权状态
GET /api/check-domain?domain=your-domain.com

# 添加授权域名
POST /api/add-domain
{
  "domain": "your-domain.com",
  "token": "your-auth-token"
}

# 获取授权域名列表
GET /api/domains?token=your-auth-token
```

### 图片上传
```bash
# 上传图片
POST /api/upload
Content-Type: multipart/form-data
- file: 图片文件
- domain: 来源域名
```

## 🐳 Docker部署

### 环境要求
- Docker
- Docker Compose

### 配置文件说明

**docker-compose.yml**: Docker编排配置
**start.sh**: 一键启动脚本
**.env**: 环境变量配置（需手动创建）

### 手动Docker部署

```bash
# 拉取镜像
docker pull frankie0736/wp-image-uploader:latest

# 启动容器
docker run -d \
  --name wp-image-uploader \
  -p 3001:3001 \
  -e WP_AUTH_TOKEN=your-token \
  -e DATABASE_URL=your-database-url \
  -v ./uploads:/app/uploads \
  frankie0736/wp-image-uploader:latest
```

## 🛠️ 本地开发

### 环境要求
- Node.js 18+
- npm 或 yarn

### 开发启动
```bash
# 安装依赖
npm install
cd server && npm install

# 启动开发环境
npm run dev     # 前端开发服务器
npm run server  # 后端服务器
# 或同时启动
npm start
```

### 构建部署
```bash
# 构建前端
npm run build

# 构建Docker镜像
docker build -t wp-image-uploader .
```

## 📝 配置说明

### 环境变量

| 变量名 | 描述 | 默认值 | 必需 |
|--------|------|--------|------|
| `WP_AUTH_TOKEN` | API授权token | wp-img-auth-2024-fx-token-9k8j7h6g5f4d3s2a1z | 建议修改 |
| `DATABASE_URL` | PostgreSQL连接字符串 | - | ✅ |
| `PORT` | 服务端口 | 3001 | ❌ |
| `MAX_FILE_SIZE` | 最大文件大小(字节) | 10485760 (10MB) | ❌ |
| `UPLOAD_DIR` | 上传目录 | /app/uploads | ❌ |
| `CORS_ORIGIN` | 跨域配置 | * | ❌ |

### 数据库配置

使用Neon PostgreSQL云数据库：

1. 访问 [Neon Console](https://console.neon.tech)
2. 创建新项目和数据库
3. 复制连接字符串到`.env`文件的`DATABASE_URL`

格式：`postgresql://username:password@hostname:5432/database?sslmode=require`

## 🚨 注意事项

1. **安全性**: 务必修改默认的`WP_AUTH_TOKEN`
2. **数据库**: 必须配置有效的`DATABASE_URL`
3. **端口**: 确保部署端口未被占用
4. **防火墙**: 开放对应端口的外网访问
5. **备份**: 定期备份数据库和上传文件

## 📖 故障排除

### 常见问题

1. **容器启动失败**
   ```bash
   # 查看日志
   docker logs wp-image-uploader
   ```

2. **数据库连接失败**
   - 检查`DATABASE_URL`格式是否正确
   - 确认网络可以访问Neon数据库

3. **文件上传失败**
   - 检查文件大小是否超出限制
   - 确认上传目录权限

4. **API访问被拒绝**
   - 检查域名是否已授权
   - 确认token是否正确

### 重置配置

```bash
# 删除配置文件重新生成
rm .env
./start.sh
```

## 🤝 技术支持

- 项目地址: [GitHub Repository](https://github.com/frankie0736/wp-image-uploader)
- 问题反馈: [Issues](https://github.com/frankie0736/wp-image-uploader/issues)

## 📄 开源协议

MIT License

```sh
npm run start
```