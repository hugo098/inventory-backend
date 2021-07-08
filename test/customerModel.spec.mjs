import { validateEmail } from '../models/Customer.mjs';


describe('Customer model test', () => {

    test('Should not be a valid email', () => {
        const email = 'hirodriguezgmailcom';
        expect(validateEmail(email)).toBe(false);
    });

    test('Should be a valid email', () => {
        const email = 'hi@rodriguezgmail.com';
        expect(validateEmail(email)).toBe(true);
    });
})


