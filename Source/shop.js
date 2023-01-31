const avatar = document.querySelector(".avatar");
const dropDownItem = document.querySelectorAll(".dropDownItem");
const wishlistIcon = document.querySelector(".wishlistIcon");
const wishlist = document.querySelector(".wishlist");
const checkboxLabel = document.querySelectorAll(".checkboxLabel");
const option = document.querySelectorAll(".option");
const productBoard = document.querySelector(".productBoard");
const pageBar = document.querySelector(".pageBar");

window.addEventListener("load", (event) => {
  if(loginState === "true"){
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

wishlistIcon.addEventListener("mouseover", (event) => {
  wishlist.style.display = "flex";
});

wishlistIcon.addEventListener("mouseout", (event) => {
  wishlist.style.display = "none";
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
  for(let i = 1; i <= pageNum; i++) {
    let page = document.createElement("span");
    page.innerHTML = i;
    page.className = "page";
    pageBar.appendChild(page);
  }
  const pages = document.querySelectorAll('.page');
  pages[0].classList.add("chosen");
  for (let i = 0; i < 12; i++) {
      let elem = document.createElement("div");
      elem.className = "item";
      elem.innerHTML = `<img src= ${data[i].bigImg} alt="" class="itemImage">
          <div class="itemName"> ${data[i].name} </div>
          <div class="description"> ${data[i].description} '</div>
          <div class="price"> ${data[i].price} </div>
          <div class="orderBtn">Order</div>
          <input type="hidden" name="productId" value = "${data[i].ID}">
          <input type="hidden" name="collection" value = "${data[i].collection}">
          <input type="hidden" name="type" value = "${data[i].type}"`;
      productBoard.appendChild(elem);
  }
  pages.forEach((page, index) => {
    page.addEventListener('click',(event) => {
      for(let i of pages){
        i.classList.remove('chosen');
      }
      page.classList.add('chosen');
      productBoard.innerHTML = '';
      for (let i = 12 * (parseInt(page.innerHTML) - 1); i < 12 * parseInt(page.innerHTML); i++) {
        let elem = document.createElement("div");
        elem.className = "item";
        elem.innerHTML = `<img src= ${data[i].bigImg} alt="" class="itemImage">
            <div class="itemName"> ${data[i].name} </div>
            <div class="description"> ${data[i].description} '</div>
            <div class="price"> ${data[i].price} </div>
            <div class="orderBtn">Order</div>
            <input type="hidden" name="productId" value = "${data[i].ID}">
            <input type="hidden" name="collection" value = "${data[i].collection}">
            <input type="hidden" name="type" value = "${data[i].type}"`;
        productBoard.appendChild(elem);
    }
    });
  });
});