// Creates (or promotes) an admin user.
// Usage: node src/scripts/createAdmin.js admin@studystay.com StrongPassword123 "Admin Name"
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import db from '../config/db.js';

dotenv.config();

const run = async () => {
  const [, , email, password, name = 'Admin'] = process.argv;

  if (!email || !password) {
    console.error('Usage: node src/scripts/createAdmin.js <email> <password> [name]');
    process.exit(1);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);

    if (existing.length > 0) {
      await db.query('UPDATE users SET role = ?, password = ?, name = ? WHERE email = ?', [
        'admin',
        hashedPassword,
        name,
        email,
      ]);
      console.log(`Existing user ${email} promoted to admin and password reset.`);
    } else {
      await db.query(
        'INSERT INTO users (name, email, password, role, verification_status) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, 'admin', 'verified']
      );
      console.log(`Admin user created: ${email}`);
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
};

run();
