import express from 'express';
import sharp from 'sharp';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const upload = multer();

app.use(cors());

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`图片处理服务运行在端口 ${PORT}`);
}); 