const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// (bonus) interatividade
const keys = { w: false, a: false, s: false, d: false };
const mouse = { x: canvas.width/2, y: canvas.height/2, clicked: false };

window.addEventListener('keydown', e => {
    if(keys.hasOwnProperty(e.key.toLowerCase())) keys[e.key.toLowerCase()] = true;
});
window.addEventListener('keyup', e => {
    if(keys.hasOwnProperty(e.key.toLowerCase())) keys[e.key.toLowerCase()] = false;
});
canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});
canvas.addEventListener('mousedown', () => mouse.clicked = true);
canvas.addEventListener('mouseup', () => mouse.clicked = false);

let score = 0;
let time = 0;

class Player {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speed = 3.5;
        this.radius = 16;
        this.facingRight = true;
        this.shootTimer = 0;
    }

    update() {
        if (keys.w && this.y > this.radius + 20) this.y -= this.speed;
        if (keys.s && this.y < canvas.height - this.radius - 20) this.y += this.speed;
        if (keys.a && this.x > this.radius + 20) this.x -= this.speed;
        if (keys.d && this.x < canvas.width - this.radius - 20) this.x += this.speed;

        if (mouse.x < this.x) this.facingRight = false;
        else this.facingRight = true;

        if (mouse.clicked && this.shootTimer <= 0) {
            const angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
            projectiles.push(new Projectile(this.x, this.y, angle));
            this.shootTimer = 15;
        }
        if (this.shootTimer > 0) this.shootTimer--;
    }

    draw() {
        // (7) save/restore
        ctx.save();
        
        // (1) translação
        ctx.translate(this.x, this.y);

        // (bonus) reflexão
        ctx.scale(this.facingRight ? 1 : -1, 1);

        ctx.fillStyle = '#673ab7'; 
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#4a148c'; 
        ctx.beginPath();
        ctx.moveTo(-18, -2);
        ctx.lineTo(18, -2);
        ctx.lineTo(0, -28); 
        ctx.closePath();
        ctx.fill();

        // (7) save/restore
        // (bonus) hierarquia
        ctx.save(); 
        
        let wandAngle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
        if (!this.facingRight) {
            wandAngle = Math.PI - wandAngle;
        }
        
        // (2) rotação
        // (5) rotação/escala com ponto fixo
        ctx.rotate(wandAngle);
        
        ctx.translate(22, 0);

        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(0, -2, 16, 4);

        // (7) save/restore
        // (bonus) hierarquia
        ctx.save(); 
        ctx.translate(16, 0); 
        
        // (3) escala
        // (5) rotação/escala com ponto fixo
        const pulse = 1 + 0.4 * Math.sin(time * 6);
        ctx.scale(pulse, pulse); 
        
        ctx.fillStyle = '#00e5ff'; 
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // (7) save/restore
        ctx.restore(); 
        ctx.restore(); 
        ctx.restore(); 
    }
}

class Projectile {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * 8;
        this.vy = Math.sin(angle) * 8;
        this.radius = 5;
        this.active = true;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.active = false;
        }
    }
    draw() {
        // (7) save/restore
        ctx.save();
        
        // (1) translação
        ctx.translate(this.x, this.y); 
        
        ctx.fillStyle = '#00e5ff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00e5ff';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // (7) save/restore
        ctx.restore();
    }
}

class Enemy {
    constructor(type) {
        this.type = type;
        this.radius = 14;
        this.active = true;
        this.spawnOutside();
        
        switch(type) {
            case 'terra': 
                this.hp = 3;
                this.speed = 1.2;
                this.color = '#2e5d26'; 
                break;
            case 'fogo': 
                this.hp = 1;
                this.speed = 3.2;
                this.color = '#e53935'; 
                break;
            case 'agua': 
                this.hp = 2;
                this.speed = 1.6;
                this.color = '#1e88e5'; 
                this.timeOffset = Math.random() * 100;
                break;
            case 'ar': 
                this.hp = 1;
                this.speed = 0.035; 
                this.orbitDist = 350; 
                this.angle = Math.random() * Math.PI * 2;
                this.color = '#eeeeee'; 
                break;
        }
    }

    spawnOutside() {
        const side = Math.floor(Math.random() * 4);
        if (side === 0) { this.x = Math.random() * canvas.width; this.y = -40; } 
        else if (side === 1) { this.x = canvas.width + 40; this.y = Math.random() * canvas.height; } 
        else if (side === 2) { this.x = Math.random() * canvas.width; this.y = canvas.height + 40; } 
        else { this.x = -40; this.y = Math.random() * canvas.height; } 
    }

