import express from 'express';
import path from 'path';
import router from './router';
import routerAdmin from './routerAdmin';


/** 1-Entrance **/
const app = express();
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/** 2-Sessions **/

/** 3-VIEWS **/
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

/** 4-ROUTERS **/
app.use("/admin", routerAdmin); //admin panel routes       
app.use('/', router);       //middleware design pattern
export default app;