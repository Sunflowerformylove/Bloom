const playMusic = document.querySelector(".playMusic");
const webSong = document.querySelector(".webSong");
const backToTop = document.querySelector(".backToTop");
const header = document.getElementById("header");
const menu = document.querySelector(".menu");
const menuIcon = document.querySelector(".menuIcon");
const menuLine = document.querySelectorAll(".menuLine");
const menuItem = document.querySelector(".menuItem");
const headerAnglesDown = document.querySelector(".headerAnglesDown");
const latest = document.getElementById("latest");
const latestNews = document.querySelector(".latestNews");
const newsImg = document.querySelector(".newsImg");
const imgBg = document.querySelector(".imgBg");
const newsText = document.querySelector(".newsText");
const textBg = document.querySelector(".textBg");
const aquaticShowcase = document.getElementById("aquaticShowcase");
const aquaticBtn = document.querySelector(".aquaticBtn");
const mountainShowcase = document.getElementById("mountainShowcase");
const mountainBtn = document.querySelector(".mountainBtn");
const userProfile = document.querySelector('.userProfile');
const profileForm = document.querySelector('.profileForm');
const shopForm = document.querySelector('.shopForm');
const shop = document.querySelector('.shop');
const signOutForm = document.querySelector('.signOutForm');
const signOut = document.querySelector('.signOut');
const section = document.querySelectorAll('.section');

//user-defined variables
let playTracker = 0;
let menuTracker = 0;
let previousScrollPosition = window.scrollY;
let index = 0;

//functions
function parallax(parent, child) {
  let windowHeight = window.innerHeight;
  let topBoundary = parent.getBoundingClientRect().top;
  let bottomBoundary = parent.getBoundingClientRect().bottom;
  if (topBoundary <= windowHeight - 200 && bottomBoundary > 100) {
    child.classList.add("parallax");
  } else if (bottomBoundary <= 100 || topBoundary > windowHeight - 200) {
    child.classList.remove("parallax");
  }
}

function checkInView(element) {
  let elementTop = element.getBoundingClientRect().top;
  let elementBottom = Math.floor(element.getBoundingClientRect().bottom);
  if (elementTop === 0 && elementBottom === window.innerHeight) {
    return true;
  }
  return false;
}

//DOM event handler
window.addEventListener("load", (event) => {
  if (navigator.userAgent.indexOf("Firefox") === -1) {
    playMusic.innerHTML = "Play";
  } else {
    playMusic.innerHTML = "Pause";
  }
});

window.addEventListener("load", (event) => {
  if(navigator.userAgent.indexOf("Firefox") === -1) {
    webSong.removeAttribute("autoplay");
    webSong.pause();
  }
});

window.addEventListener("scroll", (event) => {
  parallax(latestNews, newsText);
  parallax(latestNews, textBg);
  parallax(latestNews, newsImg);
  parallax(latestNews, imgBg);
  parallax(aquaticShowcase, aquaticBtn);
  parallax(mountainShowcase, mountainBtn);
});

playMusic.addEventListener("click", (event) => {
  if (navigator.userAgent.indexOf("Firefox") === -1) {
    if (playTracker === 0) {
      webSong.play();
      playMusic.innerHTML = "Pause";
      playTracker = 1;
    } else if (playTracker === 1) {
      webSong.pause();
      playMusic.innerHTML = "Play";
      playTracker = 0;
    }
  } else {
    if (playTracker === 0) {
      webSong.pause();
      playMusic.innerHTML = "Play";
      playTracker = 1;
    } else if (playTracker === 1) {
      webSong.play();
      playMusic.innerHTML = "Pause";
      playTracker = 0;
    }
  }
});

menuIcon.addEventListener("click", (event) => {
  if (menuTracker % 2 === 0) {
    menu.classList.add("open");
    menuItem.classList.add("open");
    for (let line of menuLine) {
      line.classList.add("open");
    }
    menuTracker++;
  } else if (menuTracker % 2 === 1) {
    menu.classList.remove("open");
    menuItem.classList.remove("open");
    for (let line of menuLine) {
      line.classList.remove("open");
    }
    menuTracker++;
  }
});

backToTop.addEventListener("click", (event) => {
  event.preventDefault();
  window.scrollTo(0, 0);
});

userProfile.addEventListener('click', (event) => {
  profileForm.submit();
});

shop.addEventListener('click', (event) => {
  shopForm.submit();
});

signOut.addEventListener('click', (event) => {
  signOutForm.submit();
});