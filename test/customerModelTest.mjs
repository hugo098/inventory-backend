import util from 'util';
import Customer from '../models/Customer.mjs';
import Chai from 'chai';
const assert = Chai.assert;

describe('Customer Model Test', function () {
    it('Should create a proper customer', function () {
        const customer = new Customer({
            customerDisplayName: "Hugo",
            customerType: 'Individual'
        })
        console.log(customer)        
        assert.exists(customer);
        assert.deepEqual({
            customerDisplayName: customer.customerDisplayName, customerType: customer.customerType
        }, {
            customerDisplayName: 'Hugo',
            customerType: 'Individual'            
        });
    });    
});
