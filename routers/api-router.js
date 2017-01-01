'use strict';

const express = require('express');

module.exports = function(app, data) {
    let apiController = require('../controllers/api-controller')(data);
    let condominimumController = require('../controllers/condominimum-controller')(data);
    let apartmentController = require('../controllers/apartment-controller')(data);
    let protocolController = require('../controllers/protocols-controller')(data);
    let managerUnionController = require('../controllers/managerUnion-controller')(data);

    let router = express.Router();

    router.post('/users', apiController.register);
    router.post('/authenticate', apiController.login);
    router.post('/change-image', apiController.changeImage);
    router.post('/getUserByFacebookAuthToken', apiController.getUserByFacebookAuthToken);
    router.post('/addTask', apiController.addTask);

    router.get('/condominimums', condominimumController.getAllCondominiums);
    router.post('/condominimums', condominimumController.createCondominium);
    router.post('/findCondominimums', condominimumController.findCondominimumBy);
    router.post('/addApartmentToCondominimum', condominimumController.addApartmentToCondominium);
    router.post('/addUserToApartmentInCondominium', condominimumController.AddUserToApartmentInCondominium);

    router.get('/apartments', apartmentController.getAllApartments);
    router.post('/apartments', apartmentController.createApartment);
    router.post('/findApartments', apartmentController.findApartmentBy);
    router.post('/addUserToApartment', apartmentController.addUserToApartment);

    router.get('/protocols', protocolController.getAllProtocols);
    router.post('/protocols', protocolController.createProtocol);
    router.post('/findProtocol', protocolController.findProtocolBy);

    router.get('/managerUnions', managerUnionController.getAllManagerUnions);
    router.post('/managerUnions', managerUnionController.createManagerUnion);
    router.post('/findManagerUnion', managerUnionController.findManagerUnionBy);
    router.post('/addMemberToManagerUnion', managerUnionController.addMemberToManagerUnion);
    router.post('/changeCashierName', managerUnionController.changeCashierName);

    app.use('/api', router);
};