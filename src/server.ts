import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import app from './app';

mongoose.connect(process.env.MONGO_URL as string, {})
.then((data) => {
    console.log("Connection to MongoDB successful");
    const PORT = process.env.PORT ?? 3007;
    app.listen(PORT, () => {
        console.log(`The Server is running on port ${PORT}`);
    });
})
.catch(err => console.log("Error connecting to MongoDB", err));