import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appSettings = {databaseURL: "https://online-college-voting-system-default-rtdb.asia-southeast1.firebasedatabase.app/"}
const app = initializeApp(appSettings) 
const database = getDatabase(app)
const candidateDetailsInDB = ref(database, "candidateData")
const voterDetailsInDB = ref(database, "voterData")
const votesDetailsInDB = ref(database, "votesCasted"); // Reference to store votes

fetchCount(candidateDetailsInDB, 'candidateCount')
fetchCount(voterDetailsInDB, 'voterCount')
fetchCount(votesDetailsInDB, 'votesCount')


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