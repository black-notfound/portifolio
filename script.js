const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

let stars = [];
let shootingStars = [];
const parallax = { x: 0, y: 0 };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Criar estrelas em camadas para parallax
const layers = [
  { speed: 0.1, stars: [] },
  { speed: 0.3, stars: [] },
  { speed: 0.6, stars: [] },
];

function createStars(layer, count) {
  for (let i = 0; i < count; i++) {
    layer.stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      delta: Math.random() * 0.02 + 0.005,
    });
  }
}

layers.forEach((layer, i) => createStars(layer, 100 + i * 50));

// Criar estrela cadente
function createShootingStar() {
  shootingStars.push({
    x: Math.random() * canvas.width,
    y: (Math.random() * canvas.height) / 2,
    length: Math.random() * 80 + 50,
    speed: Math.random() * 10 + 6,
    angle: Math.PI / 4,
    alpha: 1,
  });
}

setInterval(createShootingStar, 2000);

function animateStars() {
  // Gradiente espacial, combinando com o rodapé
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#1B0B3A"); // roxo synthwave
  gradient.addColorStop(0.3, "#1B0B3A"); // azul elétrico
  gradient.addColorStop(0.6, "#2c2c54"); // azul petróleo
  gradient.addColorStop(1, "#000000"); // preto espaço

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Estrelas parallax
  layers.forEach((layer) => {
    layer.stars.forEach((star) => {
      star.alpha += star.delta;
      if (star.alpha <= 0 || star.alpha >= 1) {
        star.delta = -star.delta;
      }

      const offsetX = parallax.x * layer.speed;
      const offsetY = parallax.y * layer.speed;

      ctx.beginPath();
      ctx.arc(star.x + offsetX, star.y + offsetY, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.fill();
    });
  });

  // Estrelas cadentes
  shootingStars.forEach((shooting, index) => {
    ctx.save();
    ctx.translate(shooting.x, shooting.y);
    ctx.rotate(shooting.angle);

    const grad = ctx.createLinearGradient(0, 0, shooting.length, 0);
    grad.addColorStop(0, `rgba(255, 255, 255, ${shooting.alpha})`);
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(shooting.length, 0);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();

    shooting.x += shooting.speed;
    shooting.y += shooting.speed;

    shooting.alpha -= 0.02;

    if (shooting.alpha <= 0) {
      shootingStars.splice(index, 1);
    }
  });

  requestAnimationFrame(animateStars);
}

animateStars();

// Parallax de movimento do mouse
window.addEventListener("mousemove", (e) => {
  parallax.x = (e.clientX - canvas.width / 2) / 50;
  parallax.y = (e.clientY - canvas.height / 2) / 50;
});

// Parallax de rolagem
window.addEventListener("scroll", () => {
  parallax.y = window.scrollY / 20;
});

// Carrossel de projetos

const projects = [
  {
    title: "SaaS para monitoramento de operações logísticas",
    description:
      "Portal para melhorar a visão da gestão sobre a operação e facilitar a coleta de dados de produção e de funcionários.",
    link: "https://black-notfound.github.io/nao-atendido/",
  },
  {
    title: "Organizador de rotina em python",
    description:
      "Programa que criei para me ajudar a organizar minhas tarefas diárias e minha rotina de estudos, treino e trabalho.",
    link: "https://github.com/black-notfound/Personal-projects",
  },
  {
    title: "Ferramentas de CyberSec",
    description:
      "Scanner de redes que traz portas abertas e vulnerabilidades nas máquinas da rede e ferramenta de buteforce para quebra de senhas.",
    link: "https://github.com/black-notfound/Ferramentas-de-Cybersec",
  },
];

const carousel = document.getElementById("carousel");

projects.forEach((project) => {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <a href="${project.link}" target="_blank" rel="noopener noreferrer">
        Ver Projeto
      </a>
    `;

  carousel.appendChild(card);
});
