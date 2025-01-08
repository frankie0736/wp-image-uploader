import React from 'react'
import { Layout, Typography } from 'antd'
import ConfigForm from './components/ConfigForm'
import ImageUploader from './components/ImageUploader'

const { Content } = Layout
const { Title } = Typography

function App() {
  return (
    <Layout style={{ minHeight: '100vh', padding: '20px' }}>
      <Content style={{ maxWidth: 800, margin: '0 auto' }}>
        <Title level={2}>WordPress 图片上传工具</Title>
        <ConfigForm />
        <div style={{ marginTop: 20 }}>
          <ImageUploader />
        </div>
      </Content>
    </Layout>
  )
}

export default App