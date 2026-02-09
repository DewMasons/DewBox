let ensured = false;

async function ensurePaystackProcessedTable(db) {
  if (ensured) return;

  // Minimal idempotency table to prevent double-crediting the same Paystack reference.
  await db.query(`
    CREATE TABLE IF NOT EXISTS paystack_processed (
      reference VARCHAR(100) NOT NULL PRIMARY KEY,
      processed_at DATETIME(6) NOT NULL
    )
  `);

  ensured = true;
}

async function tryMarkPaystackReferenceProcessed(db, reference) {
  await ensurePaystackProcessedTable(db);

  try {
    await db.query(
      'INSERT INTO paystack_processed (reference, processed_at) VALUES (?, NOW(6))',
      [reference]
    );
    return true;
  } catch (err) {
    // mysql2 uses `code` for error type
    if (err && err.code === 'ER_DUP_ENTRY') return false;
    throw err;
  }
}

module.exports = { ensurePaystackProcessedTable, tryMarkPaystackReferenceProcessed };
