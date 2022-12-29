const playMusic = document.querySelector('.playMusic');
const webSong = document.querySelector('.webSong');
const menu = document.querySelector('.menu');
const menuIcon = document.querySelector('.menuIcon');
const menuLine = document.querySelectorAll('.menuLine');
const menuItem = document.querySelector('.menuItem');

//user-defined variables
let playTracker = 0;
let menuTracker = 0;

playMusic.addEventListener('click', (event) => {
    if(navigator.userAgent.indexOf("Firefox") === -1){
        if(playTracker === 0){
            webSong.play();
            playMusic.innerHTML = "Pause";
            playTracker = 1;
        }
        else if(playTracker === 1){
            webSong.pause();
            playMusic.innerHTML = "Play"
            playTracker = 0;
        }
    }
    else{
        if(playTracker === 0){
            webSong.pause();
            playMusic.innerHTML = "Play";
            playTracker = 1;
        }
        else if(playTracker === 1){
            webSong.play();
            playMusic.innerHTML = "Pause";
            playTracker = 0;
        }
    }
});

menuIcon.addEventListener('click', (event) => {
    if(menuTracker % 2 === 0){
        menu.classList.add('open');
        menuItem.classList.add('open');
        for(let line of menuLine){
            line.classList.add('open');
        }
        menuTracker++;
    }
    else if(menuTracker % 2 === 1){
        menu.classList.remove('open');
        menuItem.classList.remove('open');
        for(let line of menuLine){
            line.classList.remove('open');
        }
        menuTracker++;
    }
})