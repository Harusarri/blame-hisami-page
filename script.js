document.addEventListener("DOMContentLoaded", () => {
    const blameButton = document.getElementById('blameButton');
    const counterElement = document.getElementById('counter');
    const backgroundText = document.getElementById('backgroundText');
    const resetButton = document.getElementById('resetButton');
    const changeColorButton = document.getElementById('changeColorButton');
    const leaderboardButton = document.getElementById('leaderboardButton');
    const randomImage = document.getElementById('randomImage');

    let counter = localStorage.getItem('blameCounter') || 0;
    counterElement.textContent = counter;

    let darkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
    }

    let username = localStorage.getItem('username');

    const getIpAddress = async () => {
        try {
            const response = await fetch('https://api64.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Error fetching IP address:', error);
            return null;
        }
    };

    const images = [
        './image/1.png',
        './image/2.png',
        './image/3.png'
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    randomImage.src = images[randomIndex];

    blameButton.addEventListener('click', async () => {
        counter++;
        counterElement.textContent = counter;
        localStorage.setItem('blameCounter', counter);

        if (counter === 250 && !backgroundText.classList.contains('visible')) {
            backgroundText.style.display = 'block';
            backgroundText.classList.add('visible');
            animateBackgroundText();
        }

        const userIp = await getIpAddress();
        if (!userIp) return;

        const payload = { ip: userIp, clicks: counter - 1 };
        if (username) {
            payload.username = username;
        }

        window.dispatchEvent(new CustomEvent('userClick', { detail: payload }));
    });

    resetButton.addEventListener('click', () => {
        counter = 0;
        counterElement.textContent = counter;
        localStorage.setItem('blameCounter', counter);

        backgroundText.style.display = 'none';
        backgroundText.classList.remove('visible');
    });

    changeColorButton.addEventListener('click', () => {
        darkModeEnabled = !darkModeEnabled;
        document.body.classList.toggle('dark-mode', darkModeEnabled);
        localStorage.setItem('darkModeEnabled', darkModeEnabled);
    });

    leaderboardButton.addEventListener('click', () => {
        window.location.href = './public/leaderboard.html';
    });

    console.log('Initial counter value:', counter);

    function animateBackgroundText() {
        let position = window.innerWidth;

        function moveText() {
            position -= 2.5;
            backgroundText.style.left = position + 'px';

            if (position < -backgroundText.clientWidth) {
                position = window.innerWidth;
            }

            requestAnimationFrame(moveText);
        }

        moveText();
    }

    document.addEventListener('keydown', function(event) {
        if (['ArrowUp', 'ArrowDown', 'Enter', ' '].includes(event.key)) {
            event.preventDefault();
        }
    });
});
