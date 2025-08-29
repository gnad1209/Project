const cron = require('node-cron');
const cleanOldRecords = require('./cleanOldRecords');

// chạy mỗi ngày lúc 00:00
cron.schedule('0 0 * * *', () => {
  console.log("⏰ Running cron: clean old records");
  cleanOldRecords();
});