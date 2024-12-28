import mongoose from 'mongoose';

const dbURI = process.env.MONGODB_CONNECTION || '';

mongoose.connect(dbURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('DB Connection Failed:', err));