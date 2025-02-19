// 创建新文件来管理 API URLs
export const API_URLS = {
  development: {
    imageProcessor: 'http://localhost:3001',
    api: 'http://localhost:3001'
  },
  production: {
    imageProcessor: 'https://wptools.210k.cc',
    api: 'https://wptools.210k.cc'
  }
};

export const getApiUrls = () => {
  const isProduction = import.meta.env.PROD;
  return isProduction ? API_URLS.production : API_URLS.development;
}; 