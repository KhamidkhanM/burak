import express from 'express';
import path from 'path';
import router from './router';
import routerAdmin from './routerAdmin';
import morgan from 'morgan';
import { MORGAN_FORMAT } from './libs/config';

import session from 'express-session';
import ConnectMongoDB from 'connect-mongodb-session';
import T from './libs/types/common';

const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
    uri: process.env.MONGO_URL as string,
    collection: 'sessions'
});

// store.on('error', function (error) {
//     console.log('Session store error:', error);
// });

/** 1-Entrance **/
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan(MORGAN_FORMAT)); //morgan logger

/** 2-SESSIONS **/
app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    cookie: {
      maxAge: 1000 * 3600 * 6, // 1 week
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
    const sessionInstance = req.session as T;
    res.locals.member = sessionInstance.member;
    next();
});

/** 3-VIEWS **/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/** 4-ROUTERS **/
app.use("/admin", routerAdmin); //ssr      
app.use('/', router);       //spa
export default app;