import { mongoConnect, mongoClose } from "../support/mongoConnection.mjs";


describe('Test for the mongodb connection class', () => {
    test('Should connect to the database', async () => {
        expect(await mongoConnect()).toBeDefined();
    });
    test('Should close the database connection', async () => {
        await mongoConnect();
        expect(await mongoClose()).toBeUndefined();
    }); 
});