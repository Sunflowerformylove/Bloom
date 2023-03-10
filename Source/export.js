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

function standardize(str) {
  let newStr = str.toLowerCase().trim().split("");
  for (let i = 0; i < newStr.length - 1; i++) {
    if (newStr[i] === " " && newStr[i + 1] === " ") {
      deleteCharAtPos(newStr, i);
    }
  }
  return newStr.join("");
}

export {formatPrice, standardize};