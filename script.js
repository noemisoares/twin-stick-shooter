const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// TAMANHO DA ARENA
const ARENA_SIZE = 600;

canvas.width = 800;
canvas.height = 800;

// CENTRALIZA ARENA
const arena = {
  x: (canvas.width - ARENA_SIZE) / 2,
  y: (canvas.height - ARENA_SIZE) / 2,
  size: ARENA_SIZE,
};

let tempo = 0;
let gameOver = false;

// PLAYER
let player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  speed: 3,
  size: 12,
};

// INPUT

let keys = {};
document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

// TIROS (SETAS)

let projectiles = [];

function shoot(dx, dy) {
  projectiles.push({
    x: player.x,
    y: player.y,
    dx,
    dy,
    speed: 6,
    size: 4,
  });
}

// Tiro estilo twin-stick
document.addEventListener("keydown", (e) => {
  if (gameOver) return;

  if (e.key === "ArrowUp") shoot(0, -1);
  if (e.key === "ArrowDown") shoot(0, 1);
  if (e.key === "ArrowLeft") shoot(-1, 0);
  if (e.key === "ArrowRight") shoot(1, 0);
});

// INIMIGOS

let enemies = [];

function spawnEnemy() {
  const types = ["terra", "fogo", "agua", "ar"];
  let type = types[Math.floor(Math.random() * 4)];

  let side = Math.floor(Math.random() * 4);

  let x, y;

  if (side === 0) {
    // topo
    x = arena.x + Math.random() * arena.size;
    y = arena.y;
  } else if (side === 1) {
    // direita
    x = arena.x + arena.size;
    y = arena.y + Math.random() * arena.size;
  } else if (side === 2) {
    // baixo
    x = arena.x + Math.random() * arena.size;
    y = arena.y + arena.size;
  } else {
    // esquerda
    x = arena.x;
    y = arena.y + Math.random() * arena.size;
  }

  enemies.push({
    x,
    y,
    type,
    size: 12,
  });
}

// UTIL

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// UPDATE

function update() {
  if (gameOver) return;

  // MOVIMENTO WASD
  let dx = 0,
    dy = 0;

  if (keys["w"]) dy -= 1;
  if (keys["s"]) dy += 1;
  if (keys["a"]) dx -= 1;
  if (keys["d"]) dx += 1;

  let len = Math.hypot(dx, dy);
  if (len > 0) {
    dx /= len;
    dy /= len;
  }

  player.x += dx * player.speed;
  player.y += dy * player.speed;

  // LIMITA AO QUADRADO
  player.x = Math.max(
    arena.x + player.size,
    Math.min(arena.x + arena.size - player.size, player.x),
  );
  player.y = Math.max(
    arena.y + player.size,
    Math.min(arena.y + arena.size - player.size, player.y),
  );

  // TIROS
  projectiles.forEach((p) => {
    p.x += p.dx * p.speed;
    p.y += p.dy * p.speed;
  });

  projectiles = projectiles.filter(
    (p) =>
      p.x > arena.x &&
      p.x < arena.x + arena.size &&
      p.y > arena.y &&
      p.y < arena.y + arena.size,
  );

  // SPAWN CONTROLADO
  if (Math.random() < 0.03) spawnEnemy();

  // INIMIGOS
  enemies.forEach((e) => {
    let dx = player.x - e.x;
    let dy = player.y - e.y;
    let dist = Math.hypot(dx, dy);

    dx /= dist;
    dy /= dist;

    // VELOCIDADE DIFERENTE POR TIPO
    let speed = 1.5;

    if (e.type === "terra") speed = 1.0;
    if (e.type === "fogo") speed = 2.5;
    if (e.type === "agua") speed = 1.8;
    if (e.type === "ar") speed = 2.0;

    e.x += dx * speed;
    e.y += dy * speed;

    // COLISÃO
    if (distance(e, player) < e.size + player.size) {
      gameOver = true;
    }
  });

  // TIRO MATA
  enemies = enemies.filter((e) => {
    for (let p of projectiles) {
      if (distance(e, p) < e.size + p.size) {
        return false;
      }
    }
    return true;
  });
}

// DESENHO

function drawArena() {
  ctx.fillStyle = "#d8b46a";
  ctx.fillRect(arena.x, arena.y, arena.size, arena.size);
}

function drawPlayer() {
  ctx.save();
  ctx.translate(player.x, player.y);

  ctx.fillStyle = "purple";

  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawProjectiles() {
  projectiles.forEach((p) => {
    ctx.save();
    ctx.translate(p.x, p.y);

    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  });
}

function drawEnemies() {
  enemies.forEach((e) => {
    ctx.save();
    ctx.translate(e.x, e.y);

    if (e.type === "terra") {
      ctx.fillStyle = "#1b5e20"; // verde escuro
      ctx.fillRect(-10, -10, 20, 20);
    }

    if (e.type === "fogo") {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    if (e.type === "agua") {
      ctx.fillStyle = "blue";
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(10, 10);
      ctx.lineTo(-10, 10);
      ctx.fill();
    }

    if (e.type === "ar") {
      ctx.strokeStyle = "white";
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  });
}

function drawGameOver() {
  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.fillText("GAME OVER", canvas.width / 2 - 120, canvas.height / 2);
}

// LOOP
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawArena();
  drawPlayer();
  drawProjectiles();
  drawEnemies();

  if (gameOver) drawGameOver();
}

function animate() {
  update();
  draw();
  requestAnimationFrame(animate);
}

animate();
