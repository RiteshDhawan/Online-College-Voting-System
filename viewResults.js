import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appSettings = {databaseURL: "https://online-college-voting-system-default-rtdb.asia-southeast1.firebasedatabase.app/"}
const app = initializeApp(appSettings) 
const database = getDatabase(app)
const electionDetailsInDB = ref(database, "electionData");
const candidateDetailsInDB = ref(database, "candidateData");
const votesDetailsInDB = ref(database, "votesCasted");
const resultsInDB = ref(database, "votingResult");

const tableBody = document.querySelector('tbody');
console.log(tableBody.innerHTML);
let eTitle;
let ePosition;
function fetchData() {
    onValue(electionDetailsInDB, (electionSnapshot) => {
        electionSnapshot.forEach((electionChildSnapshot) => {
            const electionData = electionChildSnapshot.val();
            const electionTitle = electionData.Title;
            const electionPosition = electionData.Position;

            // Fetch candidates for the current election position
            onValue(candidateDetailsInDB, (candidateSnapshot) => {
                const candidates = [];
                candidateSnapshot.forEach((candidateChildSnapshot) => {
                    const candidateData = candidateChildSnapshot.val();
                    if (candidateData.position === electionPosition) {
                        candidates.push({ id: candidateChildSnapshot.key, name: candidateData.name });
                    }
                });

                // Fetch votes for the current election
                onValue(votesDetailsInDB, (votesSnapshot) => {
                    const voteCounts = {};
                    votesSnapshot.forEach((voteChildSnapshot) => {
                        const voteData = voteChildSnapshot.val();
                        if (voteData.electionTitle === electionTitle && candidates.some(candidate => candidate.id === voteData.candidateId)) {
                            const candidateId = voteData.candidateId;
                            voteCounts[candidateId] = (voteCounts[candidateId] || 0) + 1;
                        }
                    });

                    // Render the data with vote counts
                    renderData(electionTitle, electionPosition, candidates, voteCounts);
                });
            });
        });
    });
}

function renderData(electionTitle, electionPosition, candidates, voteCounts) {
    candidates.forEach(candidate => {
        const tr = document.createElement('tr');
        const candidateId = candidate.id;

        tr.innerHTML = `
            <td>${electionTitle}</td>
            <td>${electionPosition}</td>
            <td>${candidate.name}</td>
            <td>${voteCounts[candidateId] || 0}</td>
            <td><button class="publish-btn">Publish Result</button></td>
        `;

        // Append the "Publish Result" button to the row
        tr.querySelector('.publish-btn').addEventListener('click', () => {
            publishResult(electionTitle, electionPosition, candidate, candidates, voteCounts);
        });

        tableBody.appendChild(tr);
    });
}

function publishResult(electionTitle, electionPosition, candidate, candidates, voteCounts) {
    console.log(`Publishing result for ${electionTitle}, ${electionPosition}, Candidate: ${candidate.name}`);
    alert(`Publishing result for ${electionTitle}, ${electionPosition}`);

    let winner;
    let maxVotes = -1;
    candidates.forEach(candidate => {
        const voteCount = voteCounts[candidate.id] || 0;
        if (voteCount > maxVotes) {
            maxVotes = voteCount;
            winner = candidate;
        }
    });

    let runnerUp;
    let secondHighestVotes = -1;
    candidates.forEach(candidate => {
        const voteCount = voteCounts[candidate.id] || 0;
        if (voteCount > secondHighestVotes && voteCount < maxVotes) {
            secondHighestVotes = voteCount;
            runnerUp = candidate;
        }
    });
    const votesWonByWinner = maxVotes - secondHighestVotes;
    
    const result = {
        electionTitle: electionTitle,
        electionPosition: electionPosition,
        winnerName: winner.name,
        winByVotes: votesWonByWinner
    }
    push(resultsInDB, result);
    console.log(`Winner: ${winner.name} with ${maxVotes} votes and ${votesWonByWinner}`);
}

fetchData();
