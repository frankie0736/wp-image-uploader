#!/bin/bash

# WordPress图片上传工具 - 容器部署脚本
# 支持环境变量配置

echo "==================================="
echo "WordPress图片上传工具 - 容器部署"
echo "==================================="

# 检查.env文件
if [ ! -f ".env" ]; then
    echo "🔧 未找到.env配置文件，正在创建..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ 已创建.env文件，请编辑配置后重新运行"
        echo ""
        echo "📝 需要配置的重要项目："
        echo "   - DATABASE_URL: Neon数据库连接字符串"
        echo "   - WP_AUTH_TOKEN: API访问授权token"
        echo ""
        echo "🚀 配置完成后请重新运行: ./start.sh"
        exit 0
    else
        echo "❌ 缺少.env.example文件，无法创建配置文件"
        exit 1
    fi
fi

# 加载环境变量
set -a
source .env
set +a

# 检查必要的环境变量
if [ -z "$DATABASE_URL" ] || [ "$DATABASE_URL" = "postgresql://username:password@hostname:5432/database?sslmode=require" ]; then
    echo "❌ 请先配置DATABASE_URL环境变量"
    echo "📝 编辑.env文件，设置正确的Neon数据库连接字符串"
    exit 1
fi

# 获取端口配置
if [ -z "$HOST_PORT" ]; then
    read -p "请输入要使用的端口号 (默认: ${PORT:-3001}): " input_port
    HOST_PORT=${input_port:-${PORT:-3001}}
fi

echo ""
echo "📋 配置信息:"
echo "   - 端口: $HOST_PORT"
echo "   - 镜像: frankie0736/wp-image-uploader:latest"
echo "   - 容器名称: wp-image-uploader"
echo "   - 授权Token: ${WP_AUTH_TOKEN:0:20}..."
echo "   - 数据库: ${DATABASE_URL:0:30}..."
echo ""

read -p "是否继续部署? (y/N): " confirm
if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
    echo "取消部署"
    exit 0
fi

echo ""
echo "🚀 开始部署..."

# 停止现有容器
echo "🛑 停止现有容器..."
docker stop wp-image-uploader 2>/dev/null || true
docker rm wp-image-uploader 2>/dev/null || true

# 生成临时配置文件
echo "📝 生成配置文件..."
export HOST_PORT
envsubst < docker-compose.yml > docker-compose.tmp.yml

# 拉取最新镜像
echo "📥 拉取最新镜像..."
docker pull frankie0736/wp-image-uploader:latest

# 启动服务
echo "🚀 启动服务..."
docker-compose -f docker-compose.tmp.yml up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 5

# 检查服务状态
if docker ps | grep -q "wp-image-uploader"; then
    echo ""
    echo "✅ 部署成功!"
    echo ""
    echo "📍 访问信息:"
    echo "   - 本地访问: http://localhost:$HOST_PORT"
    
    # 获取外网IP
    external_ip=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || echo "无法获取")
    if [ "$external_ip" != "无法获取" ]; then
        echo "   - 外网访问: http://$external_ip:$HOST_PORT"
    fi
    
    echo ""
    echo "🔗 API接口:"
    echo "   - 域名验证: GET /api/check-domain?domain=your-domain.com"
    echo "   - 添加域名: POST /api/add-domain"
    echo "   - 域名列表: GET /api/domains?token=$WP_AUTH_TOKEN"
    echo ""
    echo "📖 查看日志: docker logs -f wp-image-uploader"
    echo "🛑 停止服务: docker stop wp-image-uploader"
    echo "🗑️  删除容器: docker rm wp-image-uploader"
    
    # 清理临时文件
    rm -f docker-compose.tmp.yml
else
    echo ""
    echo "❌ 部署失败，请检查日志:"
    echo "docker logs wp-image-uploader"
    
    # 清理临时文件
    rm -f docker-compose.tmp.yml
    exit 1
fi 