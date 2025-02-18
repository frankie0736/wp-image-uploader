const PROCESSOR_URL = import.meta.env.VITE_IMAGE_PROCESSOR_URL || 'http://localhost:3001';

export async function processImage(file, maxWidth, shouldCompress) {
  if (!shouldCompress) {
    return file;
  }

  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('maxWidth', maxWidth.toString());
    formData.append('shouldCompress', shouldCompress.toString());

    const response = await fetch(`${PROCESSOR_URL}/process-image`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('图片处理失败');
    }

    const processedBlob = await response.blob();
    return new File(
      [processedBlob],
      file.name.replace(/\.[^/.]+$/, '.webp'),
      { type: 'image/webp' }
    );
  } catch (error) {
    console.error('图片处理错误:', error);
    throw error;
  }
} 