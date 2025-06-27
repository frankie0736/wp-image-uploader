import axios from 'axios'

export const generateImageDescription = async (base64Image, config) => {
  try {
    const apiUrl = config.openaiUrl || 'https://aihubmix.com/v1'
    console.log('向此地址发送请求（AIHubMix接口）：', apiUrl)

    const response = await axios.post(
      `${apiUrl}/chat/completions`,
      {
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please describe this image and return in strict JSON format with three fields, please take the original file name into first consideration if it's not just random or meaningless texts: 1. title (short title), 2. alt (alternative text), 3. filename (lowercase letters and hyphens only). Return only the JSON object without any markdown formatting or code blocks."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${config.openaiKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    let result
    try {
      const content = response.data.choices[0].message.content.trim()
        .replace(/^```json\n/, '')
        .replace(/\n```$/, '')
        .trim()

      console.log('OpenAI 响应内容(清理后):', content)
      result = JSON.parse(content)
    } catch (parseError) {
      console.error('JSON 解析失败:', parseError)
      console.log('尝试解析的内容:', response.data.choices[0].message.content)
      
      const jsonMatch = response.data.choices[0].message.content.match(/{[\s\S]*?}/)
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[0])
        } catch (e) {
          result = {
            title: 'Untitled Image',
            alt: response.data.choices[0].message.content.slice(0, 100),
            filename: 'untitled-image'
          }
        }
      } else {
        result = {
          title: 'Untitled Image',
          alt: response.data.choices[0].message.content.slice(0, 100),
          filename: 'untitled-image'
        }
      }
    }

    const cleanResult = {
      title: result.title || 'Untitled Image',
      alt: result.alt || 'No description available',
      filename: (result.filename || result.title || 'untitled-image')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }

    return cleanResult
  } catch (error) {
    console.error('AIHubMix 请求失败:', error)
    throw new Error('AI 描述生成失败: ' + error.message)
  }
} 