// Ant Design 主题配置
export const theme = {
  token: {
    // 优化字体加载
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif`,
    // 减少动画时间，提升感知性能
    motionDurationSlow: '0.2s',
    motionDurationMid: '0.15s',
    motionDurationFast: '0.1s',
  },
  // 禁用不必要的动画
  cssVar: true,
  hashed: false, // 禁用样式hash，减少样式大小
}