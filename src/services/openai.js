import axios from 'axios'

export const generateImageDescription = async (base64Image, config) => {
    try {
      const response = await axios.post(
        `${config.openaiUrl}/chat/completions`,
        {
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Please describe this image and return in strict JSON format with three fields: 1. title (short title), 2. alt (alternative text), 3. filename (lowercase letters and hyphens only). Example format: {\"title\": \"Pet Licking Mats\", \"alt\": \"Three colorful pet licking mats\", \"filename\": \"pet-licking-mats\"}"
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
  
      console.log('OpenAI raw response:', response.data.choices[0].message.content);
  
      let result;
      try {
        result = JSON.parse(response.data.choices[0].message.content.trim());
      } catch (parseError) {
        console.error('JSON 解析失败:', parseError);
        console.log('尝试解析的内容:', response.data.choices[0].message.content);
        
        // 如果解析失败，尝试从返回的文本中提取有用信息
        const content = response.data.choices[0].message.content;
        const titleMatch = content.match(/["']title["']\s*:\s*["']([^"']+)["']/);
        const altMatch = content.match(/["']alt["']\s*:\s*["']([^"']+)["']/);
        
        result = {
          title: titleMatch ? titleMatch[1] : 'Untitled Image',
          alt: altMatch ? altMatch[1] : content.slice(0, 100),
          filename: titleMatch ? 
            titleMatch[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : 
            'untitled-image'
        };
      }
  
      // 验证和清理结果
      const cleanResult = {
        title: result.title || 'Untitled Image',
        alt: result.alt || 'No description available',
        filename: (result.filename || result.title || 'untitled-image')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      };
  
      console.log('处理后的结果:', cleanResult);
  
      return cleanResult;
    } catch (error) {
      console.error('OpenAI API 错误:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error?.message || 
        error.message || 
        '生成描述失败，请检查 API 配置和网络连接'
      );
    }
  }