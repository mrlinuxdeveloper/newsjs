// scripts/create-blogs-table.js
const db = require('../DB'); // مسیر رو مطابق پروژه‌ت تنظیم کن

const sql = `
    CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        image TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
`;

db.query(sql, (err) => {
    if (err) {
        console.error('خطا در ساخت جدول:', err.message);
        process.exit(1);
    }
    console.log('✅ جدول blogs با موفقیت ساخته شد');
    process.exit(0);
});