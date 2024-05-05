import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appSettings = {databaseURL: "https://online-college-voting-system-default-rtdb.asia-southeast1.firebasedatabase.app/"}
const app = initializeApp(appSettings) 
const database = getDatabase(app)
const resultsInDB = ref(database, "votingResult");

function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const voterName = getQueryParameter('name');
const voterId = getQueryParameter('id');
console.log(voterId);
if (voterName) {
    document.getElementById('voterName').innerText += ` ${voterName}!`;
} else {
    document.getElementById('voterName').innerText += " Voter";
}
document.getElementById('recieveId').addEventListener('click',function(e){
    window.location.href = `electionDetails.html?vid=${encodeURIComponent(voterId)}`
});

renderCount(localStorage.getItem('voteCount'), 'electionAvailCount')
fetchCount(resultsInDB, 'resultsCount')

function renderCount(count, displayId){
    document.getElementById(displayId).innerText = count;
}
function fetchCount(databaseName, displayId) {
    onValue(databaseName, (snapshot) => {
        let count = 0;
        snapshot.forEach((childSnapshot) => {
            count++;
        });
        renderCount(count, displayId);
    });
}
