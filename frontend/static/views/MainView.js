import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    //this.postId = params.id;
    this.setTitle("Main Page");
  }

  getHtml() {
    return `
    <div class="main-container">
      <div class="main-section">
          <div class="main-section-left">
              <canvas id="timer" width="400" height="400"></canvas>
            </div>
          <div class="main-section-right">
            <div class="header">이용 정보</div> 
            <div class="content">
              좌석 회원권 입장시간
            </div>
          </div>
          <div class="main-section-bottom">
          <a href="/" data-link><button class="btn" type="button">시간 연장</button></a>
          <a href="/" data-link><button class="btn" type="button">좌석 이동</button></a>
          <a href="/" data-link><button class="btn" type="button" onclick="checkOut(true)">퇴실</button></a>
          <a href="/select" data-link><button class="btn" type="button">좌석 선택</button></a>
          </div>
        </div>
      </div>
        `;
  }

  defaultFunc() {
    const endTime = new Date("2021-12-19 01:34:00");

    const progressColor = "#daecd7";
    const circleColor = "#fff";
    const lineWidth = 30;

    const canvas = document.getElementById("timer");
    const ctx = canvas.getContext("2d");
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    let now = new Date();
    let elapsed = endTime.getTime() - now.getTime();

    // function runTimer(){
    //   if (elapsed > 0) {
    //     var interval = setInterval(function () {
    //       drawTimer(ctx);
    //     }, 1000);
    //   } else {
    //     drawTimer(ctx);
    //   }
    // }

    if (elapsed > 0) {
      var interval = setInterval(function () {
        drawTimer(ctx);
      }, 1000);
    } else {
      drawTimer(ctx);
    }

    function btnRerange() {}

    function checkOut(flag) {
      if (flag) {
        clearInterval(interval);
        drawTimer(ctx);
      } else {
        interval();
      }
    }

    function drawTimer(ctx) {
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
      ctx.shadowBlur = 5;
      ctx.shadowColor = "#9fa0a4";
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 1;
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
      ctx.fillStyle = "#333333";
      ctx.font = "12pt headerCustomFont";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.textAlign = "center";

      if (elapsed > 0) {
        ctx.fillText("잔여시간", canvasWidth / 2, canvasHeight / 2 - 10);
      } else {
        ctx.fillText("잔여시간없음", canvasWidth / 2, canvasHeight / 2 + 10);
      }

      if (elapsed > 0) {
        now = new Date();
        elapsed = endTime.getTime() - now.getTime();

        const restTime = new Date(elapsed);
        let seconds = parseInt(elapsed / 1000);
        let minutes = parseInt(seconds / 60);
        let hours = parseInt(minutes / 60);

        minutes = minutes - hours * 60;
        seconds = seconds - (minutes * 60 + hours * 60 * 60);

        ctx.font = "22pt headerCustomFont";
        const outputTextPerc = `${hours < 10 ? `0${hours}` : hours}:${
          minutes < 10 ? `0${minutes}` : minutes
        }:${seconds < 10 ? `0${seconds}` : seconds}`;
        ctx.fillText(outputTextPerc, canvasWidth / 2, canvasHeight / 2 + 20);
      }
    }
  }
}
