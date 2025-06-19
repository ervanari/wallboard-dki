import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'database',
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
