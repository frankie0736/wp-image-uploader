# WordPress图片智能上传工具

一个基于React + Node.js的WordPress图片上传和压缩工具，支持智能压缩和格式转换。

## ✨ 主要功能

- 🖼️ **智能图片压缩**: 自动压缩图片，减少文件大小
- 🔄 **格式转换**: 支持JPG、PNG、WebP等格式转换
- 📱 **响应式界面**: 现代化的用户界面，支持移动端
- ☁️ **云部署**: 支持Zeabur一键部署

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/frankie0736/wp-image-uploader.git
cd wp-image-uploader

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

启动后访问：`http://localhost:3000`

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

### 域名验证
```bash
# 验证域名授权
POST /api/validate-domain
Content-Type: application/json
{
  "domain": "your-domain.com",
  "authToken": "your-auth-token"
}
```

## 🛠️ 本地开发

### 环境要求
- Node.js 18+
- npm 或 yarn

### 开发启动
```bash
# 安装依赖
npm install

# 启动开发环境
npm run dev

# 构建生产版本
npm run build
npm start
```

### Docker部署
```bash
# 使用Docker Compose
docker-compose up --build

# 或构建镜像
docker build -t wp-image-uploader .
```

## 📝 配置说明

### 环境变量

| 变量名 | 描述 | 默认值 | 必需 |
|--------|------|--------|------|
| `WP_AUTH_TOKEN` | API授权token | - | 是 |
| `PORT` | 服务端口 | 3001 | 否 |
| `MAX_FILE_SIZE` | 最大文件大小(字节) | 10485760 (10MB) | 否 |
| `CORS_ORIGIN` | 跨域配置 | * | 否 |

## 🚨 注意事项

1. **安全性**: 请设置强密码的`WP_AUTH_TOKEN`
2. **端口**: 确保部署端口未被占用
3. **文件大小**: 根据需要调整`MAX_FILE_SIZE`限制
4. **CORS**: 生产环境请配置具体的`CORS_ORIGIN`

## 📖 故障排除

### 常见问题

1. **容器启动失败**
   ```bash
   # 查看日志
   docker logs wp-image-uploader
   ```

2. **文件上传失败**
   - 检查文件大小是否超出限制
   - 确认文件格式是否支持

3. **API访问被拒绝**
   - 检查域名是否已授权
   - 确认token是否正确

## 🤝 技术支持

- 项目地址: [GitHub Repository](https://github.com/frankie0736/wp-image-uploader)
- 问题反馈: [Issues](https://github.com/frankie0736/wp-image-uploader/issues)

## 📄 开源协议

MIT License