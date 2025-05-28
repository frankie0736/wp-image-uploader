# WordPress图片智能上传工具

一个基于React + Node.js的WordPress图片上传和压缩工具，支持智能压缩、格式转换和域名白名单管理。

## ✨ 主要功能

- 🖼️ **智能图片压缩**: 自动压缩图片，减少文件大小
- 🔄 **格式转换**: 支持JPG、PNG、WebP等格式转换
- 🌐 **域名白名单**: 基于PostgreSQL的域名授权管理
- 📱 **响应式界面**: 现代化的用户界面，支持移动端
- 🐳 **Docker部署**: 一键部署，开箱即用

## 🚀 快速部署

### 一键启动脚本

```bash
# 克隆项目
git clone https://github.com/frankie0736/wp-image-uploader.git
cd wp-image-uploader

# 运行一键启动脚本
./start.sh
```

脚本会自动：
- 检查Docker环境
- 询问端口配置
- 拉取最新镜像
- 启动服务

### 手动部署

如果您prefer手动配置：

```bash
# 修改docker-compose.yml中的PORT_PLACEHOLDER为您的端口
sed 's/PORT_PLACEHOLDER/3001/g' docker-compose.yml > docker-compose.tmp.yml

# 启动服务
docker-compose -f docker-compose.tmp.yml up -d

# 清理临时文件
rm docker-compose.tmp.yml
```

## 📖 API文档

详细的API文档请查看 [API_DOCS.md](./API_DOCS.md)

### 主要接口

- `GET /api/check-domain?domain=example.com` - 验证域名是否在白名单
- `POST /api/add-domain` - 添加域名到白名单
- `GET /api/domains` - 获取域名列表
- `POST /api/upload` - 上传并处理图片

## 🛠️ 技术栈

- **前端**: React 18 + Vite + Ant Design
- **后端**: Node.js + Express
- **数据库**: PostgreSQL (Neon云数据库)
- **图片处理**: Sharp
- **部署**: Docker + Docker Compose

## 📝 环境要求

- Docker 20.0+
- Docker Compose 2.0+

## 🔧 管理命令

```bash
# 查看日志
docker logs -f wp-image-uploader

# 停止服务
docker stop wp-image-uploader

# 删除容器
docker rm wp-image-uploader

# 更新到最新版本
docker pull frankie0736/wp-image-uploader:latest
docker stop wp-image-uploader && docker rm wp-image-uploader
./start.sh
```

## 📄 许可证

MIT License

```sh
npm run start
```

## Changelog

📅 2025-03-12

- 调整上传文件大小至12M
- 删除部分控制台信息（用不到了的）