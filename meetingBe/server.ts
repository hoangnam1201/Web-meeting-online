import express, { json, urlencoded, Express, Response, Request } from 'express';
import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import { createServer } from 'http';
import dotenv from 'dotenv';
import initRouter from './src/api/routers/index.router'
import { initIOServer } from './src/io/index';
import { ExpressPeerServer } from 'peer';
import { databaseConfig } from './src/config/database.config';
import notificationModel from './src/models/notifications.model';

interface ExpressApp extends Express {
    io?: Server
}

dotenv.config();
const PORT = process.env.PORT || 3000;
const app: ExpressApp = express();
const httpServer = createServer(app);

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

// socketjs
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    }
});
initIOServer(io);

// peerjs
const peerServer = ExpressPeerServer(httpServer, {
    path: '/meeting'
})
app.use('/peerjs', peerServer);

// api
app.io = io;
initRouter(app);

// test
app.get('/api/test', (req: any, res) => {
    notificationModel.create({
        type: 1,
        content: 'tham gia',
        user: '6151d301c93ac0467e79394a',
        read: false,
    }).then(() => {
        // req.app.io.emit('notification', 'tao thanh cong')
    }
    );
    res.status(200).json({ status: 'ok' });
});

httpServer.listen(PORT, () => console.log('listen on port ' + PORT));

