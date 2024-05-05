import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appSettings = {databaseURL: "https://online-college-voting-system-default-rtdb.asia-southeast1.firebasedatabase.app/"}
const app = initializeApp(appSettings) 
const database = getDatabase(app)
const candidateDetailsInDB = ref(database, "candidateData")

fetchCandidates();

document.getElementById("newCandidate").addEventListener("click", function() {
    document.getElementById("addCandidate").style.display = "block";
});

document.getElementById("close").addEventListener("click", function() {
    document.getElementById("addCandidate").style.display = "none";
});
const name = document.getElementById('cName')
const course = document.getElementById('cCourse')
const year = document.getElementById('cYear')
const rollNo = document.getElementById('cRoll')
const position = document.getElementById('cPosition')

document.getElementById('create_button').addEventListener('click', function(e){
    e.preventDefault()
    let cname = name.value;
    let ccourse = course.value;
    let cyear = year.value;
    let crollNo = rollNo.value;
    let cposition = position.value;
    const candidateDetails = {
        name: cname,
        course: ccourse,
        year: cyear,
        rollNo: crollNo,
        position: cposition
    }
    push(candidateDetailsInDB, candidateDetails)
    // let candidateDetailsHTML = "<tr>"
    // candidateDetailsHTML += "<td>" + cposition + "</td>";
    // candidateDetailsHTML += "<td>" + cname + "</td>";
    // candidateDetailsHTML += "<td>" + ccourse + "</td>";
    // candidateDetailsHTML += "<td>" + cyear + "</td>";
    // candidateDetailsHTML += "<td>" + crollNo + "</td>";
    // candidateDetailsHTML += "<td><button>Delete</button></td>";
    // candidateDetailsHTML += "</tr>"
    // document.querySelector('tbody').innerHTML += candidateDetailsHTML;
    clearInputFields()
})
    // push(electionDetailsInDB, title)
    // console.log(title);
    // console.log(position);
    // console.log(startDate);
    // console.log(startTime);
    // clearInputFields()

function clearInputFields() {
    name.value = ""
    course.value = ""
    year.value = ""
    rollNo.value = ""
    position.value = ""
}

const tbody = document.querySelector('tbody');
function renderCandidates(candidates) {
    tbody.innerHTML = '';

    // Loop through each candidate and create a table row for them
    candidates.forEach(candidate => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${candidate.position}</td>
            <td>${candidate.name}</td>
            <td>${candidate.course}</td>
            <td>${candidate.year}</td>
            <td>${candidate.rollNo}</td>
            <td><button class="delete-btn" data-id="${candidate.id}">Delete</button></td>
        `;
        tbody.appendChild(tr);
    });

    // Add event listeners to delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const candidateId = this.getAttribute('data-id');
            deleteCandidate(candidateId);
        });
    });
}

// Function to fetch candidates from Firebase
function fetchCandidates() {
    onValue(candidateDetailsInDB, (snapshot) => {
        const candidates = [];
        snapshot.forEach((childSnapshot) => {
            const candidate = childSnapshot.val();
            candidate.id = childSnapshot.key; // Assign Firebase ID to candidate object
            candidates.push(candidate);
        });
        renderCandidates(candidates);
    });
}

// Function to delete a candidate from Firebase
function deleteCandidate(candidateId) {
    // Reference to the specific candidate in Firebase
    const candidateRef = ref(database, `candidateData/${candidateId}`);
    remove(candidateRef);
}
