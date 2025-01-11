import React from 'react'
import { Form, Input, Card, Button, message } from 'antd'
import useConfigStore from '../store/configStore'

const ConfigForm = () => {
  const { wpUrl, wpUsername, wpPassword, openaiKey, openaiUrl, setConfig } = useConfigStore()
  const [form] = Form.useForm()

  const onFinish = (values) => {
    setConfig({ ...values, isConfigured: true })
    message.success('配置已保存')
  }

  return (
    <Card title="配置信息">
      <Form
        form={form}
        initialValues={{
          wpUrl,
          wpUsername,
          wpPassword,
          openaiKey,
          openaiUrl,
        }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label="WordPress 网站地址"
          name="wpUrl"
          rules={[{ required: true, message: '请输入WordPress网站地址' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="WordPress 用户名"
          name="wpUsername"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="WordPress Application Password"
          name="wpPassword"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="OpenAI API Key"
          name="openaiKey"
          rules={[{ required: true, message: '请输入OpenAI API Key' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
  label="OpenAI API URL"
  name="openaiUrl"
  rules={[{ required: false, message: '请输入OpenAI API URL' }]}
  tooltip="如果使用官方API，输入: https://api.openai.com/v1，或者留空即可"
>
  <Input placeholder="https://api.openai.com/v1" />
</Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            保存配置
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default ConfigForm