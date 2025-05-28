import express from 'express';
import sharp from 'sharp';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { checkDomainStatus } from './services/domainService.js';
import { initializeDatabase, addDomainToWhitelist, getAllDomains } from './services/database.js';

dotenv.config();

const app = express();
const upload = multer({
  limits: {
    fileSize: 12 * 1024 * 1024 // 12MB 的文件大小限制
  }
});

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

// 管理员验证接口
app.post('/admin/verify', (req, res) => {
  const { password } = req.body;
  
  if (password === 'wpimg') {
    res.json({
      success: true,
      message: '验证成功'
    });
  } else {
    res.status(401).json({
      success: false,
      message: '密码错误'
    });
  }
});

// 添加域名到白名单
app.post('/admin/add-domain', async (req, res) => {
  try {
    const { domain } = req.body;
    
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

// 获取所有域名列表
app.get('/admin/domains', async (req, res) => {
  try {
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

// 静态文件服务（用于管理页面）
const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use('/admin-panel', express.static(path.join(__dirname, '../admin')));

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`服务运行在端口 ${port}`);
});