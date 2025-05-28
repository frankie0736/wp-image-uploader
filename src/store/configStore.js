import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useConfigStore = create(
  persist(
    (set) => ({
      wpUrl: '',
      wpUsername: '',
      wpPassword: '',
      openaiKey: '',
      openaiUrl: '',
      isConfigured: false,
      compressImages: false,
      maxImageWidth: 1920,
      setConfig: (config) => set(config),
      clearConfig: () => set({
        wpUrl: '',
        wpUsername: '',
        wpPassword: '',
        openaiKey: '',
        openaiUrl: '',
        isConfigured: false,
        compressImages: false,
        maxImageWidth: 1920
      }),
    }),
    {
      name: 'config-storage',
    }
  )
)

export default useConfigStore