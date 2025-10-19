import mongoose from 'mongoose';

export const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Conectado Correctamente');
  } catch (error) {
    console.log(e);
  }
};
