import toast from "../common/toast.js";

export const selectSeat = (e) => {
  const classes = e.target.classList;
  let mySeat = e.target.innerText;
  const display = document.querySelector(".payment-box .seat__selected");

  if (classes.contains("seat") && classes.contains("available")) {
    const tableNumber =
      e.target.parentElement.parentElement.childNodes[1].id.substring(5);

    classes.add("selected");
    classes.remove("available");
    display.innerText = mySeat;

    sessionStorage.setItem("lastSelected", mySeat);
    sessionStorage.setItem("table", tableNumber);
  }
};

export const releaseSeat = (e) => {
  const classes = e.target.classList;
  const display = document.querySelector(".payment-box .seat__selected");

  classes.add("available");
  classes.remove("selected");
  display.innerText = "";

  sessionStorage.removeItem("lastSelected");
  sessionStorage.removeItem("table");
};
