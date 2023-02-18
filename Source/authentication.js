const codeInput = document.querySelectorAll(".codeInput");

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
    console.log(event.key);
  });
});
