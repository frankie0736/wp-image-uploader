import { useState, useEffect } from 'react';

function Settings() {
  const [compressImages, setCompressImages] = useState(false);
  const [maxImageWidth, setMaxImageWidth] = useState(800);

  return (
    <div className="settings-container">
      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            checked={compressImages}
            onChange={(e) => setCompressImages(e.target.checked)}
          />
          压缩图片
        </label>
      </div>

      <div className="setting-item">
        <label>
          最大图片宽度 (像素):
          <input
            type="number"
            value={maxImageWidth}
            onChange={(e) => setMaxImageWidth(parseInt(e.target.value))}
            min="100"
            max="2000"
            disabled={!compressImages}
          />
        </label>
      </div>
    </div>
  );
}

export default Settings; 