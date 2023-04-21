import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

mongoose.set("strictQuery", false);

const connectDB = async () => {
    try {
        mongoose.connect(process.env.DATABASE_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
    } catch (err) {
        console.log(err.message);
    }
};

export default connectDB;
