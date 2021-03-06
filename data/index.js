/*globals global module require*/
"use strict";

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

module.exports = function(config) {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.connectionString);

    let User = require('../models/user-model');
    let Chat = require('../models/chat-model');
    let Condominium = require('../models/condominium-model');
    let Apartment = require('../models/apartment-model');
    let Protocol = require('../models/protocol-model');
    let ManagerUnion = require('../models/managerUnion-model');
    let ControlUnion = require('../models/controlUnion-model');
    let TownshipMessage = require('../models/townshipMessage-model');
    let Feedback = require('../models/feedback-model');
    let models = { User, Condominium, Apartment, Protocol, Chat, ManagerUnion, ControlUnion, TownshipMessage, Feedback };

    let data = {};

    fs.readdirSync('./data')
        .filter(x => x.includes('-data')) //loads only files that ends on '-data' ex. 'auctions-data.js'
        .forEach(file => {
            let dataModule = require(path.join(__dirname, file))(models); //dir name if any of you use linux

            Object.keys(dataModule)
                .forEach(key => {

                    data[key] = dataModule[key];

                })
        });
    return data;
};