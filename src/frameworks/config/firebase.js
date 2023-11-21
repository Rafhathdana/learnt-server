const admin = require('firebase-admin');

const serviceAccount = require("./.firebase/firebaseAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin