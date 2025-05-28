#!/bin/bash

# WordPress图片上传工具 - 一键启动脚本
echo "==================================="
echo "WordPress图片上传工具 - 容器部署"
echo "==================================="
echo ""

# 检查Docker和Docker Compose是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: Docker未安装，请先安装Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ 错误: Docker Compose未安装，请先安装Docker Compose"
    exit 1
fi

# 询问端口号
while true; do
    read -p "请输入要使用的端口号 (默认: 3001): " PORT
    PORT=${PORT:-3001}
    
    # 验证端口号格式
    if [[ ! $PORT =~ ^[0-9]+$ ]] || [ $PORT -lt 1 ] || [ $PORT -gt 65535 ]; then
        echo "❌ 请输入有效的端口号 (1-65535)"
        continue
    fi
    
    # 检查端口是否被占用
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "❌ 端口 $PORT 已被占用，请选择其他端口"
        continue
    fi
    
    break
done

echo ""
echo "📋 配置信息:"
echo "   - 端口: $PORT"
echo "   - 镜像: frankie0736/wp-image-uploader:latest"
echo "   - 容器名称: wp-image-uploader"
echo ""

# 询问是否继续
read -p "是否继续部署? (y/N): " CONFIRM
if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    echo "取消部署"
    exit 0
fi

echo ""
echo "🚀 开始部署..."

# 停止并删除已存在的容器
if docker ps -a --format "table {{.Names}}" | grep -q "^wp-image-uploader$"; then
    echo "🛑 停止现有容器..."
    docker stop wp-image-uploader >/dev/null 2>&1
    docker rm wp-image-uploader >/dev/null 2>&1
fi

# 创建临时的docker-compose文件
echo "📝 生成配置文件..."
sed "s/PORT_PLACEHOLDER/$PORT/g" docker-compose.yml > docker-compose.tmp.yml

# 拉取最新镜像
echo "📥 拉取最新镜像..."
docker pull frankie0736/wp-image-uploader:latest

# 启动服务
echo "🚀 启动服务..."
if command -v docker-compose &> /dev/null; then
    docker-compose -f docker-compose.tmp.yml up -d
else
    docker compose -f docker-compose.tmp.yml up -d
fi

# 清理临时文件
rm -f docker-compose.tmp.yml

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 5

# 检查容器状态
if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "wp-image-uploader.*Up"; then
    echo ""
    echo "✅ 部署成功!"
    echo ""
    echo "📍 访问信息:"
    echo "   - 本地访问: http://localhost:$PORT"
    
    # 尝试获取外网IP
    EXTERNAL_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipecho.net/plain 2>/dev/null || echo "获取失败")
    if [ "$EXTERNAL_IP" != "获取失败" ]; then
        echo "   - 外网访问: http://$EXTERNAL_IP:$PORT"
    fi
    
    echo ""
    echo "🔗 API接口:"
    echo "   - 域名验证: GET /api/check-domain?domain=your-domain.com"
    echo "   - 添加域名: POST /api/add-domain"
    echo "   - 域名列表: GET /api/domains?token=wp-img-auth-2024-fx-token-9k8j7h6g5f4d3s2a1z"
    echo ""
    echo "📖 查看日志: docker logs -f wp-image-uploader"
    echo "🛑 停止服务: docker stop wp-image-uploader"
    echo "🗑️  删除容器: docker rm wp-image-uploader"
else
    echo ""
    echo "❌ 部署失败，请检查日志:"
    echo "docker logs wp-image-uploader"
fi 