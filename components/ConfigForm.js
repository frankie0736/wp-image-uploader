import { useState, useEffect } from 'react'
import { Form, Input, Button, Switch, Card, message, InputNumber, Alert, Spin } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import useConfigStore from '../store/configStore'
import axios from 'axios'

const ConfigForm = () => {
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResults, setTestResults] = useState(null)
  const [form] = Form.useForm()
  const { 
    wpUrl,
    wpUsername,
    wpPassword,
    openaiKey,
    openaiUrl,
    compressImages,
    maxImageWidth,
    setConfig 
  } = useConfigStore()

  useEffect(() => {
    // 当store数据更新时，更新表单值
    form.setFieldsValue({
      wpUrl: wpUrl || '',
      wpUsername: wpUsername || '',
      wpPassword: wpPassword || '',
      openaiKey: openaiKey || '',
      openaiUrl: openaiUrl || 'https://aihubmix.com/v1',
      compressImages: compressImages || false,
      maxImageWidth: maxImageWidth || 1920
    })
  }, [wpUrl, wpUsername, wpPassword, openaiKey, openaiUrl, compressImages, maxImageWidth, form])

  const onFinish = async (values) => {
    setLoading(true)
    setTesting(true)
    setTestResults(null)
    
    try {
      // 先测试配置
      const testResponse = await axios.post('/api/test-config', {
        openaiApiKey: values.openaiKey,
        openaiUrl: values.openaiUrl,
        wpUrl: values.wpUrl,
        wpUsername: values.wpUsername,
        wpPassword: values.wpPassword
      })

      const { results } = testResponse.data
      setTestResults(results)

      // 如果所有测试都通过，保存配置
      if (testResponse.data.success) {
        setConfig({
          ...values,
          isConfigured: true
        })
        message.success('配置保存成功！所有测试通过！')
      } else {
        // 显示具体的错误信息
        const errors = []
        if (!results.openai.success) errors.push(`OpenAI: ${results.openai.message}`)
        if (!results.wordpress.success) errors.push(`WordPress: ${results.wordpress.message}`)
        message.error('配置测试失败: ' + errors.join('; '))
      }
    } catch (error) {
      console.error('配置保存失败:', error)
      message.error('配置保存失败: ' + error.message)
    } finally {
      setLoading(false)
      setTesting(false)
    }
  }

  return (
    <Card title="WordPress 配置" style={{ maxWidth: 600, margin: '0 auto' }}>
      <Form
        form={form}
        name="config"
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          wpUrl: '',
          wpUsername: '',
          wpPassword: '',
          openaiKey: '',
          openaiUrl: 'https://aihubmix.com/v1',
          compressImages: false,
          maxImageWidth: 1920
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
          <Input placeholder="https://aihubmix.com/v1" />
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

        {/* 测试结果显示 */}
        {testing && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Spin tip="正在测试配置..." />
          </div>
        )}
        
        {testResults && !testing && (
          <div style={{ marginTop: 16 }}>
            {testResults.openai && (
              <Alert
                message="OpenAI API 测试"
                description={testResults.openai.message}
                type={testResults.openai.success ? 'success' : 'error'}
                icon={testResults.openai.success ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                showIcon
                style={{ marginBottom: 8 }}
              />
            )}
            
            {testResults.wordpress && (
              <Alert
                message="WordPress API 测试"
                description={testResults.wordpress.message}
                type={testResults.wordpress.success ? 'success' : 'error'}
                icon={testResults.wordpress.success ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                showIcon
              />
            )}
          </div>
        )}
      </Form>
    </Card>
  )
}

export default ConfigForm 