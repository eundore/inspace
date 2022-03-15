import { createTable, createSmallTable } from "./Table.js";
import { selectSeat, releaseSeat } from "./selectSeat.js";
import toast from "../common/toast.js";

let countSelected = 0;

export function bringSeatInfo() {
  let countSeatsLeft = [4, 4, 4, 2, 2, 2, 2, 2, 2, 4, 4, 4];

  fetch(
    "http://elice-kdt-sw-1st-vm08.koreacentral.cloudapp.azure.com:5000/reservation/table",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        const { position, remainingTime, table } = data[i];

        const min = remainingTime.min === 0 ? "00" : remainingTime.min;
        const hour = remainingTime.hour === 0 ? "00" : remainingTime.hour;
        const hourText = hour + ":" + min;

        const occupiedSeat = document.querySelector(`li[idx='${position}']`);

        occupiedSeat.innerHTML = hourText;
        occupiedSeat.style.color = "white";
        occupiedSeat.classList.remove("available");
        occupiedSeat.classList.add("occupied");

        countSeatsLeft[table] = countSeatsLeft[table] - 1;
      }

      const tableTexts = document.getElementsByClassName(
        "table__contents__seats-left"
      );
      for (let i = 0; i < countSeatsLeft.length; i++) {
        tableTexts[i].innerText = `(${countSeatsLeft[i]}자리 남음)`;
        if (countSeatsLeft[i] === 0) {
          const table = document.getElementById(`table${i}`);
          let selector = `#table${i} .table__color-bar`;
          if (table.classList.contains("small")) {
            selector += ".small";
          }
          document.querySelector(selector).style.backgroundColor = "#c28ed1";
        }
      }
    })
    .catch((err) => console.log(err));
}

function createSeats() {
  const row1 = document.getElementById("table-row1");
  const row2 = document.getElementById("table-row2");
  const row3 = document.getElementById("table-row3");
  const row4 = document.getElementById("table-row4");

  let numChairs = 0;
  let tableNumber = 0;

  for (let i = 0; i < 3; i++) {
    numChairs = createTable(tableNumber, numChairs, row1.id);
    tableNumber++;
  }
  for (let i = 0; i < 3; i++) {
    numChairs = createSmallTable(tableNumber, numChairs, row2.id);
    tableNumber++;
  }
  for (let i = 0; i < 3; i++) {
    numChairs = createSmallTable(tableNumber, numChairs, row3.id);
    tableNumber++;
  }
  for (let i = 0; i < 3; i++) {
    numChairs = createTable(tableNumber, numChairs, row4.id);
    tableNumber++;
  }
}

export function clearCountSelected() {
  countSelected = 0;
}

export function initSeats() {
  const section = document.getElementById("section-container");

  clearCountSelected();
  createSeats();
  bringSeatInfo();

  section.addEventListener("click", (e) => {
    if (
      !e.target.classList.contains("seat") ||
      e.target.classList.contains("occupied")
    )
      return;
    if (countSelected === 0) {
      selectSeat(e);
      countSelected++;
    } else {
      if (e.target.classList.contains("selected")) {
        releaseSeat(e);
        countSelected--;
      } else {
        toast("자리를 이미 선택하셨습니다!");
      }
    }
  });
}
