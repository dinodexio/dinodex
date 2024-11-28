import Player from './Player.js';
import Ground from './Ground.js';
import CactiController from './CactiController.js';
import Score from './Score.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const GAME_SPEED_START = 1; // 1.0
const GAME_SPEED_INCREMENT = 0.00001;

const GAME_WIDTH = window.innerWidth;
const GAME_HEIGHT = window.innerHeight;
const PLAYER_WIDTH = 88; //58
const PLAYER_HEIGHT = 94; //62
const MAX_JUMP_HEIGHT = 300;
const MIN_JUMP_HEIGHT = 200;
const GROUND_WIDTH = 2400;
const GROUND_HEIGHT = 30;
const HEIGHT_STANDING = 0;
const HEIGHT_STANDING_MOBILE = 120;
const GROUND_AND_CACTUS_SPEED = 0.5;

const CACTI_CONFIG = [
  { width: 98, height: 100, image: 'images/cactus-left.svg' },
  { width: 98, height: 100, image: 'images/cactus-center.svg' },
  { width: 72, height: 100, image: 'images/cactus-right.svg' },
];

// Tạo đối tượng Image cho đám mây 1
const cloudImage1 = new Image();
cloudImage1.src = 'images/cloud-1.svg'; // Thay bằng đường dẫn đến ảnh đám mây 1

// Tạo đối tượng Image cho đám mây 2
const cloudImage2 = new Image();
cloudImage2.src = 'images/cloud-2.svg'; // Thay bằng đường dẫn đến ảnh đám mây 2

// Tạo đối tượng Image cho đám mây 3
const cloudImage3 = new Image();
cloudImage3.src = 'images/cloud-3.svg'; // Thay bằng đường dẫn đến ảnh đám mây 3

// Tạo đối tượng Image cho đám mây 4
const cloudImage4 = new Image();
cloudImage4.src = 'images/cloud-4.svg'; // Thay bằng đường dẫn đến ảnh đám mây 4

// Load the background image
const backgroundImage = new Image();
backgroundImage.src = 'images/bg-web.png'; // Replace with your background image path
backgroundImage.style.objectFit = 'cover';
backgroundImage.style.backgroundRepeat = 'no-repeat';

let clouds = [
  // { x: GAME_WIDTH * 0.1, y: 50, image: cloudImage1, width: 150, height: 65 },
  { x: GAME_WIDTH * 0.8, y: 100, image: cloudImage2, width: 150, height: 55 },
  // { x: GAME_WIDTH * 0.5, y: 150, image: cloudImage3, width: 150, height: 65 },
  { x: GAME_WIDTH * 0.3, y: 200, image: cloudImage4, width: 150, height: 55 },

  {
    x: GAME_WIDTH * 1.1,
    y: GAME_HEIGHT * 0.3,
    image: cloudImage1,
    width: 150,
    height: 55,
  },
  // { x: GAME_WIDTH * 1.3, y: 100, image: cloudImage2, width: 150, height: 65 },
  {
    x: GAME_WIDTH * 1.5,
    y: GAME_HEIGHT * 0.2,
    image: cloudImage3,
    width: 150,
    height: 55,
  },
  // { x: GAME_WIDTH * 1.7, y: 200, image: cloudImage2, width: 150, height: 65 },
  // ... thêm các đám mây khác
];

//Game Objects
let player = null;
let ground = null;
let cactiController = null;
let score = null;

let scaleRatio = 1.5;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameOver = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;

function detectDeviceType() {
  const userAgent = navigator.userAgent;
  const screenWidth = window.innerWidth;

  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent,
    )
  ) {
    if (/iPad|Android/i.test(userAgent)) {
      if (screenWidth >= 768) {
        return 'tablet'; // Tablet nếu là iPad/Android và màn hình lớn hơn 768px
      } else {
        return 'mobile'; // Mobile nếu là iPad/Android nhưng màn hình nhỏ hơn hoặc bằng 768px (có thể bật F12)
      }
    } else {
      return 'mobile'; // Mobile nếu là các thiết bị di động khác
    }
  } else if (/Macintosh|Windows|Linux/i.test(userAgent)) {
    if (screenWidth <= 768) {
      return 'mobile'; // Coi như mobile nếu bật F12 trên desktop/laptop
    } else if (screenWidth <= 1024) {
      return 'laptop';
    } else {
      return 'desktop';
    }
  } else {
    return 'special';
  }
}

