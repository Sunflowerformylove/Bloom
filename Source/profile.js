const backgroundIcon = document.querySelector('.backgroundIcon');
const profileBackground = document.querySelector('.profileBackground');
const background = document.getElementById('background');
const labelMessage = document.querySelector('.labelMessage');
const feedBtn = document.querySelectorAll('.feedBtn');
const boardElement = document.querySelectorAll('.boardElement');
const avatarInput = document.getElementById('avatarInput');
const avatar = document.querySelector('.avatar');
const hideBtn = document.querySelector('.hideBtn');
const realName = document.querySelector('.realName');
const interestInfo = document.querySelector('.interestInfo');
const editBtn = document.querySelectorAll('.editBtn');
const fieldEditor = document.querySelectorAll('.fieldEditor');
const data = document.querySelectorAll('.data');
const boardItem = document.querySelectorAll('.boardItem');
const cancelBtn = document.querySelectorAll('.cancelBtn');
const updateForm = document.getElementById('updateForm');
const saveBtn = document.querySelector('.saveBtn');

function interestSplice(interest){
    let index = 0;
    let arr = [];
    let str = "";
    while(index <= interest.length){
        if(interest[index] !== '|'){
            str += interest[index];
        }
        else{
            arr.push(str);
            str = "";
        }
        index++;
    }
    return arr;
}

window.addEventListener('load', (e) => {
    let interestArr = interestSplice(rawInterest);
    for(let i in interestArr){
        let elem = document.createElement('span');
        elem.className = 'interest';
        elem.textContent = interestArr[i];
        interestInfo.appendChild(elem);
    }
    fieldEditor.forEach((field,index) => {
        field.value = data[index].innerHTML;
    })
});

backgroundIcon.addEventListener('mouseover', (event) =>{
    backgroundIcon.style.color = "white";
    labelMessage.classList.add("show");
});

backgroundIcon.addEventListener('mouseout', (event) =>{
    backgroundIcon.style.color = "black";
    labelMessage.classList.remove("show");
});

labelMessage.addEventListener('mouseover', (event) =>{
    labelMessage.classList.add("show");
});

labelMessage.addEventListener('mouseout', (event) =>{
    labelMessage.classList.remove("show");
});

feedBtn.forEach((button,index) => {
    button.addEventListener('click', () => {
        for(let btn of feedBtn){
            btn.style.backgroundColor = "rgba(205,205,205,0.5)"
        }
        for(let board of boardElement){
            board.style.display = "none";
        }
        boardElement[index].style.display = "flex";
    });
});

background.addEventListener('change', (event) => {
    if(event.target.files.length !== 0){
        let src = URL.createObjectURL(event.target.files[0]);
        profileBackground.src = src;
    }
});

avatarInput.addEventListener('change', (event) => {
    if(event.target.files.length !== 0){
        let src = URL.createObjectURL(event.target.files[0]);
        avatar.src = src;
    }
});

editBtn.forEach((button,index) => {
    button.addEventListener('click', (event) => {
        fieldEditor[index].style.display = 'block';
        fieldEditor[index].value = data[index].innerHTML;
        data[index].style.display = 'none';
    });
    fieldEditor[index].addEventListener('focusout', (event) => {
        if(fieldEditor[index].value.length !== 0 && index === 0){
            data[index].style.display = 'block';
            data[index].innerHTML = fieldEditor[index].value;
            fieldEditor[index].style.display = 'none';
        }
        else if(index !== 0){
            data[index].style.display = 'block';
            data[index].innerHTML = fieldEditor[index].value;
            fieldEditor[index].style.display = 'none';
        }
    });
    fieldEditor[index].addEventListener('keydown', (event) => {
        if(event.keyCode === 13){
            if(fieldEditor[index].value.length !== 0 && index === 0){
                data[index].style.display = 'block';
                data[index].innerHTML = fieldEditor[index].value;
                fieldEditor[index].style.display = 'none';
            }
            else if(index !== 0){
                data[index].style.display = 'block';
                data[index].innerHTML = fieldEditor[index].value;
                fieldEditor[index].style.display = 'none';
            }
        }
    });
    window.addEventListener('click', (event) => {
        if(event.target !== fieldEditor[index] && fieldEditor[index].style.display === 'block' && event.target !== editBtn[index]){
            data[index].style.display = 'block';
            data[index].innerHTML = fieldEditor[index].value;
            fieldEditor[index].style.display = 'none';
        }
    });
});

cancelBtn.forEach((button, index) => {
    button.addEventListener('click', () => {
        boardItem[index].remove();
    })
});

saveBtn.addEventListener('click', () => {
    updateForm.submit();
});