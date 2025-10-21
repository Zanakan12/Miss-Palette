const mysql = require('mysql2/promise');

async function main() {
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error('Please set DATABASE_URL environment variable (mysql://user:pass@host:port/db)');
        process.exit(2);
    }
    const pool = mysql.createPool(url);
    const conn = await pool.getConnection();
    try {
        await conn.query(`
      CREATE TABLE IF NOT EXISTS palettes (
        id VARCHAR(191) PRIMARY KEY,
        name VARCHAR(255),
        colors JSON NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
        console.log('Table palettes ensured');
    } finally {
        conn.release();
        await pool.end();
    }
}

main().catch((err) => { console.error(err); process.exit(1); });
