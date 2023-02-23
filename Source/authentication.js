const codeInput = document.querySelectorAll(".codeInput");
const OTP = document.querySelector('.OTP');
const codeCheck = document.querySelector('.codeCheck');
const slidingBtn = document.querySelector('.slidingBtn');
const ID = document.querySelector('.userID');

codeInput.forEach((input, index) => {
  input.addEventListener("keydown", (event) => {
    if (input.value.length === input.maxLength && index < 5 && event.key !== "Backspace" && event.key !== "Delete"){
        codeInput[index + 1].focus();
    }
    else if(event.key === "Backspace" && index >= 1){
      codeInput[index].value = "";
      event.preventDefault();
      codeInput[index - 1].focus();
    }
  });

  input.addEventListener("paste", async (event) => {
    if(navigator.userAgent.includes("Firefox")){
      event.preventDefault();
    }
    else{
      let clipboardText = await navigator.clipboard.readText();
      clipboardText.trim();
      clipboardText.replace(' ', '');
      clipboardText.replace('\n', '');
      clipboardText.replace('\r', '');
      clipboardText.replace('\t', '');
      if(clipboardText.length > 6){
        clipboardText = clipboardText.substring(0,6);
      }
      let text = clipboardText.split('');
      for(let i = 0; i < text.length; i++){
        codeInput[i].value = text[i];
      }
    }
  });
});

slidingBtn.addEventListener('click', (event) => {
  event.preventDefault();
  let otpCode = "";
  for(let i = 0; i < codeInput.length; i++){
    otpCode += codeInput[i].value;
  }
  OTP.value = otpCode;
  codeCheck.submit();
});

$(document).ready(() => {
  $('.codeCheck').submit((event) => {
    event.preventDefault();
    let otpCode = "";
    for(let i = 0; i < codeInput.length; i++){
      otpCode += codeInput[i].value;
    }
    OTP.value = otpCode;
    const data = {
      OTP: OTP.value,
      ID: ID.value,
    }
    $.ajax({
      type: "POST",
      data: JSON.stringify(data),
      success: (response) => {
        console.log("Success!");
      },
      error: (xhr, status, err) => {
        if(err) throw err;
      }
    })
  });
});