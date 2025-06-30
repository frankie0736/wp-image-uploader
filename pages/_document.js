import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* 关键样式内联 - 防止布局偏移 */
            * {
              box-sizing: border-box;
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
            }
            
            .layout {
              display: flex;
              flex-direction: column;
              min-height: 100vh;
            }
            
            .main-content {
              flex: 1;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 40px 20px;
            }
            
            .page-title {
              font-size: 2rem;
              color: #333;
              margin-bottom: 2rem;
              text-align: center;
            }
            
            .button-group {
              display: flex;
              gap: 10px;
              justify-content: center;
              align-items: center;
            }
            
            .btn {
              padding: 8px 16px;
              border: 1px solid #d9d9d9;
              background: white;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
              transition: all 0.3s;
            }
            
            .ant-card {
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.03);
              border-radius: 8px;
            }
            
            .ant-form {
              max-width: 600px;
              margin: 0 auto;
            }
            
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 14px;
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