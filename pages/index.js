import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import ConfigForm from '../components/ConfigForm'
import useConfigStore from '../store/configStore'

// 动态导入ImageUploader，避免SSR不一致
const ImageUploader = dynamic(() => import('../components/ImageUploader'), {
  ssr: false,
  loading: () => (
    <div className="loading-placeholder" style={{
      height: '220px',
      borderRadius: '8px',
      marginBottom: '16px'
    }} />
  )
})

export default function Home() {
  const { isConfigured, clearConfig } = useConfigStore()
  const [showSettings, setShowSettings] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 确保状态重水化完成
    const timer = setTimeout(() => {
      setIsHydrated(true)
      setIsLoading(false)
      
      // 如果没有配置，自动显示设置页面
      if (!isConfigured) {
        setShowSettings(true)
      }
    }, 100) // 短暂延迟确保store完全加载
    
    return () => clearTimeout(timer)
  }, [isConfigured])

  const handleSettingsClick = () => {
    setShowSettings(!showSettings)
  }

  const handleLogout = () => {
    clearConfig()
    setShowSettings(true) // 清除配置后显示设置界面
  }

  // 在水合完成前显示骨架屏
  if (!isHydrated || isLoading) {
    return (
      <div className="layout">
        <main className="main-content">
          <div style={{ maxWidth: 800, width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
              <h1 className="page-title">
                WordPress 图片智能上传工具
              </h1>
              <div className="button-group">
                <div className="loading-placeholder" style={{
                  width: '60px',
                  height: '32px',
                  borderRadius: '6px'
                }} />
              </div>
            </div>
            
            {/* 骨架屏 */}
            <div className="loading-placeholder" style={{
              height: '400px',
              borderRadius: '8px'
            }} />
          </div>
        </main>
        <footer className="footer">
          © {new Date().getFullYear()} <a href="https://www.210k.cc" target="_blank" rel="noopener noreferrer">210工作室</a> 版权所有
        </footer>
      </div>
    )
  }

  return (
    <div className="layout">
      <main className="main-content">
        <div style={{ maxWidth: 800, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <h1 className="page-title">
              WordPress 图片智能上传工具
            </h1>
            <div className="button-group">
              <button 
                className="btn"
                onClick={handleSettingsClick}
                style={{
                  opacity: isHydrated ? 1 : 0,
                  transition: 'opacity 0.3s ease'
                }}
              >
                <span>⚙️</span>
                {showSettings ? '返回上传' : '设置'}
              </button>
              {isConfigured && (
                <button 
                  onClick={handleLogout} 
                  className="btn btn-link"
                  style={{
                    opacity: isHydrated ? 1 : 0,
                    transition: 'opacity 0.3s ease'
                  }}
                >
                  清除配置
                </button>
              )}
            </div>
          </div>
          
          {/* 内容区域 - 使用fade过渡 */}
          <div style={{
            opacity: isHydrated ? 1 : 0,
            transition: 'opacity 0.3s ease',
            minHeight: '400px'
          }}>
            {showSettings ? (
              <ConfigForm />
            ) : (
              <ImageUploader />
            )}
          </div>
        </div>
      </main>
      <footer className="footer">
        © {new Date().getFullYear()} <a href="https://www.210k.cc" target="_blank" rel="noopener noreferrer">210工作室</a> 版权所有
      </footer>
    </div>
  )
} 