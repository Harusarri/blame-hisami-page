document.addEventListener("DOMContentLoaded", () => {
    const leaderboardElement = document.getElementById('leaderboard');
    const toggleDarkMode = document.getElementById('toggleDarkMode');
    const editNameButton = document.getElementById('editNameButton');
    const nicknameModalContent = document.getElementById('nicknameModalContent');
    const closeBtn = nicknameModalContent.querySelector('.close');
    let darkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';
    let currentIp = '';
    let userIp = '';

    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
    }

    toggleDarkMode.addEventListener('click', () => {
        darkModeEnabled = !darkModeEnabled;
        document.body.classList.toggle('dark-mode', darkModeEnabled);
        localStorage.setItem('darkModeEnabled', darkModeEnabled);
    });

    if (editNameButton) {
        editNameButton.addEventListener('click', () => {
            showEditNicknameModal(userIp);
        });
    }

    closeBtn.addEventListener('click', () => {
        nicknameModalContent.style.display = 'none';
    });

    getUserIp().then(ip => {
        userIp = ip;

        fetch('https://blamehisami.adaptable.app/api/leaderboard')
            .then(response => response.json())
            .then(data => {
                leaderboardElement.innerHTML = '';

                // 데이터 정렬: 클릭 수에 따라 내림차순 정렬
                const sortedData = Object.entries(data).sort((a, b) => b[1].clicks - a[1].clicks);

                sortedData.forEach(([username, { ip, clicks }], index) => {
                    const maskedIp = maskIP(ip);
                    const displayName = username ? `${username}` : `${maskedIp}`;
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <span class="rank">${index + 1}</span>
                        <span class="leaderboard-text">${maskedIp} (${displayName})</span>
                        <span class="clicks">${clicks} clicks</span>
                    `;
                    leaderboardElement.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error('Error fetching leaderboard data:', error);
            });
    }).catch(error => {
        console.error('Error fetching user IP:', error);
    });
});

function maskIP(ip) {
    if (!ip) return '';
    if (ip.includes(':')) { // IPv6 주소일 경우
        const parts = ip.split(':');
        return `${parts[0]}:${parts[1]}::${parts[parts.length - 1]}`;
    } else { // IPv4 주소일 경우
        const parts = ip.split('.');
        if (parts.length === 4) {
            return `${parts[0]}.${parts[1].charAt(0)}*.${parts[2].charAt(0)}*.${parts[3]}`;
        }
    }
    return ip;
}

function showEditNicknameModal(ip) {
    currentIp = ip;
    const modal = document.getElementById('nicknameModalContent');
    modal.style.display = 'block';
    document.getElementById('nicknameInput').value = '';
}

function saveNickname() {
    const newNickname = document.getElementById('nicknameInput').value;
    fetch('https://blamehisami.adaptable.app/api/changeNickname', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oldIp: currentIp, newNickname: newNickname })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('username', newNickname);
            alert('Nickname updated successfully!');
            document.getElementById('nicknameModalContent').style.display = 'none';
            location.reload();
        } else {
            alert('Error updating nickname: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error updating nickname:', error);
    });
}

async function getUserIp() {
    try {
        const response = await fetch('https://api64.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
        throw error;
    }
}
