#!/usr/bin/env node

/**
 * WordPress图片上传工具 - 性能检测脚本
 * 用于验证CLS和FOUS优化效果
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 开始性能检测...\n')

// 检测项目配置
const checks = {
  nextConfig: {
    name: 'Next.js配置优化',
    file: 'next.config.js',
    checks: [
      { key: 'optimizeFonts', desc: '字体优化' },
      { key: 'optimizeCss', desc: 'CSS优化' },
      { key: 'compress', desc: 'Gzip压缩' },
      { key: 'swcMinify', desc: 'SWC压缩' }
    ]
  },
  
  documentOptimization: {
    name: '_document.js优化',
    file: 'pages/_document.js',
    checks: [
      { pattern: /关键样式内联/g, desc: '关键CSS内联' },
      { pattern: /ant-upload-drag.*height.*180px/g, desc: 'Upload组件固定高度' },
      { pattern: /ant-progress/g, desc: 'Progress组件样式预设' },
      { pattern: /防止布局偏移/g, desc: '布局偏移防护' }
    ]
  },
  
  componentOptimization: {
    name: '组件优化检测',
    file: 'components/ImageUploader.js',
    checks: [
      { pattern: /minHeight.*180px/g, desc: '拖拽区域固定高度' },
      { pattern: /position.*relative/g, desc: '相对定位布局' },
      { pattern: /占位元素/g, desc: 'Progress占位元素' },
      { pattern: /loading-placeholder/g, desc: '加载占位样式' }
    ]
  },
  
  themeOptimization: {
    name: 'Ant Design主题优化',
    file: 'lib/antd-theme.js',
    checks: [
      { pattern: /components:/g, desc: '组件级别优化' },
      { pattern: /dragHeight.*180/g, desc: 'Upload组件尺寸固定' },
      { pattern: /hashed.*false/g, desc: '禁用样式Hash' },
      { pattern: /algorithm.*\[\]/g, desc: '算法优化' }
    ]
  }
}

let totalScore = 0
let maxScore = 0

// 执行检测
Object.entries(checks).forEach(([key, config]) => {
  console.log(`📋 ${config.name}`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  
  const filePath = path.join(process.cwd(), config.file)
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ 文件不存在: ${config.file}`)
    console.log()
    return
  }
  
  const content = fs.readFileSync(filePath, 'utf8')
  let sectionScore = 0
  
  if (config.checks) {
    config.checks.forEach(check => {
      maxScore++
      
      if (check.pattern) {
        // 正则检测
        const found = check.pattern.test(content)
        if (found) {
          console.log(`✅ ${check.desc}`)
          sectionScore++
          totalScore++
        } else {
          console.log(`❌ ${check.desc} - 未发现`)
        }
      } else if (check.key) {
        // 配置项检测
        const found = content.includes(check.key)
        if (found) {
          console.log(`✅ ${check.desc}`)
          sectionScore++
          totalScore++
        } else {
          console.log(`❌ ${check.desc} - 未配置`)
        }
      }
    })
  }
  
  const percentage = config.checks ? Math.round((sectionScore / config.checks.length) * 100) : 0
  console.log(`📊 得分: ${sectionScore}/${config.checks?.length || 0} (${percentage}%)`)
  console.log()
})

// 额外检测项
console.log(`🔧 额外优化检测`)
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

// 检测package.json中的优化包
const packagePath = path.join(process.cwd(), 'package.json')
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  
  const optimizationPackages = {
    'critters': '关键CSS提取',
    'next': 'Next.js框架',
    'sharp': '图片优化',
    '@ant-design/icons': 'Ant Design图标优化'
  }
  
  Object.entries(optimizationPackages).forEach(([pkg, desc]) => {
    maxScore++
    if (packageJson.dependencies?.[pkg] || packageJson.devDependencies?.[pkg]) {
      console.log(`✅ ${desc} (${pkg})`)
      totalScore++
    } else {
      console.log(`❌ ${desc} (${pkg}) - 未安装`)
    }
  })
}

// 检测pages/index.js的SSR优化
const indexPath = path.join(process.cwd(), 'pages/index.js')
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8')
  
  const ssrChecks = [
    { pattern: /dynamic.*import/g, desc: '动态导入组件' },
    { pattern: /ssr.*false/g, desc: '禁用SSR避免不一致' },
    { pattern: /loading.*loading-placeholder/g, desc: '加载占位组件' },
    { pattern: /isHydrated/g, desc: '水合状态管理' }
  ]
  
  ssrChecks.forEach(check => {
    maxScore++
    if (check.pattern.test(indexContent)) {
      console.log(`✅ ${check.desc}`)
      totalScore++
    } else {
      console.log(`❌ ${check.desc} - 未实现`)
    }
  })
}

console.log()

// 总体评分
const finalPercentage = Math.round((totalScore / maxScore) * 100)
console.log(`🎯 总体性能优化评分`)
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
console.log(`📊 总分: ${totalScore}/${maxScore} (${finalPercentage}%)`)

if (finalPercentage >= 90) {
  console.log(`🚀 优秀! 您的项目已经很好地解决了CLS和FOUS问题`)
} else if (finalPercentage >= 70) {
  console.log(`✨ 良好! 大部分优化已完成，还有少量改进空间`)
} else if (finalPercentage >= 50) {
  console.log(`⚠️  一般! 需要进一步优化来完全解决CLS和FOUS问题`)
} else {
  console.log(`🔧 需要改进! 建议按照检测结果进行相应优化`)
}

console.log()
console.log(`💡 建议下一步:`)
console.log(`1. 运行 'npm run build' 构建生产版本`)
console.log(`2. 使用Chrome DevTools的Performance面板测试`)
console.log(`3. 使用Lighthouse检测Web Vitals指标`)
console.log(`4. 关注CLS (Cumulative Layout Shift) < 0.1`)
console.log(`5. 关注FCP (First Contentful Paint) < 1.8s`)

process.exit(0) 