import mongoose from 'mongoose';

let db = () => {
  return mongoose
    .connect(process.env.MONGODB_URI!)
    .then(() => console.log('MongoDB Connection Succeeded.'))
    .catch((err) => console.log('Error in DB connection: ' + err));
};

export default db;
