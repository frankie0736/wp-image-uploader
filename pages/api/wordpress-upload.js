import axios from 'axios'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { wpUrl, wpUsername, wpPassword, imageData, metadata } = req.body

    if (!wpUrl || !wpUsername || !wpPassword || !imageData || !metadata) {
      return res.status(400).json({ 
        success: false, 
        message: '缺少必要参数' 
      })
    }

    // Convert base64 to buffer
    const base64Data = imageData.base64.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')
    
    // Create blob from buffer
    const blob = new Blob([buffer], { type: imageData.mimeType })
    
    // Create FormData
    const formData = new FormData()
    const fileExtension = imageData.originalName.split('.').pop()
    const fileName = `${metadata.filename}.${fileExtension}`
    
    formData.append('file', blob, fileName)

    const baseUrl = wpUrl.replace(/\/$/, '')
    
    // Upload image to WordPress
    console.log('开始上传图片到 WordPress...')
    const uploadResponse = await axios.post(
      `${baseUrl}/wp-json/wp/v2/media`,
      formData,
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(wpUsername + ':' + wpPassword).toString('base64'),
          'Content-Type': 'multipart/form-data'
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      }
    )

    console.log('图片上传成功，开始更新元数据...')
    
    // Update metadata
    const updateResponse = await axios.post(
      `${baseUrl}/wp-json/wp/v2/media/${uploadResponse.data.id}`,
      {
        title: metadata.title,
        alt_text: metadata.alt
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(wpUsername + ':' + wpPassword).toString('base64')
        }
      }
    )

    console.log('元数据更新成功')
    
    res.status(200).json({
      success: true,
      data: uploadResponse.data
    })
  } catch (error) {
    console.error('WordPress 上传错误:', error.response?.data || error.message)
    
    const errorMessage = error.response?.data?.message || error.message || '上传失败'
    const statusCode = error.response?.status || 500
    
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      details: error.response?.data
    })
  }
}