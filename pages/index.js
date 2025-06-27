import { useState } from 'react'
import ConfigForm from '../components/ConfigForm'
import ImageUploader from '../components/ImageUploader'
import useConfigStore from '../store/configStore'

export default function Home() {
  const { isConfigured, clearConfig } = useConfigStore()
  const [showSettings, setShowSettings] = useState(!isConfigured)

  const handleSettingsClick = () => {
    setShowSettings(!showSettings)
  }

  const handleLogout = () => {
    clearConfig()
    setShowSettings(true)
  }

  return (
    <div className="layout">
      <main className="main-content">
        <div style={{ maxWidth: 800, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <h1 className="page-title">
              WordPress 图片智能上传工具
            </h1>
            {isConfigured && (
              <div className="button-group">
                <button 
                  className="btn"
                  onClick={handleSettingsClick}
                >
                  <span>⚙️</span>
                  {showSettings ? '返回上传' : '设置'}
                </button>
                <button onClick={handleLogout} className="btn btn-link">
                  清除配置
                </button>
              </div>
            )}
          </div>
          
          {showSettings ? (
            <ConfigForm />
          ) : (
            <ImageUploader />
          )}
        </div>
      </main>
      <footer className="footer">
        © {new Date().getFullYear()} <a href="https://www.210k.cc" target="_blank" rel="noopener noreferrer">210工作室</a> 版权所有
      </footer>
    </div>
  )
} 