    update() {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distToPlayer = Math.sqrt(dx*dx + dy*dy);

        if (this.type === 'terra' || this.type === 'fogo') {
            this.x += (dx / distToPlayer) * this.speed;
            this.y += (dy / distToPlayer) * this.speed;
        } 
        else if (this.type === 'agua') {
            const angleToPlayer = Math.atan2(dy, dx);
            this.x += Math.cos(angleToPlayer) * this.speed;
            this.y += Math.sin(angleToPlayer) * this.speed;
            
            const perpAngle = angleToPlayer + Math.PI / 2;
            const waveParams = Math.sin(time * 3 + this.timeOffset) * 2.5;
            this.x += Math.cos(perpAngle) * waveParams;
            this.y += Math.sin(perpAngle) * waveParams;
        } 
        else if (this.type === 'ar') {
            this.angle += this.speed;
            this.orbitDist -= 0.8; 
            if (this.orbitDist < 0) this.orbitDist = 0;
            
            this.x = player.x + Math.cos(this.angle) * this.orbitDist;
            this.y = player.y + Math.sin(this.angle) * this.orbitDist;
        }

        if (Math.hypot(player.x - this.x, player.y - this.y) < this.radius + player.radius) {
            this.active = false;
            score = Math.max(0, score - 50); 
            updateScore();
        }
    }

    draw() {
        // (7) save/restore
        ctx.save();

        if (this.type === 'ar') {
            // (1) translação
            // (2) rotação
            // (4) composição de transformações
            ctx.translate(player.x, player.y); 
            ctx.rotate(this.angle);            
            ctx.translate(this.orbitDist, 0);  
            ctx.rotate(time * 8);              
            
            // (3) escala
            const pulsoAr = 1 + 0.1 * Math.sin(time * 15);
            ctx.scale(pulsoAr, pulsoAr);       

        } else {
            // (1) translação
            ctx.translate(this.x, this.y); 
            
            if (this.type === 'fogo') {
                const angleToPlayer = Math.atan2(player.y - this.y, player.x - this.x);
                // (2) rotação
                ctx.rotate(angleToPlayer); 
            }
        }

        ctx.fillStyle = this.color;

        if (this.type === 'terra') {
            ctx.fillRect(-this.radius, -this.radius, this.radius*2, this.radius*2);
            ctx.fillStyle = '#1e3d18';
            ctx.fillRect(-this.radius + 2, -this.radius + 2, 8, 8);
            ctx.fillRect(this.radius - 10, this.radius - 10, 8, 8);
        } else if (this.type === 'fogo') {
            ctx.beginPath();
            ctx.moveTo(this.radius + 4, 0);
            ctx.lineTo(-this.radius, -this.radius);
            ctx.lineTo(-this.radius, this.radius);
            ctx.closePath();
            ctx.fill();
        } else if (this.type === 'agua') {
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.beginPath();
            ctx.arc(-4, -4, 4, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'ar') {
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.arc(0, 0, this.radius/1.5, Math.PI, Math.PI*2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(0, 0, this.radius/2, Math.PI, Math.PI*2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
        }

        // (7) save/restore
        ctx.restore();
    }
}

const player = new Player();
const projectiles = [];
const enemies = [];

function updateScore() {
    document.getElementById('score').innerText = `Score: ${score}`;
}

function drawDungeon() {
    ctx.fillStyle = '#3a302e'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#2b2321';
    ctx.lineWidth = 3;
    const tileSize = 40;
    for (let x = 0; x < canvas.width; x += tileSize) {
        for (let y = 0; y < canvas.height; y += tileSize) {
            ctx.strokeRect(x, y, tileSize, tileSize);
        }
    }
    
    ctx.fillStyle = '#1f1a18';
    const wallThick = 20;
    ctx.fillRect(0, 0, canvas.width, wallThick); 
    ctx.fillRect(0, canvas.height - wallThick, canvas.width, wallThick); 
    ctx.fillRect(0, 0, wallThick, canvas.height); 
    ctx.fillRect(canvas.width - wallThick, 0, wallThick, canvas.height); 
    
    ctx.fillStyle = '#3a302e';
    for (let x = wallThick; x < canvas.width; x+= 40) ctx.fillRect(x + 5, 5, 20, 10);
    for (let x = wallThick; x < canvas.width; x+= 40) ctx.fillRect(x + 5, canvas.height - 15, 20, 10);
    for (let y = wallThick; y < canvas.height; y+= 40) ctx.fillRect(5, y + 5, 10, 20);
    for (let y = wallThick; y < canvas.height; y+= 40) ctx.fillRect(canvas.width - 15, y + 5, 10, 20);
}

let lastTime = performance.now();

// (6) animação
function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    time += deltaTime;

    // (6) animação (reset de matriz a cada frame)
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawDungeon();

    if (Math.random() < 0.02 + (time * 0.0001)) { 
        const types = ['terra', 'fogo', 'agua', 'ar'];
        enemies.push(new Enemy(types[Math.floor(Math.random() * types.length)]));
    }

    player.update();
    player.draw();

    for (let i = projectiles.length - 1; i >= 0; i--) {
        let p = projectiles[i];
        p.update();
        p.draw();
        
        if (!p.active) {
            projectiles.splice(i, 1);
            continue;
        }

        for (let j = enemies.length - 1; j >= 0; j--) {
            let e = enemies[j];
            if (Math.hypot(p.x - e.x, p.y - e.y) < p.radius + e.radius) {
                e.hp--;
                p.active = false;
                if (e.hp <= 0) {
                    e.active = false;
                    score += (e.type === 'terra' ? 30 : e.type === 'agua' ? 20 : 10);
                    updateScore();
                }
                break;
            }
        }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];
        if (e.active) {
            e.update();
            e.draw();
        } else {
            enemies.splice(i, 1);
        }
    }

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
