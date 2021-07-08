import express from 'express';
const router = express.Router();

import {
    listCustomers,
    customerByID,
    removeCustomer,
    readCustomer,
    createCustomer,
    updateCustomer
} from '../controllers/customerCtrl.mjs';

router.route('/customers')
    .get(listCustomers)
    .post(createCustomer)

router.route('/customers/:customerId')
    .get(readCustomer)
    .delete(removeCustomer)
    .put(updateCustomer)

router.param('customerId', customerByID)

export default router;