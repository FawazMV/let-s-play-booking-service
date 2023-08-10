import dotenv from 'dotenv'
import express from 'express'
import Router from './Routes.js'
import mongoose from 'mongoose'
import cors from 'cors'
import connectDB from './Models/config.js'
import sendMail from './Helpers/nodemailer.js'


dotenv.config()
const app = express()
app.use(express.json());
const corsOptions = {
    origin: ['https://let-s-play-user-service.onrender.com', 'https://let-s-play-turf-service.onrender.com'],
    methods: 'GET,POST,put,PUT,DELETE',
    preflightContinue: true,
    optionsSuccessStatus: 200,
    credentials: true
};

app.use(cors(corsOptions));

app.use('/', Router)

connectDB()
mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(4321, () => {
        console.log(`Server running on port 4321`);
    });
});