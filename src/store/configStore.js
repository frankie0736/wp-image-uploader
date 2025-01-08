import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useConfigStore = create(
  persist(
    (set) => ({
      wpUrl: '',
      wpUsername: '',
      wpPassword: '',
      openaiKey: '',
      // 可以设置一个默认值，但不会影响表单提交的值
      openaiUrl: '',
      isConfigured: false,
      setConfig: (config) => set(config),
      clearConfig: () => set({
        wpUrl: '',
        wpUsername: '',
        wpPassword: '',
        openaiKey: '',
        openaiUrl: '',  // 清空时也重置为空
        isConfigured: false
      }),
    }),
    {
      name: 'wp-image-uploader-config',
    }
  )
)

export default useConfigStore