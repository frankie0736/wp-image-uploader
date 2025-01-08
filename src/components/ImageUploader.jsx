import React, { useState } from 'react'
import { Upload, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import useConfigStore from '../store/configStore'
import { generateImageDescription } from '../services/openai'
import { uploadToWordPress } from '../services/wordpress'

const { Dragger } = Upload

const ImageUploader = () => {
  const config = useConfigStore()
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (file) => {
    setUploading(true)
    try {
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result.split(',')[1])
      })
  
      // metadata 现在包含 title, alt 和 filename
      const metadata = await generateImageDescription(base64, config)
      const result = await uploadToWordPress(file, metadata, config)
  
      message.success('上传成功')
      return result
    } catch (error) {
      message.error(error.message)
      return false
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dragger
      multiple
      customRequest={({ file, onSuccess, onError }) => {
        handleUpload(file)
          .then(onSuccess)
          .catch(onError)
      }}
      disabled={uploading}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或拖拽图片到此区域上传</p>
    </Dragger>
  )
}

export default ImageUploader