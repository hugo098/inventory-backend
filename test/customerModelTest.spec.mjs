import { default as Customer, CustomerSchema, validateEmail } from '../models/Customer.mjs';
/*import Chai from 'chai';
const assert = Chai.assert;

describe('Customer Model Test', function () {
    it('Should create a proper customer', function () {
        const customer = new Customer({
            customerDisplayName: "Hugo",
            customerType: 'Individual'
        });
        assert.exists(customer);
        assert.deepEqual({
            customerDisplayName: customer.customerDisplayName, customerType: customer.customerType
        }, {
            customerDisplayName: 'Hugo',
            customerType: 'Individual'
        });
    });
    it('Should create a customer schema', function () {
        const customerSchema = CustomerSchema;
        assert.exists(customerSchema);
    });
    it('Should be a valid email', function () {
        const email = 'hi.rodriguez@gmail.com';
        assert.equal(validateEmail(email), true);
    });
    it('Should not be a valid email', function () {
        const email = 'hirodriguezgmailcom';
        assert.notEqual(validateEmail(email), true);
    });
});*/


test('Should not be a valid email', ()=>{
    const email = 'hirodriguezgmailcom';
    expect(validateEmail(email)).toBe(false);
})