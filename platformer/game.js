var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var raf;
var img = new Image();
img.src = 'player.png';

var gravity = .1;

var player = {
  x: 100,
  y: 100,
  vx: 5,
  vy: 0,
  width:50,
  height:50,
  friction: .9,
  draw: function() {
    ctx.drawImage(img, this.x, this.y, this.width, this.height);
  }
};

function draw() {
  clear();
  player.draw();
  player.x += player.vx;
  player.y += player.vy;
  player.vy += gravity;
  collision_canvas();
  raf = window.requestAnimationFrame(draw);
}

function collision_canvas(){
  if (player.y + player.height + player.vy > canvas.height || player.y + player.height + player.vy < 0) {
    player.vy = 0;
    player.vx *= player.friction;
  }
  if (player.x + player.vx + player.height> canvas.width || player.x + player.vx < 0) {
    player.vx = -player.vx;
  }
}

function clear() {
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.fillRect(0,0,canvas.width,canvas.height);
}

$(document).ready(function() {
  raf = window.requestAnimationFrame(draw);
  player.draw();
});

var map = {};
onkeydown = onkeyup = function(e){
    e = e || event;
    map[e.key] = e.type == 'keydown';
    if(map['ArrowLeft']){
      player.vx = -3;
      collision_canvas();
    }
    if(map['ArrowRight']){
      collision_canvas();
      player.vx = 3;
    }
    if(map['ArrowUp']){
      if (player.vy == 0){
        player.vy = -5;
      }
    }
}
