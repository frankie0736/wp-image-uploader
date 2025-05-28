# 域名管理API文档

## API Token
```
wp-img-auth-2024-fx-token-9k8j7h6g5f4d3s2a1z
```

## 接口列表

### 1. 添加域名到白名单

**接口地址:** `POST /api/add-domain`

**请求参数:**
```json
{
  "token": "wp-img-auth-2024-fx-token-9k8j7h6g5f4d3s2a1z",
  "domain": "example.com"
}
```

**注意事项:**
- 支持完整URL格式（如：https://example.com）会自动提取主域名
- 支持直接域名格式（如：example.com）
- 自动去除www前缀
- 重复域名会更新时间戳

**返回示例:**
```json
{
  "success": true,
  "domain": "example.com",
  "message": "域名添加成功"
}
```

**错误返回:**
```json
{
  "success": false,
  "message": "Invalid API token"
}
```

### 2. 获取所有域名列表

**接口地址:** `GET /api/domains?token=YOUR_TOKEN`

**请求参数:**
- token: API密钥（通过query参数传递）

**返回示例:**
```json
{
  "success": true,
  "domains": [
    {
      "domain": "example.com",
      "is_active": 1,
      "update_date": "2024-01-20T10:30:00.000Z"
    }
  ]
}
```

## n8n 使用示例

### 添加域名的HTTP Request节点配置:
- **Method:** POST
- **URL:** `http://your-server:3001/api/add-domain`
- **Headers:** 
  - Content-Type: application/json
- **Body (JSON):**
```json
{
  "token": "wp-img-auth-2024-fx-token-9k8j7h6g5f4d3s2a1z",
  "domain": "{{ $node.webhook.json.domain }}"
}
```

### 获取域名列表的HTTP Request节点配置:
- **Method:** GET
- **URL:** `http://your-server:3001/api/domains?token=wp-img-auth-2024-fx-token-9k8j7h6g5f4d3s2a1z`

## 测试命令

### 使用curl测试添加域名:
```bash
curl -X POST http://localhost:3001/api/add-domain \
  -H "Content-Type: application/json" \
  -d '{
    "token": "wp-img-auth-2024-fx-token-9k8j7h6g5f4d3s2a1z",
    "domain": "test-domain.com"
  }'
```

### 使用curl测试获取域名列表:
```bash
curl "http://localhost:3001/api/domains?token=wp-img-auth-2024-fx-token-9k8j7h6g5f4d3s2a1z"
``` 