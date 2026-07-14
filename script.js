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
    A: "Arcade Games 🕹️",
    B: "Beers at a Brewery 🍺",
    C: "Comedy Show 😂",
    D: "Disco Night 🕺",
    E: "Escape Room Challenge 🔐",
    F: "Flea Market Shopping 🛍️",
    G: "Games Night 🎲",
    H: "Hiking 🥾",
    I: "Ice Cream Shop 🍦",
    J: "Junk Food Date 🍔",
    K: "Karaoke 🎤",
    L: "Laser Tag 🎯",
    M: "Movie 🎬",
    N: "Night Out 🌃",
    O: "Outdoor Concert Night 🎵",
    P: "Putting / Mini Golf ⛳",
    Q: "Quick Weekend Getaway 🧳",
    R: "Roller Coaster Park 🎢",
    S: "Spa 💆‍♀️",
    T: "Theatre Show 🎭",
    U: "Upscale Bar Night 🍸",
    V: "Volunteer Work 🤝",
    W: "Waterfront Fine Dining 🌅",
    X: "X-treme Sports 🏄",
    Y: "Yacht Sunset Cruise ⛵",
    Z: "ZZZs - Sleep Pampering 😴"
};

// Add a photo here once a date has actually happened.
// Filename should be uploaded to the root of the repo, same as divya.jpg.
// caption is optional — a short line under the photo.
const dateMemories = {
    G: { photo: "memory-g.jpg", caption: "Our first date night! 💕" }
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
        const ticketNo = String(charCode - 64).padStart(2, '0');
        const currentIdea = dateIdeas[letter] || "Surprise Date Plan! ✨";

        const memory = dateMemories[letter];

        const cardContainer = document.createElement('div');
        cardContainer.className = 'flip-card';

        const backContent = memory
            ? `<img class="memory-photo" src="${memory.photo}" alt="${letter} memory">
               <span class="memory-caption">${memory.caption || currentIdea}</span>`
            : `<span class="idea-text">${currentIdea}</span>
               <button class="book-btn">Redeem 📅</button>`;

        cardContainer.innerHTML = `
            <div class="card-inner" id="card-${letter}">
                <div class="card-front">
                    ${memory ? '<span class="ticket-stamp">✓</span>' : ''}
                    <span class="ticket-eyebrow">Admit One</span>
                    <span class="ticket-letter">${letter}</span>
                    <div class="ticket-perf"></div>
                    <span class="ticket-no">No. ${ticketNo}</span>
                </div>
                <div class="card-back${memory ? ' memory' : ''}">
                    ${backContent}
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
