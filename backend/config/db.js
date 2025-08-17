// backend/config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(
            'mongodb+srv://TaskManagement:Ajay@taskcluster0.6q72axx.mongodb.net/Taskflow',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:', error.message);
        process.exit(1);
    }
};

export default connectDB;
