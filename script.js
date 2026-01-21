const firebaseConfig = {
  apiKey: "AIzaSyC22zvyBwIfH7CgI-XNpy7I8wS7WWi2qdc",
  authDomain: "enter-game-39ce5.firebaseapp.com",
  databaseURL: "https://enter-game-39ce5-default-rtdb.firebaseio.com",
  projectId: "enter-game-39ce5",
  storageBucket: "enter-game-39ce5.appspot.com",
  messagingSenderId: "1083853495762",
  appId: "1:1083853495762:web:cd4c9cc865c24fcb47bc0b"
};

document.addEventListener("DOMContentLoaded", () => {

  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  const screens = document.querySelectorAll(".screen");
  const enterBtn = document.getElementById("enterBtn");
  const cardGrid = document.getElementById("cardGrid");
  const confirmText = document.getElementById("confirmText");

  let selectedSuit = "";
  let selectedCard = "";
  let roomMap = {};

  fetch("rooms.json")
    .then(res => res.json())
    .then(data => roomMap = data);

  function showScreen(id) {
    screens.forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
  }

  /* ADMIN UNLOCK */
  db.ref("quiz/isOpen").on("value", snapshot => {
    const isOpen = snapshot.val() === true;
    enterBtn.disabled = !isOpen;
  });

  /* ENTER */
  enterBtn.onclick = () => {
    showScreen("startQuizScreen");
  };

  /* START QUIZ */
  document.getElementById("startQuizBtn").onclick = () => {
    showScreen("suitScreen");
  };

  /* SUIT SELECTION */
  document.querySelectorAll("[data-suit]").forEach(btn => {
    btn.onclick = () => {
      selectedSuit = btn.dataset.suit;
      generateCards();
      showScreen("cardScreen");
    };
  });


  function generateCards() {
  cardGrid.innerHTML = "";

  for (let i = 2; i <= 10; i++) {
    const btn = document.createElement("button");

    btn.className = "cardBtn";
    btn.style.backgroundImage = `url("Assets/cards/${selectedSuit}-${i}.webp")`;

    btn.onclick = () => {
      selectedCard = `${selectedSuit}-${i}`;
      confirmText.textContent =
        `You selected ${selectedSuit.toUpperCase()} card ${i}`;
        const preview = document.getElementById("selectedCardPreview");
        preview.style.backgroundImage = `url("Assets/cards/${selectedSuit}-${i}.webp")`;
      showScreen("confirmScreen");
    };

    cardGrid.appendChild(btn);
  }
}

  /* CONFIRM */
  document.getElementById("confirmBtn").onclick = () => {
    document.getElementById("confirmBtn").disabled = true;

    const roomURL = roomMap[selectedCard];
    if (roomURL) {
      window.location.href = roomURL;
    } else {
      alert("Invalid card selection. Please go back.");
      document.getElementById("confirmBtn").disabled = false;
    }
  };

});
