// import Airtable from 'airtable';

// const AIRTABLE_CONFIG = {
//   apiKey: 'patU0hJI6OpYyOgG2.beae580bb46b169579225986348b11f24465e5b13bda34ce4bd1eda65d1d111e',
//   baseId: 'appjMwA0wZgQlV3dY',
//   tableName: 'Domains'
// };

// const base = new Airtable({ apiKey: AIRTABLE_CONFIG.apiKey }).base(AIRTABLE_CONFIG.baseId);

export async function checkDomainStatus(domain) {
  // 临时关闭域名授权验证，所有域名都返回允许
  console.log('域名验证已临时关闭，允许所有域名:', domain);
  
  return {
    allowed: true,
    message: 'Domain authorization temporarily disabled - all domains allowed'
  };
}

/* 原始的Airtable验证代码（已注释）
import Airtable from 'airtable';

const AIRTABLE_CONFIG = {
  apiKey: 'patU0hJI6OpYyOgG2.beae580bb46b169579225986348b11f24465e5b13bda34ce4bd1eda65d1d111e',
  baseId: 'appjMwA0wZgQlV3dY',
  tableName: 'Domains'
};

const base = new Airtable({ apiKey: AIRTABLE_CONFIG.apiKey }).base(AIRTABLE_CONFIG.baseId);

export async function checkDomainStatus(domain) {
  try {
    // 移除可能的 www. 前缀
    const cleanDomain = domain.replace(/^www\./i, '');
    
    console.log('原始域名:', domain);
    console.log('清理后的域名:', cleanDomain);
    console.log('使用的API Key:', AIRTABLE_CONFIG.apiKey.substring(0, 10) + '...');
    console.log('使用的Base ID:', AIRTABLE_CONFIG.baseId);
    
    // 直接查找匹配的域名
    const records = await base(AIRTABLE_CONFIG.tableName)
      .select({
        filterByFormula: `{Domain} = '${cleanDomain}'`,
        maxRecords: 1
      })
      .firstPage();

    console.log('查询到的记录数量:', records.length);
    
    if (records.length === 0) {
      // 如果没有找到精确匹配，尝试查找所有记录来调试
      console.log('未找到精确匹配，查询所有域名记录...');
      const allRecords = await base(AIRTABLE_CONFIG.tableName)
        .select({
          maxRecords: 100
        })
        .firstPage();
      
      console.log('所有域名记录:');
      allRecords.forEach(record => {
        console.log('- 域名:', record.fields.Domain, '状态:', record.fields.Status);
      });
      
      return {
        allowed: false,
        message: `未授权的域名，无法保存配置。查询的域名: ${cleanDomain}`
      };
    }

    const record = records[0]._rawJson.fields;
    console.log('找到的记录:', record);
    
    const status = record.Status === true;
    console.log('域名状态:', status);

    return {
      allowed: status,
      message: status ? 'Domain is authorized' : 'Domain is not activated'
    };
  } catch (error) {
    console.error('Airtable 查询错误:', error);
    
    // 如果是授权错误，提供更具体的错误信息
    if (error.error === 'NOT_AUTHORIZED') {
      return {
        allowed: false,
        message: 'Airtable API授权失败，请检查API Key和Base权限'
      };
    }
    
    return {
      allowed: false,
      message: 'Error checking domain status: ' + error.message
    };
  }
}
*/ 