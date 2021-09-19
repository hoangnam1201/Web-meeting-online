import express, { json, urlencoded } from 'express';
import mongoose from 'mongoose';
import http from 'http';
import dotenv from 'dotenv';
import initRouter from './src/api/routers/index.router.js';

const app = express();
const server = http.Server(app);
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(function (req, res, next) {
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

server.listen(PORT, () => console.log('listen on port ' + PORT))
