const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const dbName = 'dental-db';

const adminPool = new Pool({
  connectionString: process.env.DATABASE_URL.replace(`/${dbName}`, '/postgres'),
});

async function createDatabaseIfNotExists() {
  try {
    const check = await adminPool.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    if (check.rowCount === 0) {
      await adminPool.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" created.`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error('Failed to create database:', err);
  } finally {
    await adminPool.end();
  }
}

async function createTables() {
  const dbPool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  try {
    const schema = fs.readFileSync(__dirname + '/schema.sql', 'utf-8');
    await dbPool.query(schema);
    console.log('Tables created successfully.');
  } catch (err) {
    console.error('Failed to create tables:', err);
  } finally {
    await dbPool.end();
  }
}

(async () => {
  console.log('Connecting to:', process.env.DATABASE_URL);
  await createDatabaseIfNotExists();
  await createTables();
})();