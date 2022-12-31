//DOM variables
const password = document.getElementById("registerPassword");
const passwordStrength = document.querySelector(".passwordStrengthIndicator");
const passwordText = document.querySelector(".passwordStrengthText");
const registerForm = document.querySelector(".registerForm");
const submitBtn = document.querySelector(".submitBtn");
const DOB = document.getElementById("registerDOB");

//secure variables
let passSec = 0;
let containNum = false;
let containNumSentinel = false;
let capitalized = false;
let capitalizedSentinel = false;
let containSpecialChar = false;
let containSpecialCharSentinel = false;
let checkPassLength = false;
let checkPassLengthSentinel = false;

function checkIncludeSpecialChar(string) {
  let specialChar = ["!", "@", "#", "$", "%", "^", "&", "*", "?", "~"];
  for (let i = 0; i < specialChar.length; i++) {
    if (string.includes(specialChar[i])) {
      return true;
    }
  }
  return false;
}

function checkContainNum(string) {
  for (let i = 0; i < string.length; i++) {
    if (string.charAt(i) >= "0" && string.charAt(i) <= "9") {
      return true;
    }
  }
  return false;
}

function validateAge(DOB) {
  let arr = DOB.value.split("-");
  let today = Date.now();
}

//functions
setInterval(() => {
  if (password.value.length >= 8) {
    checkPassLength = true;
  } else {
    checkPassLength = false;
  }
  if (checkPassLength && !checkPassLengthSentinel) {
    checkPassLengthSentinel = true;
    passSec += 20;
  } else if (!checkPassLength && checkPassLengthSentinel) {
    passSec -= 20;
    checkPassLengthSentinel = false;
  }
  if (password.value.charAt(0) >= "A" && password.value.charAt(0) <= "Z") {
    capitalized = true;
  } else {
    capitalized = false;
  }
  if (capitalized && !capitalizedSentinel) {
    passSec += 20;
    capitalizedSentinel = true;
  } else if (!capitalized && capitalizedSentinel) {
    passSec -= 20;
    capitalizedSentinel = false;
  }
  if (checkIncludeSpecialChar(password.value)) {
    containSpecialChar = true;
  } else {
    containSpecialChar = false;
  }
  if (containSpecialChar && !containSpecialCharSentinel) {
    passSec += 30;
    containSpecialCharSentinel = true;
  } else if (!containSpecialChar && containSpecialCharSentinel) {
    passSec -= 30;
    containSpecialCharSentinel = false;
  }
  if (checkContainNum(password.value)) {
    containNum = true;
  } else {
    containNum = false;
  }
  if (containNum && !containNumSentinel) {
    passSec += 30;
    containNumSentinel = true;
  } else if (!containNum && containNumSentinel) {
    passSec -= 30;
    containNumSentinel = false;
  }
}, 1);

//event handlers
password.addEventListener("keydown", (event) => {
  if (passSec <= 30) {
    passwordStrength.style.width = `${passSec}%`;
    passwordStrength.style.borderRadius = "20px 0 0 20px";
    passwordStrength.style.backgroundColor = "red";
  } else if (passSec <= 60) {
    passwordStrength.style.width = `${passSec}%`;
    passwordStrength.style.borderRadius = "20px 0 0 20px";
    passwordStrength.style.backgroundColor = "#FBFB3C";
  } else if (passSec <= 80) {
    passwordStrength.style.width = `${passSec}%`;
    passwordStrength.style.borderRadius = "20px 0 0 20px";
    passwordStrength.style.backgroundColor = "powderblue";
  } else if (passSec <= 100) {
    passwordStrength.style.width = `${passSec}%`;
    passwordStrength.style.borderRadius = "20px";
    passwordStrength.style.backgroundColor = "lime";
  }
});

password.addEventListener("keyup", (event) => {
  if (passSec <= 30) {
    passwordStrength.style.width = `${passSec}%`;
    passwordStrength.style.borderRadius = "20px 0 0 20px";
    passwordStrength.style.backgroundColor = "red";
    passwordText.innerHTML = "Weak";
  } else if (passSec <= 60) {
    passwordStrength.style.width = `${passSec}%`;
    passwordStrength.style.borderRadius = "20px 0 0 20px";
    passwordStrength.style.backgroundColor = "#FBFB3C";
    passwordText.innerHTML = "Medium";
  } else if (passSec <= 80) {
    passwordStrength.style.width = `${passSec}%`;
    passwordStrength.style.borderRadius = "20px 0 0 20px";
    passwordStrength.style.backgroundColor = "powderblue";
    passwordText.innerHTML = "Good";
  } else if (passSec <= 100) {
    passwordStrength.style.width = `${passSec}%`;
    passwordStrength.style.borderRadius = "20px";
    passwordStrength.style.backgroundColor = "lime";
    passwordText.innerHTML = "Excellent";
  }
});

password.addEventListener("focus", (event) => {
  if (passSec <= 30) {
    passwordStrength.style.width = `${passSec}%`;
    passwordStrength.style.borderRadius = "20px 0 0 20px";
    passwordStrength.style.backgroundColor = "red";
    passwordText.innerHTML = "Weak";
  } else if (passSec <= 60) {
    passwordStrength.style.width = `${passSec}%`;
    passwordStrength.style.borderRadius = "20px 0 0 20px";
    passwordStrength.style.backgroundColor = "#FBFB3C";
    passwordText.innerHTML = "Medium";
  } else if (passSec <= 80) {
    passwordStrength.style.width = `${passSec}%`;
    passwordStrength.style.borderRadius = "20px 0 0 20px";
    passwordStrength.style.backgroundColor = "powderblue";
    passwordText.innerHTML = "Good";
  } else if (passSec <= 100) {
    passwordStrength.style.width = `${passSec}%`;
    passwordStrength.style.borderRadius = "20px";
    passwordStrength.style.backgroundColor = "lime";
    passwordText.innerHTML = "Excellent";
  }
});

submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  registerForm.submit();
});
