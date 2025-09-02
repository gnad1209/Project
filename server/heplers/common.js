const { STATUS } = require('./constant');

/**
 * Remove Vietnamese tones
 */
function removeVietnameseTones(str) {
  if (!str) return '';
  return str
    .normalize('NFD') // tách ký tự gốc + dấu
    .replace(/[\u0300-\u036f]/g, '') // xóa dấu
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^0-9a-zA-Z\s]/g, ''); // bỏ ký tự đặc biệt (tuỳ chọn)
}

function hasVietnameseTones(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '') !== str;
}

/**
 * Build dynamic query with filters, pagination (support search without accents when keyword has no accents)
 */
function buildSelectQuery(tableName, options = {}) {
  const {
    select = ['*'],
    filters = {},
    search = null,
    status = 'ACTIVE',
    page = 1,
    limit = 10,
  } = options;

  let sql = `SELECT ${select.join(', ')} FROM ${tableName} WHERE 1=1`;
  const params = [];

  // lọc theo status
  if (status) {
    sql += ` AND status = ?`;
    params.push(status);
  }

  // lọc theo filters (key-value)
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === '') continue;
    sql += ` AND ${key} = ?`;
    params.push(value);
  }

  // tìm kiếm theo nhiều trường
  if (search && search.keyword && Array.isArray(search.fields)) {
    let likeClause;
    let keyword;

    if (hasVietnameseTones(search.keyword)) {
      // keyword có dấu -> tìm chính xác theo dữ liệu gốc
      keyword = `%${search.keyword}%`;
      likeClause = search.fields.map((f) => `${f} LIKE ?`).join(' OR ');
    } else {
      // keyword không dấu -> bỏ dấu khi so sánh
      likeClause = search.fields
        .map((f) => `${f} LIKE ?`) // search trên cột không dấu
        .join(' OR ');
      keyword = `%${removeVietnameseTones(search.keyword)}%`;
    }

    sql += ` AND (${likeClause})`;
    search.fields.forEach(() => params.push(keyword));
  }

  // phân trang
  const offset = (page - 1) * limit;
  sql += ` LIMIT ? OFFSET ?`;
  params.push(Number(limit), Number(offset));

  return { sql, params };
}

module.exports = { buildSelectQuery, removeVietnameseTones };
