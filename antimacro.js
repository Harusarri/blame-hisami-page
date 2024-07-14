let clickCount = 0;
let lastClickTime = 0;
const MAX_CPS = 200; // 모바일 환경에서 더 높은 CPS 값을 설정합니다.

window.addEventListener('userClick', (event) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime;

    if (timeDiff < 1000 / MAX_CPS) {
        console.warn('Too many clicks per second!');
        clickCount = 0; // 클릭 수 초기화
        return; // 클릭을 무시합니다.
    }

    lastClickTime = currentTime;
    clickCount++;

    // 클릭 데이터를 업데이트합니다.
    updateClickData(event.detail);
});

function updateClickData(clickData) {
    fetch('https://blamebackend.onrender.com/api/click', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(clickData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Click data sent to server:', data);
    })
    .catch(error => {
        console.error('Error sending click data to server:', error);
    });
}
