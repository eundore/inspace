import AbstractView from "./AbstractView.js";
import NavComponent from "../js/common/nav.js";
import ticketHandler from "../js/handler/ticketHandler.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("InSpace");
    this.obj = {};
    this.nav = new NavComponent();
  }

  async getHtml() {
    return this.nav.getHtml() + (await super.getHtml("ticket"));
  }

  defaultFunc() {
    this.nav.defaultFunc();

    const $tickets = document.querySelectorAll(".ticket");
    const $nextBtn = document.getElementById("next-btn");
    $nextBtn.disabled = true;

    const ID = localStorage.getItem("id");

    const $onedayTickets = document.querySelectorAll(".oneday");
    const $chargeTickets = document.querySelectorAll(".charge");

    fetch(
      // `http://localhost:5000/reservation/${ID}/ticket`
      `http://elice-kdt-sw-1st-vm08.koreacentral.cloudapp.azure.com:5000/reservation/ticket`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // 유저의 현재 사용하는 이용권이 충전권(charge)인 경우 충전권 버튼만 클릭 이벤트 활성화
        console.log(data);

        if (data.category === "charge") {
          ticketHandler($chargeTickets);

          $onedayTickets.forEach((ticket) => {
            ticket.style.pointerEvents = "none";
            ticket.style.backgroundColor = "#b0b0b0a3";
          });
          // 유저의 현재 사용하는 이용권이 시간권(oneday)인 경우 시간권 버튼만 클릭 이벤트 활성화
        } else if (data.category === "oneday") {
          ticketHandler($onedayTickets);

          $chargeTickets.forEach((ticket) => {
            ticket.style.pointerEvents = "none";
            ticket.style.backgroundColor = "#b0b0b0a3";
          });
          // 처음 이용하는 유저인 경우 모든 버튼 활성화
        } else {
          ticketHandler($tickets);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
