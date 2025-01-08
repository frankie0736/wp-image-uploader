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
      setConfig: (config) => set(config),
    }),
    {
      name: 'wp-image-uploader-config',
    }
  )
)

export default useConfigStore