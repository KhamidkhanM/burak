// Entry point of the app: loads env vars, connects to MongoDB, then starts the server.
import dotenv from 'dotenv';
dotenv.config(); // loads variables from .env (MONGO_URL, PORT, SESSION_SECRET, etc.)

import mongoose from 'mongoose';
import app from './app';

// connect to MongoDB first, only start listening for requests once the DB is ready
mongoose.connect(process.env.MONGO_URL as string, {})
.then((data) => {
    console.log("Connection to MongoDB successful");
    const PORT = process.env.PORT ?? 3007;
    app.listen(PORT, () => {
        console.info(`The Server is running on port ${PORT}`);
        console.info(`Admin project on http://localhost:${PORT}/admin \n`);
    });
})
.catch(err => console.log("Error connecting to MongoDB", err));