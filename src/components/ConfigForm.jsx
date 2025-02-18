import { Form, Input, Card, Button, message, Checkbox } from 'antd'
import useConfigStore from '../store/configStore'
import axios from 'axios'
import { getApiUrls } from '../utils/constants'

const ConfigForm = () => {
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
  
  const [form] = Form.useForm()

  const validateDomain = async (domain) => {
    try {
      const { api } = getApiUrls();
      const response = await axios.post(`${api}/validate-domain`, {
        domain
      });
      return response.data.allowed;
    } catch (error) {
      console.error('域名验证错误:', error);
      return false;
    }
  };

  const onFinish = async (values) => {
    try {
      // 确保 WordPress URL 格式正确
      const wpUrl = values.wpUrl.replace(/\/+$/, ''); // 移除末尾的斜杠
      
      // 验证域名
      const isAllowed = await validateDomain(wpUrl);
      if (!isAllowed) {
        message.error('未授权的域名，无法保存配置');
        return;
      }

      setConfig({ 
        ...values, 
        wpUrl,
        isConfigured: true 
      });
      message.success('配置已保存');
    } catch (error) {
      message.error('保存配置失败: ' + error.message);
    }
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
          compressImages: compressImages || false,
          maxImageWidth: maxImageWidth || 800,
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
        <Form.Item
          name="compressImages"
          valuePropName="checked"
        >
          <Checkbox>压缩处理图片</Checkbox>
        </Form.Item>
        <Form.Item
          label="最大图片宽度"
          name="maxImageWidth"
          rules={[{ 
            required: true,
            type: 'number',
            min: 100,
            max: 5000,
            transform: (value) => Number(value),
            message: '请输入100-5000之间的整数'
          }]}
          tooltip="设置图片的最大宽度（像素），超过此宽度的图片将等比例缩小"
        >
          <Input 
            type="number" 
            min={100}
            max={5000}
            style={{ width: '100%' }}
            placeholder="1920"
          />
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