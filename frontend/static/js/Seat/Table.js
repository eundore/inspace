const defaultChairs = {
  small: 2,
  normal: 4,
  long: 10,
};

function bringChair(position, chairStartIdx, amount) {
  let index = chairStartIdx;
  const ul = document.createElement("ul");

  ul.classList.add("row");

  for (let i = 0; i < amount; i++) {
    const li = document.createElement("li");
    li.classList.add("seat", position, "available");
    li.setAttribute("idx", index);
    li.innerText = `${index}번`;
    li.style.fontSize = "0.7rem";
    li.style.fontWeight = "600";
    li.style.lineHeight = "16px";
    index++;
    ul.append(li);
  }

  return [ul, index];
}

function bringTable(tableNumber, type) {
  const tableDiv = document.createElement("div");
  tableDiv.classList.add("table", type);
  tableDiv.id = `table${tableNumber}`;

  const table = document.createElement("div");
  const tableBar = document.createElement("div");
  const pTitle = document.createElement("p");
  const pSeatsLeft = document.createElement("p");

  table.classList.add("table__contents");
  tableBar.classList.add(`table__color-bar`);
  if (type === "small") tableBar.classList.add(`small`);
  pTitle.classList.add("table__contents__name");
  pSeatsLeft.classList.add("table__contents__seats-left");

  pTitle.innerText = `T${tableNumber}`;
  pSeatsLeft.innerText = `(${defaultChairs[type]}자리 남음)`;

  table.append(pTitle, pSeatsLeft);
  tableDiv.append(table, tableBar);

  return tableDiv;
}

function createTable(tableNumber, chairStartIdx, containerId) {
  const newSection = document.createElement("div");
  const tableSpace = document.getElementById(containerId);

  newSection.classList.add("section-margin", "section");
  newSection.id = `section`;

  const [ul1, chairNextIdx] = bringChair("top", chairStartIdx, 2);
  const table = bringTable(tableNumber, "normal");
  const [ul2, chairFinalIdx] = bringChair("bottom", chairNextIdx, 2);

  newSection.append(ul1, table, ul2);
  tableSpace.append(newSection);

  return chairFinalIdx;
}

function createSmallTable(tableNumber, chairStartIdx, containerId) {
  const newSection = document.createElement("div");
  const tableSpace = document.getElementById(containerId);

  newSection.classList.add("section-margin", "section");
  newSection.id = `section-small`;

  const [ul1, chairNextIdx] = bringChair("top", chairStartIdx, 1);
  const table = bringTable(tableNumber, "small");
  const [ul2, chairFinalIdx] = bringChair("bottom", chairNextIdx, 1);

  newSection.append(ul1, table, ul2);
  tableSpace.append(newSection);

  return chairFinalIdx;
}

export { createSmallTable, createTable };
