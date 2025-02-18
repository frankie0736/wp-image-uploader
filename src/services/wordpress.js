import axios from 'axios'

export async function uploadToWordPress(imageFile, metadata, config) {
  try {
    // 检查 config 是否包含必要的信息
    if (!config.wpUrl) {
      throw new Error('WordPress URL 未设置');
    }

    // 创建一个新的 File 对象，使用生成的文件名
    const fileExtension = imageFile.name.split('.').pop();
    const newFile = new File(
      [imageFile], 
      `${metadata.filename}.${fileExtension}`,
      { type: imageFile.type }
    );

    const formData = new FormData();
    formData.append('file', newFile);
    
    const headers = {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Basic ' + btoa(config.wpUsername + ':' + config.wpPassword)
    };

    // 确保 wpUrl 没有尾部斜杠
    const baseUrl = config.wpUrl.replace(/\/$/, '');
    
    console.log('开始上传图片到:', `${baseUrl}/wp-json/wp/v2/media`);
    // 首先上传图片
    const response = await axios.post(
      `${baseUrl}/wp-json/wp/v2/media`,
      formData,
      { headers }
    );

    console.log('图片上传成功，开始更新元数据...');
    
    // 更新 media 元数据
    const updateHeaders = {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(config.wpUsername + ':' + config.wpPassword)
    };

    await axios.post(
      `${baseUrl}/wp-json/wp/v2/media/${response.data.id}`,
      {
        title: metadata.title,
        alt_text: metadata.alt
      },
      { headers: updateHeaders }
    );

    console.log('元数据更新成功');
    return response.data;
  } catch (error) {
    console.error('上传过程出错:', error.response?.data || error);
    throw new Error(error.response?.data?.message || '上传失败');
  }
}