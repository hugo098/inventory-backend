import request from "supertest";
import mongoose from "mongoose";
import { app } from "../app.mjs";
import dotenv from 'dotenv/config.js';
import { jest } from '@jest/globals';
import Customer from "../models/Customer.mjs";

jest.setTimeout(100000000)
describe("Customer API test suite", () => {
    let ids = [];
    beforeAll(async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
        } catch (error) {
            console.log(error);
        }
    }, 100000);
    describe("POST /customers", () => {
        test("Should create a new Customer", (done) => {
            request(app)
                .post('/customers')
                .send({
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
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    ids.push(res.body.customer._id);
                    return done();
                });
        });
        test("Should create a new customer because require information is exists", (done) => {
            request(app)
                .post('/customers')
                .send({
                    customerType: 'Individual',
                    customerDisplayName: 'Hugo Rodríguez',
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    ids.push(res.body.customer._id);
                    return done();
                });
        });
        test("Should not create a new customer because missing require information", (done) => {
            request(app)
                .post('/customers')
                .send({
                    primaryContact: 'Hugo'
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    return done();
                });
        });
        test("Should not create a new customer because empty req.body", (done) => {
            request(app)
                .post('/customers')
                .send({
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    return done();
                });
        });
        test("Should not create a new customer because wrong email format", (done) => {
            request(app)
                .post('/customers')
                .send({
                    customerType: 'Individual',
                    companyName: 'Best Company',
                    customerDisplayName: 'Hugo Rodríguez',
                    customerEmail: 'hirodriguezgmailcom',
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    return done();
                });
        });
        test("Should not create a new customer because wrong customer type value", (done) => {
            request(app)
                .post('/customers')
                .send({
                    customerType: 'Wrong',
                    companyName: 'Best Company',
                    customerDisplayName: 'Hugo Rodríguez'
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    return done();
                });
        });
        test("Should not create a new customer because customer display name is too long", (done) => {
            request(app)
                .post('/customers')
                .send({
                    customerType: 'Individual',
                    companyName: 'Best Company',
                    customerDisplayName: 'Hugo Rodríguezsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    return done();
                });
        });        


    });
    describe("GET /customers", ()=>{
        test("Should exists customers", (done) => {
            request(app)
                .get('/customers')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)                
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }                    
                    return done();
                });
        });
    });
    describe("GET /customers/:customerId", ()=>{
        test("Should get a customer", (done) => {
            request(app)
                .get(`/customers/${ids[0]}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)                
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }                    
                    return done();
                });
        });
        test("Should not get a customer because inexistent id", (done) => {
            request(app)
                .get(`/customers/52e101befe6f221caca3449e`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)                
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }                    
                    return done();
                });
        });
        test("Should not get a customer because bad id format", (done) => {
            request(app)
                .get(`/customers/sa546f`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)                
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }                    
                    return done();
                });
        });
    });   
    describe("PUT /customers/:customerId", ()=>{
        test("Should update a customer", (done) => {
            request(app)
                .put(`/customers/${ids[0]}`)
                .field('customerDisplayName', 'Hugo Updated')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                    expect(res.body.customer.customerDisplayName).toBe('Hugo Updated')
                })                
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });
        test("Should not update a customer because inexistent id", (done) => {
            request(app)
                .put(`/customers/52e101befe6f221caca3449e`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)                              
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });
        test("Should not update a customer because bad id format", (done) => {
            request(app)
                .put(`/customers/1`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)                              
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });              
    });
    describe("DELETE /customers/:customerId", ()=>{
        test("Should delete a customer", (done) => {
            request(app)
                .delete(`/customers/${ids[0]}`)                
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                    expect(res.body.message).toBe('Customer deleted successfully');
                })                
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });
        test("Should not delete a customer because inexistent id", (done) => {
            request(app)
                .delete(`/customers/52e101befe6f221caca3449e`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .expect(function(res){
                    expect(res.body.error).toBe('Customer not found');
                })                               
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });
        test("Should not update a customer because bad id format", (done) => {
            request(app)
                .delete(`/customers/1`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .expect(function(res){
                    expect(res.body.error).toBe('Could not retrieve the customer');
                })                               
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
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
        } catch (error) {
            console.log(error);
        }
    }, 100000);
})