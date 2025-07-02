import axios from 'axios'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { openaiApiKey, openaiUrl, wpUrl, wpUsername, wpPassword } = req.body
  const results = {
    openai: { success: false, message: '' },
    wordpress: { success: false, message: '' }
  }

  // 测试 OpenAI API
  if (openaiApiKey) {
    try {
      console.log('测试 OpenAI API...')
      // 使用用户配置的 API URL，默认为官方地址
      const apiUrl = openaiUrl || 'https://api.openai.com/v1'
      const response = await axios.post(
        `${apiUrl}/chat/completions`,
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Hi' }],
          max_tokens: 5
        },
        {
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      )
      results.openai.success = true
      results.openai.message = 'OpenAI API 密钥有效'
    } catch (error) {
      results.openai.success = false
      if (error.response?.status === 401) {
        results.openai.message = 'OpenAI API 密钥无效'
      } else if (error.response?.status === 429) {
        results.openai.message = 'OpenAI API 配额已用完'
      } else if (error.code === 'ECONNABORTED') {
        results.openai.message = 'OpenAI API 连接超时'
      } else {
        results.openai.message = `OpenAI API 错误: ${error.response?.data?.error?.message || error.message}`
      }
    }
  }

  // 测试 WordPress API
  if (wpUrl && wpUsername && wpPassword) {
    try {
      console.log('测试 WordPress API...')
      const baseUrl = wpUrl.replace(/\/$/, '')
      
      // 尝试获取用户信息来验证凭据
      const response = await axios.get(
        `${baseUrl}/wp-json/wp/v2/users/me`,
        {
          headers: {
            'Authorization': 'Basic ' + Buffer.from(wpUsername + ':' + wpPassword).toString('base64')
          },
          timeout: 10000
        }
      )
      
      // 检查用户是否有上传权限
      if (response.data && response.data.id) {
        results.wordpress.success = true
        results.wordpress.message = `WordPress 连接成功 (用户: ${response.data.name})`
      }
    } catch (error) {
      results.wordpress.success = false
      if (error.response?.status === 401) {
        results.wordpress.message = 'WordPress 用户名或密码错误'
      } else if (error.response?.status === 403) {
        results.wordpress.message = 'WordPress 用户权限不足'
      } else if (error.response?.status === 404) {
        results.wordpress.message = 'WordPress REST API 未启用或 URL 错误'
      } else if (error.code === 'ECONNABORTED') {
        results.wordpress.message = 'WordPress 连接超时'
      } else if (error.code === 'ENOTFOUND') {
        results.wordpress.message = 'WordPress 域名无法解析'
      } else {
        results.wordpress.message = `WordPress 连接错误: ${error.message}`
      }
    }
  }

  // 返回测试结果
  const allSuccess = results.openai.success && results.wordpress.success
  
  res.status(200).json({
    success: allSuccess,
    results: results
  })
}