const admin = require('firebase-admin');
const serviceAccount = require('./firebase-creds.json');

class Firebase {
    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://speelpleinweekend-app.firebaseio.com"
        });

        // Reference collections
        this.userRef = admin.database();
    }

    // Save user to Firebase
    saveUser(user, callback) {
        this.userRef.ref('users/' + user.uid).set(user, () => {
            callback(null, user);
        });
    }

    getUserByUid(uid, callback) {
        this.userRef.ref('users/' + uid).once('value')
        .then((snapshot) => {
            let data = snapshot.val();
            callback(null, data);
        })
        .catch((err) => {
            callback({error: err}, null);
        });
    }

    getUserByName(name, callback) {
        this.userRef.ref('users/').once('value')
        .then((snapshot) => {
            let data = snapshot.val();
            let keys = Object.keys(data);
            let user = null;
            for(let i = 0; i < keys.length; i++) {
                let k = keys[i];
                if(data[k].f_name == name) {
                    user = data[k];
                }
            }
            callback(null, user);
        })
        .catch((err) => {
            callback({error: err}, null);
        });
    }

    getUsers(callback) {
        this.userRef.ref('users/').once('value')
        .then((snapshot) => {
            let users = [];
            let data = snapshot.val();
            let keys = Object.keys(data);
            for(let i = 0; i < keys.length; i++) {
                let k = keys[i];
                users.push(data[k]);
            }
            callback(null, users);
        })
        .catch(err => {
            callback({error: err}, null);
        });
    }

    deleteUser(uid) {
        this.userRef.ref('users/' + uid).remove()
    }

    updateUser(uid, updatedUser, callback) {
        this.userRef.ref('users/' + uid).update(updatedUser, (err) => {
            if(err) {
                callback({
                    error: "Something went wrong whilst updating your account."
                }, null);
            } else {
                callback(null, updatedUser);
            }
        });
    }
}

module.exports = new Firebase();