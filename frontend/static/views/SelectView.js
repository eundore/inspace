import AbstractView from "./AbstractView.js";
import NavComponent from "../js/common/nav.js";
import { initSeats } from "../js/Seat/Seat.js";
import toast from "../js/common/toast.js";
import {
  Price,
  baseURL,
  setButtonConnection,
  composePaymentsInfo,
  checkSeat,
  extendTime,
  chooseSeat,
  chooseByTicket,
} from "../js/handler/seatHandler.js";

export default class extends AbstractView {
  content;

  constructor(params) {
    super(params);
    this.setTitle("INSPACE");
    this.nav = new NavComponent();
  }

  async getHtml() {
    return this.nav.getHtml() + (await super.getHtml("select"));
  }

  defaultFunc() {
    this.nav.defaultFunc();

    initSeats();

    const denied = JSON.parse(localStorage.getItem("denied"));
    if (denied) {
      toast(denied.msg);
      localStorage.removeItem("denied");
    }

    const path = sessionStorage.getItem("path");
    const prevPath = sessionStorage.getItem("history");
    const prevBtn = document.querySelector("#prev-btn");
    const payBtn = document.getElementById("payment-Btn");
    const totalPrice = document.querySelector(".total-price-box__price");
    const ticketInfoArr = document.querySelectorAll(
      ".info-payments .info-payment a"
    );

    // 사용중 Main
    if (prevPath === "using") {
      if (path === "move") chooseSeat(payBtn, prevBtn, totalPrice);
      else if (path == "extend") extendTime(ticketInfoArr, totalPrice, payBtn);
    }
    //퇴실메인
    else if (prevPath === "before") {
      if (path === "select") chooseSeat(payBtn, prevBtn, totalPrice);
      else if (path === "extend") extendTime(ticketInfoArr, totalPrice, payBtn);
      // 선택+연장
      else {
        chooseByTicket(payBtn, prevBtn, totalPrice, ticketInfoArr);
      }
    }
  }
}
