import { useEffect } from 'react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import '../styles/globals.css'
import '../styles/components.css'
import useConfigStore from '../store/configStore'
import { theme } from '../lib/antd-theme'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // 手动触发store的rehydrate，确保从localStorage加载数据
    useConfigStore.persist.rehydrate()
  }, [])
  
  return (
    <ConfigProvider 
      locale={zhCN}
      theme={theme}
    >
      <Component {...pageProps} />
    </ConfigProvider>
  )
} 