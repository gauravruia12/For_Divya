// Configuration
const TARGET_DATE = new Date('2026-07-12T00:00:00'); // Date when site unlocks
const dateIdeas = {
    A: "Amusement Park Day Trip",
    B: "Breakfast in Bed & Bowling Night",
    C: "Candlelight Dinner & Jazz Club",
    D: "Drive-in Movie Marathon",
    // ... Fill out E through Z here
    Z: "Zoo VIP Tour & Safari Experience"
};

let selectedDateIdea = "";

// DOM Elements
const countdownScreen = document.getElementById('countdown-screen');
const questionScreen = document.getElementById('question-screen');
const dateScreen = document.getElementById('date-screen');
const timerDisplay = document.getElementById('timer');
const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');
const alphabetGrid = document.getElementById('alphabet-grid');
const calendarModal = document.getElementById('calendar-modal');
const modalTitle = document.getElementById('selected-date-title');

// 1. Initial State Check
function checkPhase() {
    const now = new Date();
    if (now < TARGET_DATE) {
        countdownScreen.classList.remove('hidden');
        startCountdown();
    } else {
        questionScreen.classList.remove('hidden');
    }
}

// 2. Countdown Timer
function startCountdown() {
    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = TARGET_DATE.getTime() - now;

        if (distance < 0) {
            clearInterval(interval);
            countdownScreen.classList.add('hidden');
            questionScreen.classList.remove('hidden');
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        timerDisplay.innerHTML = `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
    }, 1000);
}

// 3. Runaway "No" Button Logic
noBtn.addEventListener('mouseover', () => {
    // Calculate a random location inside the viewport padding areas
    const padding = 50;
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth - padding);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - padding);
    
    noBtn.style.left = `${Math.max(padding, x)}px`;
    noBtn.style.top = `${Math.max(padding, y)}px`;
});

// Avoid accidental keyboard navigation clicks to 'No'
noBtn.addEventListener('click', (e) => e.preventDefault());

// 4. Transition to Date Picker
yesBtn.addEventListener('click', () => {
    questionScreen.classList.add('hidden');
    dateScreen.classList.remove('hidden');
    generateAlphabetGrid();
});

// 5. Build the A-Z Grid
function generateAlphabetGrid() {
    alphabetGrid.innerHTML = "";
    for (let charCode = 65; charCode <= 90; charCode++) {
        const letter = String.fromCharCode(charCode);
        const card = document.createElement('div');
        card.className = 'letter-card';
        card.innerText = letter;
        
        card.addEventListener('click', () => {
            selectedDateIdea = dateIdeas[letter] || "Mystery Surprise Date!";
            modalTitle.innerText = `${letter} is for: ${selectedDateIdea}`;
            calendarModal.classList.remove('hidden');
        });
        alphabetGrid.appendChild(card);
    }
}

// 6. Calendar Invite Generation (.ics file)
document.getElementById('download-ics-btn').addEventListener('click', () => {
    const chosenDate = document.getElementById('invite-date-picker').value;
    if (!chosenDate) {
        alert("Please pick a calendar date for our adventure!");
        return;
    }

    // Format date string to YYYYMMDD format required by iCalendar format
    const formattedDate = chosenDate.replace(/-/g, '');
    
    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        `SUMMARY:30th Birthday Celebration: ${selectedDateIdea}`,
        `DTSTART;VALUE=DATE:${formattedDate}`,
        `DTEND;VALUE=DATE:${formattedDate}`,
        "DESCRIPTION:The date experience you selected for your milestone 30th birthday celebration!",
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\n");

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Birthday_Date_${selectedDateIdea.replace(/ /g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Modal Controls
document.getElementById('close-modal-btn').addEventListener('click', () => {
    calendarModal.classList.add('hidden');
});

// Execute on page load
checkPhase();