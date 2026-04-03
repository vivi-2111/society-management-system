const { execute } = require('./config/db');
const bcrypt = require('bcrypt');

async function seed() {
    try {
        console.log('Starting member generation...');
        // Hash the password just once for performance
        const hash = await bcrypt.hash('member123', 10);
        const blocks = ['A', 'B', 'C'];
        let count = 0;
        
        for (const block of blocks) {
            for (let i = 1; i <= 100; i++) {
                // Ensure nice numbering, e.g., A-001, A-010, A-100 or A-101 (floor format).
                // Usually flats are A-101 meaning Floor 1 Flat 01. 
                // Let's just do sequential numbering: A-1 to A-100
                const flatNumber = `${block}-${i}`;
                const name = `Resident ${flatNumber}`;
                // Generate a random 10-digit Indian phone number starting with 98
                const phone = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
                
                try {
                    await execute(`INSERT INTO members (member_id, name, flat_number, phone, password_hash) 
                                   VALUES (member_seq.NEXTVAL, :1, :2, :3, :4)`, 
                                  [name, flatNumber, phone, hash]);
                    count++;
                } catch (e) {
                    // Ignore UNIQUE constraint violations (ORA-00001) quietly so we can safely run it multiple times
                    if (!e.message.includes('ORA-00001')) {
                        console.error(`Error inserting ${flatNumber}:`, e.message);
                    }
                }
            }
            console.log(`Finished Block ${block}`);
        }
        
        console.log(`\nSuccessfully added ${count} new members to the database!`);
        process.exit(0);
    } catch (err) {
        console.error('Fatal Error:', err);
        process.exit(1);
    }
}

seed();
