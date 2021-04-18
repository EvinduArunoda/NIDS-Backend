const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp()


exports.testAPI = functions.https.onRequest(async (request, response) => {
    console.log(request.body)
    response.status(200).send(request.body)
});