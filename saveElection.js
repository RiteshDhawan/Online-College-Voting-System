import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase, ref, push} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appSettings = {databaseURL: "https://online-college-voting-system-default-rtdb.asia-southeast1.firebasedatabase.app/"}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const electionTitleInDB = ref(database, "titleList")

const electionTitle = document.getElementById('title')
const createButton = document.getElementById('create_button')
createButton.addEventListener("click", function(){
    let inputValue = electionTitle.value
    push(electionTitleInDB, inputValue)
    console.log(inputValue);
})