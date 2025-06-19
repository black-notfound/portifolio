(() => {
  const openBtn = document.getElementById("openSpaceInvadersBtn");
  const closeBtn = document.getElementById("closeSpaceInvadersBtn");
  const overlay = document.getElementById("spaceInvadersOverlay");
  const canvas = document.getElementById("spaceInvadersCanvas");
  const ctx = canvas.getContext("2d");

  const PLAYER_WIDTH = 40;
  const PLAYER_HEIGHT = 20;
  const PLAYER_SPEED = 5;
  const BULLET_SPEED = 7;
  const INVADER_ROWS = 4;
  const INVADER_COLS = 8;
  const INVADER_WIDTH = 30;
  const INVADER_HEIGHT = 20;
  const INVADER_SPEED_BASE = 1;
  const INVADER_DESCEND = 20;

  let level = 1;
  let levelComplete = false;
  let keys = {};
  let playerX = canvas.width / 2 - PLAYER_WIDTH / 2;
  let bullets = [];
  let invaders = [];
  let invaderDirection = 1;
  let invaderSpeed = INVADER_SPEED_BASE;
  let gameOver = false;
  let score = 0;

  function resetGame() {
    playerX = canvas.width / 2 - PLAYER_WIDTH / 2;
    bullets = [];
    invaders = [];
    gameOver = false;
    score = 0;
    invaderDirection = 1;
    invaderSpeed = INVADER_SPEED_BASE;

    for (let r = 0; r < INVADER_ROWS; r++) {
      for (let c = 0; c < INVADER_COLS; c++) {
        invaders.push({
          x: c * (INVADER_WIDTH + 10) + 30,
          y: r * (INVADER_HEIGHT + 10) + 30,
          width: INVADER_WIDTH,
          height: INVADER_HEIGHT,
          alive: true,
        });
      }
    }
  }

  function drawPlayer() {
    ctx.fillStyle = "#00ffcc";
    ctx.fillRect(
      playerX,
      canvas.height - PLAYER_HEIGHT - 10,
      PLAYER_WIDTH,
      PLAYER_HEIGHT
    );
  }

  function drawBullets() {
    ctx.fillStyle = "#00ffcc";
    bullets.forEach((bullet) => {
      ctx.fillRect(bullet.x, bullet.y, 4, 10);
    });
  }

  function drawInvaders() {
    ctx.fillStyle = "#ff0044";
    invaders.forEach((invader) => {
      if (invader.alive) {
        ctx.fillRect(invader.x, invader.y, invader.width, invader.height);
      }
    });
  }

  function movePlayer() {
    if (keys["ArrowLeft"] || keys["a"] || keys["A"]) {
      playerX -= PLAYER_SPEED;
      if (playerX < 0) playerX = 0;
    }
    if (keys["ArrowRight"] || keys["d"] || keys["D"]) {
      playerX += PLAYER_SPEED;
      if (playerX > canvas.width - PLAYER_WIDTH)
        playerX = canvas.width - PLAYER_WIDTH;
    }
  }

  function moveBullets() {
    bullets.forEach((bullet, i) => {
      bullet.y -= BULLET_SPEED;
      if (bullet.y < 0) bullets.splice(i, 1);
    });
  }

  function moveInvaders() {
    let shouldDescend = false;
    let rightMost = 0;
    let leftMost = canvas.width;

    invaders.forEach((invader) => {
      if (!invader.alive) return;
      invader.x += invaderSpeed * invaderDirection;
      rightMost = Math.max(rightMost, invader.x + invader.width);
      leftMost = Math.min(leftMost, invader.x);
    });

    if (rightMost >= canvas.width - 10 && invaderDirection === 1) {
      invaderDirection = -1;
      shouldDescend = true;
    } else if (leftMost <= 10 && invaderDirection === -1) {
      invaderDirection = 1;
      shouldDescend = true;
    }

    if (shouldDescend) {
      invaders.forEach((invader) => {
        if (invader.alive) {
          invader.y += INVADER_DESCEND;
          if (
            invader.y + invader.height >=
            canvas.height - PLAYER_HEIGHT - 10
          ) {
            gameOver = true;
          }
        }
      });
      invaderSpeed += 0.2; // aumenta a velocidade a cada descida
    }
  }

  function checkCollisions() {
    bullets.forEach((bullet, bi) => {
      invaders.forEach((invader, ii) => {
        if (
          invader.alive &&
          bullet.x < invader.x + invader.width &&
          bullet.x + 4 > invader.x &&
          bullet.y < invader.y + invader.height &&
          bullet.y + 10 > invader.y
        ) {
          // colisão detectada
          invader.alive = false;
          bullets.splice(bi, 1);
          score += 10;
        }
      });
    });
  }

  function drawScore() {
    ctx.fillStyle = "#00ffcc";
    ctx.font = "16px monospace";
    ctx.fillText(`Score: ${score}`, 10, 20);
  }

  function drawGameOver() {
    ctx.fillStyle = "#ff0044";
    ctx.font = "32px monospace";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
    ctx.font = "16px monospace";
    ctx.fillText(
      "Pressione ENTER para reiniciar",
      canvas.width / 2,
      canvas.height / 2 + 30
    );
  }

  function drawScore() {
    ctx.fillStyle = "#00ffcc";
    ctx.font = "16px monospace";
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`Level: ${level}`, canvas.width - 80, 20);
  }

  function resetGame() {
    playerX = canvas.width / 2 - PLAYER_WIDTH / 2;
    bullets = [];
    invaders = [];
    gameOver = false;
    score = 0;
    invaderDirection = 1;
    invaderSpeed = INVADER_SPEED_BASE + (level - 1) * 0.5; // Velocidade aumenta com o nível

    for (let r = 0; r < INVADER_ROWS; r++) {
      for (let c = 0; c < INVADER_COLS; c++) {
        invaders.push({
          x: c * (INVADER_WIDTH + 10) + 30,
          y: r * (INVADER_HEIGHT + 10) + 30,
          width: INVADER_WIDTH,
          height: INVADER_HEIGHT,
          alive: true,
        });
      }
    }
  }

  function checkVictory() {
    if (invaders.every((invader) => !invader.alive)) {
      level++;
      invaderSpeed += 0.5; // Opcional: aumenta mais velocidade
      resetGame();
    }
  }

  // No gameLoop(), depois de checkCollisions():
  checkVictory();

  function checkVictory() {
    if (invaders.every((invader) => !invader.alive)) {
      levelComplete = true;
      // Pausa o jogo (para isso você pode parar o requestAnimationFrame)
    }
  }

  function gameLoop() {
    if (gameOver) {
      drawGameOver();
      return;
    }

    if (levelComplete) {
      drawLevelComplete();
      return; // pausa o jogo esperando o jogador apertar Enter
    }

    // resto do gameLoop normal: limpar tela, mover player, invaders, desenhar tudo

    checkVictory();

    requestAnimationFrame(gameLoop);
  }

  function drawLevelComplete() {
    ctx.fillStyle = "white";
    ctx.font = "30px monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      `Nível ${level} completo!`,
      canvas.width / 2,
      canvas.height / 2 - 20
    );
    ctx.font = "20px monospace";
    ctx.fillText(
      "Pressione Enter para o próximo nível",
      canvas.width / 2,
      canvas.height / 2 + 20
    );
  }

  document.addEventListener("keydown", (e) => {
    keys[e.key] = true;

    if (e.key === " " || e.key === "Spacebar") {
      shoot();
      e.preventDefault();
    }

    if (levelComplete && e.key === "Enter") {
      levelComplete = false;
      level++;
      resetGame();
      gameLoop();
    }

    if (gameOver && e.key === "Enter") {
      level = 1;
      resetGame();
      gameLoop();
    }
  });

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawInvaders();
    drawScore();

    if (gameOver) {
      drawGameOver();
      return;
    }

    movePlayer();
    moveBullets();
    moveInvaders();
    checkCollisions();

    requestAnimationFrame(gameLoop);
  }

  function shoot() {
    if (gameOver) return;
    bullets.push({
      x: playerX + PLAYER_WIDTH / 2 - 2,
      y: canvas.height - PLAYER_HEIGHT - 20,
    });
  }

  // Controle de teclado
  document.addEventListener("keydown", (e) => {
    keys[e.key] = true;

    if (e.key === " " || e.key === "Spacebar") {
      shoot();
      e.preventDefault();
    }

    if (gameOver && e.key === "Enter") {
      resetGame();
      gameLoop();
    }
  });

  document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
  });

  // Abrir e fechar overlay

  openBtn.addEventListener("click", () => {
    overlay.classList.remove("hidden");
    canvas.focus();
    resetGame();
    gameLoop();
  });

  closeBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
  });

  // Fechar com ESC
  document.addEventListener("keydown", (e) => {
    keys[e.key] = true;

    if (e.key === " " || e.key === "Spacebar") {
      shoot();
      e.preventDefault();
    }

    if (gameOver && e.key === "Enter") {
      level = 1; // reset nível ao perder
      resetGame();
      gameLoop();
    }
  });
})();
