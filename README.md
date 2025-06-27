# WordPress图片智能上传工具

一个基于React + Node.js的WordPress图片上传和压缩工具，支持智能压缩和格式转换。

## ✨ 主要功能

- 🖼️ **智能图片压缩**: 自动压缩图片，减少文件大小
- 🔄 **格式转换**: 支持JPG、PNG、WebP等格式转换
- 📱 **响应式界面**: 现代化的用户界面，支持移动端
- ☁️ **云部署**: 支持Zeabur一键部署

## 🚀 快速开始

### Zeabur 部署

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/YOUR_TEMPLATE_ID)

1. 点击上方按钮一键部署到 Zeabur
2. 在 Zeabur 控制台中设置环境变量：
   - `WP_AUTH_TOKEN`: API访问授权token（必填）
   - `PORT`: 服务端口（默认 3001）
   - `MAX_FILE_SIZE`: 最大上传文件大小（默认 10485760）

### 本地开发

```bash
# 一键启动
./start.sh
```

```bash
# 克隆项目
git clone https://github.com/frankie0736/wp-image-uploader.git
cd wp-image-uploader

# 安装依赖
bun install

# 创建 .env 文件
cp .env.example .env

# 编辑 .env 文件设置环境变量

# 构建前端
bun run build

# 启动服务
bun start
```

启动后访问：`http://localhost:3001`

## 📋 功能特性

- ✅ **智能图片优化**: 自动压缩和格式转换
- ✅ **批量上传处理**: 支持多文件同时上传
- ✅ **AI 图片描述**: 使用 OpenAI 生成图片元数据
- ✅ **WordPress集成**: 无缝对接WordPress网站
- ✅ **云端部署**: 支持 Zeabur 一键部署
- ✅ **响应式设计**: 支持移动端操作

## 🔧 API接口

### 图片上传
```bash
# 上传图片
POST /api/upload
Content-Type: multipart/form-data
- file: 图片文件
- processImage: "true"/"false" (是否处理图片，默认 true)
```

## 🌐 环境变量

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
- Bun 1.0+ 或 Node.js 18+
- bun 或 npm

### 开发启动
```bash
# 安装依赖
bun install

# 启动开发环境
bun run dev     # Next.js 开发服务器
# 或生产环境
bun start
```

### 构建部署
```bash
# 构建前端
bun run build

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
bun run start
```