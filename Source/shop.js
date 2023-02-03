const avatar = document.querySelector(".avatar");
const dropDownItem = document.querySelectorAll(".dropDownItem");
const wishlistIcon = document.querySelector(".wishlistIcon");
const wishlist = document.querySelector(".wishlist");
const checkboxLabel = document.querySelectorAll(".checkboxLabel");
const option = document.querySelectorAll(".option");
const productBoard = document.querySelector(".productBoard");
const pageBar = document.querySelector(".pageBar");

let wishlistTracker = 0;
let wliTracker = 0;

function priceToInt(price) {
  return parseInt(price.split(",").join(""), 10);
}

function formatPrice(price) {
  let charArr = price.split("");
  let count = 0;
  let index = charArr.length - 1;
  while (index >= 0) {
    count++;
    if (count === 3 && index !== 0) {
      charArr.length++;
      for (let i = charArr.length - 1; i >= index; i--) {
        charArr[i] = charArr[i - 1];
      }
      charArr[index] = ",";
      count = 0;
    }
    index--;
  }
  let newPrice = charArr.join("");
  return newPrice;
}

window.addEventListener("load", (event) => {
  if (loginState === "true") {
    const username = document.querySelector(".username");
    const userDropDown = document.querySelector(".userDropDown");
    username.addEventListener("mouseover", (event) => {
      userDropDown.classList.add("open");
    });

    username.addEventListener("mouseout", (event) => {
      userDropDown.classList.remove("open");
    });

    userDropDown.addEventListener("mouseover", (event) => {
      userDropDown.classList.add("open");
    });

    userDropDown.addEventListener("mouseout", (event) => {
      userDropDown.classList.remove("open");
    });
  }
});

wishlistIcon.addEventListener("click", (event) => {
  if (wishlistTracker % 2 === 0) {
    wishlist.style.display = "flex";
    wishlistTracker++;
  } else {
    wishlist.style.display = "none";
    wishlistTracker++;
  }
});

checkboxLabel.forEach((item, index) => {
  item.addEventListener("click", (event) => {
    if (option[index].checked === false) {
      option[index].checked = true;
    } else if (option[index].checked === true) {
      option[index].checked = false;
    }
  });
});

window.addEventListener("load", async (event) => {
  let stream = await fetch("http://localhost:3000/api/products");
  let data = await stream.json();
  let length = Object.keys(data).length;
  let pageNum = Math.ceil(length / 12);
  for (let i = 1; i <= pageNum; i++) {
    let page = document.createElement("span");
    page.innerHTML = i;
    page.className = "page";
    pageBar.appendChild(page);
  }
});