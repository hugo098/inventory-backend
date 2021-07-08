import {
    createCustomer,
    listCustomers,
    customerByID,
    readCustomer,
    removeCustomer,    
} from "../controllers/customerCtrl.mjs";
import { jest } from '@jest/globals';
import dotenv from 'dotenv/config'
import mongoose from 'mongoose';
import Customer from "../models/Customer.mjs";

jest.setTimeout(100000000)
describe('Customer Controller Test Suite', () => {
    let ids = [];
    beforeAll(async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
        } catch (error) {
            console.log(error);
        }
    }, 100000);
    const mockRequest = (body) => ({
        body,
    });
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };
    describe('Create Customer Operation', () => {
        test('Should create a new customer', async () => {
            try {
                const c = new Customer({
                    customerType: 'Individual',
                    primaryContact: 'Hugo Rodríguez',
                    companyName: 'Best Company',
                    customerDisplayName: 'Hugo Rodríguez',
                    customerEmail: 'hi.rodriguez@gmail.com',
                    customerPhone: {
                        workPhone: '0971391717',
                        mobilePhone: '0971391717'
                    },
                    contactPersons: [
                        {
                            contactName: 'Ivan Vera',
                            contactEmail: 'ivan@gmail.com',
                            contactPhone: {
                                workPhone: '06921369',
                                mobilePhone: '4561333'
                            }
                        }
                    ]
                });
                ids.push(c._id);
                const req = mockRequest(c);
                const res = mockResponse();
                await createCustomer(req, res);
                expect(res.status).toHaveBeenCalledWith(201);
            } catch (err) {
                console.log(err);
                expect(err).toBeUndefined();
            }
        });
        test('Should create a new customer because require information is exists', async () => {
            try {
                const c = new Customer({
                    customerType: 'Individual',
                    customerDisplayName: 'Hola mundo'
                });
                ids.push(c._id);
                const req = mockRequest(c);
                const res = mockResponse();
                await createCustomer(req, res);
                expect(res.status).toHaveBeenCalledWith(201);
            } catch (err) {
                console.log(err);
                expect(err).toBeUndefined();
            }
        });
        test('Should not create a new customer because missing require information', async () => {
            try {
                const req = mockRequest({
                    primaryContact: 'Hugo'
                });
                const res = mockResponse();
                await createCustomer(req, res);
                expect(res.status).toHaveBeenCalledWith(400);
            } catch (err) {
                console.log(err);
                expect(err).toBeUndefined();
            }
        });
        test('Should not create a new customer because empty req.body', async () => {
            try {
                const req = mockRequest({});
                const res = mockResponse();
                await createCustomer(req, res);
                expect(res.status).toHaveBeenCalledWith(400);
            } catch (err) {
                console.log(err);
                expect(err).toBeUndefined();
            }
        });
        test('Should not create a new customer because wrong email format', async () => {
            try {
                const req = mockRequest({
                    customerType: 'Individual',
                    companyName: 'Best Company',
                    customerDisplayName: 'Hugo Rodríguez',
                    customerEmail: 'hirodriguezgmailcom',
                });
                const res = mockResponse();
                await createCustomer(req, res);
                expect(res.status).toHaveBeenCalledWith(400);
            } catch (err) {
                console.log(err);
                expect(err).toBeUndefined();
            }
        });
        test('Should not create a new customer because wrong customer type value', async () => {
            try {
                const req = mockRequest({
                    customerType: 'Wrong',
                    companyName: 'Best Company',
                    customerDisplayName: 'Hugo Rodríguez'
                });
                const res = mockResponse();
                await createCustomer(req, res);
                expect(res.status).toHaveBeenCalledWith(400);
            } catch (err) {
                console.log(err);
                expect(err).toBeUndefined();
            }
        });
        test('Should not create a new customer because customer display name is too long', async () => {
            try {
                const req = mockRequest({
                    customerType: 'Individual',
                    companyName: 'Best Company',
                    customerDisplayName: "HugodasdasdadsdasdasdasdasadasadasdasdasdasdRodrídasdasdasdasdadsadasdasdasdasguezassssssssssssssssssssssssssssssssssssssssssssdwadadasdasdasdasdas"
                });
                const res = mockResponse();
                await createCustomer(req, res);
                expect(res.status).toHaveBeenCalledWith(400);
            } catch (err) {
                console.log(err);
                expect(err).toBeUndefined();
            }
        });
    });
    describe('List Customers Operation', () => {
        beforeAll(async () => {
            let c1 = new Customer({
                customerType: 'Individual',
                customerDisplayName: 'Hugo Rodríguez-TEST',
            });
            ids.push(c1._id);
            const req1 = mockRequest(c1);
            const res1 = mockResponse();
            let c2 = new Customer({
                customerType: 'Bussiness',
                customerDisplayName: 'Iván Vera-TEST',
            });
            ids.push(c2._id);
            const req2 = mockRequest(c2);
            const res2 = mockResponse();
            let c3 = new Customer({
                customerType: 'Bussiness',
                customerDisplayName: 'CICA CO-TEST',
            });
            ids.push(c3._id);
            const req3 = mockRequest(c3);
            const res3 = mockResponse();
            try {
                await createCustomer(req1, res1);
                await createCustomer(req2, res2);
                await createCustomer(req3, res3);
            } catch (err) {
                console.log(err);
            }
        }, 100000);
        test('Should exists customers', async () => {
            try {
                const req = mockRequest({});
                const res = mockResponse();
                await listCustomers(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalled();
            } catch (err) {
                console.log(err);
                expect(err).toBeUndefined();
            }
        });
        test('Should not list customers because the database is not connected', async () => {
            try {
                await mongoose.connection.close()
                const req = mockRequest({});
                const res = mockResponse();
                await listCustomers(req, res);
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalled();
            } catch (err) {
                console.log(err);
                expect(err).toBeUndefined();
            }
        });
        afterAll(async () => {
            try {
                await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
            } catch (err) {
                console.log(err);
            }
        })
    });
    describe('Find Customer by ID', () => {
        test('Should get a customer', async () => {
            try {
                const req = mockRequest({ customer: undefined });
                const res = mockResponse();
                const mockRead = jest.fn().mockName('Read mock');
                await customerByID(req, res, mockRead, ids[0]);
                expect(mockRead).toHaveBeenCalledTimes(1);
            } catch (err) {
                console.log(err);
                expect(err).toBeUndefined();
            }
        });
        test('Should not get a customer because inexistent id', async () => {
            try {
                const req = mockRequest({ customer: undefined });
                const res = mockResponse();
                const mockRead = jest.fn().mockName('Read mock');
                await customerByID(req, res, mockRead, '52e101befe6f221caca3449e');
                expect(mockRead).toHaveBeenCalledTimes(0);
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({
                    error: "Customer not found",
                });
            } catch (err) {
                console.log(err);
                expect(err).toBeUndefined();
            }
        });
        test('Should not get a customer because bad id format', async () => {
            try {
                const req = mockRequest({ customer: undefined });
                const res = mockResponse();
                const mockRead = jest.fn().mockName('Read mock');
                await customerByID(req, res, readCustomer, '1');
                expect(mockRead).toHaveBeenCalledTimes(0);
                expect(res.status).toHaveBeenCalledWith(400);
            } catch (err) {
                console.log(err);
                expect(err).toBeUndefined();
            }
        });
    });
    describe('Read Customer', () => {
        test('Should response with a customer object', () => {
            const c = new Customer({
                customerType: 'Individual',
                primaryContact: 'Hugo Rodríguez',
                companyName: 'Best Company',
                customerDisplayName: 'Hugo Rodríguez',
                customerEmail: 'hi.rodriguez@gmail.com',
                customerPhone: {
                    workPhone: '0971391717',
                    mobilePhone: '0971391717'
                },
                contactPersons: [
                    {
                        contactName: 'Ivan Vera',
                        contactEmail: 'ivan@gmail.com',
                        contactPhone: {
                            workPhone: '06921369',
                            mobilePhone: '4561333'
                        }
                    }
                ]
            });
            const req = { customer: c };
            const res = mockResponse();
            try {
                readCustomer(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith(c);
            } catch (err) {
                console.log(err);
                expect(err).toBeUndefined();
            }
        });
    });
    describe('Remove Customer', () => {
        test('Should remove a customer object by id', async () => {
            const req = { id: ids[0] }
            const res = mockResponse();
            try {
                await removeCustomer(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
            } catch (err) {
                console.log(err);
                expect(err).toBeUndefined();
            }
        });
        test('Should not remove a customer object because bad id format', async () => {
            const req = { id: '1563' }
            const res = mockResponse();
            try {
                await removeCustomer(req, res);
                expect(res.status).toHaveBeenCalledWith(400);
            } catch (err) {
                console.log(err);
                expect(err).toBeUndefined();
            }
        });
    });
    afterAll(async () => {
        for (let id of ids) {
            try {
                await Customer.deleteOne({ _id: id })
            } catch (err) {
                console.log(err);
            }
        }
        try {
            await mongoose.connection.close();
        } catch (err) {
            console.log(err);
        }
    });

});