function drawClouds() {
  const device = detectDeviceType();
  if (device === 'tablet') {
    scaleRatio = 1.5;
  }
  if (device === 'mobile') {
    scaleRatio = 1;
  }
  if (device === 'laptop') {
    scaleRatio = 2;
  }
  if (device === 'desktop') {
    scaleRatio = 2.5;
  }
  if (device === 'special') {
    scaleRatio = 3.8;
  }

  clouds.forEach(cloud => {
    ctx.drawImage(
      cloud.image,
      cloud.x,
      cloud.y,
      cloud.width * scaleRatio,
      cloud.height * scaleRatio,
    );
    cloud.x -= 0.5; // Điều chỉnh tốc độ di chuyển
    if (cloud.x + cloud.width + canvas.width < 0) {
      cloud.x = canvas.width;
    }
  });
}

// Function to draw the background
function drawBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function createSprites(scaleRatio) {
  const device = detectDeviceType();
  if (device === 'tablet') {
    scaleRatio = 1.5;
  }
  if (device === 'mobile') {
    scaleRatio = 1;
  }
  if (device === 'laptop') {
    scaleRatio = 2;
  }
  if (device === 'desktop') {
    scaleRatio = 3;
  }
  if (device === 'special') {
    scaleRatio = 3.8;
  }
  const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
  const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
  const minJumpHeightInGame =
    device === 'mobile'
      ? (MIN_JUMP_HEIGHT + HEIGHT_STANDING_MOBILE) * scaleRatio
      : MIN_JUMP_HEIGHT * scaleRatio;
  const maxJumpHeightInGame =
    device === 'mobile'
      ? (MAX_JUMP_HEIGHT + HEIGHT_STANDING_MOBILE) * scaleRatio
      : MAX_JUMP_HEIGHT * scaleRatio * 0.8;

  const groundWidthInGame = GROUND_WIDTH * scaleRatio;
  const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

  const heightStanding =
    device === 'mobile' ? HEIGHT_STANDING_MOBILE : HEIGHT_STANDING;

  player = new Player(
    ctx,
    playerWidthInGame,
    playerHeightInGame,
    minJumpHeightInGame,
    maxJumpHeightInGame,
    scaleRatio,
    heightStanding,
  );

  ground = new Ground(
    ctx,
    groundWidthInGame,
    groundHeightInGame,
    GROUND_AND_CACTUS_SPEED,
    scaleRatio,
    heightStanding,
  );

  const cactiImages = CACTI_CONFIG.map(cactus => {
    const image = new Image();
    image.src = cactus.image;
    return {
      image: image,
      width: cactus.width * scaleRatio * 0.7,
      height: cactus.height * scaleRatio * 0.7,
    };
  });

  cactiController = new CactiController(
    ctx,
    cactiImages,
    scaleRatio,
    GROUND_AND_CACTUS_SPEED,
    heightStanding,
  );

  score = new Score(ctx, scaleRatio);
}

function setScreen() {
  scaleRatio = getScaleRatio();
  canvas.width = GAME_WIDTH * scaleRatio;
  canvas.height = GAME_HEIGHT * scaleRatio;
  // canvas.height = window.innerHeight * scaleRatio;
  createSprites(scaleRatio);
}

setScreen();
//Use setTimeout on Safari mobile rotation otherwise works fine on desktop
window.addEventListener('resize', () => setTimeout(setScreen, 500));

if (screen.orientation) {
  screen.orientation.addEventListener('change', setScreen);
}

function getScaleRatio() {
  const screenHeight = Math.min(
    window.innerHeight,
    document.documentElement.clientHeight,
  );

  const screenWidth = Math.min(
    window.innerWidth,
    document.documentElement.clientWidth,
  );

  //window is wider than the game width
  if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH;
  } else {
    return screenHeight / GAME_HEIGHT;
  }
}

