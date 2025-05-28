import { addDomainToWhitelist } from '../services/database.js';

// 额外的白名单域名
const additionalDomains = [
  'ranking.local',
  'sannyin.com',
  'wpbricksdemo.xyz',
  'kailelifestyle.com',
  'theidealight.com',
  'staging3.idrillio.com',
  'beechair.com',
  'tecolite.com',
  'rankingbit.com',
  '210k.cc',
  'idrillio.com',
  'wordpress-1323490-4934348.cloudwaysapps.com',
  'zetarmold.com',
  'uplastech.com',
  'topkingtapes.com',
  'hpcoverglass.com',
  'hengping-industry.com',
  'ecoicolor.com',
  'ecorivta.com',
  'eco-drinkware.com',
  'innoptical.com',
  'rubbervalve.com',
  'hisoair.com',
  'auspienterprises.com',
  'xiranskincare.com',
  'xirancosmetics.com',
  'xiranbabycare.com',
  'moldall.com',
  'shiningintimates.com',
  'yabolichina.com',
  'uwantpromo.com',
  'brxe.uwantpromo.com',
  'tweenbra.com',
  'staging3.idrilliocom',
  'iecmotores.com',
  'test.local',
  'dongchunmotor.com',
  'chunomotor.com',
  'hoplokleather.com',
  'buydiscoball.com',
  'szoneier.com',
  'chineseyiwu.com'
];

async function migrateAdditionalDomains() {
  console.log('开始添加额外的域名到数据库...');
  
  let successCount = 0;
  let failureCount = 0;
  
  for (const domain of additionalDomains) {
    try {
      const result = await addDomainToWhitelist(domain);
      if (result.success) {
        console.log(`✓ 成功添加域名: ${result.domain}`);
        successCount++;
      } else {
        console.log(`✗ 添加域名失败: ${domain} - ${result.message}`);
        failureCount++;
      }
    } catch (error) {
      console.log(`✗ 添加域名出错: ${domain} - ${error.message}`);
      failureCount++;
    }
  }
  
  console.log(`\n域名添加完成！`);
  console.log(`成功: ${successCount} 个域名`);
  console.log(`失败: ${failureCount} 个域名`);
  console.log(`总计: ${additionalDomains.length} 个域名`);
}

migrateAdditionalDomains()
  .then(() => {
    console.log('所有操作完成，退出程序');
    process.exit(0);
  })
  .catch((error) => {
    console.error('迁移过程出错:', error);
    process.exit(1);
  }); 