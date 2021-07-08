import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import * as http from 'http';
import dotenv from 'dotenv/config.js';
import { default as DBG } from 'debug';
import mongoose from 'mongoose';
import { approotdir } from './support/approotdir.mjs';
import {
    normalizePort,
    onError,
    onListening,
    handle404,
    basicErrorHandler
} from './support/appsupport.mjs';
import { app } from './app.mjs';

const __dirname = approotdir;
const debug = DBG('inventory:debug');
const dbgerror = DBG('inventory:error');



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