import AbstractView from "./AbstractView.js";
import NavComponent from "../js/common/nav.js";

const baseURL =
  "http://elice-kdt-sw-1st-vm08.koreacentral.cloudapp.azure.com:5000";

export default class extends AbstractView {
  content;

  constructor(params) {
    super(params);
    this.setTitle = "InSpace";
    this.nav = new NavComponent();
  }

  async getHtml() {
    return this.nav.getHtml() + (await super.getHtml("paycheck"));
  }

  defaultFunc() {
    this.nav.defaultFunc();

    const paycheckTitle = document.querySelector(".pay-chekc-title");
    const totalPrice = document.querySelector(".total-price-box__price");
    const totalPriceTitle = document.querySelector(".total-price-box__title");
    const infoPayment = document.getElementsByClassName("info-payment");

    let userName = infoPayment[0].querySelector("a");
    let ticketInfo = infoPayment[1].querySelector("a");
    let paysubtitle = infoPayment[3].querySelector("p");
    let payTime = infoPayment[3].querySelector("a");

    let now = new Date();
    let hour = now.getHours() === 0 ? "00" : now.getHours();
    let min = now.getMinutes() === 0 ? "00" : now.getMinutes();
    if (String(min).length === 1) min = "0" + min;

    userName.innerText = localStorage.getItem("name");
    payTime.innerText = `${now.getFullYear()}.${now.getMonth()}.${now.getDate()} ${hour}:${min}`;

    const path = sessionStorage.getItem("path");

    if (path === "move" || path === "select") {
      paycheckTitle.innerHTML =
        path === "move"
          ? "Successfully<br> Moved!"
          : "Successfully<br> Selected!";
      totalPriceTitle.innerText = "현재 좌석:";
      totalPrice.innerText = sessionStorage.getItem("lastSelected");
      ticketInfo.innerText = "-";
      paysubtitle.innerText = "좌석변경일시";
    } else {
      if (localStorage.hasOwnProperty("ticket")) {
        totalPrice.innerText = JSON.parse(localStorage.getItem("ticket")).price;
        ticketInfo.innerText =
          JSON.parse(localStorage.getItem("ticket")).time + "시간권";
      }
    }

    localStorage.removeItem("ticket");
    sessionStorage.clear();

    history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }
}
