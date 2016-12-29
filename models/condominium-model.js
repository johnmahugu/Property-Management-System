const mongoose = require('mongoose');

let propertySchema = new mongoose.Schema({
    manager: {
        type: Object,
        required: true
    },
    apartments: {
        type: [Object],
        required: true
    },
    floatNumber: {
        type: String,
        required: true
    },
    entrance: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    neighborhood: {
        type: String
    }
});

mongoose.model('Condominium', propertySchema);

module.exports = mongoose.model('Condominium');