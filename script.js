// Canvas e estrelas
const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");
let layers = [];
let shootingStars = [];
const parallax = { x: 0, y: 0 };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Configura camadas e estrelas
const layerConfigs = [
  { speed: 0.1, count: 100 },
  { speed: 0.3, count: 150 },
  { speed: 0.6, count: 200 },
];
layerConfigs.forEach((cfg) => {
  const layer = { speed: cfg.speed, stars: [] };
  for (let i = 0; i < cfg.count; i++) {
    layer.stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      delta: Math.random() * 0.02 + 0.005,
    });
  }
  layers.push(layer);
});

// Cria estrelas cadentes
function createShootingStar() {
  if (shootingStars.length >= 20) return;
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

function animate() {
  // Fundo gradient
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, "#1B0B3A");
  grad.addColorStop(0.3, "#1B0B3A");
  grad.addColorStop(0.6, "#2c2c54");
  grad.addColorStop(1, "#000");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Estrelas camadas
  layers.forEach((layer) => {
    layer.stars.forEach((star) => {
      star.alpha += star.delta;
      if (star.alpha <= 0 || star.alpha >= 1) star.delta *= -1;
      const ox = parallax.x * layer.speed,
        oy = parallax.y * layer.speed;
      ctx.beginPath();
      ctx.arc(star.x + ox, star.y + oy, star.radius, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
      ctx.fill();
    });
  });

  // Estrelas cadentes
  shootingStars = shootingStars.filter((s) => s.alpha > 0);
  shootingStars.forEach((s, i) => {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.angle);
    const g = ctx.createLinearGradient(0, 0, s.length, 0);
    g.addColorStop(0, `rgba(255,255,255,${s.alpha})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.strokeStyle = g;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(s.length, 0);
    ctx.stroke();
    ctx.restore();
    s.x += s.speed;
    s.y += s.speed;
    s.alpha -= 0.02;
  });

  requestAnimationFrame(animate);
}
animate();

// Parallax
window.addEventListener("mousemove", (e) => {
  parallax.x = (e.clientX - canvas.width / 2) / 50;
  parallax.y = (e.clientY - canvas.height / 2) / 50;
});
window.addEventListener("scroll", () => {
  parallax.y = window.scrollY / 20;
});

// Sidebar
document.addEventListener("DOMContentLoaded", () => {
  const planet = document.querySelector(".planet");
  const sidebar = document.querySelector(".planet-sidebar");

  planet.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.add("visible");
  });

  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && e.target !== planet) {
      sidebar.classList.remove("visible");
    }
  });
});

// Carrossel projetos
const projects = [
  {
    title: "SaaS para monitoramento de operações logísticas",
    description:
      "Portal para melhorar a visão da gestão sobre a operação e acompanhar melhor os resultados diários e ajudar a criar análises.",
    link: "https://black-notfound.github.io/nao-atendido/",
  },
  {
    title: "Organizador de rotina em Python",
    description:
      "Programa para organizar tarefas mensais e ajudar na rotina do dia-a-dia.",
    link: "https://github.com/black-notfound/Personal-projects",
  },
  {
    title: "Ferramentas de CyberSec",
    description:
      "Scanner de redes com análise de vúlnerabilidades e brute-force para quebra de senhas",
    link: "https://github.com/black-notfound/Ferramentas-de-Cybersec",
  },
];
const carousel = document.getElementById("carousel");
projects.forEach((p) => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `<h3>${p.title}</h3><p>${p.description}</p><a href="${p.link}" target="_blank">Ver Projeto</a>`;
  carousel.appendChild(card);
});

// Interação planeta
(function () {
  const planet = document.querySelector(".planet");
  const info = document.getElementById("planetInfo");
  planet?.addEventListener("click", (e) => {
    e.stopPropagation();
    info.classList.toggle("visible");
    info.setAttribute(
      "aria-hidden",
      info.classList.contains("visible") ? "false" : "true"
    );
  });
  document.addEventListener("click", (e) => {
    if (
      info.classList.contains("visible") &&
      !info.contains(e.target) &&
      e.target !== planet
    ) {
      info.classList.remove("visible");
      info.setAttribute("aria-hidden", "true");
    }
  });
})();

// Disco voador e abdução
window.addEventListener("DOMContentLoaded", () => {
  const ufo = document.getElementById("ufo");
  const vaca = document.getElementById("vaca");
  let abducted = false;
  function inView(el) {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }
  function checkAbduct() {
    if (!abducted && inView(ufo) && inView(vaca)) {
      abducted = true;
      vaca.classList.add("abduzido");
      setTimeout(() => moveUfo(), 4000);
      window.removeEventListener("scroll", checkAbduct);
    }
  }
  function moveUfo() {
    const init = window.getComputedStyle(ufo).transform;
    let ang = 0;
    function loop() {
      const dx = Math.cos(ang) * 30;
      const dy = Math.sin(ang) * 20;
      ufo.style.transform = `${init} translate(${dx}px,${dy}px)`;
      ang += 0.02;
      requestAnimationFrame(loop);
    }
    loop();
  }
  window.addEventListener("scroll", checkAbduct);
  checkAbduct();
});
