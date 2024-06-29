// Select DOM elements
const audio = document.querySelector(".quranPlayer");
const surahs = document.querySelector(".surahs");
const ayah = document.querySelector(".ayah span");
const next = document.querySelector(".next");
const play = document.querySelector(".play");
const prev = document.querySelector(".prev");

let ayahAudio = [];
let ayahText = [];
let ayahIndex = 0;
let isPlaying = false;

// Fetch and display the list of Surahs
function getSurahs() {
    fetch("https://api.quran.gading.dev/surah")
        .then(response => response.json())
        .then(data => displaySurahs(data.data))
        .catch(error => console.error("Error fetching Surahs:", error));
}

// Display Surahs in the DOM
function displaySurahs(surahData) {
    surahData.forEach((surah, index) => {
        const surahElement = document.createElement('div');
        surahElement.innerHTML = `
            <p>${surah.name.long}</p>
            <p>${surah.name.transliteration.en}</p>
        `;
        surahElement.addEventListener('click', () => fetchAndPlaySurah(index + 1));
        surahs.appendChild(surahElement);
    });
}

// Fetch and play a specific Surah
function fetchAndPlaySurah(surahNumber) {
    fetch(`https://api.quran.gading.dev/surah/${surahNumber}`)
        .then(response => response.json())
        .then(data => {
            ayahAudio = data.data.verses.map(verse => verse.audio.primary);
            ayahText = data.data.verses.map(verse => verse.text.arab);
            ayahIndex = 0;
            playAyah(ayahIndex);
        })
        .catch(error => console.error("Error fetching Surah:", error));
}

// Play a specific Ayah
function playAyah(index) {
    audio.src = ayahAudio[index];
    ayah.innerHTML = ayahText[index];
    audio.play();
    isPlaying = true;
    updatePlayButton();
}

// Handle next button click
next.addEventListener('click', () => {
    if (ayahIndex < ayahAudio.length - 1) {
        ayahIndex++;
        playAyah(ayahIndex);
    }
});

// Handle previous button click
prev.addEventListener('click', () => {
    if (ayahIndex > 0) {
        ayahIndex--;
        playAyah(ayahIndex);
    }
});

// Handle play/pause button click
play.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
    } else {
        audio.play();
    }
    isPlaying = !isPlaying;
    updatePlayButton();
});

// Update play button icon
function updatePlayButton() {
    const icon = play.querySelector('.material-icons');
    icon.textContent = isPlaying ? 'pause' : 'play_arrow';
}

// Handle audio ended event
audio.addEventListener('ended', () => {
    if (ayahIndex < ayahAudio.length - 1) {
        ayahIndex++;
        playAyah(ayahIndex);
    } else {
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Surah has been ended",
            showConfirmButton: false,
            timer: 1500
        });
        isPlaying = false;
        updatePlayButton();
    }
});

// Initialize the app
getSurahs();