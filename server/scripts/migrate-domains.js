import { addDomainToWhitelist, initializeDatabase } from '../services/database.js';

// 现有的白名单域名
const existingDomains = [
  'ranking.local',
  'sannyin.com',
  'wpbricksdemo.xyz',
  '210k.cc',
  'tecolite.com',
  'kailelifestyle.com',
  'rankingbit.com',
  'idrillio.com',
  'staging3.idrillio.com',
  'beechair.com',
  'theidealight.com',
  'chineseyiwu.com'
];

async function migrateDomains() {
  console.log('初始化数据库...');
  
  // 先初始化数据库表
  await initializeDatabase();
  
  console.log('开始迁移域名到数据库...');
  
  for (const domain of existingDomains) {
    try {
      const result = await addDomainToWhitelist(domain);
      if (result.success) {
        console.log(`✓ 成功添加域名: ${result.domain}`);
      } else {
        console.log(`✗ 添加域名失败: ${domain} - ${result.message}`);
      }
    } catch (error) {
      console.log(`✗ 添加域名出错: ${domain} - ${error.message}`);
    }
  }
  
  console.log('域名迁移完成！');
}

migrateDomains()
  .then(() => {
    console.log('所有操作完成，退出程序');
    process.exit(0);
  })
  .catch((error) => {
    console.error('迁移过程出错:', error);
    process.exit(1);
  }); 