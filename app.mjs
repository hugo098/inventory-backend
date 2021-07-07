import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import * as http from 'http';
import dotenv from 'dotenv/config.js';
import { default as DBG } from 'debug';
const debug = DBG('inventory:debug');
const dbgerror = DBG('inventory:error');

import { approotdir } from './support/approotdir.mjs';
const __dirname = approotdir;

import {
    normalizePort,
    onError,
    onListening,
    handle404,
    basicErrorHandler
} from './support/appsupport.mjs';

export const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

import customerRoutes from './routes/customerRoutes.mjs';

app.use('/', customerRoutes);


app.get('/', (req, res) => {
    res.send("Hello")
})



// error handlers
// catch 404 and forward to error handler
app.use(handle404);
app.use(basicErrorHandler);

export const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

export const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

import mongoose from 'mongoose';
import Customer from './models/Customer.mjs';
try {
    mongoose.Promise = global.Promise
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    console.log('Data base connection established');
} catch (error) {
    console.log('error')
}

mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${config.mongoUri}`)
});