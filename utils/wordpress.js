import axios from 'axios'

export async function uploadToWordPress(imageFile, metadata, config) {
  try {
    if (!config.wpUrl) {
      throw new Error('WordPress URL 未设置')
    }

    // Read file as base64
    const reader = new FileReader()
    const base64Promise = new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
    })
    reader.readAsDataURL(imageFile)
    const base64Data = await base64Promise

    console.log('开始上传图片')
    
    // Use our proxy endpoint instead of direct WordPress API call
    const response = await axios.post(
      '/api/wordpress-upload',
      {
        wpUrl: config.wpUrl,
        wpUsername: config.wpUsername,
        wpPassword: config.wpPassword,
        imageData: {
          base64: base64Data,
          originalName: imageFile.name,
          mimeType: imageFile.type
        },
        metadata: metadata
      }
    )

    console.log('上传成功')
    return response.data.data
  } catch (error) {
    console.error('上传过程出错:', error.response?.data || error)
    throw new Error(error.response?.data?.message || '上传失败')
  }
} 