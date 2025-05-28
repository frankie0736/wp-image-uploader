#!/bin/bash

# WordPress图片上传工具 - 开发助手脚本

echo "🛠️  WordPress图片上传工具 - 开发助手"
echo "================================="
echo ""

# 显示当前分支
current_branch=$(git branch --show-current)
echo "📍 当前分支: $current_branch"
echo ""

echo "请选择操作:"
echo "1. 切换到开发分支 (dev)"
echo "2. 切换到部署分支 (main)" 
echo "3. 提交开发代码"
echo "4. 同步部署文件到main分支"
echo "5. 构建并推送Docker镜像"
echo "6. 查看分支状态"
echo "7. 启动开发服务器"
echo "8. 查看开发文档"
echo "0. 退出"
echo ""

read -p "请输入选项 (0-8): " choice

case $choice in
    1)
        echo "🔄 切换到开发分支..."
        git checkout dev
        git pull origin dev
        echo "✅ 已切换到dev分支"
        ;;
    2)
        echo "🔄 切换到部署分支..."
        git checkout main
        git pull origin main
        echo "✅ 已切换到main分支"
        ;;
    3)
        if [ "$current_branch" != "dev" ]; then
            echo "❌ 请先切换到dev分支"
            exit 1
        fi
        echo "📝 提交开发代码..."
        git status
        echo ""
        read -p "请输入提交信息: " commit_msg
        git add .
        git commit -m "$commit_msg"
        git push origin dev
        echo "✅ 代码已提交到dev分支"
        ;;
    4)
        echo "🔄 同步部署文件到main分支..."
        current_branch=$(git branch --show-current)
        
        # 确保dev分支是最新的
        git checkout dev
        git pull origin dev
        
        # 切换到main分支并同步文件
        git checkout main
        git pull origin main
        git checkout dev -- start.sh docker-compose.yml README.md .gitignore
        
        git add .
        read -p "请输入提交信息 (默认: sync deployment files): " sync_msg
        sync_msg=${sync_msg:-"sync: 同步部署文件"}
        git commit -m "$sync_msg"
        git push origin main
        
        # 切换回原分支
        git checkout $current_branch
        echo "✅ 部署文件已同步到main分支"
        ;;
    5)
        if [ "$current_branch" != "dev" ]; then
            echo "❌ 请先切换到dev分支"
            exit 1
        fi
        echo "🐳 构建Docker镜像..."
        read -p "请输入版本号 (如: v1.0.3, 留空则只更新latest): " version
        
        docker build --platform linux/amd64 -t frankie0736/wp-image-uploader:latest .
        
        if [ ! -z "$version" ]; then
            docker tag frankie0736/wp-image-uploader:latest frankie0736/wp-image-uploader:$version
            docker push frankie0736/wp-image-uploader:$version
            echo "✅ 已推送版本: $version"
        fi
        
        docker push frankie0736/wp-image-uploader:latest
        echo "✅ Docker镜像已构建并推送"
        ;;
    6)
        echo "📊 分支状态:"
        echo ""
        echo "所有分支:"
        git branch -a
        echo ""
        echo "当前分支详情:"
        git status
        ;;
    7)
        if [ "$current_branch" != "dev" ]; then
            echo "❌ 请先切换到dev分支"
            exit 1
        fi
        echo "🚀 启动开发服务器..."
        npm start
        ;;
    8)
        echo "📖 打开开发文档..."
        if command -v code &> /dev/null; then
            code DEV_WORKFLOW.md
        elif command -v open &> /dev/null; then
            open DEV_WORKFLOW.md
        else
            cat DEV_WORKFLOW.md
        fi
        ;;
    0)
        echo "👋 再见!"
        exit 0
        ;;
    *)
        echo "❌ 无效选项，请重新运行脚本"
        exit 1
        ;;
esac 