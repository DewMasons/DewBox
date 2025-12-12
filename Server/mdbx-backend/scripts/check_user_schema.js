const pool = require('../src/db');

async function checkSchema() {
    const [cols] = await pool.query('DESCRIBE user');
    console.log('USER TABLE COLUMNS:');
    cols.forEach(c => console.log(`  ${c.Field} - ${c.Type}`));
    
    const [subCols] = await pool.query('DESCRIBE subscribers');
    console.log('\nSUBSCRIBERS TABLE COLUMNS:');
    subCols.forEach(c => console.log(`  ${c.Field} - ${c.Type}`));
    
    await pool.end();
}

checkSchema();
