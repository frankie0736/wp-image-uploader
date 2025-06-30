// Ant Design 主题配置 - 优化版本
export const theme = {
  token: {
    // 优化字体加载 - 使用系统字体栈
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif`,
    
    // 减少动画时间，提升感知性能
    motionDurationSlow: '0.2s',
    motionDurationMid: '0.15s',
    motionDurationFast: '0.1s',
    
    // 优化边框半径，减少重绘
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
    
    // 优化颜色系统，减少计算
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    
    // 优化间距系统
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    
    // 优化字体大小
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 20,
    
    // 优化阴影，减少层级
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.03)',
    boxShadowSecondary: '0 4px 12px rgba(0, 0, 0, 0.06)',
  },
  
  // 组件特定优化
  components: {
    Upload: {
      // 固定Upload组件尺寸，防止CLS
      dragHeight: 180,
      dragBackground: '#fafafa',
      dragBorderColor: '#d9d9d9',
      dragBorderColorHover: '#1890ff',
      dragIconSize: 48,
    },
    
    Progress: {
      // 固定Progress组件样式
      defaultColor: '#1890ff',
      remainingColor: '#f5f5f5',
      strokeWidth: 8,
      trailColor: '#f5f5f5',
    },
    
    Card: {
      // 优化Card组件
      borderRadius: 8,
      paddingLG: 24,
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.03)',
    },
    
    Button: {
      // 优化按钮
      borderRadius: 6,
      paddingContentHorizontal: 16,
      paddingContentVertical: 8,
    },
    
    Form: {
      // 优化表单
      verticalLabelPadding: '0 0 8px',
      itemMarginBottom: 24,
    },
  },
  
  // 启用CSS变量，但禁用hash以减少样式大小
  cssVar: {
    prefix: 'wp-uploader',
    key: 'wp-uploader'
  },
  hashed: false, // 禁用样式hash，减少样式大小
  
  // 算法配置优化
  algorithm: [], // 使用默认算法，减少计算开销
}