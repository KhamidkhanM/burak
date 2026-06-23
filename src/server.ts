// Entry point of the app: loads env vars, connects to MongoDB, then starts the server.
import dotenv from 'dotenv'; // package that reads variables from a .env file
dotenv.config(); // loads .env into process.env (MONGO_URL, PORT, SESSION_SECRET, etc.)

import mongoose from 'mongoose'; // MongoDB ODM (object document mapper)
import app from './app'; // the configured Express app (middlewares + routers)

// connect to MongoDB first, only start listening for requests once the DB is ready
mongoose.connect(process.env.MONGO_URL as string, {}) // process.env.MONGO_URL is the connection string from .env
.then((data) => { // runs once the connection succeeds
    console.log("Connection to MongoDB successful"); // confirms DB connection in the console
    const PORT = process.env.PORT ?? 3007; // use PORT from .env, or fall back to 3007
    app.listen(PORT, () => { // start the HTTP server on that port
        console.info(`The Server is running on port ${PORT}`); // confirms the server started
        console.info(`Admin project on http://localhost:${PORT}/admin \n`); // helpful link to the admin panel
    });
})
.catch(err => console.log("Error connecting to MongoDB", err)); // runs if the DB connection fails
