import axios from 'axios'
import { processImage } from '../utils/imageProcessor'

export const generateImageDescription = async (base64Image, config) => {
    try {
      const apiUrl = config.openaiUrl || 'https://api.openai.com/v1';
      console.log('OpenAI API 请求地址:', apiUrl);

      const response = await axios.post(
        `${apiUrl}/chat/completions`,
        {
          model: "gpt-4-turbo-preview",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Please describe this image and return in strict JSON format with three fields: 1. title (short title), 2. alt (alternative text), 3. filename (lowercase letters and hyphens only). Return only the JSON object without any markdown formatting or code blocks."
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
  
      console.log('OpenAI 原始响应:', response.data);
  
      let result;
      try {
        // 移除可能的 markdown 代码块标记
        const content = response.data.choices[0].message.content.trim()
          .replace(/^```json\n/, '')  // 移除开头的 ```json
          .replace(/\n```$/, '')      // 移除结尾的 ```
          .trim();

        console.log('清理后的内容:', content);
        result = JSON.parse(content);
      } catch (parseError) {
        console.error('JSON 解析失败:', parseError);
        console.log('尝试解析的内容:', response.data.choices[0].message.content);
        
        // 尝试从内容中提取 JSON
        const jsonMatch = response.data.choices[0].message.content.match(/{[\s\S]*?}/);
        if (jsonMatch) {
          try {
            result = JSON.parse(jsonMatch[0]);
          } catch (e) {
            // 如果还是解析失败，使用默认值
            result = {
              title: 'Untitled Image',
              alt: response.data.choices[0].message.content.slice(0, 100),
              filename: 'untitled-image'
            };
          }
        } else {
          // 没有找到 JSON 结构，使用默认值
          result = {
            title: 'Untitled Image',
            alt: response.data.choices[0].message.content.slice(0, 100),
            filename: 'untitled-image'
          };
        }
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
      console.error('OpenAI API 错误:', error.response?.data || error);
      throw new Error(
        error.response?.data?.error?.message || 
        error.message || 
        'OpenAI API 调用失败'
      );
    }
  }

export async function analyzeImage(imageFile, settings) {
  try {
    // 处理图片
    const processedImage = await processImage(
      imageFile, 
      settings.maxImageWidth, 
      settings.compressImages
    );

    // 构建FormData
    const formData = new FormData();
    formData.append('image', processedImage);
    
    // ... existing code for API call ...
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}