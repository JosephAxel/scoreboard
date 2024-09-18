document.addEventListener('DOMContentLoaded', () => {
    const team1ScoreElement = document.getElementById('team1-score');
    const team2ScoreElement = document.getElementById('team2-score');

    function updateScore(element, score) {
        element.textContent = score < 10 ? `0${score}` : score;
    }

    document.addEventListener('keydown', (event) => {
        let currentScoreElement = null;

        if (event.key === 'a' || event.key === 'A' || event.key === 's' || event.key === 'S' ) {
            currentScoreElement = team1ScoreElement;
        } else if (event.key === 'k' || event.key === 'K' || event.key === 'l' || event.key === 'L') {
            currentScoreElement = team2ScoreElement;
        }

        if (currentScoreElement) {
            let currentScore = parseInt(currentScoreElement.textContent, 10);
            if (event.key === 'a' || event.key === 'A' ) {
                currentScore = Math.max(0, currentScore - 1); // Decrease Team 1 score
            } else if (event.key === 's' || event.key === 'S') {
                currentScore += 1; // Increase Team 1 score
            } else if (event.key === 'k' || event.key === 'K') {
                currentScore = Math.max(0, currentScore - 1); // Decrease Team 2 score
            } else if (event.key === 'l' || event.key === 'L') {
                currentScore += 1; // Increase Team 2 score
            }
            updateScore(currentScoreElement, currentScore);
        }
    });

    // Initialize scores with leading zero if needed
    updateScore(team1ScoreElement, parseInt(team1ScoreElement.textContent, 10));
    updateScore(team2ScoreElement, parseInt(team2ScoreElement.textContent, 10));
});




document.addEventListener('DOMContentLoaded', () => {
    let currentHoveredElement = null;
    let isRunning = false;
    let isShotClockRunning = false;
    let timerInterval = null;
    let shotClockInterval = null;
    let timerSeconds = 600; // Initial timer seconds (10 minutes)
    let shotClockDuration = 12; // Global shot clock duration (default 12 seconds)
    let shotClockSeconds = shotClockDuration; // Initialize with the shot clock duration
    const shotClockBeep = new Audio('assets/buzzer.mp3'); // Update path to your beep sound

    const timerElement = document.getElementById('timer');
    const shotClockElement = document.getElementById('shot-clock');
    const team1NameElement = document.getElementById('team1-name');
    const team2NameElement = document.getElementById('team2-name');

    timerElement.addEventListener('click', () => {
        if (!isRunning) { // Only set hover if timer is not running
            currentHoveredElement = timerElement;
        }
    });

    team1NameElement.addEventListener('click', () => {
        if (!isRunning) { // Only set hover if timer is not running
            currentHoveredElement = team1NameElement;
        }
    });

    team2NameElement.addEventListener('click', () => {
        if (!isRunning) { // Only set hover if timer is not running
            currentHoveredElement = team2NameElement;
        }
    });

    function updateScore(element, score) {
        element.textContent = score < 10 ? `0${score}` : score;
        if (score <= 5) {
            element.classList.add('red');
        } else {
            element.classList.remove('red');
        }
    }

    function updateTimer() {
        if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            return;
        }
        let minutes = Math.floor(timerSeconds / 60);
        let seconds = timerSeconds % 60;
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function updateShotClock() {
        if (shotClockSeconds === 1) {
            shotClockBeep.play(); // Play beep sound
        } else if (shotClockSeconds <= 0) {
            clearInterval(shotClockInterval);
            shotClockInterval = null;
            isShotClockRunning = false;
            return;
        }
        shotClockSeconds -= 1;
        updateScore(shotClockElement, shotClockSeconds);
    }

    function startTimer() {
        if (timerInterval === null) { // Only start if not already running
            timerInterval = setInterval(() => {
                if (timerSeconds > 0) {
                    timerSeconds -= 1;
                    updateTimer();
                } else {
                    stopTimer(); // Stop when timer reaches 0
                }
            }, 1000); // Update every second
        }

        if (!isShotClockRunning) { // Start shot clock only if not already running
            shotClockInterval = setInterval(updateShotClock, 1000); // Update shot clock every second
            isShotClockRunning = true;
        }
    }

    function stopTimer() {
        clearInterval(timerInterval);
        clearInterval(shotClockInterval);
        timerInterval = null;
        shotClockInterval = null;
        isShotClockRunning = false;
    }

    function changeTimer(seconds) {
        if (!isRunning) { // Only allow changes if timer is not running
            timerSeconds = Math.max(0, timerSeconds + seconds);
            updateTimer();
        }
    }

    // function changeShotClock(seconds) {
    //     if (!isShotClockRunning) { // Only allow changes if shot clock is not running
    //         shotClockSeconds = Math.max(0, shotClockSeconds + seconds);
    //         updateScore(shotClockElement, shotClockSeconds);
    //     }
    // }

    function changeTeamName(element) {
        let currentName = element.textContent.trim();
        let newName = prompt('Enter new team name:', currentName);
        if (newName !== null) {
            element.textContent = newName;
            adjustFontSize(element);
        }
    }

    function adjustFontSize(element) {
        // Atur ukuran font maksimum sesuai dengan gaya CSS
        const maxFontSize = 4.68; // Ukuran font maksimal
        let fontSize = maxFontSize;
    
        element.style.fontSize = fontSize + "em";
        let marginBottom = 31.2;
        
        const originalWhiteSpace = element.style.whiteSpace;
        element.style.whiteSpace = 'nowrap';
        
        // Kurangi ukuran font hingga teks muat dalam div
        while (element.scrollWidth > element.clientWidth && fontSize > 0) {
            console.log(element.scrollWidth + " - " + element.clientWidth);
            fontSize -= 0.5;
            marginBottom += 2;
            element.style.fontSize = fontSize + "em";
            element.style.marginBottom = marginBottom + "px";
        }

        element.style.whiteSpace = originalWhiteSpace;
    }

    function toggleShotClock() {
        if (isShotClockRunning) {
            clearInterval(shotClockInterval);
            shotClockInterval = null;
            isShotClockRunning = false;
        } else {
            shotClockInterval = setInterval(updateShotClock, 1000); // Update shot clock every second
            isShotClockRunning = true;
        }
    }

    function changeShotClockDuration(newDuration) {
        if (!isShotClockRunning) { // Only allow changes if shot clock is not running
            shotClockDuration = newDuration;
            shotClockSeconds = shotClockDuration;
            updateScore(shotClockElement, shotClockSeconds);
        }
    }

    function resetShotClock() {
        shotClockSeconds = shotClockDuration; // Reset to the global shot clock duration
        updateScore(shotClockElement, shotClockSeconds);
        if (!isShotClockRunning) {
            shotClockInterval = setInterval(updateShotClock, 1000); // Start shot clock immediately
            isShotClockRunning = true;
        } else {
            // If shot clock is running, update the score and reset the interval
            clearInterval(shotClockInterval);
            shotClockInterval = setInterval(updateShotClock, 1000); // Restart shot clock immediately
        }
    }

    function offensiveShotClock() {
        if(shotClockDuration === 24) {
            shotClockSeconds = 14; // Reset to the global shot clock duration
            updateScore(shotClockElement, shotClockSeconds);
            if (!isShotClockRunning) {
                shotClockInterval = setInterval(updateShotClock, 1000); // Start shot clock immediately
                isShotClockRunning = true;
            } else {
                // If shot clock is running, update the score and reset the interval
                clearInterval(shotClockInterval);
                shotClockInterval = setInterval(updateShotClock, 1000); // Restart shot clock immediately
            }
        }
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === ' ') {
            resetShotClock(); // Reset and start shot clock
        } else if (event.key === 'r' || event.key === 'R') {
            offensiveShotClock();
        }else if (event.key === 'p' || event.key === 'P') {
            if (isRunning) {
                stopTimer();
            } else {
                startTimer();
            }
            isRunning = !isRunning;
        }

        // Change shot clock duration with '1' and '2'
        if (event.key === '1') {
            changeShotClockDuration(12); // Set to 12 seconds
        } else if (event.key === '2') {
            changeShotClockDuration(24); // Set to 24 seconds
        }
        // Handle shot clock control with o/O
        if (event.key === 'o' || event.key === 'O') {
            toggleShotClock();
        }

        if (currentHoveredElement) {
            if (currentHoveredElement === timerElement) {
                if (event.key === '+' || event.key === '=') {
                    changeTimer(30); // Add 30 seconds
                } else if (event.key === '-' || event.key === '_') {
                    changeTimer(-30); // Subtract 30 seconds
                }
            } else if (currentHoveredElement === team1NameElement || currentHoveredElement === team2NameElement) {
                if (event.key === 'e' || event.key === 'E') {
                    changeTeamName(currentHoveredElement); // Change team name
                }
            } 
        }
    });

    // Initialize timers and shot clock
    updateTimer();
    updateScore(shotClockElement, shotClockSeconds);
});




