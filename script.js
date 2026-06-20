const titleScreen = document.getElementById("title-screen");
const storyScreen = document.getElementById("story-screen");
const countdownScreen = document.getElementById("countdown-screen");
const countdownText = document.getElementById("countdown-text");
const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const scoreScreen = document.getElementById("score-screen");
const finalScore = document.getElementById("final-score");
const startButton = document.getElementById("start-button");

const holes = document.querySelectorAll(".hole");
const scoreText = document.getElementById("score");
const hammer = document.getElementById("hammer");
const timeText = document.getElementById("time");

const hitSound = new Audio("sounds/hammer.mp3");
const whistleSound = new Audio("sounds/whistle.mp3");
const countSound = new Audio("sounds/count.mp3");
const pigletSound = new Audio("sounds/piglet.mp3");
const helmetSound = new Audio("sounds/helmet.mp3");

const titleBgm = new Audio("sounds/bgm_1.mp3");
const storyBgm = new Audio("sounds/bgm_2.mp3");
const gameBgm = new Audio("sounds/bgm_3.mp3");
const scoreBgm = new Audio("sounds/bgm_2.mp3");

titleBgm.loop = true;
storyBgm.loop = true;
gameBgm.loop = true;
scoreBgm.loop = true;

let time = 30;
let score = 0;
let isPlaying = false;
let moleInterval;
let timerInterval;

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopAllBgm() {
  titleBgm.pause();
  storyBgm.pause();
  gameBgm.pause();
  scoreBgm.pause();

  titleBgm.currentTime = 0;
  storyBgm.currentTime = 0;
  gameBgm.currentTime = 0;
  scoreBgm.currentTime = 0;
}

function playBgm(bgm) {
  stopAllBgm();
  bgm.play();
}

startButton.addEventListener("click", () => {
  playSound(hitSound);
  playBgm(storyBgm);

  titleScreen.classList.add("hidden");
  storyScreen.classList.remove("hidden");

  setTimeout(() => {
    storyScreen.classList.add("hidden");
    startCountdown();
  }, 15000);
});

function startCountdown() {
  countdownScreen.classList.remove("hidden");

  let count = 3;
  countdownText.textContent = count;

  playSound(countSound);

  const countdownInterval = setInterval(() => {
    count--;

    if (count > 0) {
      countdownText.textContent = count;
    } else if (count === 0) {
      countdownText.textContent = "START!";
      playBgm(gameBgm);
    } else {
      clearInterval(countdownInterval);

      countdownScreen.classList.add("hidden");
      gameScreen.classList.remove("hidden");

      startGame();
    }
  }, 1000);
}

function startGame() {
  time = 30;
  score = 0;
  isPlaying = true;

  scoreText.textContent = score;
  timeText.textContent = time;

  showMole();

  moleInterval = setInterval(showMole, 1200);

  timerInterval = setInterval(() => {
    time--;
    timeText.textContent = time;

    if (time <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  isPlaying = false;

  clearInterval(timerInterval);
  clearInterval(moleInterval);

  holes.forEach((hole) => {
    hole.classList.remove("mole");
    hole.classList.remove("dead");
  });

  stopAllBgm();

  gameScreen.classList.add("hidden");
  gameOverScreen.classList.remove("hidden");
  playSound(whistleSound);

  setTimeout(() => {
    gameOverScreen.classList.add("hidden");

    finalScore.textContent = score;
    scoreScreen.classList.remove("hidden");

    playBgm(scoreBgm);

    const pigCount = Math.min(score, 20);

    for (let i = 0; i < pigCount; i++) {
      createPig(i * 0.4);
    }
  }, 2000);

  setTimeout(() => {
    scoreScreen.classList.add("hidden");
    titleScreen.classList.remove("hidden");

    stopAllBgm();

  }, 15000);
}

function createPig(delay) {
  const pig = document.createElement("img");

  pig.src = "images/pig1.png";
  pig.classList.add("running-pig");
  pig.style.bottom = `${20 + Math.random() * 50}px`;

  document.getElementById("pig-run-area").appendChild(pig);

  // 画像アニメーション
  const pigFrames = [
    "images/pig1.png",
    "images/pig2.png",
    "images/pig1.png",
    "images/pig3.png"
  ];

  let frame = 0;

  const frameAnimation = setInterval(() => {
    pig.src = pigFrames[frame];
    frame++;

    if (frame >= pigFrames.length) {
      frame = 0;
    }
  }, 120);

  const randomDelay = delay + Math.random() * 0.5;
  const hopDelay = Math.random();
  const hopSpeed = 0.35 + Math.random() * 0.25;

  pig.style.animationDelay = `${randomDelay}s, ${hopDelay}s`;
  pig.style.animationDuration = `4s, ${hopSpeed}s`;

  // 5秒後に削除
  setTimeout(() => {
    clearInterval(frameAnimation);
    pig.remove();
  }, 12000);
}

function showMole() {
  if (!isPlaying) {
    return;
  }

  holes.forEach((hole) => {
    hole.classList.remove("mole");
    hole.classList.remove("dead");
    hole.classList.remove("pig");
    hole.classList.remove("pig-dead");
    hole.classList.remove("helmet");
  });

  const randomIndex = Math.floor(Math.random() * holes.length);
  const randomCharacter = Math.random();

  if (randomCharacter < 0.7) {
    holes[randomIndex].classList.add("mole");
  } else if (randomCharacter < 0.9) {
    holes[randomIndex].classList.add("pig");
  } else {
    holes[randomIndex].classList.add("helmet");
  }
}

holes.forEach((hole) => {
  hole.addEventListener("click", () => {
    if (!isPlaying) {
      return;
    }

    if (hole.classList.contains("mole")) {
      playSound(hitSound);

      score++;
      scoreText.textContent = score;

      hole.classList.remove("mole");
      hole.classList.add("dead");

      setTimeout(() => {
        hole.classList.remove("dead");
      }, 300);
    }

    if (hole.classList.contains("pig")) {
      playSound(hitSound);

      score--;

      if (score < 0) {
        score = 0;
      }

      scoreText.textContent = score;

      hole.classList.remove("pig");
      hole.classList.add("pig-dead");

      setTimeout(() => {
        hole.classList.remove("pig-dead");
      }, 300);
    }
    if (hole.classList.contains("helmet")) {
      playSound(helmetSound);

      hole.classList.remove("helmet");
      hole.classList.add("mole");
    }
  });
});

document.addEventListener("mousemove", (event) => {
  hammer.style.left = `${event.clientX - 20}px`;
  hammer.style.top = `${event.clientY - 20}px`;
});

document.addEventListener("mousedown", () => {
  hammer.classList.add("hit");
});

document.addEventListener("mouseup", () => {
  hammer.classList.remove("hit");
});