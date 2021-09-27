import express, { json, urlencoded, Response, Request } from 'express';
import mongoose from 'mongoose';
import { createServer, Server } from 'http';
import dotenv from 'dotenv';
import initRouter from './src/api/routers/index.router'
import { initIOServer } from './src/io/index';

dotenv.config();
const app = express();
const httpServer: Server = createServer(app);

const PORT = process.env.PORT || 3000;

app.use((req: Request, res: Response, next: any) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(json());
app.use(urlencoded({ extended: false }));

const uri = 'mongodb://localhost:27017/meetingdb';
mongoose.connect(uri);

initRouter(app);
initIOServer(httpServer);

httpServer.listen(PORT, () => console.log('listen on port ' + PORT));
