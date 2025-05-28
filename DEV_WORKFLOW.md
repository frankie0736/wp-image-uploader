# WordPress图片上传工具 - 开发工作流程

## 📋 分支结构说明

### 🌟 分支设计理念
- **main分支**：只包含部署文件，用户友好
- **dev分支**：完整源代码，开发友好
- **deploy分支**：本地临时分支，可删除

### 📂 各分支内容

#### **main分支** (GitHub默认分支)
```
├── .gitignore          # 部署用忽略规则
├── README.md           # 用户使用说明
├── docker-compose.yml  # Docker部署模板
└── start.sh           # 一键启动脚本
```

#### **dev分支** (开发分支)
```
├── src/               # React前端源码
├── server/            # Node.js后端源码
├── public/            # 静态资源
├── package.json       # 前端依赖
├── server/package.json # 后端依赖
├── Dockerfile         # Docker构建文件
├── .dockerignore      # Docker忽略文件
├── API_DOCS.md        # API文档
├── DEPLOYMENT.md      # 部署文档
├── .env.example       # 环境变量模板
└── ... (所有源代码文件)
```

## 🚀 日常开发流程

### 1. 开始开发
```bash
# 切换到开发分支
git checkout dev

# 确保是最新代码
git pull origin dev

# 安装依赖（如果需要）
npm install
cd server && npm install && cd ..

# 启动开发服务器
npm start
```

### 2. 进行开发
```bash
# 在dev分支进行所有开发工作
# 修改源代码、添加新功能、修复Bug等

# 提交更改
git add .
git commit -m "feat: 添加新功能"
git push origin dev
```

### 3. 更新Docker镜像（当有重要更新时）
```bash
# 在dev分支构建新镜像
docker build --platform linux/amd64 -t frankie0736/wp-image-uploader:latest .

# 推送到Docker Hub
docker push frankie0736/wp-image-uploader:latest

# 也可以打标签版本
docker tag frankie0736/wp-image-uploader:latest frankie0736/wp-image-uploader:v1.0.3
docker push frankie0736/wp-image-uploader:v1.0.3
```

## 📦 部署文件更新流程

### 场景1：只更新部署脚本或README
```bash
# 在dev分支修改
git checkout dev
# 修改 start.sh, docker-compose.yml, README.md 等

# 提交到dev分支
git add .
git commit -m "update: 优化部署脚本"
git push origin dev

# 同步到main分支
git checkout main
git checkout dev -- start.sh docker-compose.yml README.md .gitignore
git add .
git commit -m "sync: 同步部署文件更新"
git push origin main
```

### 场景2：重大更新需要同步所有部署文件
```bash
# 在dev分支完成所有开发
git checkout dev
git add .
git commit -m "feat: 重大功能更新"
git push origin dev

# 构建并推送新的Docker镜像
docker build --platform linux/amd64 -t frankie0736/wp-image-uploader:latest .
docker push frankie0736/wp-image-uploader:latest

# 同步部署文件到main分支
git checkout main
git checkout dev -- start.sh docker-compose.yml README.md .gitignore
git add .
git commit -m "release: v1.x.x - 同步重大更新"
git push origin main
```

## 🔧 分支管理命令

### 查看分支状态
```bash
# 查看所有分支
git branch -a

# 查看当前分支
git branch

# 查看分支差异
git diff main dev
```

### 分支切换
```bash
# 切换到开发分支
git checkout dev

# 切换到部署分支
git checkout main
```

### 清理本地分支（可选）
```bash
# 删除不需要的本地分支
git branch -d deploy
git branch -d docker-deploy
git branch -d migrate-to-neon-db
```

## 🚨 重要注意事项

### ❌ 不要做的事情
1. **不要直接在main分支开发**
2. **不要把源代码推送到main分支**
3. **不要删除dev分支**
4. **不要强制推送覆盖远程分支** (除非确定要这么做)

### ✅ 正确的做法
1. **所有开发都在dev分支进行**
2. **main分支只更新部署相关文件**
3. **定期备份重要代码**
4. **更新Docker镜像后测试部署**

## 📝 常用Git命令速查

```bash
# 基础操作
git status                    # 查看状态
git add .                     # 添加所有更改
git commit -m "message"       # 提交更改
git push origin <branch>      # 推送分支

# 分支操作
git checkout <branch>         # 切换分支
git checkout -b <new-branch>  # 创建并切换分支
git merge <branch>            # 合并分支
git branch -d <branch>        # 删除分支

# 文件操作
git checkout <branch> -- <file>  # 从其他分支复制文件
git rm <file>                    # 删除文件
git mv <old> <new>               # 重命名文件

# 查看历史
git log --oneline             # 查看提交历史
git diff <branch1> <branch2>  # 比较分支差异
```

## 🛠️ 开发环境设置

### 本地开发
```bash
# 前端开发服务器
npm run dev          # 端口: 5173

# 后端开发服务器  
npm run server       # 端口: 3001

# 同时启动前后端
npm start
```

### Docker开发
```bash
# 构建开发镜像
docker build -t wp-image-uploader-dev .

# 运行开发容器
docker run -p 3001:3001 wp-image-uploader-dev
```

## 📞 问题处理

### 如果忘记当前在哪个分支
```bash
git branch                    # 查看当前分支（带*号的）
pwd                          # 查看当前目录
ls -la                       # 查看文件列表判断是否有源代码
```

### 如果不小心在错误分支提交了代码
```bash
# 如果在main分支误提交了源代码
git checkout main
git reset --soft HEAD~1       # 撤销最后一次提交，保留更改
git stash                     # 暂存更改
git checkout dev              # 切换到dev分支
git stash pop                 # 恢复更改
git add .
git commit -m "正确的提交信息"
git push origin dev
```

### 如果需要紧急修复部署问题
```bash
# 直接在main分支修复部署文件
git checkout main
# 修复 start.sh 或 docker-compose.yml
git add .
git commit -m "hotfix: 紧急修复部署问题"
git push origin main

# 然后同步到dev分支
git checkout dev
git checkout main -- start.sh docker-compose.yml
git add .
git commit -m "sync: 同步紧急修复"
git push origin dev
```

---

## 📋 检查清单

每次发布前请检查：

- [ ] dev分支代码已提交并推送
- [ ] Docker镜像已构建并推送到Docker Hub
- [ ] 部署文件已同步到main分支
- [ ] README.md内容是最新的
- [ ] start.sh脚本可以正常运行
- [ ] 在测试环境验证过部署流程

---

**记住：开发用dev，部署用main！** 