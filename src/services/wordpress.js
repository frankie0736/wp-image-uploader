import axios from 'axios'

export const uploadToWordPress = async (file, metadata, config) => {
  try {
    // 创建一个新的 File 对象，使用生成的文件名
    const fileExtension = file.name.split('.').pop()
    const newFile = new File(
      [file], 
      `${metadata.filename}.${fileExtension}`,
      { type: file.type }
    )

    const formData = new FormData()
    formData.append('file', newFile)
    
    const headers = {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Basic ' + btoa(config.wpUsername + ':' + config.wpPassword)
    }

    console.log('开始上传图片...')
    // 首先上传图片
    const response = await axios.post(
      `${config.wpUrl}/wp-json/wp/v2/media`,
      formData,
      { headers }
    )

    console.log('图片上传成功，开始更新元数据...')
    
    // 更新 media 元数据
    const updateHeaders = {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(config.wpUsername + ':' + config.wpPassword)
    }

    await axios.post(
      `${config.wpUrl}/wp-json/wp/v2/media/${response.data.id}`,
      {
        title: metadata.title,
        alt_text: metadata.alt
      },
      { headers: updateHeaders }
    )

    console.log('元数据更新成功')
    return response.data
  } catch (error) {
    console.error('上传过程出错:', error.response?.data || error)
    throw new Error(error.response?.data?.message || '上传失败')
  }
}