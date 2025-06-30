import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useConfigStore = create(
  persist(
    (set) => ({
      wpUrl: '',
      wpUsername: '',
      wpPassword: '',
      openaiKey: '',
      openaiUrl: 'https://aihubmix.com/v1',
      isConfigured: false,
      compressImages: false,
      maxImageWidth: 1920,
      setConfig: (config) => set(config),
      clearConfig: () => set({
        wpUrl: '',
        wpUsername: '',
        wpPassword: '',
        openaiKey: '',
        openaiUrl: 'https://aihubmix.com/v1',
        isConfigured: false,
        compressImages: false,
        maxImageWidth: 1920
      }),
    }),
    {
      name: 'wp-image-uploader-config', // localStorage的key名称
    }
  )
)

export default useConfigStore 