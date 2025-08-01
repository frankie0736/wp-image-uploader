/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
    optimizeCss: true // 启用CSS优化
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // 启用生产优化
  productionBrowserSourceMaps: false,
  compress: true,
  // 输出配置
  output: 'standalone',
  // 优化字体加载
  optimizeFonts: true,
  // 修复 ESM 模块问题
  transpilePackages: ['antd', 'rc-util', '@ant-design/icons', 'rc-pagination', 'rc-picker'],
}

module.exports = nextConfig 