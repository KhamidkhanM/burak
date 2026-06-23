import express from 'express'; // web framework
import path from 'path'; // node utility for building file paths
import router from './router'; // SPA/API routes ('/')
import routerAdmin from './routerAdmin'; // SSR admin panel routes ('/admin')
import morgan from 'morgan'; // request logger middleware
import { MORGAN_FORMAT } from './libs/config'; // custom log line format

import session from 'express-session'; // session middleware (keeps users logged in)
import ConnectMongoDB from 'connect-mongodb-session'; // stores sessions in MongoDB instead of memory
import T from './libs/types/common'; // generic object type helper

// stores session data (who's logged in) inside MongoDB instead of server memory
const MongoDBStore = ConnectMongoDB(session); // wraps express-session with a MongoDB store
const store = new MongoDBStore({
    uri: process.env.MONGO_URL as string, // same DB connection string used for the app's data
    collection: 'sessions' // sessions are saved in their own "sessions" collection
});

// store.on('error', function (error) {
//     console.log('Session store error:', error);
// });

/** 1-Entrance: basic middlewares **/
const app = express(); // creates the Express application
app.use(express.static(path.join(__dirname, 'public'))); // serves /public (css, js, images) directly
app.use(express.urlencoded({ extended: true })); // parses HTML form data (signup/login forms)
app.use(express.json()); // parses JSON bodies (used by SPA/API and AJAX calls)
app.use(morgan(MORGAN_FORMAT)); //morgan logger, logs every request to the console

/** 2-SESSIONS: keeps logged-in admin/member info between requests **/
app.use(
  session({
    secret: String(process.env.SESSION_SECRET), // used to sign the session id cookie
    cookie: {
      maxAge: 1000 * 3600 * 6, // 1 week
    },
    store: store, // sessions are saved in MongoDB (not memory), so they survive server restarts
    resave: true, // always re-save the session, even if nothing changed
    saveUninitialized: true, // save new sessions even before anything is stored in them
  })
);

// makes the logged-in member available to every EJS view as `member` (e.g. for nav menus)
app.use((req, res, next) => {
    const sessionInstance = req.session as T; // cast session to a generic object type
    res.locals.member = sessionInstance.member; // expose it to all EJS templates as `member`
    next(); // continue to the next middleware/route
});

/** 3-VIEWS: EJS template engine setup for the admin (SSR) pages **/
app.set('views', path.join(__dirname, 'views')); // folder where .ejs templates live
app.set('view engine', 'ejs'); // use EJS to render views

/** 4-ROUTERS **/
app.use("/admin", routerAdmin); //ssr - admin panel (restaurant owner), EJS pages
app.use('/', router);       //spa - public/user-facing JSON API
export default app; // exported so server.ts can start listening on it
