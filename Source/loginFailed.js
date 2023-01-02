const countdown = document.querySelector('.countdown');

window.addEventListener('load', (event) => {
    let countdownNum = 5;
    setInterval(() => {
        if(countdownNum >= 1){
            countdownNum--;
        }
        countdown.innerHTML = countdownNum.toString();
        if(countdownNum === 0){
            window.location.replace("/Public/Login/login.html");
        }
    }, 1000);
})