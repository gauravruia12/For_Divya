// Target configuration (July 12, 2026, 00:00:00 IST)
const TARGET_DATE_UTC = Date.UTC(2026, 6, 11, 18, 30, 0); 

let selectedDateIdea = "";

const countdownScreen = document.getElementById('countdown-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const timerDisplay = document.getElementById('timer');
const alphabetGrid = document.getElementById('alphabet-grid');
const calendarModal = document.getElementById('calendar-modal');
const modalTitle = document.getElementById('selected-date-title');

const dateIdeas = {
    A: "Amusement Park Day Trip 🎢",
    B: "Breakfast in Bed & Bowling 🎳",
    C: "Candlelight Dinner & Jazz 🎷",
    D: "Drive-in Movie Night 🎬",
    E: "Escape Room Challenge 🔑",
    F: "Fancy Fondue Night 🍫",
    G: "Glamping Under Stars ✨",
    H: "Hot Air Balloon Flight 🎈",
    I: "Ice Skating & Hot Cocoa ⛸️",
    J: "Jewelry Making Workshop 💍",
    K: "Kayaking Adventure 🛶",
    L: "Luxury Spa & Massage 💆‍♀️",
    M: "Moonlight Beach Picnic 🌊",
    N: "Nature Hike & Picnic ⛰️",
    O: "Outdoor Concert Night 🎵",
    P: "Pottery Throwing Class 🏺",
    Q: "Quick Weekend Getaway 🧳",
    R: "Rooftop Dinner & Drinks 🍹",
    S: "Safari Tour Adventure 🦁",
    T: "Tasting Menu Experience 🍽️",
    U: "Underground Comedy Show 🎭",
    V: "Vineyard Wine Tasting 🍷",
    W: "Waterfront Fine Dining 🥂",
    X: "Xylograph/Art Workshop 🎨",
    Y: "Yacht Sunset Cruise ⛵",
    Z: "Zoo VIP Safari Tour 🐼"
};

function checkPhase() {
    const now = new Date().getTime();
    if (now < TARGET_DATE_UTC) {
        countdownScreen.classList.remove('hidden');
        startCountdown();
    } else {
        dashboardScreen.classList.remove('hidden');
        generateMobileAlphabetGrid();
    }
}

function startCountdown() {
    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = TARGET_DATE_UTC - now;

        if (distance < 0) {
            clearInterval(interval);
            countdownScreen.classList.add('hidden');
            dashboardScreen.classList.remove('hidden');
            generateMobileAlphabetGrid();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        timerDisplay.innerHTML = `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
    }, 1000);
}

function generateMobileAlphabetGrid() {
    alphabetGrid.innerHTML = "";
    for (let charCode = 65; charCode <= 90; charCode++) {
        const letter = String.fromCharCode(charCode);
        const currentIdea = dateIdeas[letter] || "Surprise Date Plan! ✨";

        const cardContainer = document.createElement('div');
        cardContainer.className = 'flip-card';

        cardContainer.innerHTML = `
            <div class="card-inner" id="card-${letter}">
                <div class="card-front">${letter}</div>
                <div class="card-back">
                    <span class="idea-text">${currentIdea}</span>
                    <button class="book-btn">Book 📅</button>
                </div>
            </div>
        `;

        // Handle card interaction
        const innerCard = cardContainer.querySelector('.card-inner');
        innerCard.addEventListener('click', (e) => {
            // If she hits the book button, open the booking overlay
            if (e.target.classList.contains('book-btn')) {
                e.stopPropagation(); // Stops card from un-flipping when booking
                selectedDateIdea = currentIdea;
                modalTitle.innerText = `Book Date: ${letter}`;
                calendarModal.classList.remove('hidden');
            } else {
                // Otherwise toggle flip
                innerCard.classList.toggle('flipped');
            }
        });

        alphabetGrid.appendChild(cardContainer);
    }
}

// Calendar Generator
document.getElementById('download-ics-btn').addEventListener('click', () => {
    const chosenDate = document.getElementById('invite-date-picker').value;
    if (!chosenDate) {
        alert("Please pick a date on the calendar!");
        return;
    }

    const formattedDate = chosenDate.replace(/-/g, '');
    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        `SUMMARY:Birthday Celebration: ${selectedDateIdea}`,
        `DTSTART;VALUE=DATE:${formattedDate}`,
        `DTEND;VALUE=DATE:${formattedDate}`,
        "DESCRIPTION:A special 30th milestone celebration concept planned entirely by your husband!",
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\n");

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Date_Concept.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

document.getElementById('close-modal-btn').addEventListener('click', () => {
    calendarModal.classList.add('hidden');
});

checkPhase();
