import express from 'express';
import sharp from 'sharp';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkDomainStatus } from './services/domainService.js';
import { initializeDatabase, addDomainToWhitelist, getAllDomains } from './services/database.js';

dotenv.config();

const app = express();
const upload = multer({
  limits: {
    fileSize: 12 * 1024 * 1024 // 12MB 的文件大小限制
  }
});

// API Token for domain management
const API_TOKEN = 'wp-img-auth-2024-fx-token-9k8j7h6g5f4d3s2a1z';

app.use(cors());
app.use(express.json());

// 初始化数据库
await initializeDatabase();

// 验证域名的接口
app.post('/validate-domain', async (req, res) => {
  try {
    const { domain } = req.body;
    
    // 从域名中提取主域名
    let hostname = domain;
    try {
      hostname = new URL(domain).hostname;
    } catch {
      // 如果不是完整URL，就使用原始输入
    }
    
    // 检查域名状态
    const result = await checkDomainStatus(hostname);
    res.json(result);
  } catch {
    res.status(400).json({
      allowed: false,
      message: 'Invalid domain format'
    });
  }
});

// API接口：添加域名到白名单
app.post('/api/add-domain', async (req, res) => {
  try {
    const { token, domain } = req.body;
    
    // 验证token
    if (token !== API_TOKEN) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API token'
      });
    }
    
    if (!domain) {
      return res.status(400).json({
        success: false,
        message: '域名不能为空'
      });
    }
    
    const result = await addDomainToWhitelist(domain);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误: ' + error.message
    });
  }
});

// API接口：获取所有域名列表
app.get('/api/domains', async (req, res) => {
  try {
    const { token } = req.query;
    
    // 验证token
    if (token !== API_TOKEN) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API token'
      });
    }
    
    const result = await getAllDomains();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误: ' + error.message
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
  console.log(`API Token: ${API_TOKEN}`);
});