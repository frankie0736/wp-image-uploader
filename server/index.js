import express from 'express';
import sharp from 'sharp';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import { allowedDomains } from './config/whitelist.js';

dotenv.config();

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

// 验证域名的接口
app.post('/validate-domain', (req, res) => {
  try {
    const { domain } = req.body;
    
    // 从域名中提取主域名
    let hostname = domain;
    try {
      hostname = new URL(domain).hostname;
    } catch {
      // 如果不是完整URL，就使用原始输入
    }
    
    // 移除可能的 www. 前缀
    hostname = hostname.replace(/^www\./i, '');
    
    const isAllowed = allowedDomains.includes(hostname);
    
    res.json({
      allowed: isAllowed,
      message: isAllowed ? 'Domain is authorized' : 'Unauthorized domain'
    });
  } catch {
    res.status(400).json({
      allowed: false,
      message: 'Invalid domain format'
    });
  }
});

// 图片处理接口
app.post('/process-image', upload.single('image'), async (req, res) => {
  try {
    const maxWidth = parseInt(req.body.maxWidth);
    const shouldCompress = req.body.shouldCompress === 'true';
    
    if (!shouldCompress) {
      return res.send(req.file.buffer);
    }

    const metadata = await sharp(req.file.buffer).metadata();

    let width = metadata.width;
    let height = metadata.height;
    
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    const processedBuffer = await sharp(req.file.buffer)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toBuffer();

    res.type('image/webp').send(processedBuffer);
  } catch (error) {
    console.error('图片处理错误:', error);
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`服务运行在端口 ${port}`);
}); 