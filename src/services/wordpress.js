import axios from 'axios'

export const uploadToWordPress = async (file, description, alt, config) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Authorization': 'Basic ' + btoa(config.wpUsername + ':' + config.wpPassword)
  }

  try {
    const response = await axios.post(
      `${config.wpUrl}/wp-json/wp/v2/media`,
      formData,
      { headers }
    )

    // 更新图片描述和 alt 文本
    await axios.post(
      `${config.wpUrl}/wp-json/wp/v2/media/${response.data.id}`,
      {
        description: description,
        alt_text: alt
      },
      { headers }
    )

    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || '上传失败')
  }
}