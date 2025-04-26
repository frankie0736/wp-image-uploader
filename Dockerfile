FROM node:18-alpine

WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制所有文件
COPY . .

# 构建前端应用
RUN npm run build

# 暴露端口
EXPOSE 3001

# 启动命令
CMD ["node", "--experimental-modules", "server/index.js"] 