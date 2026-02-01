// Initialize subject array
const subjects = ["Mathematics", "Web Development", "Database", "Networking", "OOP"];
// Variable store last calculation
let lastComputed = null;
// Array to store saved results     
const history = [];          

// Helper function used to display messages
function setMessage(text) {
  document.getElementById("message").innerHTML = text;
}

function readMarks() {
  // Use array indexes to read marks fields
  const marks = [];
  for (let i = 0; i < 5; i++) {
    const value = document.getElementById(`m${i}`).value;
    const num = Number(value);

    // used operators and validation method
    if (value === "" || Number.isNaN(num) || num < 0 || num > 100) {
      return { ok: false, error: `Please enter a valid  student mark 0–100 for Subject ${i + 1}.` };
    }
    marks.push(num); 
  }
  return { ok: true, marks };
}

// Grade logic defined
function computeGrade(avg) {
  if (avg >= 75) return "A";
  if (avg >= 65) return "B";
  if (avg >= 55) return "C";
  if (avg >= 40) return "S";
  return "F";
}

//Define calculation logic
function calculate() {
  const name = document.getElementById("studentName").value.trim();
  if (name.length < 2) {
    setMessage("Please enter the student name.");
    return null;
  }

  const marksRead = readMarks();
  if (!marksRead.ok) {
    setMessage(marksRead.error);
    return null;
  }

  // Array of marks
  const marks = marksRead.marks;

  // Used Operators
  let total = 0;
  for (let i = 0; i < marks.length; i++) {
    total = total + marks[i];
  }
  const average = total / marks.length;

  // Checked pass, fail status
  const passMark = 40;
  let passedAll = true;
  for (let i = 0; i < marks.length; i++) {
    if (marks[i] < passMark) {
      passedAll = false;
      break;
    }
  }

  const grade = computeGrade(average);

  // Store last computed result
  lastComputed = {
    name,
    marks,
    total,
    average,
    grade,
    passedAll,
    time: new Date().toLocaleString(),
  };

  renderCurrentResult();
  setMessage("Calculated successfully.");
  return lastComputed;
}

function renderCurrentResult() {
  const box = document.getElementById("resultBox");
  if (!lastComputed) {
    box.innerHTML = "No result";
    return;
  }

  // innerHTML dynamic update
  let marksList = "<ul>";
  for (let i = 0; i < lastComputed.marks.length; i++) {
    marksList += `<li>${subjects[i]}: <span class="good">${lastComputed.marks[i]}</span></li>`;
  }
  marksList += "</ul>";

  box.innerHTML = `
    <div><b>Name:</b> ${lastComputed.name}</div>
    <div><b>Total:</b> ${lastComputed.total}</div>
    <div><b>Average:</b> ${lastComputed.average.toFixed(2)}</div>
    <div><b>Grade:</b> ${lastComputed.grade}</div>
    <div><b>Status:</b> ${lastComputed.passedAll ? "PASS" : "FAIL"}</div>
    <div class="muted"><b>Calculated at:</b> ${lastComputed.time}</div>
    <hr/>
    <div><b>Marks:</b></div>
    ${marksList}
  `;
}

// Set data save 
function saveToHistory() {
  if (!lastComputed) {
    setMessage("Please calculate first and then save.");
    return;
  }

  history.push(lastComputed); // push() required
  renderHistory();
  setMessage("Saved history");
}

// Set data removed 
function removeLast() {
  if (history.length === 0) {
    setMessage("History is empty.");
    return;
  }

  history.pop();
  renderHistory();
  setMessage("Removed last saved student data.");
}

// Get history of data
function renderHistory() {
  const box = document.getElementById("historyBox");

  if (history.length === 0) {
    box.innerHTML = "No saved results in here.";
    return;
  }

  let html = "<ol>";
  for (let i = 0; i < history.length; i++) {
    // Using array indexes to display saved items
    const item = history[i];
    html += `
      <li>
        <b>${item.name}</b> — Avg: ${item.average.toFixed(2)} — Grade: ${item.grade} — ${item.passedAll ? "PASS" : "FAIL"}
        <div class="muted">${item.time}</div>
      </li>
    `;
  }
  html += "</ol>";

  box.innerHTML = html;
}

// Set form reset function
function resetForm() {
  document.getElementById("studentName").value = "";
  for (let i = 0; i < 5; i++) document.getElementById(`m${i}`).value = "";
  lastComputed = null;
  renderCurrentResult();
  setMessage("Reset.");
}

// Set to Button / event
document.getElementById("btnCalc").addEventListener("click", calculate);
document.getElementById("btnSave").addEventListener("click", saveToHistory);
document.getElementById("btnRemove").addEventListener("click", removeLast);
document.getElementById("btnReset").addEventListener("click", resetForm);
