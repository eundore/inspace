import AbstractView from "./AbstractView.js";
import NavComponent from "../js/common/nav.js";
import { baseURL } from "../js/handler/seatHandler.js";
// import { copy } from "../../../backend/app.js";

export default class extends AbstractView {
  content;

  constructor(params) {
    super(params);
    //this.postId = params.id;
    this.setTitle("InSpace");
    this.nav = new NavComponent();
  }

  async getHtml() {
    return this.nav.getHtml() + (await super.getHtml("main"));
  }

  defaultFunc() {
    this.nav.defaultFunc();
    const $checkIn = document.querySelector(".main-section__btn-check-in");
    const $checkOut = document.querySelector(".main-section__btn-check-out");
    const $btnCheckOut = document.getElementById("btn-check-out");

    const selectSeatBtn = document.querySelector("#btn--select-seat");
    const moveSeatBtn = document.querySelector("#btn--move-seat");
    const selectAndExtendBtn = document.querySelector("#btn--select-extend");
    const extendTimeBtnIn = document.querySelector(
      "#check-in__btn--extend-time"
    );
    const extendTimeBtnOut = document.querySelector(
      "#check-out__btn--extend-time"
    );

    const view = sessionStorage.getItem("view");
    if (view && view === "using") {
      sessionStorage.clear();
    }

    const $seatInfo = document.querySelector("#seat-info span");
    const $checkInfo = document.querySelector("#check-info span");
    const $ticketInfo = document.querySelector("#ticket-info span");

    const progressColor = "#BCCBEA";
    const circleColor = "#EDF0EB";
    const lineWidth = 40;

    const canvas = document.getElementById("timer");
    const ctx = canvas.getContext("2d");
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const checkIn = localStorage.getItem("checkIn");
    const token = localStorage.getItem("token");

    let elapsed = 0;

    if (checkIn == "true") {
      checkInDisplay(true);

      fetch(
        `http://elice-kdt-sw-1st-vm08.koreacentral.cloudapp.azure.com:5000/users/checkIn`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            return null;
          }
        })
        .then((data) => {
          //data = data[0];

          if (data) {
            const info = {
              seat: "T" + data.table + "-" + data.position,
              check: formatDate(new Date(data.startTime)),
              ticket:
                data.duration +
                "시간 " +
                (data.category == "charge" ? "충전권" : "당일권"),
            };

            setInfo(info);

            const endTime = new Date(data.finishTime);

            let setTimer = setInterval(function () {
              elapsed = endTime.getTime() - new Date().getTime();

              if (elapsed <= 0) {
                $btnCheckOut.click();
              }

              drawTimer();
            }, 1000);
          }
        })
        .catch((err) => console.log(err));
    } else {
      checkInDisplay(false);

      fetch(
        `http://elice-kdt-sw-1st-vm08.koreacentral.cloudapp.azure.com:5000/users/checkOut`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
        //fetch("http://localhost:3000/checkOut")
        .then((res) => {
          // if (!res.ok) {
          //   location.href = "/";
          // }
          return res.json();
        })
        .then((data) => {
          //data = data[0];

          const info = {
            seat: " - ",
            check: " - ",
            ticket: " - ",
          };

          setInfo(info);

          if (data.remainingTime && data.remainingTime.hour >= 0) {
            elapsed =
              Math.abs(data.remainingTime.hour) * (1000 * 60 * 60) +
              data.remainingTime.min * (1000 * 60) +
              data.remainingTime.sec * 1000;
          } else {
            elapsed = 0;
          }

          drawTimer();
        })
        .catch((err) => console.log(err));
    }

    const formatDate = (current_datetime) => {
      let formatted_date =
        current_datetime.getFullYear() +
        "-" +
        (current_datetime.getMonth() + 1 >= 10
          ? current_datetime.getMonth() + 1
          : `0${current_datetime.getMonth() + 1}`) +
        "-" +
        (current_datetime.getDate() >= 10
          ? current_datetime.getDate()
          : `0${current_datetime.getDate()}`) +
        " " +
        (current_datetime.getHours() >= 10
          ? current_datetime.getHours()
          : `0${current_datetime.getHours()}`) +
        ":" +
        (current_datetime.getMinutes() >= 10
          ? current_datetime.getMinutes()
          : `0${current_datetime.getMinutes()}`) +
        ":" +
        (current_datetime.getSeconds() >= 10
          ? current_datetime.getSeconds()
          : `0${current_datetime.getSeconds()}`);
      return formatted_date;
    };

    function setInfo(info) {
      $seatInfo.innerHTML = info.seat;
      $checkInfo.innerHTML = info.check;
      $ticketInfo.innerHTML = info.ticket;
    }

    function checkInDisplay(flag) {
      if (flag) {
        $checkIn.style.display = "grid";
        $checkOut.style.display = "none";
      } else {
        const info = {
          seat: "-",
          check: "-",
          ticket: "-",
        };

        setInfo(info);

        $checkIn.style.display = "none";
        $checkOut.style.display = "grid";
      }
    }
    //퇴실 메인
    selectSeatBtn.addEventListener("click", function () {
      sessionStorage.clear();
      sessionStorage.setItem("history", "before");
      sessionStorage.setItem("path", "select");
    });
    extendTimeBtnOut.addEventListener("click", function () {
      sessionStorage.clear();
      sessionStorage.setItem("history", "before");
      sessionStorage.setItem("path", "extend");
    });
    selectAndExtendBtn.addEventListener("click", function () {
      sessionStorage.clear();
      sessionStorage.setItem("history", "before");
      sessionStorage.setItem("path", "both");
    });

    // 이용중 메인
    moveSeatBtn.addEventListener("click", function () {
      sessionStorage.clear();
      sessionStorage.setItem("history", "using");
      sessionStorage.setItem("path", "move");
    });
    extendTimeBtnIn.addEventListener("click", function () {
      sessionStorage.clear();
      sessionStorage.setItem("history", "using");
      sessionStorage.setItem("path", "extend");
    });

    $btnCheckOut.addEventListener("click", () => {
      fetch(
        `http://elice-kdt-sw-1st-vm08.koreacentral.cloudapp.azure.com:5000/users/checkOut`,
        {
          headers: {
            Authorization: token,
          },
        }
        // `http://localhost:5000/users/${id}/checkOut`
      )
        .then((res) => {
          if (res.ok) {
            localStorage.setItem("checkIn", false);
            location.reload();
          }
        })
        .then((data) => {})
        .catch((err) => console.log(err));
    });

    function drawTimer() {
      //timer process circle
      const restTimeHour = (elapsed > 0 ? elapsed : 0) / (1000 * 60 * 60);

      const hour = 24;
      const degrees = (restTimeHour / hour) * 100;
      const radians = (degrees * Math.PI) / 50;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // backgroud circle
      ctx.beginPath();
      ctx.strokeStyle = circleColor;
      ctx.lineWidth = lineWidth;
      // ctx.shadowBlur = 5;
      // ctx.shadowColor = "#9fa0a4";
      // ctx.shadowOffsetX = 0;
      // ctx.shadowOffsetY = 1;
      ctx.arc(
        canvasHeight / 2,
        canvasWidth / 2,
        canvasWidth / 3,
        0,
        Math.PI * 4,
        false
      );
      ctx.imageSmoothingEnabled = true;
      ctx.closePath();
      ctx.stroke();

      // progressBar
      ctx.beginPath();
      ctx.strokeStyle = progressColor;
      ctx.lineWidth = lineWidth;
      ctx.arc(
        canvasHeight / 2,
        canvasWidth / 2,
        canvasWidth / 3,
        0 - (90 * Math.PI) / 180,
        radians - (90 * Math.PI) / 180,
        false
      );
      ctx.stroke();

      // progress update text
      ctx.fillStyle = "#000000";
      ctx.font = "16pt Noto Sans KR";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.textAlign = "center";

      if (elapsed > 0) {
        ctx.fillText("잔여시간", canvasWidth / 2, canvasHeight / 2 - 10);

        const restTime = new Date(elapsed);

        let seconds = parseInt(elapsed / 1000);
        let minutes = parseInt(seconds / 60);
        let hours = parseInt(minutes / 60);

        minutes = minutes - hours * 60;
        seconds = seconds - (minutes * 60 + hours * 60 * 60);

        ctx.font = "22pt Noto Sans KR";
        const outputTextPerc = `${hours < 10 ? `0${hours}` : hours}:${
          minutes < 10 ? `0${minutes}` : minutes
        }:${seconds < 10 ? `0${seconds}` : seconds}`;
        ctx.fillText(outputTextPerc, canvasWidth / 2, canvasHeight / 2 + 27);
      } else {
        ctx.fillText("잔여시간없음", canvasWidth / 2, canvasHeight / 2 + 10);
      }
    }
  }
}
