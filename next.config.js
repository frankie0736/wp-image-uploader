/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
    optimizeCss: false // 禁用CSS优化避免critters问题
  },
  compiler: {
    styledComponents: true
  },
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // 启用生产优化
  productionBrowserSourceMaps: false,
  compress: true,
  // 输出配置
  output: 'standalone'
}

module.exports = nextConfig 