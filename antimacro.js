let clickCount = 0;
let lastClickTime = 0;
const MAX_CPS = 25; // 설정할 최대 CPS 값

window.addEventListener('userClick', (event) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime;

    if (timeDiff < 1000 / MAX_CPS) {
        console.warn('Possible autoclicker detected!');
        // 클릭을 무시하지 않고 경고만 출력합니다.
    }

    lastClickTime = currentTime;
    clickCount++;
    if (clickCount > MAX_CPS) {
        console.warn('Too many clicks per second!');
        clickCount = 0; // 클릭 수 초기화
        return;
    }

    fetch('https://blamebackend.onrender.com/api/click', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event.detail)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Click data sent to server:', data);
    })
    .catch(error => {
        console.error('Error sending click data to server:', error);
    });
});
