import { useState } from 'react'
import { Form, Input, Button, Switch, Card, message, InputNumber } from 'antd'
import useConfigStore from '../store/configStore'

const ConfigForm = () => {
  const [loading, setLoading] = useState(false)
  const { setConfig } = useConfigStore()

  const onFinish = async (values) => {
    setLoading(true)
    try {
      // 验证 WordPress 连接
      const formData = new FormData()
      formData.append('domain', values.wpUrl)
      
      const response = await fetch('/api/validate-domain', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        setConfig({
          ...values,
          isConfigured: true
        })
        message.success('配置保存成功！')
      } else {
        message.error('WordPress 配置验证失败，请检查配置信息')
      }
    } catch (error) {
      console.error('配置保存失败:', error)
      message.error('配置保存失败: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="WordPress 配置" style={{ maxWidth: 600, margin: '0 auto' }}>
      <Form
        name="config"
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          compressImages: false,
          maxImageWidth: 1920,
          openaiUrl: 'https://aihubmix.com/v1'
        }}
      >
        <Form.Item
          label="WordPress 网站地址"
          name="wpUrl"
          rules={[
            { required: true, message: '请输入 WordPress 网站地址!' },
            { type: 'url', message: '请输入有效的网址!' }
          ]}
        >
          <Input placeholder="https://example.com" />
        </Form.Item>

        <Form.Item
          label="WordPress 用户名"
          name="wpUsername"
          rules={[{ required: true, message: '请输入 WordPress 用户名!' }]}
        >
          <Input placeholder="admin" />
        </Form.Item>

        <Form.Item
          label="WordPress 应用密码"
          name="wpPassword"
          rules={[{ required: true, message: '请输入应用密码!' }]}
        >
          <Input.Password placeholder="xxxx xxxx xxxx xxxx" />
        </Form.Item>

        <Form.Item
          label={
            <span>
              AIHubMix API Key
              <a href="https://aihubmix.com?aff=Ykkh" target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8, fontSize: 12 }}>
                购买AIHubMix API Key
              </a>
            </span>
          }
          name="openaiKey"
          rules={[{ required: true, message: '请输入 AIHubMix API Key!' }]}
        >
          <Input.Password placeholder="sk-..." />
        </Form.Item>

        <Form.Item
          label="AIHubMix API 地址"
          name="openaiUrl"
        >
          <Input value="https://aihubmix.com/v1" disabled />
        </Form.Item>

        <Form.Item
          label="图片压缩"
          name="compressImages"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="最大图片宽度"
          name="maxImageWidth"
        >
          <InputNumber min={500} max={4000} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            保存配置
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default ConfigForm 