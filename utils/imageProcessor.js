import sharp from 'sharp'

export async function processImageInMemory(buffer, originalName, options = {}) {
  const {
    processImage = true,
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 80,
    format = 'webp'
  } = options

  try {
    if (!processImage) {
      return {
        buffer,
        size: buffer.length,
        processed: false
      }
    }

    const image = sharp(buffer)
    const metadata = await image.metadata()

    let processedImage = image

    // 调整尺寸
    if (metadata.width > maxWidth || metadata.height > maxHeight) {
      processedImage = processedImage.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
    }

    // 转换格式和压缩
    switch (format.toLowerCase()) {
      case 'webp':
        processedImage = processedImage.webp({ quality })
        break
      case 'jpeg':
      case 'jpg':
        processedImage = processedImage.jpeg({ quality })
        break
      case 'png':
        processedImage = processedImage.png({ quality })
        break
      default:
        processedImage = processedImage.webp({ quality })
    }

    const processedBuffer = await processedImage.toBuffer()

    return {
      buffer: processedBuffer,
      size: processedBuffer.length,
      processed: true
    }
  } catch (error) {
    console.error('图片处理错误:', error)
    throw new Error('图片处理失败: ' + error.message)
  }
} 