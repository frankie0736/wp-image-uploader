import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head>
        {/* 预加载系统字体 */}
        <link
          rel="preload"
          href="data:font/woff2;base64,..."
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        <style dangerouslySetInnerHTML={{
          __html: `
            /* === 防止FOUS和CLS的关键样式 === */
            
            /* 重置样式 - 最高优先级 */
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            
            /* 根元素稳定布局 */
            html {
              font-size: 14px;
              line-height: 1.5;
              -webkit-text-size-adjust: 100%;
              font-feature-settings: 'kern' 1;
              font-kerning: normal;
            }
            
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              background-color: #f5f5f5;
              min-height: 100vh;
              /* 防止布局偏移 */
              overflow-x: hidden;
            }
            
            /* === 关键布局样式 === */
            .layout {
              display: flex;
              flex-direction: column;
              min-height: 100vh;
              /* 防止内容跳动 */
              position: relative;
            }
            
            .main-content {
              flex: 1;
              display: flex;
              justify-content: center;
              align-items: flex-start;
              padding: 40px 20px;
              /* 预留Progress组件空间，防止CLS */
              min-height: calc(100vh - 120px);
            }
            
            .page-title {
              font-size: 2rem;
              color: #333;
              margin-bottom: 2rem;
              text-align: center;
              font-weight: 600;
              /* 防止字体加载导致的跳动 */
              font-display: swap;
            }
            
            .button-group {
              display: flex;
              gap: 10px;
              justify-content: center;
              align-items: center;
              /* 固定高度防止CLS */
              min-height: 32px;
              margin-bottom: 30px;
            }
            
            /* === Ant Design关键样式内联 === */
            
            /* Ant Design Card基础样式 */
            .ant-card {
              position: relative;
              background: #fff;
              border-radius: 8px;
              border: 1px solid #f0f0f0;
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.03);
              /* 防止内容跳动 */
              min-height: 200px;
            }
            
            .ant-card-body {
              padding: 24px;
            }
            
            /* Ant Design Upload拖拽区域 */
            .ant-upload-drag {
              position: relative;
              width: 100%;
              height: 180px !important;
              text-align: center;
              background: #fafafa;
              border: 2px dashed #d9d9d9 !important;
              border-radius: 8px !important;
              cursor: pointer;
              transition: border-color 0.3s ease;
              /* 防止尺寸变化 */
              box-sizing: border-box;
            }
            
            .ant-upload-drag:hover {
              border-color: #1890ff !important;
            }
            
            .ant-upload-drag.ant-upload-disabled {
              cursor: not-allowed;
              opacity: 0.6;
            }
            
            .ant-upload-drag-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100%;
              padding: 16px;
            }
            
            .ant-upload-drag-icon {
              font-size: 48px !important;
              color: #1890ff !important;
              margin-bottom: 16px;
              /* 防止图标跳动 */
              width: 48px;
              height: 48px;
              line-height: 48px;
            }
            
            .ant-upload-text {
              font-size: 16px;
              color: #666;
              margin-bottom: 8px;
              /* 防止文本重排 */
              white-space: nowrap;
            }
            
            .ant-upload-hint {
              font-size: 14px;
              color: #999;
            }
            
            /* Ant Design Progress组件 */
            .ant-progress {
              /* 为Progress组件预留固定空间 */
              margin-top: 16px;
              min-height: 8px;
            }
            
            .ant-progress-line {
              position: relative;
              width: 100%;
            }
            
            .ant-progress-outer {
              display: inline-block;
              width: 100%;
              margin-right: 0;
              padding-right: 0;
            }
            
            .ant-progress-inner {
              position: relative;
              display: inline-block;
              width: 100%;
              overflow: hidden;
              vertical-align: middle;
              background-color: #f5f5f5;
              border-radius: 100px;
              height: 8px;
            }
            
            .ant-progress-bg {
              position: relative;
              background-color: #1890ff;
              border-radius: 100px;
              transition: all 0.3s ease;
              height: 100%;
            }
            
            /* Ant Design Form样式 */
            .ant-form {
              max-width: 600px;
              margin: 0 auto;
            }
            
            .ant-form-item {
              margin-bottom: 24px;
            }
            
            .ant-form-item-label {
              padding: 0 0 8px;
              line-height: 1.5;
              white-space: initial;
              text-align: left;
            }
            
            .ant-form-item-label > label {
              position: relative;
              display: inline-flex;
              align-items: center;
              color: #000;
              font-size: 14px;
              height: 32px;
            }
            
            .ant-input {
              box-sizing: border-box;
              font-variant: tabular-nums;
              list-style: none;
              font-feature-settings: 'tnum';
              position: relative;
              display: inline-block;
              width: 100%;
              padding: 4px 11px;
              color: #000;
              font-size: 14px;
              line-height: 1.5;
              background-color: #fff;
              border: 1px solid #d9d9d9;
              border-radius: 6px;
              transition: all 0.3s ease;
              min-height: 32px;
            }
            
            /* === 布局容器样式 === */
            .btn {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              padding: 8px 16px;
              font-size: 14px;
              line-height: 1.5;
              border-radius: 6px;
              border: 1px solid #d9d9d9;
              background: #fff;
              color: #333;
              cursor: pointer;
              transition: all 0.3s;
              font-family: inherit;
              gap: 8px;
              /* 防止按钮尺寸变化 */
              min-height: 32px;
              white-space: nowrap;
            }
            
            .btn:hover {
              border-color: #40a9ff;
              color: #40a9ff;
            }
            
            .btn-link {
              border: none;
              background: none;
              color: #1890ff;
              padding: 4px 0;
            }
            
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 14px;
              /* 固定高度防止布局偏移 */
              height: 60px;
              line-height: 20px;
            }
            
            .footer a {
              color: #1890ff;
              text-decoration: none;
            }
            
            .footer a:hover {
              text-decoration: underline;
            }
            
            /* === 防止闪烁的辅助样式 === */
            
            /* 预加载状态样式 */
            .loading-placeholder {
              background: linear-gradient(90deg, #f0f0f0 25%, transparent 37%, #f0f0f0 63%);
              background-size: 400% 100%;
              animation: loading 1.4s ease infinite;
            }
            
            @keyframes loading {
              0% { background-position: 100% 50%; }
              100% { background-position: -100% 50%; }
            }
            
            /* 动画性能优化 */
            * {
              -webkit-transform: translateZ(0);
              transform: translateZ(0);
              -webkit-backface-visibility: hidden;
              backface-visibility: hidden;
            }
            
            /* === 响应式适配 === */
            @media (max-width: 768px) {
              .main-content {
                padding: 20px 16px;
              }
              
              .page-title {
                font-size: 1.5rem;
                margin-bottom: 1.5rem;
              }
              
              .button-group {
                flex-direction: column;
                gap: 8px;
              }
            }
            
            /* === 深色模式适配 === */
            @media (prefers-color-scheme: dark) {
              body {
                background-color: #141414;
                color: #fff;
              }
              
              .ant-card {
                background: #1f1f1f;
                border-color: #434343;
              }
              
              .ant-upload-drag {
                background: #262626;
                border-color: #434343 !important;
              }
            }
          `
        }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}