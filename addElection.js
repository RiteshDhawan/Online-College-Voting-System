import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appSettings = {databaseURL: "https://online-college-voting-system-default-rtdb.asia-southeast1.firebasedatabase.app/"}
const app = initializeApp(appSettings) 
const database = getDatabase(app)
const electionDetailsInDB = ref(database, "electionData")
fetchElection();
document.getElementById("newElection").addEventListener("click", function() {
    document.getElementById("addElection").style.display = "block";
});

document.getElementById("close").addEventListener("click", function() {
    document.getElementById("addElection").style.display = "none";
});
const title = document.getElementById('title')
const position = document.getElementById('positionList')
const startDate = document.getElementById('sdate')
const startTime = document.getElementById('stime')
const endTime = document.getElementById('etime')

document.getElementById('create_button').addEventListener('click', function(e){
    e.preventDefault()
    let etitle = title.value;
    let eposition = position.value;
    let estartdate = startDate.value;
    let estarttime = startTime.value;
    let eendtime = endTime.value;
    const electionDetails = {
        Title: etitle,
        Position: eposition,
        StartDate: estartdate,
        StartTime: estarttime,
        EndTime: eendtime
    }
    push(electionDetailsInDB, electionDetails)
    // let electionDetailsHTML = "<tr>"
    // electionDetailsHTML += "<td>" + etitle + "</td>";
    // electionDetailsHTML += "<td>" + eposition + "</td>";
    // electionDetailsHTML += "<td>" + estartdate + "</td>";
    // electionDetailsHTML += "<td>" + estarttime + "</td>";
    // electionDetailsHTML += "<td>" + eendtime + "</td>";
    // electionDetailsHTML += "<td><button>Delete</button></td>";
    // electionDetailsHTML += "</tr>"
    // document.querySelector('tbody').innerHTML += electionDetailsHTML;
    clearInputFields()
})
    // push(electionDetailsInDB, title)
    // console.log(title);
    // console.log(position);
    // console.log(startDate);
    // console.log(startTime);
    // clearInputFields()

function clearInputFields() {
    title.value = ""
    position.value = ""
    startDate.value = ""
    startTime.value = ""
    endTime.value = ""
}
const tbody = document.querySelector('tbody');
function renderElection(elections) {
    tbody.innerHTML = '';

    // Loop through each candidate and create a table row for them
    elections.forEach(election => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${election.Title}</td>
            <td>${election.Position}</td>
            <td>${election.StartDate}</td>
            <td>${election.StartTime}</td>
            <td>${election.EndTime}</td>
            <td><button class="delete-btn" data-id="${election.id}">Delete</button></td>
        `;
        tbody.appendChild(tr);
    });

    // Add event listeners to delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const electionId = this.getAttribute('data-id');
            deleteElection(electionId);
        });
    });
}

// Function to fetch candidates from Firebase
function fetchElection() {
    onValue(electionDetailsInDB, (snapshot) => {
        const elections = [];
        snapshot.forEach((childSnapshot) => {
            const election = childSnapshot.val();
            election.id = childSnapshot.key; // Assign Firebase ID to candidate object
            elections.push(election);
        });
        renderElection(elections);
    });
}

// Function to delete a candidate from Firebase
function deleteElection(electionId) {
    const electionRef = ref(database, `electionData/${electionId}`);
    remove(electionRef);
}
