import {formatPrice} from '/Source/export.js'

const input = document.querySelectorAll('.input');
const label = document.querySelectorAll('.label');
const personalInfo = document.querySelector('.personalInfo');
const nextBtn = document.querySelector('.nextBtn');
const prevBtn = document.querySelector('.prevBtn');
const pbi = document.querySelectorAll('.pbi');
const bcItem = document.querySelectorAll('.bcItem');
const payment = document.querySelectorAll(".payment");
const paymentMethod = document.querySelector(".paymentMethod");
const paymentTab = document.querySelectorAll('.paymentTab');
const inputDate = document.querySelectorAll('.inputDate');
const visaMonth = document.querySelector('.visaMonth');
const visaYear = document.querySelector('.visaYear');
const switcher = document.querySelectorAll('.switcher');
const paymentBoard = document.querySelector('.paymentBoard');
const productReview = document.querySelector('.productReview');

let currentPage = 0;

label.forEach((item,index) =>{
    item.addEventListener('click',()=>{
        label[index].style.fontSize = "1rem";
        input[index].style.height = "1.8rem";
        input[index].focus();
    });
});

input.forEach((item,index) =>{
    item.addEventListener('focusout',()=>{
        if(input[index].value.length === 0){
            label[index].style.fontSize = "1.5rem";
            input[index].style.height = "0";
        }
    });
});

nextBtn.addEventListener('click',(event)=>{
    for(let pb of pbi){
        pb.style.display = "none";
    }
    for(let bc of bcItem){
        bc.classList.remove("chosen");
    }
    if(currentPage < 3){
        currentPage++;
    }
    if(currentPage === 3){
        nextBtn.textContent = "All done!";
    }
    if(nextBtn.textContent === "All done!"){
        let checkConfirmation = 0;
        for(let switches of switcher){
            if(switches.dataset.value === "true"){
                checkConfirmation++;
            }
        }
        if(checkConfirmation === 3){
            paymentBoard.submit();
        }
    }
    pbi[currentPage].style.display = "flex";
    bcItem[currentPage].classList.add("chosen");
});

prevBtn.addEventListener('click',(event)=>{
    for(let pb of pbi){
        pb.style.display = "none";
    }
    for(let bc of bcItem){
        bc.classList.remove("chosen");
    }
    if(currentPage > 0){
        currentPage--;
    }
    nextBtn.textContent = "Next";
    pbi[currentPage].style.display = "flex";
    bcItem[currentPage].classList.add("chosen");
});

payment.forEach((option,index) => {
    option.addEventListener("click", (event) => {
        for (let item of payment){
            item.classList.remove("chosen");
        }
        option.classList.add("chosen");
        paymentMethod.value = option.textContent;
    })
});

inputDate.forEach((item,index) => {
    item.addEventListener("keydown", (event) => {
        if(event.key !== "Backspace" && (event.key < '0' || event.key > '9')) {
            event.preventDefault();
        }
    });
});

visaMonth.addEventListener("keydown", (event) => {
    if(visaMonth.value.length === 2 && event.key !== "Backspace"){
        visaYear.focus();
    }
});

visaYear.addEventListener("keydown", (event) => {
    if(visaYear.value.length === 2 && event.key !== "Backspace"){
        event.preventDefault();
    }
});

payment.forEach((payment, index) => {
    payment.addEventListener("click", (event) => {
        for(let item of paymentTab){
            item.style.display = "none";
            item.style.height = "0";
        }
        if(index !== 0){
            paymentTab[index - 1].style.display = "flex";
            setTimeout(() => {
                paymentTab[index - 1].style.height = "80%";
            },1);  
        }
    });
});

switcher.forEach((item, index) => {
    let switchClick = 0;
    item.addEventListener("click", (event) => {
        if(switchClick % 2 === 0){
            item.classList.add("chosen");
            item.dataset.value = "true";
            switchClick++;
        }
        else{
            item.dataset.value = "false";
            item.classList.remove("chosen");
            switchClick++;
        }
    });
});

window.addEventListener("load", (event) => {
    let totalPrice = 0;
    for(let i = 0; i < data.length; i++) {
    const totPrice = (parseInt(quantity[i]) * parseInt(data[i].price));
    const pditem = document.createElement("div");
    pditem.className = "pditem";
    pditem.innerHTML = `<img src="${data[i].bigImg}" class="pditemImage">
    <div class="pditemText">
      <div class="pditemName">${data[i].name}</div>
      <div class="pditemDescription">${data[i].description}</div>
      <div class="pditemMisc">
        <div class="quantity">Quantity: ${quantity[i]}</div>
        <div class="price">Retail Price: ${formatPrice(data[i].price.toString())}</div>
      </div>
    </div>`;
    productReview.appendChild(pditem);
    totalPrice += totPrice;
    }
    const totalPriceDOM = document.createElement("div");
    totalPriceDOM.className = "totalPrice";
    totalPriceDOM.innerHTML = `Total Cost: ${formatPrice(totalPrice.toString())}`;
    productReview.appendChild(totalPriceDOM);
});