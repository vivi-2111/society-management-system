const { execute } = require('./config/db');
const bcrypt = require('bcrypt');

async function updateAdmin() {
    try {
        const hash = await bcrypt.hash('admin123', 10);
        await execute('DELETE FROM admins');
        await execute(`INSERT INTO admins (admin_id, username, password_hash) VALUES (1, 'admin', :1)`, [hash]);
        console.log('Successfully updated Admin credentials');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
updateAdmin();
