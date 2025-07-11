import { useState, useCallback } from 'react'
import { Upload, message, Progress } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import useConfigStore from '../store/configStore'
import { generateImageDescription } from '../utils/openai'
import { uploadToWordPress } from '../utils/wordpress'
import pLimit from 'p-limit'

const { Dragger } = Upload
const CONCURRENT_LIMIT = 3

const ImageUploader = () => {
  const [uploading, setUploading] = useState(false)
  const [uploadedCount, setUploadedCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const config = useConfigStore()
  
  const limit = pLimit(CONCURRENT_LIMIT)

  const updateProgress = useCallback((current, total) => {
    setUploadedCount(current)
    setTotalCount(total)
  }, [])

  const handleUpload = async (file) => {
    try {
      if (!config.wpUrl || !config.wpUsername || !config.wpPassword) {
        throw new Error('请先完成 WordPress 配置')
      }

      console.log('开始处理图片:', file.name)

      // 1. 上传文件到 API 进行处理
      const formData = new FormData()
      formData.append('file', file)
      formData.append('processImage', config.compressImages.toString())
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!uploadResponse.ok) {
        throw new Error('图片上传处理失败')
      }
      
      const uploadResult = await uploadResponse.json()
      console.log('图片处理完成')

      // 2. 生成图片描述
      console.log('开始生成图片描述...')
      const metadata = await generateImageDescription(uploadResult.data.base64, config)
      console.log('生成的元数据:', metadata)
      
      // 3. 转换回 File 对象
      const binaryString = atob(uploadResult.data.base64)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const processedFile = new File([bytes], file.name, { 
        type: uploadResult.data.mimeType 
      })
      
      // 4. 上传到 WordPress
      console.log('开始上传到 WordPress...')
      const result = await uploadToWordPress(processedFile, metadata, config)
      
      setUploadedCount(prev => prev + 1)
      message.success(`${file.name} 上传成功！`)
      return result
    } catch (error) {
      console.error('上传错误详情:', error)
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
          const files = file
          updateProgress(0, files.length)
          
          const uploadTasks = files.map((f, index) => 
            limit(async () => {
              await handleUpload(f)
              updateProgress(index + 1, files.length)
            })
          )

          const results = await Promise.allSettled(uploadTasks)
          const failedCount = results.filter(r => r.status === 'rejected').length
          const successCount = results.filter(r => r.status === 'fulfilled').length
          
          if (failedCount > 0) {
            message.warning(`上传完成：${successCount}个成功，${failedCount}个失败`)
          } else {
            message.success('所有图片上传完成！')
          }
        } else {
          updateProgress(0, 1)
          await handleUpload(file)
          updateProgress(1, 1)
        }
        onSuccess()
      } catch (error) {
        onError(error)
      } finally {
        setUploading(false)
        updateProgress(0, 0)
      }
    }
  }

  return (
    <div>
      <Dragger {...uploadProps} disabled={uploading}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          {uploading 
            ? '正在上传...'
            : '点击或拖拽图片到此区域上传'
          }
        </p>
        <p className="ant-upload-hint">
          支持单个或多个图片上传（同时处理最多{CONCURRENT_LIMIT}张）
        </p>
      </Dragger>
      {uploading && totalCount > 0 && (
        <Progress 
          percent={Math.round((uploadedCount / totalCount) * 100)} 
          status="active"
          style={{ marginTop: 16 }}
        />
      )}
    </div>
  )
}

export default ImageUploader 