import mongoose from "mongoose"
import dotenv from 'dotenv/config'
import DBG from 'debug';
const debug = DBG('inventory:inventory-mongodb');
const error = DBG('inventory:error-mongodb');

let conn = undefined;

export const mongoConnect = async () => {
    try {
        if (conn === undefined)
            conn = await mongoose.createConnection(process.env.MONGO_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
        debug(conn);
        return conn;
    } catch (err) {
        error(err);
    }
}

export const mongoClose = async () => {
    try {
        await conn.close();
        debug(conn);
    } catch (err) {
        error(err);
    }
}
