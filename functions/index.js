const functions = require("firebase-functions");
const admin = require('firebase-admin');
import AddDataFunction from './addDataHandler';

admin.initializeApp()


exports.testAPI = functions.https.onRequest(AddDataFunction.handler);