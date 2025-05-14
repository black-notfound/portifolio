const canvas = document.getElementById("circuitCanvas");
const ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const nodes = [];
const mouse = { x: width / 2, y: height / 2 };
const numNodes = 120;

for (let i = 0; i < numNodes; i++) {
  nodes.push({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5
  });
}

function draw() {
  ctx.fillStyle = "#1a0033";
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < nodes.length; i++) {
    const nodeA = nodes[i];

    // Movimento leve
    nodeA.x += nodeA.vx;
    nodeA.y += nodeA.vy;

    // Rebote nas bordas
    if (nodeA.x < 0 || nodeA.x > width) nodeA.vx *= -1;
    if (nodeA.y < 0 || nodeA.y > height) nodeA.vy *= -1;

    // Desenhar conexões suaves
    for (let j = i + 1; j < nodes.length; j++) {
      const nodeB = nodes[j];
      const dx = nodeA.x - nodeB.x;
      const dy = nodeA.y - nodeB.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        const mx = (nodeA.x + nodeB.x) / 2;
        const my = (nodeA.y + nodeB.y) / 2;

        const opacity = 1 - dist / 120;
        ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(nodeA.x, nodeA.y);
        ctx.quadraticCurveTo(mx, my, nodeB.x, nodeB.y);
        ctx.stroke();
      }
    }

    // Efeito de brilho em nós próximos do mouse
    const mdx = nodeA.x - mouse.x;
    const mdy = nodeA.y - mouse.y;
    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
    if (mdist < 100) {
      ctx.beginPath();
      ctx.arc(nodeA.x, nodeA.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 0, 255, ${1 - mdist / 100})`; // Neon pink
      ctx.fill();
    }
  }

  requestAnimationFrame(draw);
}

document.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

draw();
