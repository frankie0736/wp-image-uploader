import { useEffect } from 'react'
import '../styles/globals.css'
import '../styles/components.css'
import useConfigStore from '../store/configStore'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // 手动触发store的rehydrate，确保从localStorage加载数据
    useConfigStore.persist.rehydrate()
  }, [])
  
  return <Component {...pageProps} />
} 