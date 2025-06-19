(() => {
  const canvas = document.getElementById("pongCanvas");
  const ctx = canvas.getContext("2d");

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  // Jogador e CPU
  const paddleWidth = 10;
  const paddleHeight = 80;
  const ballRadius = 8;

  let playerY = HEIGHT / 2 - paddleHeight / 2;
  let cpuY = HEIGHT / 2 - paddleHeight / 2;
  let ballX = WIDTH / 2;
  let ballY = HEIGHT / 2;
  let ballSpeedX = 5;
  let ballSpeedY = 3;

  let playerScore = 0;
  let cpuScore = 0;

  let upPressed = false;
  let downPressed = false;

  // Controle da CPU
  function cpuMove() {
    const paddleCenter = cpuY + paddleHeight / 2;
    if (paddleCenter < ballY - 10) {
      cpuY += 5;
    } else if (paddleCenter > ballY + 10) {
      cpuY -= 5;
    }
    // Limites
    if (cpuY < 0) cpuY = 0;
    if (cpuY + paddleHeight > HEIGHT) cpuY = HEIGHT - paddleHeight;
  }

  // Eventos teclado
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") upPressed = true;
    if (e.key === "ArrowDown" || e.key.toLowerCase() === "s")
      downPressed = true;
  });

  window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") upPressed = false;
    if (e.key === "ArrowDown" || e.key.toLowerCase() === "s")
      downPressed = false;
  });

  // Atualiza estado do jogador
  function playerMove() {
    if (upPressed) playerY -= 7;
    if (downPressed) playerY += 7;
    if (playerY < 0) playerY = 0;
    if (playerY + paddleHeight > HEIGHT) playerY = HEIGHT - paddleHeight;
  }

  // Atualiza posição da bola
  function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Colisão superior e inferior
    if (ballY + ballRadius > HEIGHT || ballY - ballRadius < 0) {
      ballSpeedY = -ballSpeedY;
    }

    // Colisão com o paddle do jogador
    if (
      ballX - ballRadius < paddleWidth &&
      ballY > playerY &&
      ballY < playerY + paddleHeight
    ) {
      ballSpeedX = -ballSpeedX;
      // Ajusta velocidade vertical conforme o ponto da colisão
      let deltaY = ballY - (playerY + paddleHeight / 2);
      ballSpeedY = deltaY * 0.25;
    }

    // Colisão com o paddle da CPU
    if (
      ballX + ballRadius > WIDTH - paddleWidth &&
      ballY > cpuY &&
      ballY < cpuY + paddleHeight
    ) {
      ballSpeedX = -ballSpeedX;
      let deltaY = ballY - (cpuY + paddleHeight / 2);
      ballSpeedY = deltaY * 0.25;
    }

    // Marcar pontos
    if (ballX - ballRadius < 0) {
      cpuScore++;
      resetBall();
    }
    if (ballX + ballRadius > WIDTH) {
      playerScore++;
      resetBall();
    }
  }

  // Reseta a bola para o centro
  function resetBall() {
    ballX = WIDTH / 2;
    ballY = HEIGHT / 2;
    ballSpeedX = -ballSpeedX; // muda direção
    ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
  }

  // Desenha tudo
  function draw() {
    // Fundo
    ctx.fillStyle = "#000022";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Linha central pontilhada
    ctx.strokeStyle = "#00ffff";
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Paddles
    ctx.fillStyle = "#00ffff";
    ctx.fillRect(0, playerY, paddleWidth, paddleHeight);
    ctx.fillRect(WIDTH - paddleWidth, cpuY, paddleWidth, paddleHeight);

    // Bola
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();

    // Placar
    ctx.font = "24px monospace";
    ctx.fillText(playerScore, WIDTH / 4, 30);
    ctx.fillText(cpuScore, (WIDTH * 3) / 4, 30);
  }

  // Loop principal
  function gameLoop() {
    playerMove();
    cpuMove();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
  }

  // Abrir e fechar o overlay
  const openBtn = document.getElementById("openPongBtn");
  const closeBtn = document.getElementById("closePongBtn");
  const overlay = document.getElementById("pongOverlay");

  openBtn.addEventListener("click", () => {
    overlay.classList.remove("hidden");
    // Para garantir foco no canvas e controles
    canvas.focus();
  });

  closeBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!overlay.classList.contains("hidden")) {
        overlay.classList.add("hidden");
        // Se tiver alguma função pra pausar/parar o jogo, chame aqui
      }
    }
  });

  // Inicia o jogo
  gameLoop();
})();
