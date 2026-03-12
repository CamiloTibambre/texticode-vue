import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     Number(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
})

// Verificar conexión al iniciar
try {
  const conn = await pool.getConnection()
  console.log('✅ Conectado a MySQL — base de datos:', process.env.DB_NAME)
  conn.release()
} catch (err) {
  console.error('❌ Error conectando a MySQL:', err.message)
  process.exit(1)
}

export default pool
