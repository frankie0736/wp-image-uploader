FROM node:18-alpine

WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制所有文件
COPY . .

# 构建前端应用
RUN npm run build

# 创建uploads目录
RUN mkdir -p uploads

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/domains?token=wp-img-auth-2024-fx-token-9k8j7h6g5f4d3s2a1z || exit 1

# 启动命令
CMD ["node", "--experimental-modules", "server/index.js"] 