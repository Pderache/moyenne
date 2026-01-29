const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

// Utilise la variable d'env DB_PATH si elle existe, sinon database.sqlite dans le dossier actuel
const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Initialize DB
const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      date TEXT,
      rating INTEGER,
      description TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id),
      UNIQUE(user_id, date)
    )
  `);

  // Create a default user if none exists
  const stmt = db.prepare('SELECT count(*) as count FROM users');
  const result = stmt.get();
  
  if (result.count === 0) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    const insert = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    insert.run('admin', hashedPassword);
    console.log('Default user "admin" created with password "admin123"');
  }
};

module.exports = {
  db,
  initDb
};
