const loginForm = document.querySelector(".loginForm");
const submitBtn = document.querySelector(".submitBtn");
const passwordShow = document.querySelector(".passwordShow");
const loginPassword = document.getElementById("loginPassword");

let checkClick = false;

submitBtn.addEventListener("click", (event) => {
  loginForm.submit();
});

passwordShow.addEventListener("click", (event) => {
  if(!checkClick) {
    loginPassword.type = "text";
    checkClick = true;
  }
  else{
    loginPassword.type = "password";
    checkClick = false;
  }
});