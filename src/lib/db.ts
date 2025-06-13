import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: '192.168.3.5',
  user: 'rootdev',
  password: '-productD3v3l0pm3nt-',
  database: 'synergix_bdki'
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Function to execute a query with retries
export async function query(sql: string, params?: any[]) {
  const MAX_RETRIES = 3;
  let lastError;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const [results] = await pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error(`Database query attempt ${attempt + 1} failed:`, error);
      lastError = error;
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }

  throw lastError;
}

// Function to check if the database connection is working
export async function testConnection() {
  try {
    await query('SELECT 1');
    return { connected: true };
  } catch (error) {
    console.error('Database connection test failed:', error);
    return { connected: false, error };
  }
}

export default { query, testConnection };
