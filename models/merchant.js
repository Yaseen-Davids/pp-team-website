const mongoose = require('mongoose');

// User Schema
const MerchantSchema = mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true,
    },
    sandbox:{
        type: String,
        required: true
    },
    documents:{
        type: String,
        required: true
    },
    contract:{
        type: String,
        required: true
    },
    update:{
        type: String,
        required: true
    }
});

const Merchant = module.exports = mongoose.model('Merchant', MerchantSchema);