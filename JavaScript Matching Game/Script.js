function appendNewCard(parentElement) {
  var card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
  <div class="card-down"></div>
  <div class="card-up"></div>`;
  parentElement.appendChild(card);
  return card;
}


function shuffleCardImageClasses() {
  let cardImg = ["image-1", "image-1", "image-2", "image-2", "image-3", "image-3", "image-4", "image-4", "image-5", "image-5", "image-6", "image-6"];
  let result = _.shuffle(cardImg);
  return result;
}


function createCards(parentElement, shuffledImageClasses) {
  let cardObject = [];
  for (let i = 0; i < 12; i++) {
    let newCard = appendNewCard(parentElement);
    newCard.classList.add(shuffledImageClasses[i]);
    cardObject.push( {
      index: i,
      element: newCard,
      imageClass: shuffledImageClasses[i]
  });
}
  return cardObject;
}


function doCardsMatch(cardObject1, cardObject2) {
  if (cardObject1.imageClass === cardObject2.imageClass) {
    return true;
  } else {
    return false;
  }
}


let counters = {};

function incrementCounter(counterName, parentElement) {
  if (counters[counterName] === undefined) {
    counters[counterName] = 0;
  }
  counters[counterName]++;
  parentElement.innerHTML = counters[counterName];
}


let clickAudio = new Audio('audio/click.wav');
let matchAudio = new Audio('audio/match.wav');
let winAudio = new Audio('audio/win.wav');


function flipCardWhenClicked(cardObject) {
  cardObject.element.onclick = function() {
    if (cardObject.element.classList.contains("flipped")) {
      return;
    }
    clickAudio.play();
    cardObject.element.classList.add("flipped");
    setTimeout(function() {
      onCardFlipped(cardObject);
    }, 500);
  };
}
let lastCardFlipped = null;


function onCardFlipped(newlyFlippedCard) {
  incrementCounter("flipped", document.getElementById("flip-count"));
  if (lastCardFlipped === null) {
    lastCardFlipped = newlyFlippedCard;
    return;
  }
  if (!doCardsMatch(lastCardFlipped, newlyFlippedCard)) {
    lastCardFlipped.element.classList.remove("flipped");
    newlyFlippedCard.element.classList.remove("flipped");
    lastCardFlipped = null;
    return;
  }
  let matchCounter = document.getElementById("match-count");
  incrementCounter("matches", matchCounter);
  if (lastCardFlipped.imageClass === newlyFlippedCard.imageClass) {
    lastCardFlipped.element.classList.add("glow");
    newlyFlippedCard.element.classList.add("glow");
  }
  if (lastCardFlipped.imageClass === newlyFlippedCard.imageClass && matchCounter.innerText != 6) {
    matchAudio.play();
  }

  if (matchCounter.innerText == 6) {
    winAudio.play();
    document.getElementById("winner").classList.remove("hidden");
    document.getElementById("playAgain").classList.remove("hidden");
  }
  lastCardFlipped = null;
}


let cardObjects = 
createCards(document.getElementById("card-container"), shuffleCardImageClasses());

if (cardObjects != null) {
  for (let i = 0; i < cardObjects.length; i++) {
    flipCardWhenClicked(cardObjects[i]);
  }
}


function playAgain() {
  window.location.reload();
}
