const { execute, query } = require('./config/db');
const bcrypt = require('bcrypt');

async function run() {
    // Wait for the connection to be established (since db.js connects asynchronously)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
        console.log('Altering members table...');
        await execute('ALTER TABLE members ADD password_hash VARCHAR2(255)');
        console.log('Added password_hash column.');
    } catch (e) {
        if (e.message.includes('ORA-01430') || e.message.includes('ORA-00904')) {
            console.log('Column password_hash might already exist.');
        } else {
            console.error('Error altering table:', e.message);
        }
    }

    try {
        console.log('Updating existing members...');
        const members = await query('SELECT member_id, password_hash FROM members');
        const hash = await bcrypt.hash('member123', 10);
        
        let count = 0;
        for (let member of members) {
            if (!member.password_hash) {
                await execute('UPDATE members SET password_hash = :1 WHERE member_id = :2', [hash, member.member_id || member.MEMBER_ID]);
                count++;
            }
        }
        console.log(`Updated ${count} members with default password.`);
    } catch (e) {
        console.error('Error updating existing members:', e.message);
    }
    
    console.log('Done.');
    process.exit(0);
}

run();
