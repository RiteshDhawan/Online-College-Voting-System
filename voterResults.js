import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appSettings = {databaseURL: "https://online-college-voting-system-default-rtdb.asia-southeast1.firebasedatabase.app/"}
const app = initializeApp(appSettings) 
const database = getDatabase(app)
const resultsInDB = ref(database, "votingResult");
const tableBody = document.querySelector('tbody')
onValue(resultsInDB, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const resultDetails = childSnapshot.val();
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${resultDetails.electionTitle}</td>
            <td>${resultDetails.electionPosition}</td>
            <td>${resultDetails.winnerName}</td>
            <td>${resultDetails.winByVotes}</td>
        `;
        tableBody.appendChild(tr);
    });
})