document.addEventListener('DOMContentLoaded', () => {
    const team1FoulElement = document.getElementById('team1-foul-count');
    const team2FoulElement = document.getElementById('team2-foul-count');

    function updateFoul(element, foulCount) {
        // Update the text content
        element.textContent = foulCount;

        // Add or remove the 'red' class based on the foul count
        if (foulCount >= 5) {
            element.classList.add('red');
        } else {
            element.classList.remove('red');
        }
    }

    document.addEventListener('keydown', (event) => {
        let currentFoulElement = null;

        if (event.key === 'z' || event.key === 'Z' || event.key === 'x' || event.key === 'X') {
            currentFoulElement = team1FoulElement;
        } else if (event.key === 'n' || event.key === 'N' || event.key === 'm' || event.key === 'M') {
            currentFoulElement = team2FoulElement;
        }

        if (currentFoulElement) {
            let currentFoul = parseInt(currentFoulElement.textContent, 10);
            if (event.key === 'z' || event.key === 'Z') {
                currentFoul = Math.max(0, currentFoul - 1); // Decrease Team 1 fouls
            } else if (event.key === 'x' || event.key === 'X') {
                currentFoul += 1; // Increase Team 1 fouls
            } else if (event.key === 'n' || event.key === 'N') {
                currentFoul = Math.max(0, currentFoul - 1); // Decrease Team 2 fouls
            } else if (event.key === 'm' || event.key === 'M') {
                currentFoul += 1; // Increase Team 2 fouls
            }
            updateFoul(currentFoulElement, currentFoul);
        }
    });

    // Initialize fouls with starting values
    updateFoul(team1FoulElement, parseInt(team1FoulElement.textContent, 10));
    updateFoul(team2FoulElement, parseInt(team2FoulElement.textContent, 10));
});
