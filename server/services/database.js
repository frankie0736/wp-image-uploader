import pkg from 'pg';
const { Pool } = pkg;

// Neon数据库连接配置
// 请替换为您的Neon数据库连接字符串
const DATABASE_URL = 'postgresql://wamm_owner:npg_rNoPQ2dZBM8S@ep-cool-sea-a69mdpgu-pooler.us-west-2.aws.neon.tech/wp-image-uploader?sslmode=require';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// 初始化数据库表
export async function initializeDatabase() {
  try {
    const client = await pool.connect();
    
    // 创建域名白名单表
    await client.query(`
      CREATE TABLE IF NOT EXISTS domain_whitelist (
        id SERIAL PRIMARY KEY,
        domain VARCHAR(255) UNIQUE NOT NULL,
        is_active INTEGER DEFAULT 1,
        update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('数据库表初始化成功');
    client.release();
  } catch (error) {
    console.error('数据库初始化错误:', error);
  }
}

// 检查域名状态
export async function checkDomainStatus(domain) {
  try {
    // 移除可能的 www. 前缀
    const cleanDomain = domain.replace(/^www\./i, '');
    
    console.log('查询域名:', cleanDomain);
    
    const client = await pool.connect();
    const result = await client.query(
      'SELECT domain, is_active FROM domain_whitelist WHERE domain = $1',
      [cleanDomain]
    );
    
    client.release();
    
    if (result.rows.length === 0) {
      return {
        allowed: false,
        message: `未授权的域名: ${cleanDomain}`
      };
    }
    
    const isActive = result.rows[0].is_active === 1;
    
    return {
      allowed: isActive,
      message: isActive ? 'Domain is authorized' : 'Domain is not activated'
    };
  } catch (error) {
    console.error('数据库查询错误:', error);
    return {
      allowed: false,
      message: 'Database error: ' + error.message
    };
  }
}

// 添加域名到白名单
export async function addDomainToWhitelist(domain) {
  try {
    // 从完整URL中提取主域名
    let cleanDomain = domain;
    
    // 如果是完整URL，提取主域名
    try {
      const url = new URL(domain.startsWith('http') ? domain : `https://${domain}`);
      cleanDomain = url.hostname;
    } catch {
      // 如果不是URL格式，直接使用原始输入
      cleanDomain = domain;
    }
    
    // 移除www前缀
    cleanDomain = cleanDomain.replace(/^www\./i, '');
    
    console.log('添加域名到白名单:', cleanDomain);
    
    const client = await pool.connect();
    
    // 使用 ON CONFLICT 来处理重复域名
    const result = await client.query(`
      INSERT INTO domain_whitelist (domain, is_active, update_date) 
      VALUES ($1, 1, CURRENT_TIMESTAMP)
      ON CONFLICT (domain) 
      DO UPDATE SET 
        is_active = 1, 
        update_date = CURRENT_TIMESTAMP
      RETURNING domain, is_active
    `, [cleanDomain]);
    
    client.release();
    
    return {
      success: true,
      domain: result.rows[0].domain,
      message: '域名添加成功'
    };
  } catch (error) {
    console.error('添加域名错误:', error);
    return {
      success: false,
      message: 'Database error: ' + error.message
    };
  }
}

// 获取所有域名列表
export async function getAllDomains() {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT domain, is_active, update_date FROM domain_whitelist ORDER BY update_date DESC'
    );
    client.release();
    
    return {
      success: true,
      domains: result.rows
    };
  } catch (error) {
    console.error('获取域名列表错误:', error);
    return {
      success: false,
      message: 'Database error: ' + error.message
    };
  }
} 