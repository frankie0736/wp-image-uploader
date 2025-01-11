import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useConfigStore = create(
  persist(
    (set) => ({
      wpUrl: '',
      wpUsername: '',
      wpPassword: '',
      openaiKey: '',
      openaiUrl: 'https://api.openai.com/v1',
      isConfigured: false,
      setConfig: (config) => set({
        ...config,
        openaiUrl: config.openaiUrl || 'https://api.openai.com/v1'
      }),
      clearConfig: () => set({
        wpUrl: '',
        wpUsername: '',
        wpPassword: '',
        openaiKey: '',
        openaiUrl: '',
        isConfigured: false
      }),
    }),
    {
      name: 'wp-image-uploader-config',
    }
  )
)

export default useConfigStore