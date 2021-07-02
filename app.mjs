import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import * as http from 'http';

import { approotdir } from './approotdir.mjs';
const __dirname = approotdir;

import {
    normalizePort,
    onError,
    onListening,
    handle404,
    basicErrorHandler
} from './appsupport.mjs';

export const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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