import { useState } from 'react'
import { Upload, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import useConfigStore from '../store/configStore'
import { generateImageDescription } from '../services/openai'
import { uploadToWordPress } from '../services/wordpress'

const { Dragger } = Upload

const ImageUploader = () => {
  const [uploading, setUploading] = useState(false)
  const [uploadedCount, setUploadedCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const config = useConfigStore()

  const handleUpload = async (file) => {
    try {
      // 确保配置完整
      if (!config.wpUrl || !config.wpUsername || !config.wpPassword) {
        throw new Error('请先完成 WordPress 配置')
      }

      console.log('开始上传图片:', file.name);

      // 将文件转换为 base64
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result.split(',')[1])
      })

      // 生成图片描述
      console.log('开始生成图片描述...');
      const metadata = await generateImageDescription(base64, config)
      console.log('生成的元数据:', metadata);
      
      // 上传到 WordPress
      console.log('开始上传到 WordPress...');
      const result = await uploadToWordPress(file, metadata, config)
      console.log('WordPress 上传结果:', result);
      
      setUploadedCount(prev => prev + 1)
      message.success(`${file.name} 上传成功！`)
      return result
    } catch (error) {
      console.error('上传错误详情:', error);
      message.error(`${file.name} ${error.message || '上传失败'}`)
      throw error
    }
  }

  const uploadProps = {
    name: 'file',
    multiple: true,
    accept: 'image/*',
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        setUploading(true)
        if (Array.isArray(file)) {
          // 多文件上传
          setTotalCount(file.length)
          setUploadedCount(0)
          for (const f of file) {
            await handleUpload(f)
          }
          message.success('所有图片上传完成！')
        } else {
          // 单文件上传
          setTotalCount(1)
          setUploadedCount(0)
          await handleUpload(file)
        }
        onSuccess()
      } catch (error) {
        onError(error)
      } finally {
        setUploading(false)
        setUploadedCount(0)
        setTotalCount(0)
      }
    }
  }

  return (
    <Dragger {...uploadProps} disabled={uploading}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        {uploading 
          ? `正在上传... (${uploadedCount}/${totalCount})`
          : '点击或拖拽图片到此区域上传'
        }
      </p>
      <p className="ant-upload-hint">
        支持单个或多个图片上传
      </p>
    </Dragger>
  )
}

export default ImageUploader