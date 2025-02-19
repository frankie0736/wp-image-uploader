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
    
    // 直接查找匹配的域名
    const records = await base(AIRTABLE_CONFIG.tableName)
      .select({
        filterByFormula: `{Domain} = '${cleanDomain}'`,
        maxRecords: 1
      })
      .firstPage();

    if (records.length === 0) {
      return {
        allowed: false,
        message: 'Domain not found'
      };
    }

    const record = records[0]._rawJson.fields;
    const status = record.Status === true;

    return {
      allowed: status,
      message: status ? 'Domain is authorized' : 'Domain is not activated'
    };
  } catch (error) {
    console.error('Airtable 查询错误:', error);
    return {
      allowed: false,
      message: 'Error checking domain status'
    };
  }
} 