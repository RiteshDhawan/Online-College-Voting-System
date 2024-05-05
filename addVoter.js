import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appSettings = {databaseURL: "https://online-college-voting-system-default-rtdb.asia-southeast1.firebasedatabase.app/"}
const app = initializeApp(appSettings) 
const database = getDatabase(app)
const voterDetailsInDB = ref(database, "voterData")

fetchVoters();

document.getElementById("newVoter").addEventListener("click", function() {
    document.getElementById("addVoter").style.display = "block";
});

document.getElementById("close").addEventListener("click", function() {
    document.getElementById("addVoter").style.display = "none";
});
const name = document.getElementById('vName')
const course = document.getElementById('vCourse')
const year = document.getElementById('vYear')
const rollNo = document.getElementById('vRoll')
const username = document.getElementById("username")
const password = document.getElementById("password")

document.getElementById('create_button').addEventListener('click', function(e){
    e.preventDefault()
    let vname = name.value;
    let vcourse = course.value;
    let vyear = year.value;
    let vrollNo = rollNo.value;
    let vusername = username.value;
    let vpassword = password.value;
    const voterDetails = {
        name: vname,
        course: vcourse,
        year: vyear,
        rollNo: vrollNo,
        username: vusername,
        password: vpassword
    }
    push(voterDetailsInDB, voterDetails)
    
    clearInputFields()
})

function clearInputFields() {
    name.value = ""
    course.value = ""
    year.value = ""
    rollNo.value = ""
    username.value = ""
    password.value = ""
}

const tbody = document.querySelector('tbody');

function renderVoters(voters) {
    tbody.innerHTML = '';
    voters.forEach(voter => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${voter.name}</td>
            <td>${voter.course}</td>
            <td>${voter.year}</td>
            <td>${voter.rollNo}</td>
            <td>${voter.username}</td>
            <td>${voter.password}</td>
            <td><button class="delete-btn" data-id="${voter.id}">Delete</button></td>
        `;
        tbody.appendChild(tr);
    });

    // Add event listeners to delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const voterId = this.getAttribute('data-id');
            deleteVoter(voterId);
        });
    });
}

// Function to fetch Voters from Firebase
function fetchVoters() {
    onValue(voterDetailsInDB, (snapshot) => {
        const voters = [];
        snapshot.forEach((childSnapshot) => {
            const voter = childSnapshot.val();
            voter.id = childSnapshot.key; // Assign Firebase ID to Voter object
            voters.push(voter);
        });
        renderVoters(voters);
    });
}

// Function to delete a Voter from Firebase
function deleteVoter(voterId) {
    // Reference to the specific Voter in Firebase
    const voterRef = ref(database, `voterData/${voterId}`);
    remove(voterRef);
}
document.getElementById('generate').addEventListener('click', function(e){
    e.preventDefault();
    username.value = generateRandomString(5); 
    password.value = generateRandomString(10);
})

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
