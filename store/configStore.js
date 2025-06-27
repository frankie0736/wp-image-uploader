import { create } from 'zustand'

const useConfigStore = create((set) => ({
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
}))

export default useConfigStore 