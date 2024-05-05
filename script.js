import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, onValue, push, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = { databaseURL: "https://online-college-voting-system-default-rtdb.asia-southeast1.firebasedatabase.app/" };
const app = initializeApp(appSettings);
const database = getDatabase(app);
const voterDetailsInDB = ref(database, "voterData")

document.getElementById("loginButton").addEventListener("click", function() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    if(username === "admin" && password === "admin@123"){
        window.location.href = "adminLogin.html";
    }
    else{
        onValue(voterDetailsInDB, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const voter = childSnapshot.val();
                const vUsername = voter.username;
                const vPassword = voter.password;
                const vName = voter.name;
                const vId = childSnapshot.key;

                if(username === vUsername && password === vPassword){
                    window.location.href = `voterLogin.html?name=${encodeURIComponent(vName)}
                    &id=${encodeURIComponent(vId)}`;
                }
            });
        });
    }
});

