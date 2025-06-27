FROM oven/bun:1-alpine

# 安装必要的系统依赖
RUN apk add --no-cache libc6-compat

# 设置工作目录
WORKDIR /app

# 复制package.json文件
COPY package.json bun.lockb* ./

# 安装依赖
RUN bun install --frozen-lockfile || bun install

# 复制所有源代码
COPY . .

# 构建 Next.js 应用
RUN bun run build

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建非root用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 修改文件所有权
RUN chown -R nextjs:nodejs /app
USER nextjs

# 启动命令
CMD ["bun", "run", "start"] 