function showGameOver() {
  const device = detectDeviceType();
  if (device === 'tablet') {
    scaleRatio = 1.5;
  }
  if (device === 'mobile') {
    scaleRatio = 1;
  }
  if (device === 'laptop') {
    scaleRatio = 2;
  }
  if (device === 'desktop') {
    scaleRatio = 2.9;
  }
  if (device === 'special') {
    scaleRatio = 3.8;
  }
  const fontSize = 35 * scaleRatio;
  ctx.font = `${fontSize}px PPMondwest`;
  ctx.fillStyle = '#000';

  // Tính toán độ rộng của text
  const textWidth = ctx.measureText('GAME OVER').width;

  // Tính toán tọa độ x để căn giữa
  const x = (canvas.width - textWidth) / 2;

  const y = canvas.height / 2;
  ctx.fillText('GAME OVER', x, y);
}

function setupGameReset() {
  if (!hasAddedEventListenersForRestart) {
    hasAddedEventListenersForRestart = true;

    setTimeout(() => {
      window.addEventListener('keyup', reset, { once: true });
      window.addEventListener('touchstart', reset, { once: true });
    }, 1000);
  }
}

function reset() {
  hasAddedEventListenersForRestart = false;
  gameOver = false;
  waitingToStart = false;
  ground.reset();
  cactiController.reset();
  score.reset();
  gameSpeed = GAME_SPEED_START;
}

function showStartGameText() {
  const device = detectDeviceType();
  if (device === 'tablet') {
    scaleRatio = 1.5;
  }
  if (device === 'mobile') {
    scaleRatio = 1;
  }
  if (device === 'laptop') {
    scaleRatio = 2;
  }
  if (device === 'desktop') {
    scaleRatio = 2.9;
  }
  if (device === 'special') {
    scaleRatio = 3.8;
  }
  const fontSize = 58 * scaleRatio;
  ctx.font = `${fontSize}px PPMondwest`;
  ctx.fillStyle = '#000'; // Màu cho "Dino Game"

  // Calculate the width of the text
  const text = 'Dino Game';
  const textWidth = ctx.measureText(text).width;

  // Calculate the x-coordinate to center the text
  const x = (canvas.width - textWidth) / 2;
  const y = canvas.height / 2;

  // Vẽ "Dino Game"
  ctx.fillText(text, x, y);

  // Font size và màu cho "Press "Space" to start"
  const fontSizeStart = 25 * scaleRatio; // Font size nhỏ hơn
  const text_start = 'Press "Space" to start';
  ctx.font = `${fontSizeStart}px PPMondwest`;
  ctx.fillStyle = '#555'; // Màu xám (hoặc màu khác bạn muốn)
  const textStartWidth = ctx.measureText(text_start).width;

  // Calculate the x-coordinate to center the text
  const xStart = (canvas.width - textStartWidth) / 2;
  const yStart = canvas.height / (device === 'mobile' ? 1.8 : 1.6);

  // Vẽ "Press "Space" to start"
  ctx.fillText(text_start, xStart, yStart);
}

function updateGameSpeed(frameTimeDelta) {
  gameSpeed += frameTimeDelta * GAME_SPEED_INCREMENT;
}

function clearScreen() {
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawClouds();
}

function gameLoop(currentTime) {
  if (previousTime === null) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }
  const frameTimeDelta = currentTime - previousTime;
  previousTime = currentTime;

  clearScreen();

  if (!gameOver && !waitingToStart) {
    //Update game objects
    ground.update(gameSpeed, frameTimeDelta);
    cactiController.update(gameSpeed, frameTimeDelta);
    player.update(gameSpeed, frameTimeDelta);
    score.update(frameTimeDelta);
    updateGameSpeed(frameTimeDelta);
  }

  if (!gameOver && cactiController.collideWith(player)) {
    gameOver = true;
    setupGameReset();
    score.setHighScore();
  }

  //Draw game objects
  ground.draw();
  cactiController.draw();
  player.draw();
  score.draw();

  if (gameOver && !score.hasSetTotalScore) {
    // Kiểm tra gameOver và hasSetTotalScore
    score.setTotalScore();
    score.hasSetTotalScore = true; // Đánh dấu là đã gọi setTotalScore()
  }

  if (gameOver) {
    showGameOver();
  }

  if (waitingToStart) {
    showStartGameText();
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

window.addEventListener('keyup', reset, { once: true });
window.addEventListener('touchstart', reset, { once: true });
