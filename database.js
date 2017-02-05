var admin = require('firebase-admin');
var config = require('./json/config.json');
var serviceAccount = require("./json/service-firebase.json");

var firebase;

module.exports = {
    startFireBase: function() {
        //firebase.initializeApp(app);
        firebase = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: config.databaseURL

        });

        var ref = admin.database().ref();

        console.log("Firebase started");
    },
    writeUserData: function(userId, name, imageUrl, nickname) {
        firebase.database().ref('users/' + name + "@" + userId).set({
            username: name,
            profile_picture: imageUrl,
            discordUserId: userId,
            level: 0,
            nick: nickname
        });
        //console.log(firebase.database().data());
    },
    getUserData: function(userId, name, callback) {
        var ref = admin.database().ref('users/' + name + "@" + userId);

        var firebaseData;

        ref.on('value', function(dataSnapshot) {
            firebaseData = dataSnapshot.val();
            console.log(firebaseData);
            callback(firebaseData);
        }, function(errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

        return firebaseData;
    },
    removeUserData: function(userId, name) {
        var ref = admin.database().ref('users/' + name + "@" + userId);
        ref.remove();
    }

};
