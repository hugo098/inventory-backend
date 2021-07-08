import { default as Customer } from '../models/Customer.mjs';
import formidable from 'formidable';
import extend from 'lodash/extend.js';
import DBG from 'debug';
const debug = DBG('inventory:customer-mongodb');
const error = DBG('inventory:error-mongodb');

const createCustomer = async (req, res) => {
    const customer = new Customer(req.body)
    try {
        await customer.save();
        debug(res);
        return res.status(201).json({
            message: "Customer successfully created",
            customer: customer
        });
    } catch (err) {
        error(err);
        return res.status(400).json({
            message: "Fail to create a customer",
            error: err
        });
    }
}

const listCustomers = async (req, res) => {
    try {
        let customers = await Customer.find();
        debug(res);
        return res.status(200).json({
            customers
        });
    } catch (err) {
        debug(err);
        return res.status(400).json({
            err
        });
    }
}

const customerByID = async (req, res, next, id) => {
    try {
        let customer = await Customer.findById(id);
        if (!customer)
            return res.status(400).json({
                error: "Customer not found"
            });
        debug(customer);
        req.id = id;
        req.customer = customer;
        next();
    } catch (err) {
        debug(err);
        return res.status(400).json({
            error: "Could not retrieve the customer",
            stack: err
        });
    }
}

const readCustomer = (req, res) => {
    return res.status(200).json(req.customer);
}

const removeCustomer = async (req, res) => {
    try {
        await Customer.deleteOne({ _id: req.id });
        return res.status(200).json(
            {
                message: "Customer deleted successfully",
                customer: req.customer
            }
        );
    } catch (err) {
        return res.status(400).json({
            error: err
        });
    }
}

const updateCustomer = async (req, res) => {
    
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.maxFields = 7;
    form.maxFileSize = 2;    
    console.log(form)
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        let customer = req.customer;
        customer = extend(customer, fields);
        customer.updatedAt = Date.now();
        try {
            await customer.save();
            debug(customer);
            return res.status(200).json({ customer });
        } catch (dbErr) {
            debug(dbErr);
            return res.status(400).json({
                error: dbErr
            });
        }
    });
}

export {
    createCustomer,
    listCustomers,
    customerByID,
    readCustomer,
    removeCustomer,
    updateCustomer
}


