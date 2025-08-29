const oracledb = require('oracledb');

async function initOracle() {
  try {
    await oracledb.createPool({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASS,
      connectString: process.env.ORACLE_CONN, // "host:port/service"
    });
    console.log("✅ Oracle DB connected");
  } catch (err) {
    console.error("❌ Oracle error:", err);
  }
}

module.exports = { initOracle, oracledb };