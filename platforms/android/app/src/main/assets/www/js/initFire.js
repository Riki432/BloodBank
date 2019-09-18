// var db;

var firebaseConfig = {
    apiKey: "AIzaSyCyloK676FCWD030EYV-YY38EXLnlaE0M4",
    // authDomain: "blood-bank-3ef7e.firebaseapp.com",
    databaseURL: "https://blood-bank-3ef7e.firebaseio.com",
    projectId: "blood-bank-3ef7e",
    storageBucket: "blood-bank-3ef7e.appspot.com",
    messagingSenderId: "201015959418",
    appId: "1:201015959418:web:af45fd836784d97b1b40c3"
  };
// let fetchedRecords = false;
console.log("Init Fire ran");
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
// if (window.location.href == "Home.html"){
  if (user) {
  	console.log("Auth State Changed!!");
    CURRENT_UID = user.uid;
    // fillRequest();
    users.doc(user.uid).get().then(function(doc){
    	if(doc.exists){
    	currentUser = doc.data();
    	currentUserName = currentUser.First + " " + currentUser.Last;
    	updateGreeting(currentUserName);
    }
    	 });
    }
    else{

    } 

    // setTimeout(function(){
    // 	updateGreeting(currentUserName);
    // }, 2000);
  
});

function logOutBloodBank(){
	console.log("Loggin out!");
	firebase.auth().signOut();
	setTimeout(function(){},2000);
	window.location.href = "Login.html";
}
function updateGreeting(fullName){
	console.log("Greeting updated");
	if(window.location.href.endsWith("Home.html")){
		const greet = document.querySelector("#greet");
		if(fullName){
			greet.innerHTML = "Welcome " + fullName;
		}
		else{
		greet.innerHTML = "Welcome Anonymouse";	
		}
	}
}

async function addUser(){
	console.log("Adding user");
	const ph = document.getElementById("userContact").value;
	// let userTable = db.collection("Users");
	const fn = document.getElementById("userFirstName").value;
	const ln = document.getElementById("userLastName").value;
	const ps = document.getElementById("userPass").value;
	const em = document.getElementById("userEmail").value;
	const ad = document.getElementById("userAddress").value;
	const p = document.getElementById("permitToShare").checked;
	let gen="Others"
	if(document.getElementById("m").checked){
		gen = "Male";
	}else if(document.getElementById("f").checked){
		gen = "Female";
	}
	let permit = false;
	if(p == true) {
		permit = true;
	}
	const bloodType = document.getElementById("userBloodType").value;
	const age =  document.getElementById("userAge").value;
	const city =  document.getElementById("userCity").value;

	firebase.auth().createUserWithEmailAndPassword(em, ps)
		.then(function(user){
		console.log(user)
		users.doc(user.user.uid).set({
			First: fn,
			Last: ln,
			// Password: ps,
			Email: em,
			Contact: ph,
			Address: ad,
			Gender: gen,
			BloodType: bloodType,
			Age: age,
			City: city,
			Permit: permit 
		}).then(function(){
		console.log("Added User");
		window.location.href = "Home.html";		
		});
		// console.log(firebase.auth().currentUser)
		}).catch(function(err){
		alert(err.message);
			})
	// window.user = user;
	

}

function loginBloodBank(_email, _pass){
  console.log("Starting Login ");
  const email = _email || document.getElementById("userEmailID").value;
  const pass = _pass || document.getElementById("userPassword").value;

  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(function(){
          auth.signInWithEmailAndPassword(email, pass)
          	.then(function(){
      		window.location.href = "Home.html";
          	})
          .catch(function(err){
          		$("#errBody").html(err.message);
          		$(".toast").show();
          		setTimeout(function(){
          			$(".toast").hide();
          		}, 3000);
          	});
    })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage);
  });
  // setTimeout(function(){}, 1000)
}

function getBloodRecords(){
	const tb = $("#tableBody");
	function addRow(name, bloodType, age){
	const existingData = tb.html();
	console.log(existingData)
	let newData = "<tr> <td> " + name + "</td> <td>" + age + "</td>";
	newData += "<td>" + bloodType + "</td>"
	newData+= "<td> <button type=button class=\"btn-danger btn\" >Request Help</button> </td> </tr>"; 
	console.log(newData)
	tb.html(existingData+newData);
}
	if(fetchedRecords === true){
		tb.html("");
	}
	const bloodType= $("bloodType").val();
	db.collection("Users")
		.where("BloodType","==", "AB+")
		.get()
		.then(function(qs){
			if(qs == null){
				alert("No records available");
				return;
			}else{
			fetchedRecords = true;
			qs.forEach(function(doc){
				let data = doc.data();
				addRow(data.First + data.Last, data.BloodType, data.Age);
			});

		}
		})
		.catch(function(err){
			alert("Some Error Occured");
			console.log(err);
		})


}

