const avatar = document.querySelector(".avatar");
const dropDownItem = document.querySelectorAll(".dropDownItem");
const wishlistIcon = document.querySelector(".wishlistIcon");
const wishlist = document.querySelector(".wishlist");
const checkboxLabel = document.querySelectorAll(".checkboxLabel");
const option = document.querySelectorAll(".option");
const productBoard = document.querySelector(".productBoard");
const pageBar = document.querySelector(".pageBar");
const checkbox = document.querySelectorAll(".option");
const typeFilter = document.querySelectorAll(".type");
const collectionFilter = document.querySelectorAll(".collection");
const search = document.getElementById("search");
const searchRec = document.querySelector(".searchRec");
const searchItem = document.querySelector(".searchItem");

let wishlistTracker = 0;
let wliTracker = false;
let cbTracker = 0;

function checkboxChecked(checkbox) {
  for (let i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked === true) {
      cbTracker = true;
    }
  }
  return cbTracker;
}

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

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function noCheckboxState(checkbox) {
  for (let i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked === true) {
      return false;
    }
  }
  return true;
}

function deleteCharAtPos(str,pos){
  for(let i = pos; i < str.length; i++) {
    str[i] = str[i + 1];
  }
  str.length--;
}

function standardize(str) {
  let newStr = str.toLowerCase().trim().split("");
  for(let i = 0; i < newStr.length - 1; i++) {
    if(newStr[i] === ' ' && newStr[i + 1] === ' '){
      deleteCharAtPos(newStr,i);
    }
  }
  return newStr.join("");
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
  const data = await stream.json();
  let length = Object.keys(data).length;
  let pageNum = Math.ceil(length / 12);

  for (let i = 1; i <= pageNum; i++) {
    let page = document.createElement("span");
    page.innerHTML = i;
    page.className = "page";
    pageBar.appendChild(page);
  }

  for (let i = 0; i < length; i++) {
    let elem = document.createElement("div");
    elem.className = "item";
    elem.innerHTML = `<img src="${data[i].bigImg}" class = "itemImage">
    <div class="itemName"><a href = "localhost:3000/products?ID=${
      data[i].ID
    }">${data[i].name}</a></div>
    <div class = "description">${data[i].description}</div>
    <div class = "price">${formatPrice(data[i].price.toString())}</div>
    <div class = "orderBtn">Order</div>
    <input type="hidden" name="ID" value="${data[i].ID}" class = "itemID">
    <input type="hidden" name="name" value="${
      data[i].collection
    }" class = "collection">
    <input type="hidden" name="type" value="${data[i].type}" class = "type">`;
    productBoard.appendChild(elem);
  }

  const items = document.querySelectorAll(".item");
  const itemImage = document.querySelectorAll(".itemImage");
  const pages = document.querySelectorAll(".page");
  const itemID = document.querySelectorAll(".itemID");
  const orderBtn = document.querySelectorAll(".orderBtn");
  const itemName = document.querySelectorAll(".itemName");
  const price = document.querySelectorAll(".price");
  const collection = document.querySelectorAll(".collection");
  const type = document.querySelectorAll(".type");

  for (let j = 0; j < 12; j++) {
    items[j].style.display = "flex";
  }

  pages[0].classList.add("chosen");

  pages.forEach((page, index) => {
    page.addEventListener("click", (event) => {
      for (let p of pages) {
        p.classList.remove("chosen");
      }
      page.classList.add("chosen");
      for (let item of items) {
        item.style.display = "none";
      }
      for (let i = index * 12; i < index * 12 + 12; i++) {
        items[i].style.display = "flex";
      }
    });
  });

  orderBtn.forEach((button, index) => {
    let unique = false;
    button.addEventListener("click", (event) => {
      if (!wliTracker) {
        let wishlistContainer = document.createElement("form");
        wishlistContainer.className = "wishlistContainer";
        wishlistContainer.setAttribute("method", "POST");
        wishlistContainer.setAttribute(
          "action",
          "http://localhost:3000/payment"
        );
        wishlistContainer.setAttribute(
          "enctype",
          "application/x-www-form-urlencoded"
        );
        wishlistContainer.innerHTML = `<div class="wli">
        <img src = "${itemImage[index].src}" class="wliImage" />
        <div class="wliText">
          <div class="wliName">${itemName[index].innerHTML}</div>
          <div class="wliTotalPrice">Price: <span class="priceText">${formatPrice(
            data[index].price.toString()
          )}</span></div>
          <div class="wliQuantity">Quantity:<input type="number" name="quantity" class = "quantityText" style = "margin-left: 1rem;" value = 1 min = 1 max = 50></div>
          <input type="hidden" name="ID" value="${
            data[index].ID
          }" class = "wliID">
        </div>
      </div>`;
        let proceedBtn = document.createElement("div");
        proceedBtn.className = "proceedBtn";
        proceedBtn.innerHTML = "Proceed";
        wishlist.innerHTML = "";
        wishlist.appendChild(wishlistContainer);
        wishlist.appendChild(proceedBtn);
        wliTracker = true;
        unique = true;
      } else {
        const wishlistContainer = document.querySelector(".wishlistContainer");
        if (!unique) {
          let elem = document.createElement("div");
          elem.className = `wli`;
          elem.innerHTML = `<img src = "${
            itemImage[index].src
          }" class="wliImage" />
          <div class="wliText">
            <div class="wliName">${itemName[index].innerHTML}</div>
            <div class="wliTotalPrice">Price: <span class="priceText">${formatPrice(
              data[index].price.toString()
            )}</span></div>
            <div class="wliQuantity">Quantity:<input type="number" name="quantity" class = "quantityText" style = "margin-left: 1rem;" value = 1 min = 1 max = 50></div>
            <input type="hidden" name="ID" value="${
              data[index].ID
            }" class = "wliID">
          </div>`;
          wishlistContainer.appendChild(elem);
          unique = true;
        } else {
          const wliID = document.querySelectorAll(".wliID");
          const priceText = document.querySelectorAll(".priceText");
          const quantityText = document.querySelectorAll(".quantityText");
          wliID.forEach((ID, ind) => {
            if (ID.value === itemID[index].value) {
              if (quantityText[ind].value < 50) {
                quantityText[ind].value =
                  parseInt(quantityText[ind].value, 10) + 1;
                priceText[ind].innerHTML = formatPrice(
                  (
                    data[parseInt(itemID[index].value, 10)].price *
                    parseInt(quantityText[ind].value, 10)
                  ).toString()
                );
              }
            }
          });
        }
      }
    });
  });

  setInterval(() => {
    const priceText = document.querySelectorAll(".priceText");
    const quantityText = document.querySelectorAll(".quantityText");
    quantityText.forEach((text, idx) => {
      text.addEventListener("change", (event) => {
        priceText[idx].innerHTML = formatPrice(
          (
            data[parseInt(itemID[idx].value, 10)].price *
            parseInt(quantityText[idx].value, 10)
          ).toString()
        );
      });
    });
  }, 1);

  checkbox.forEach((option, index) => {
    option.addEventListener("click", (event) => {
      if (!noCheckboxState(checkbox)) {
        pageBar.style.display = "none";
        if (!cbTracker) {
          for (let i = 0; i < items.length; i++) {
            items[i].style.display = "none";
          }
          cbTracker = true;
        }
        if (option.checked === true) {
          for (let i = 0; i < items.length; i++) {
            if (
              collection[i].value === option.name ||
              type[i].value === option.name
            ) {
              items[i].style.display = "flex";
            }
          }
        } else {
          for (let i = 0; i < items.length; i++) {
            for (let j = 0; j < typeFilter.length; j++) {
              for (let k = 0; k < collectionFilter.length; k++) {
                if (
                  typeFilter[j].checked === false &&
                  collectionFilter[k].checked === false
                ) {
                  if (
                    type[i].value === typeFilter[j].name &&
                    collection[i].value === collection[k].name
                  ) {
                    items[i].style.display = "none";
                  }
                }
              }
            }
          }
        }
      } else {
        cbTracker = false;
        for (let i = 0; i < items.length; i++) {
          items[i].style.display = "none";
        }
        for (let i = 0; i < 12; i++) {
          items[i].style.display = "flex";
        }
        pageBar.style.display = "flex";
      }
    });
  });

  checkboxLabel.forEach((label, index) => {
    label.addEventListener("click", (event) => {
      if (!noCheckboxState(checkbox)) {
        pageBar.style.display = "none";
        if (!cbTracker) {
          for (let i = 0; i < items.length; i++) {
            items[i].style.display = "none";
          }
          cbTracker = true;
        }
        if (checkbox[index].checked === true) {
          for (let i = 0; i < items.length; i++) {
            if (
              collection[i].value === checkbox[index].name ||
              type[i].value === checkbox[index].name
            ) {
              items[i].style.display = "flex";
            }
          }
        } else {
          for (let i = 0; i < items.length; i++) {
            if (
              collection[i].value === checkbox[index].name &&
              checkbox[index].classList.contains("collectionFilter")
            ) {
              items[i].style.display = "none";
            }
            if (
              type[i].value === checkbox[index].name &&
              checkbox[index].classList.contains("typeFilter")
            ) {
              items[i].style.display = "none";
            }
          }
        }
      } else {
        cbTracker = false;
        for (let i = 0; i < items.length; i++) {
          items[i].style.display = "none";
        }
        for (let i = 0; i < 12; i++) {
          items[i].style.display = "flex";
        }
        pageBar.style.display = "flex";
      }
    });
  });

  items.forEach((item, index) => {
    item.addEventListener("click", (event) => {
      window.open(`localhost:3000/products?ID=${data[index].ID}`, "_blank");
    });
  });

  search.addEventListener("keydown", (event) => {
    searchRec.innerHTML = "";
    let searchItemCount = 0;
    for (let i = 0; i < length; i++) {
      if (
        (standardize(data[i].name).includes(standardize(search.value)) ||
        standardize(data[i].collection).includes(standardize(search.value)) ||
        standardize(data[i].type).includes(standardize(search.value))) && search.value.trim() !== ""
      ) {
        if (searchItemCount < 5) {
          searchItemCount++;
          let elem = document.createElement("div");
          elem.className = "searchItem";
          elem.innerHTML = `<div class="searchItem">
        <img
          src="${data[i].bigImg}"
          class="siImage"
        />
        <div class="siText">
          <div class="siName">${data[i].name}</div>
          <div class="siDescription">${data[i].description}</div>
          <div class="availStock">Available: ${data[i].stock}</div>
        </div>
      </div>`;
          searchRec.appendChild(elem);
        }
      }
    }
  });
  search.addEventListener("keyup", (event) => {
    searchRec.innerHTML = "";
    let searchItemCount = 0;
    for (let i = 0; i < length; i++) {
      if (
        (standardize(data[i].name).includes(standardize(search.value)) ||
        standardize(data[i].collection).includes(standardize(search.value)) ||
        standardize(data[i].type).includes(standardize(search.value))) && search.value.trim() !== ""
      ) {
        if (searchItemCount < 5) {
          searchItemCount++;
          let elem = document.createElement("div");
          elem.className = "searchItem";
          elem.innerHTML = `<div class="searchItem">
        <img
          src="${data[i].bigImg}"
          class="siImage"
        />
        <div class="siText">
          <div class="siName">${data[i].name}</div>
          <div class="siDescription">${data[i].description}</div>
          <div class="availStock">Available: ${data[i].stock}</div>
        </div>
      </div>`;
          searchRec.appendChild(elem);
        }
      }
    }
  })
});

search.addEventListener("focusin", (event) => {
  searchRec.classList.add("active");
});

search.addEventListener("focusout", (event) => {
  searchRec.classList.remove("active");
});