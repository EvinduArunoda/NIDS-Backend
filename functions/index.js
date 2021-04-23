const functions = require("firebase-functions");
const admin = require('firebase-admin');
const AddDataFunction = require('./addDataHandler');

admin.initializeApp()


exports.testAPI = functions.https.onRequest(AddDataFunction.handler);