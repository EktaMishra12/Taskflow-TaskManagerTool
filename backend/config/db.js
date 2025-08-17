// backend/config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(
            'mongodb+srv://emishra361:taskflow23@cluster0.qsl1h00.mongodb.net/TaskManagerTool',
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
