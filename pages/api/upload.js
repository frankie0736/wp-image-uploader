import multer from 'multer'
import { processImageInMemory } from '../../utils/imageProcessor'

// 配置 multer 内存存储
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
})

// 禁用 Next.js 默认的 body parser
export const config = {
  api: {
    bodyParser: false,
  },
}

// 包装 multer 为 Promise
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // 运行 multer 中间件
    await runMiddleware(req, res, upload.single('file'))

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '没有上传文件'
      })
    }

    const { processImage: shouldProcess = 'true' } = req.body

    // 处理图片但不保存到磁盘
    const processResult = await processImageInMemory(req.file.buffer, req.file.originalname, {
      processImage: shouldProcess === 'true',
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 80,
      format: 'webp'
    })

    // 将处理后的图片转换为base64返回给前端
    const base64Data = processResult.buffer.toString('base64')
    const mimeType = processResult.processed ? 'image/webp' : req.file.mimetype

    res.json({
      success: true,
      message: '图片处理成功',
      data: {
        originalName: req.file.originalname,
        size: processResult.size,
        mimeType: mimeType,
        base64: base64Data,
        processed: processResult.processed
      }
    })
  } catch (error) {
    console.error('文件上传错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误: ' + error.message
    })
  }
} 