// Configuration: Target is July 12, 2026, 00:00:00 Indian Standard Time (IST)
// Since IST is UTC+5:30, midnight IST is exactly 18:30:00 UTC on July 11th.
// Note: Month is 0-indexed in JavaScript (0 = Jan, 6 = July).
const TARGET_DATE_UTC = Date.UTC(2026, 6, 11, 18, 30, 0); 

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

const dateIdeas = {
    A: "Amusement Park Day Trip",
    B: "Breakfast in Bed & Bowling Night",
    C: "Candlelight Dinner & Jazz Club",
    D: "Drive-in Movie Marathon",
    E: "Escape Room Challenge",
    F: "Fancy Fondue Night at Home",
    G: "Glamping & Stargazing Weekend",
    H: "Hot Air Balloon Ride",
    I: "Ice Skating & Hot Cocoa",
    J: "Jazz Club & Cocktail Night",
    K: "Kayaking Adventure",
    L: "Luxury Spa & Massage Day",
    M: "Moonlight Beach Picnic",
    N: "Nature Hike & Scenic Overlook",
    O: "Outdoor Concert Night",
    P: "Pottery Throwing Class",
    Q: "Quick Weekend Getaway",
    R: "Rooftop Dinner & Drinks",
    S: "Safari Tour or Day Trip",
    T: "Tasting Menu Experience",
    U: "Underground Comedy Show",
    V: "Vineyard Wine Tasting Tour",
    W: "Waterfront Fine Dining",
    X: "Xylograph/Art Workshop",
    Y: "Yacht Cruise Sunset Dinner",
    Z: "Zoo VIP Tour Experience"
};

// 1. Check Phase based on Absolute Global Time
function checkPhase() {
    const now = new Date().getTime(); // Gets absolute global timestamp
    if (now < TARGET_DATE_UTC) {
        countdownScreen.classList.remove('hidden');
        startCountdown();
    } else {
        questionScreen.classList.remove('hidden');
    }
}

// 2. Precise Countdown Timer
function startCountdown() {
    const interval = setInterval(() => {
        const now = new Date().getTime(); // Live update every single second
        const distance = TARGET_DATE_UTC - now;

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
    const padding = 50;
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth - padding);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - padding);
    
    noBtn.style.left = `${Math.max(padding, x)}px`;
    noBtn.style.top = `${Math.max(padding, y)}px`;
});

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

document.getElementById('close-modal-btn').addEventListener('click', () => {
    calendarModal.classList.add('hidden');
});

// Run execution check immediately on load
checkPhase();
