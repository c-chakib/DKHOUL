import { connectDatabase } from '../config/database';
import mongoose from 'mongoose';

const migrate = async () => {
  try {
    await connectDatabase();
    
    // Add migration logic here
    console.log('Running migrations...');
    
    // Example: Add a new field to all users
    // await User.updateMany({}, { $set: { newField: 'defaultValue' } });
    
    console.log('Migrations completed successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrate();
