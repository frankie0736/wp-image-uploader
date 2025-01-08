import axios from 'axios'

export const generateImageDescription = async (base64Image, config) => {
  try {
    const response = await axios.post(
      `${config.openaiUrl}/v1/chat/completions`,
      {
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "请描述这张图片，并给出合适的alt文本。请用JSON格式返回，包含description和alt两个字段。"
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${config.openaiKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const result = JSON.parse(response.data.choices[0].message.content)
    return result
  } catch (error) {
    throw new Error('生成描述失败：' + error.message)
  }
}