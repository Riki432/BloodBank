  var firebaseConfig = {
    apiKey: "AIzaSyCC6-uHwopNVLjM7gGKigEaGZTtAknWjL8",
    authDomain: "blood-bank-c8759.firebaseapp.com",
    databaseURL: "https://blood-bank-c8759.firebaseio.com",
    projectId: "blood-bank-c8759",
    storageBucket: "",
    messagingSenderId: "316587402689",
    appId: "1:316587402689:web:da0532892551f74f86fb40"
  };

firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
let users = db.collection("Users");
let reqs = db.collection("Requests");
let auth = firebase.auth();
auth.languageCode = 'en';
var CURRENT_UID;
var currentUserName;
var currentUser;
var REQUESTS;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        CURRENT_UID = user.uid;
        localStorage.setItem("CURRENT_UID", CURRENT_UID);
        users.doc(user.uid).get().then(function(doc) {
            if (doc.exists) {
                currentUser = doc.data();
                currentUserName = currentUser.First + " " + currentUser.Last;
                updateGreeting(currentUserName);
            }
        });
    } else {}
});

function logOutBloodBank() {
    firebase.auth().signOut();
    setTimeout(function() {

    }, 2000);
    window.location.href = "Login.html";
}

function updateGreeting(fullName) {
    if (window.location.href.endsWith("Home.html")) {
        const greet = document.querySelector("#greet");
        if (fullName) {
            greet.innerHTML = "Welcome " + fullName;
        } else {
            greet.innerHTML = "Welcome Anonymouse";
        }
    }
}

async function addUser() {
    const ph = document.getElementById("userContact").value;
    const fn = document.getElementById("userFirstName").value;
    const ln = document.getElementById("userLastName").value;
    const ps = document.getElementById("userPass").value;
    const em = document.getElementById("userEmail").value;
    const ad = document.getElementById("userAddress").value;
    const p = document.getElementById("permitToShare").checked;
    let gen = "Others"
    if (document.getElementById("m").checked) {
        gen = "Male";
    } else if (document.getElementById("f").checked) {
        gen = "Female";
    }
    let permit = false;
    if (p == true) {
        permit = true;
    }
    const bloodType = document.getElementById("userBloodType").value;
    const age = Math.floor(document.getElementById("userAge").value);
    const city = document.getElementById("userCity").value;

    firebase.auth().createUserWithEmailAndPassword(em, ps)
        .then(function(user) {
            users.doc(user.user.uid).set({
                    First: fn,
                    Last: ln,
                    ContactInfo: {
                        Email: em,
                        Contact: ph
                    },
                    Address: ad,
                    Gender: gen,
                    BloodType: bloodType,
                    Age: age,
                    City: city,
                    Permit: permit
                })
                .then(function() {
                    window.location.href = "Home.html";
                });
        }).catch(function(err) {
            alert(err.message);
        })
}

function loginBloodBank(_email, _pass) {
    const email = _email || document.getElementById("userEmailID").value;
    const pass = _pass || document.getElementById("userPassword").value;

    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function() {
            auth.signInWithEmailAndPassword(email, pass)
                .then(function() {
                    localStorage.setItem("email",email);
                    localStorage.setItem("pass",pass);
                    window.location.href = "Home.html";
                })
                .catch(function(err) {
                    $("#errBody").html(err.message);
                    $(".toast").show();
                    setTimeout(function() {
                        $(".toast").hide();
                    }, 3000);
                });
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
        });
}

function getBloodRecords() {
    const tb = $("#tableBody");

    function addRow(name, bloodType, age) {
        const existingData = tb.html();
        let newData = "<tr> <td> " + name + "</td> <td>" + age + "</td>";
        newData += "<td>" + bloodType + "</td>"
        newData += "<td> <button type=button class=\"btn-danger btn\" >Request Help</button> </td> </tr>";
        tb.html(existingData + newData);
    }
    if (fetchedRecords === true) {
        tb.html("");
    }
    const bloodType = $("bloodType").val();
    db.collection("Users")
        .where("BloodType", "==", "AB+")
        .get()
        .then(function(qs) {
            if (qs == null) {
                alert("No records available");
                return;
            } else {
                fetchedRecords = true;
                qs.forEach(function(doc) {
                    let data = doc.data();
                    addRow(data.First + data.Last, data.BloodType, data.Age);
                });

            }
        })
        .catch(function(err) {
            alert("Some Error Occured");
        })
}