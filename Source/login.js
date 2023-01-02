const loginForm = document.querySelector(".loginForm");
const submitBtn = document.querySelector(".submitBtn");

submitBtn.addEventListener("click", (event) => {
  loginForm.submit();
});
