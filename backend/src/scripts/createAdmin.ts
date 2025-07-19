import 'dotenv/config';
import * as userController from '../controllers/user';
import { hashString } from '../helpers/bcrypt';

async function createAdminUser() {
  try {
    const adminUserName = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123!';
    
    console.log('Creating admin user...');
    
    // Check if admin already exists
    const existingUser = await userController.fetchUserDetails(adminUserName);
    if (!existingUser.isError()) {
      console.log('Admin user already exists');
      return;
    }
    
    // Create admin user
    const result = await userController.addUser(
      adminUserName,
      hashString(adminPassword),
      'admin'
    );
    
    if (result.isError()) {
      console.error('Error creating admin user:', result.error);
      process.exit(1);
    }
    
    console.log('Admin user created successfully');
    console.log('Username:', adminUserName);
    console.log('Password:', adminPassword);
    console.log('Role: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('Fatal error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();