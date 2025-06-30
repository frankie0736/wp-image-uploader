/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
    optimizeCss: true, // 启用CSS优化
    craCompat: true, // 兼容性优化
    forceSwcTransforms: true, // 强制使用SWC转换
  },
  
  // 编译器优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  
  // API路由配置
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  
  // 环境变量
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // 生产优化
  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,
  
  // 输出配置
  output: 'standalone',
  
  // 字体优化 - 关键改进
  optimizeFonts: true,
  
  // 图片优化
  images: {
    domains: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30天缓存
  },
  
  // Webpack优化
  webpack: (config, { dev, isServer }) => {
    // 性能优化
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          // Ant Design单独打包
          antd: {
            name: 'antd',
            test: /[\\/]node_modules[\\/]antd[\\/]/,
            chunks: 'all',
            priority: 10,
          },
          // React相关库单独打包
          react: {
            name: 'react',
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            chunks: 'all',
            priority: 10,
          },
          // 其他vendor库
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 5,
          },
        },
      }
    }

    // CSS模块优化
    config.module.rules.push({
      test: /\.css$/,
      use: [
        {
          loader: 'css-loader',
          options: {
            modules: {
              auto: true,
              localIdentName: dev ? '[local]--[hash:base64:5]' : '[hash:base64:8]',
            },
          },
        },
      ],
    })

    return config
  },
  
  // 页面重定向和重写
  async rewrites() {
    return []
  },
  
  // 响应头优化
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // 字体预加载
          {
            key: 'Link',
            value: '<data:font/woff2;charset=utf-8;base64,>; rel=preload; as=font; type=font/woff2; crossorigin=anonymous'
          }
        ]
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig 