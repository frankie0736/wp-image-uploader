import { useState, useEffect } from 'react'
import ConfigForm from '../components/ConfigForm'
import ImageUploader from '../components/ImageUploader'
import useConfigStore from '../store/configStore'

export default function Home() {
  const { isConfigured, clearConfig } = useConfigStore()
  const [showSettings, setShowSettings] = useState(false) // 默认不显示设置
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // 只标记已加载，不自动显示设置
    setIsHydrated(true)
  }, [])

  const handleSettingsClick = () => {
    setShowSettings(!showSettings)
  }

  const handleLogout = () => {
    clearConfig()
    setShowSettings(true) // 清除配置后显示设置界面
  }

  return (
    <div className="layout">
      <main className="main-content">
        <div style={{ maxWidth: 800, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <h1 className="page-title">
              WordPress 图片智能上传工具 v1.0
            </h1>
            <div className="button-group">
              <button 
                className="btn"
                onClick={handleSettingsClick}
              >
                <span>⚙️</span>
                {showSettings ? '返回上传' : '设置'}
              </button>
              {isConfigured && (
                <button onClick={handleLogout} className="btn btn-link">
                  清除配置
                </button>
              )}
            </div>
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