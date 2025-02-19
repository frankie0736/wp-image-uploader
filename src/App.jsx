import React from 'react'
import { Layout, Typography, Button, Space, Divider } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import ConfigForm from './components/ConfigForm'
import ImageUploader from './components/ImageUploader'
import useConfigStore from './store/configStore'

const { Content, Footer } = Layout
const { Title, Link, Text } = Typography

function App() {
  const { isConfigured, clearConfig } = useConfigStore()
  const [showSettings, setShowSettings] = React.useState(!isConfigured)

  const handleSettingsClick = () => {
    setShowSettings(!showSettings)
  }

  const handleLogout = () => {
    clearConfig()
    setShowSettings(true)
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'flex',flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Title level={1} style={{ fontSize: 24 }}>WordPress 图片智能上传</Title>
          {isConfigured && (
            <Space>
              <Button 
                icon={<SettingOutlined />} 
                onClick={handleSettingsClick}
              >
                {showSettings ? '返回上传' : '设置'}
              </Button>
              <Button onClick={handleLogout} type="link">
                清除配置
              </Button>
            </Space>
          )}
        </div>
        
        {showSettings ? (
          <ConfigForm />
        ) : (
          <ImageUploader />
        )}
      </Content>
      <Footer style={{ textAlign: 'center', background: 'transparent' }}>
        <div>
          © {new Date().getFullYear()} <a href="https://www.210k.cc" target="_blank" rel="noopener noreferrer">210 工作室</a> | <a href="https://meeting.tencent.com/crm/KeXw5gm3b7" target="_blank" rel="noopener noreferrer">操作视频</a> | <a href="mailto:xu@210k.cc" target="_blank" rel="noopener noreferrer">联系作者</a>
        </div>
        <Divider style={{ margin: '12px 0' }} />
        <div style={{ marginTop: '12px', color: '#00000040', fontSize: '12px' }}>
          目前仅限工作室的付费咨询客户使用<br />
          如需付费购买使用：￥99元/网站，长期可用
        </div>
      </Footer>
    </Layout>
  )
}

export default App