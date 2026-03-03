let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
const clickSound = new Audio("clicks.mp3");
let loseSound = new Audio("fahh.mp3");

// let turnO = true; //playerX, playerO
let isPlayerTurn = true;  // Player = O
let count = 0; //To Track Draw

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

// const resetGame = () => {
//   // turnO = true;
//   count = 0;
//   enableBoxes();
//   msgContainer.classList.add("hide");
// };

const resetGame = () => {
  turnO = true;
  isPlayerTurn = true;   // ✅ ekhane thakbe
  count = 0;

  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
  });

  msgContainer.classList.add("hide");
  strike.style.width = "0";
};


// boxes.forEach((box) => {
//   box.addEventListener("click", () => {
//     if (turnO) {
//       //playerO
//       box.innerText = "O";
//       turnO = false;
//     } else {
//       //playerX
//       box.innerText = "X";
//       turnO = true;
//     }
//     box.disabled = true;
//     count++;

//     let isWinner = checkWinner();

//     if (count === 9 && !isWinner) {
//       gameDraw();
//     }
//   });
// });

//test

boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (!isPlayerTurn || box.innerText !== "") return;

     // 📳 Haptic feedback
    if ("vibrate" in navigator) {
  navigator.vibrate(100);
}

    // 🔊 Sound play
    clickSound.currentTime = 0; 
    clickSound.play();

    // Player move
    box.innerText = "O";
    box.disabled = true;
    count++;

    let isWinner = checkWinner();
    if (isWinner) return;

    if (count === 9) {
      gameDraw();
      return;
    }

    isPlayerTurn = false;
    setTimeout(computerMove, 500);
  });
});

const computerMove = () => {

  // 1️⃣ Try to Win
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;

    let values = [
      boxes[a].innerText,
      boxes[b].innerText,
      boxes[c].innerText
    ];

    if (
      values.filter(v => v === "X").length === 2 &&
      values.includes("")
    ) {
      let emptyIndex = pattern[values.indexOf("")];
      boxes[emptyIndex].innerText = "X";
      boxes[emptyIndex].disabled = true;
      count++;
      if (checkWinner()) return;
      isPlayerTurn = true;
      return;
    }
  }

  // 2️⃣ Block Player Win
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;

    let values = [
      boxes[a].innerText,
      boxes[b].innerText,
      boxes[c].innerText
    ];

    if (
      values.filter(v => v === "O").length === 2 &&
      values.includes("")
    ) {
      let emptyIndex = pattern[values.indexOf("")];
      boxes[emptyIndex].innerText = "X";
      boxes[emptyIndex].disabled = true;
      count++;
      if (checkWinner()) return;
      isPlayerTurn = true;
      return;
    }
  }

  // 3️⃣ Otherwise Random Move
  let emptyBoxes = [];

  boxes.forEach((box, index) => {
    if (box.innerText === "") {
      emptyBoxes.push(index);
    }
  });

  if (emptyBoxes.length === 0) return;

  let randomIndex = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];

  boxes[randomIndex].innerText = "X";
  boxes[randomIndex].disabled = true;
  count++;

  checkWinner();
  isPlayerTurn = true;
};

//testf

const gameDraw = () => {
  msg.innerText = `Game was a Draw.`;
  msgContainer.classList.remove("hide");
  disableBoxes();
};

const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
  }
};

// const showWinner = (winner) => {

//   if ("vibrate" in navigator) {
//   navigator.vibrate([200, 100, 200]);
// }

//   msg.innerText = `Congratulations, Winner is ${winner}`;
//   msgContainer.classList.remove("hide");
//   disableBoxes();
// };


// let loseSound = new Audio("clicks.mp3"); // <-- ekhane tomar lose sound file path dibey

const showWinner = (winner) => {

  if ("vibrate" in navigator) {
    navigator.vibrate([200, 100, 200]);
  }

  // 🔴 Computer jitle lose sound
  if (winner === "X") {
    loseSound.currentTime = 0;
    loseSound.play();
  }

  msg.innerText = `Congratulations, Winner is ${winner}`;
  msgContainer.classList.remove("hide");
  disableBoxes();
};





const checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        showWinner(pos1Val);
        return true;
      }
    }
  }
};

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
