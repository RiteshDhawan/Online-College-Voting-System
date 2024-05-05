import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, onValue, push } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = { databaseURL: "https://online-college-voting-system-default-rtdb.asia-southeast1.firebasedatabase.app/" };
const app = initializeApp(appSettings);
const database = getDatabase(app);
const electionDetailsRef = ref(database, "electionData");
const candidateDetailsRef = ref(database, "candidateData");
const votesRef = ref(database, "votesCasted"); // Reference to store votes

const tableBody = document.querySelector('tbody');

let startDate;
let startTime;
let endTime;

function fetchData() {
    onValue(electionDetailsRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const electionData = childSnapshot.val();
            const electionTitle = electionData.Title;
            const electionPosition = electionData.Position;
            startDate = electionData.StartDate;
            startTime = electionData.StartTime;
            endTime = electionData.EndTime;
            if (isWithinTimeRange(startDate, startTime, endTime)) {
                onValue(candidateDetailsRef, (snapshot) => {
                    const candidates = [];
                    snapshot.forEach((childSnapshot) => {
                        const candidateData = childSnapshot.val();
                        if (candidateData.position === electionPosition) {
                            candidateData.id = childSnapshot.key;
                            candidates.push(candidateData);
                        }
                    });
                    renderData(electionTitle, electionPosition, candidates);
                });
            }
        });
    });
}

function isWithinTimeRange(startDate, startTime, endTime) {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0]; // Get current date in format "YYYY-MM-DD"
    const currentDateTimeString = currentDateString + 'T' + currentDate.toLocaleTimeString(); // Get current date and time in format "YYYY-MM-DDTHH:MM:SS"
    const startTimeFormat = new Date(startDate + 'T' + startTime);
    const endTimeFormat = new Date(startDate + 'T' + endTime);
    
    return currentDateString === startDate &&
        currentDate >= startTimeFormat &&
        currentDate <= endTimeFormat;
}
let count = 0;
function renderData(electionTitle, electionPosition, candidates) {
    candidates.forEach(candidate => {
        count++;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${electionTitle}</td>
            <td>${electionPosition}</td>
            <td>${candidate.name}</td>
            <td>${candidate.course}</td>
            <td>${candidate.year}</td>
            <td><button class="castVote" data-id="${candidate.id}">Cast Vote</button></td>
        `;
        tableBody.appendChild(tr);
    });
    console.log(count);
    localStorage.setItem('voteCount', count);

    const castVoteButtons = document.querySelectorAll('.castVote');
    castVoteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            castVote(id, electionTitle, electionPosition); // Pass election details to castVote function
        });
    });
}
function getQueryParameter(id) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(id);
}
 
function castVote(candidateId, electionTitle, electionPosition) {
    // Get the current user ID or any identifier for the voter
    const voterId = getQueryParameter('vid'); // Add code to get user ID or identifier

    // Check if the user has already cast a vote for this position
    onValue(votesRef, snapshot => {
        let hasVoted = false;
        snapshot.forEach(childSnapshot => {
            const vote = childSnapshot.val();
            if (vote.userId === voterId && vote.electionPosition === electionPosition) {
                hasVoted = true;
            }
        });

        if (!hasVoted) {
            // User hasn't voted for this position, allow them to cast their vote
            const voteData = {
                userId: voterId,
                candidateId: candidateId,
                electionTitle: electionTitle,
                electionPosition: electionPosition
            };

            // Push the vote data to the database
            push(votesRef, voteData)
                .then(() => {
                    alert("Vote cast successfully");
                    console.log("Vote cast successfully");
                    // You may add UI feedback here if needed
                })
                .catch(error => {
                    console.error("Error casting vote: ", error);
                    // Handle errors, show error message or retry logic
                });
        } else {
            // User has already voted for this position
            alert("You have already voted for this position.");
            console.log("User has already voted for this position.");
            // You may provide some UI feedback to the user
        }
    });
}


fetchData();
