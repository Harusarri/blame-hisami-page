document.addEventListener("DOMContentLoaded", () => {
    const blameButton = document.getElementById('blameButton');
    let clickTimes = [];
    let userIpAddress = '';

    // 사용자 IP 주소 가져오기
    fetch('https://api64.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            userIpAddress = data.ip;
            console.log('User IP Address:', userIpAddress); // 확인용 로그
        })
        .catch(error => {
            console.error('Error fetching IP address:', error);
        });

    blameButton.addEventListener('click', handleAntiMacroClick);

    function handleAntiMacroClick() {
        const currentTime = new Date().getTime();
        clickTimes.push(currentTime);

        // 1초 내의 클릭만 유지
        clickTimes = clickTimes.filter(time => currentTime - time < 1000);

        // 초당 클릭 수 체크
        if (clickTimes.length > 20) { // 1초 내에 20번 이상 클릭한 경우
            alert("You are clicking too fast!");
            return;
        }

        // 클릭 수 서버로 전송
        fetch('http://localhost:3000/api/click', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ip: userIpAddress, clicks: 1 })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Click data sent to server:', data);
        })
        .catch(error => {
            console.error('Error sending click data to server:', error);
        });
    }
});
