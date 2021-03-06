import mongoose from 'mongoose';
const { Schema } = mongoose;

export const validateEmail = function (email) {
    if (email) {
        const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(email);
    }
    return true;
};

export const CustomerSchema = new Schema({
    customerType: {
        type: String,
        trim: true,
        maxLength: [15, 'The customer type description is too long'],
        enum: { values: ['Bussiness', 'Individual'], message: '{VALUE} is not supported' },
        required: [true, 'Customer type is required']
    },
    primaryContact: {
        type: String,
        maxLength: [50, 'The primary contact name of the customer is too long'],
        trim: true,
        default: null
    },
    companyName: {
        type: String,
        maxLength: [50, 'The company name of the customer is too long'],
        trim: true,
        default: null
    },
    customerDisplayName: {
        type: String,
        maxLength: [50, 'The customer display name is too long'],
        required: [true, 'The Customer display name is required']
    },
    customerEmail: {
        type: String,
        maxLength: [30, 'The email is too long'],
        trim: true,
        lowercase: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        default: null
    },
    customerPhone: {
        workPhone: {
            type: String,
            maxLength: [20, 'The work phone number is too long'],
            default: null
        },
        mobilePhone: {
            type: String,
            maxLength: [20, 'The mobile phone number is too long'],
            default: null
        }
    },
    contactPersons: [
        {
            contactName: {
                type: String,
                maxLength: [50, 'The contact name of the customer is too long'],               
                trim: true,
            },
            contactEmail: {
                type: String,
                maxLength: [30, 'The email is too long'],
                trim: true,
                lowercase: true,
                validate: [validateEmail, 'Please fill a valid email address'],                
            },
            contactPhone: {
                workPhone: {
                    type: String,
                    maxLength: [20, 'The work phone number is too long'],                    
                },
                mobilePhone: {
                    type: String,
                    maxLength: [20, 'The mobile phone number is too long'],                    
                }
            }
        }
    ]
}, { timestamps: true });

export default mongoose.model('Customer', CustomerSchema);

