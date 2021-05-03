const functions = require("firebase-functions");
const admin = require('firebase-admin');
const AddAttackData = require('./adddetectedAttacks');

admin.initializeApp()


exports.addDetectedAttacks = functions.https.onRequest(AddAttackData.handler);