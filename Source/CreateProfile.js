const chooseNameTitle = document.querySelector('.chooseNameTitle');
const chooseAvatarTitle = document.querySelector('.chooseAvatarTitle');
const chooseGenderTitle = document.querySelector('.chooseGenderTitle');
const keys = document.querySelectorAll(".key");
const alias = document.getElementById("alias");
const keyboard = document.querySelector('.keyboard');
const avatar = document.getElementById('avatar');
const avatarLabel = document.querySelector('.avatarLabel');
const avatarForm = document.querySelector('.avatarForm');
const previewImg = document.querySelector('.previewImg');
const nextBtn = document.querySelector('.nextBtn');
const genderOption = document.querySelectorAll(".genderOption");
const genderChoose = document.querySelector('.genderChoose');
const male = document.querySelector('.male');
const female = document.querySelector('.female');
const nameForm = document.querySelector('.nameForm');
const nameOption = document.querySelectorAll('.nameOption');
const nameYes = document.querySelector('.nameYes');
const nameNo = document.querySelector('.nameNo');
const nameFormTitle = document.querySelector('.nameFormTitle');
const realName = document.getElementById('realName');
const realNameOptions = document.querySelector('.realNameOptions');
const realNameTitle = document.querySelector('.realNameTitle');

let formTracker = 0;

keys.forEach((key, index) => {
  alias.addEventListener("keydown", (event) => {
    if (
      event.key === key.innerHTML.toLowerCase() ||
      event.key === key.innerHTML ||
      event.key === ' ' && key.innerHTML === "Space"
    ) {
      key.classList.add("active");
      setTimeout((event) => {
        key.classList.remove("active");
      }, 300);
    }
  });
});

alias.addEventListener('focusin', (event) => {
  keyboard.classList.add('active');
  nextBtn.classList.add('move');
});

alias.addEventListener('focusout', (event) => {
  keyboard.classList.remove('active');
  nextBtn.classList.remove('move');
});

alias.addEventListener('keydown', (event) => {
  if(event.key === "Enter"){
    event.preventDefault();
    alias.classList.add('hide');
    keyboard.classList.remove('active');
    chooseNameTitle.classList.add('hide');
  }
});

keyboard.addEventListener('load', (event) => {
  if(navigator.userAgent.indexOf("Safari") !== 0){
    keyboard.style.display = "none";
  }
});

avatar.addEventListener('change', (event) => {
  if(event.target.files.length !== 0){
    let tempSource = URL.createObjectURL(event.target.files[0]);
    previewImg.src = tempSource;
    avatarLabel.style.opacity = 0;
  }
});

nextBtn.addEventListener('click', (event) => {
  if(alias.value.length !== 0 && formTracker === 0){
    alias.classList.add('hide');
    keyboard.classList.add('hide');
    chooseNameTitle.classList.add('hide');
    chooseAvatarTitle.classList.add('show');
    avatarForm.classList.add('show');
    formTracker++;
  }
  else if(previewImg.src.length !== 0 && formTracker === 1){
    chooseAvatarTitle.classList.remove('show');
    avatarForm.classList.add('hide');
    chooseGenderTitle.classList.add('show');
    genderChoose.classList.add('show');
    formTracker++;
  }
  else if((male.classList.contains('chosen') || female.classList.contains('chosen')) && formTracker === 2){
    chooseGenderTitle.classList.remove('show');
    genderChoose.classList.add('hide');
    genderChoose.classList.remove('show');
    realNameTitle.classList.add('show');
    realNameOptions.classList.add('show');
    formTracker++;
  }
  else if(((nameYes.classList.contains('chosen') && realName.value.length !== 0) || nameNo.classList.contains('chosen')) && formTracker === 3){
    realNameTitle.classList.remove('show');
    realNameOptions.classList.remove('show');
    realNameOptions.classList.add('hide');
    if(nameYes.classList.contains('chosen')){
        nameFormTitle.style.opacity = 0;
        realName.style.opacity = 0;
        nameForm.classList.remove('open');
    }
  }
});

genderOption.forEach((gender, index) => {
  gender.addEventListener("click", (event) => {
    for (let sex of genderOption) {
      sex.classList.remove("chosen");
    }
    gender.classList.add("chosen");
  });
});

nameOption.forEach((option,index) => {
    option.addEventListener('click', (event) => {
        for(let name of nameOption){
            name.classList.remove('chosen');
        }
        option.classList.add('chosen');
    })
});

nameYes.addEventListener('click', (event) => {
    nameFormTitle.style.opacity = 1;
    realName.style.opacity = 1;
    nameForm.classList.add('open');
});

nameNo.addEventListener('click', (event) => {
    nameFormTitle.style.opacity = 0;
    realName.style.opacity = 0;
    nameForm.classList.remove('open');
});