import React from 'react'
import { Form, Input, Card } from 'antd'
import useConfigStore from '../store/configStore'

const ConfigForm = () => {
  const { wpUrl, wpUsername, wpPassword, openaiKey, openaiUrl, setConfig } = useConfigStore()

  const onFinish = (values) => {
    setConfig(values)
  }

  return (
    <Card title="配置信息">
      <Form
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
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="WordPress 用户名"
          name="wpUsername"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="WordPress Application Password"
          name="wpPassword"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="OpenAI API Key"
          name="openaiKey"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="OpenAI API URL"
          name="openaiUrl"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Card>
  )
}

export default ConfigForm