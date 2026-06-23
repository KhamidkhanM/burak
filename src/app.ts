import express from 'express';
import path from 'path';
import router from './router';
import routerAdmin from './routerAdmin';
import morgan from 'morgan';
import { MORGAN_FORMAT } from './libs/config';

import session from 'express-session';
import ConnectMongoDB from 'connect-mongodb-session';
import T from './libs/types/common';

// stores session data (who's logged in) inside MongoDB instead of server memory
const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
    uri: process.env.MONGO_URL as string,
    collection: 'sessions'
});

// store.on('error', function (error) {
//     console.log('Session store error:', error);
// });

/** 1-Entrance: basic middlewares **/
const app = express();
app.use(express.static(path.join(__dirname, 'public'))); // serves /public (css, js, images) directly
app.use(express.urlencoded({ extended: true })); // parses HTML form data (signup/login forms)
app.use(express.json()); // parses JSON bodies (used by SPA/API and AJAX calls)
app.use(morgan(MORGAN_FORMAT)); //morgan logger, logs every request to the console

/** 2-SESSIONS: keeps logged-in admin/member info between requests **/
app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    cookie: {
      maxAge: 1000 * 3600 * 6, // 1 week
    },
    store: store, // sessions are saved in MongoDB (not memory), so they survive server restarts
    resave: true,
    saveUninitialized: true,
  })
);

// makes the logged-in member available to every EJS view as `member` (e.g. for nav menus)
app.use((req, res, next) => {
    const sessionInstance = req.session as T;
    res.locals.member = sessionInstance.member;
    next();
});

/** 3-VIEWS: EJS template engine setup for the admin (SSR) pages **/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/** 4-ROUTERS **/
app.use("/admin", routerAdmin); //ssr - admin panel (restaurant owner), EJS pages
app.use('/', router);       //spa - public/user-facing JSON API
export default app;