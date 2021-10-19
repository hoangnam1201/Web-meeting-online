import express, { json, urlencoded, Response, Request } from 'express';
import mongoose from 'mongoose';
import { createServer, Server } from 'http';
import dotenv from 'dotenv';
import initRouter from './src/api/routers/index.router'
import { initIOServer } from './src/io/index';
import { ExpressPeerServer } from 'peer';
import { databaseConfig } from './src/config/database.config';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
const httpServer: Server = createServer(app);

app.use((req: Request, res: Response, next: any) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(json());
app.use(urlencoded({ extended: false }));

const uri = databaseConfig.connectionString;
mongoose.connect(uri);

// peerjs
const peerServer = ExpressPeerServer(httpServer, {
    path: '/meeting'
})
app.use('/peerjs', peerServer);

// socketjs
initIOServer(httpServer);

// api
initRouter(app);

// test
app.get('/api/test', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

httpServer.listen(PORT, () => console.log('listen on port ' + PORT));
