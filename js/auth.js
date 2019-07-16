//Initialize Firebase
var config = {
    apiKey: "AIzaSyDD7xVpB2V9fo3eWnj0p_EgRWz8gMC42wk",
    authDomain: "language-94092.firebaseapp.com",
    databaseURL: "https://language-94092.firebaseio.com",
    projectId: "language-94092",
    storageBucket: "language-94092.appspot.com",
    messagingSenderId: "632483945219"
};
firebase.initializeApp(config);

var db = firebase.database();

/**
* Handles the sign in button press.
*/
function toggleSignIn() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
            alert('Please enter an email address.');
            return;
        }
        if (password.length < 4) {
            alert('Please enter a password.');
            return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
            document.getElementById('quickstart-sign-in').disabled = false;
            // [END_EXCLUDE]
        });
        // [END authwithemail]
    }
    document.getElementById('quickstart-sign-in').disabled = true;
}


/**
* Handles the sign up button press.
*/
function handleSignUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a password.');
        return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END createwithemail]
}
      
      
/**
* Sends an email verification to the user.
*/
function sendEmailVerification() {
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function () {
        // Email Verification sent!
        // [START_EXCLUDE]
        alert('Email Verification Sent!');
        // [END_EXCLUDE]
    });
    // [END sendemailverification]
}


/**
* Sends password reset to the user.
*/
function sendPasswordReset() {
    var email = document.getElementById('email').value;
    // [START sendpasswordemail]
    firebase.auth().sendPasswordResetEmail(email).then(function () {
        // Password Reset Email Sent!
        // [START_EXCLUDE]
        alert('Password Reset Email Sent!');
        // [END_EXCLUDE]
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') {
            alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
}


function initApp() {

    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function (user) {

        document.getElementById('quickstart-verify-email').disabled = true;
        
        if (user) {  // [USER_SIGNED_IN]

            // [NAV_LINKS]
            var email = user.email.split('.').join("");
            var ref = db.ref('/Users/' + email + "/Data");

            ref.once("value", function(snap){
                //only researchers can see PAT data and upload classes
                if (snap.child('accountType').val() == "researcher"){
                    document.getElementById('pat').classList.remove('disabled');
                    document.getElementById('class').classList.remove('disabled');
                }
                document.getElementById('stats').classList.remove('disabled');
            });
            // [END_NAV_LINKS]

            

            //[SIGN_IN_FORM]
            // sign in toggle
            //document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
            document.getElementById('quickstart-sign-in').textContent = 'Sign out';

            // verify email toggle
            var emailVerified = user.emailVerified;
            if (!emailVerified) {
                document.getElementById('quickstart-verify-email').disabled = false;
            }
            // [END_SIGN_IN_FORM]



            //[SETTINGS_FORM]
            //set placeholders for settings form
            setPlaceholders();

            // enable the settings form
            document.getElementById('name').disabled = false;
            //document.getElementById('level').disabled = false;
            document.getElementById('accountType').disabled = false;

            // enable the setting form buttons
            document.getElementById('save-button').disabled = false;
            document.getElementById('cancel-button').disabled = false;
            
            // settings form button listeners
            document.getElementById('save-button').onclick = function(){

                // get new profile values from settings form
                var newName = document.getElementById('name').value;
                var newAccountType = document.getElementById('accountType').value;
                //var newLevel = document.getElementById('level').value;

                // check new name value
                firebase.auth().onAuthStateChanged(function(user) {  

                    // update new name
                    ref.once("value", function(snap){

                        // if new name is null or empty while current name in the DB is not defined
                        if (newName.length == 0){
                            if (snap.child("name").val() == null){
                                alert('Please enter your new name.');
                                return;
                            } else if (snap.child("name").val().length == 0){
                                alert('Please enter your new name.');
                                return;
                            } 
                        } else {
                            updateProperty(newName, "name");
                        }  
                    })
                });  
                
                updateProperty(newAccountType, "accountType");
                //updateProperty(newLevel, "level");

                // set placeholders
                setPlaceholders();
                
            }
            document.getElementById('cancel-button').onclick = function(){
                setPlaceholders();
            }
            // [END_SETTINGS_FORM]

        } else {  // [USER_SIGNED_OUT]

            // [NAV_LINKS]
            document.getElementById('stats').classList.add('disabled');
            document.getElementById('pat').classList.add('disabled');
            document.getElementById('class').classList.add('disabled');

            // disable the settings form
            document.getElementById('name').disabled = true;
            //document.getElementById('level').disabled = true;
            document.getElementById('accountType').disabled = true;

            // disable the setting form buttons
            document.getElementById('save-button').disabled = true;
            document.getElementById('cancel-button').disabled = true;

            // sign in toggle
            document.getElementById('quickstart-sign-in').textContent = 'Sign in';
        }
        
        document.getElementById('quickstart-sign-in').disabled = false;
 
    });
    // [END authstatelistener]

    // sign in form button listeners
    document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
    document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
    document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
    document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);  
    
}

window.onload = function () {
    initApp();
};

function updateProperty(value, property){

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

            var email = user.email.split('.').join("");
            var ref = db.ref('/Users/' + email + "/Data");

            ref.child(property).set(value);

            // if updating level, check if it is already declared
            // level can only be set once
            if(property == "level"){
                ref.on("value", function(snap){
                    if (snap.child("level").val() != null && snap.child("level").val() !== ""){
                        alert("You starting level is already set.");
                        return;
                    }
                })
            }

        }
    });    
}

function setPlaceholders(){

    // reset the name's current value to null
    document.getElementById("name").value = "";

    firebase.auth().onAuthStateChanged(function(user){
        if (user){

            var email = user.email.split('.').join("");
            var ref = db.ref('/Users/' + email + "/Data");

            // set placeholders
            ref.on("value", function(snap){
                document.getElementById("name").placeholder = snap.child("name").val();
                document.getElementById(snap.child("accountType").val()).selected = true;
                //document.getElementById(snap.child("level").val()).selected = true;
            });
        }
    });
}