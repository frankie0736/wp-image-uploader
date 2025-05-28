# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装所有依赖（包括开发依赖）
RUN npm ci

# 复制源代码
COPY . .

# 构建前端应用
RUN npm run build

# 生产阶段
FROM node:18-alpine AS production

WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 只安装生产依赖
RUN npm ci --only=production && npm cache clean --force

# 重新安装Sharp以确保架构匹配
RUN npm rebuild sharp

# 从构建阶段复制构建产物
COPY --from=builder /app/dist ./dist

# 复制服务器代码
COPY server ./server

# 创建uploads目录
RUN mkdir -p uploads

# 安装curl用于健康检查
RUN apk add --no-cache curl

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/domains?token=wp-img-auth-2024-fx-token-9k8j7h6g5f4d3s2a1z || exit 1

# 启动命令
CMD ["node", "--experimental-modules", "server/index.js"] 