const functions = require("firebase-functions");
const admin = require('firebase-admin');
const AddDataFunction = require('./addDataHandler');
const AddAttackData = require('./adddetectedAttacks');

admin.initializeApp()


exports.testAPI = functions.https.onRequest(AddDataFunction.handler);
exports.addDetectedAttacks = functions.https.onRequest(AddAttackData.handler);