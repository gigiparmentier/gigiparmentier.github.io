var Smoke, Rocket;

class SmokeClass {
  constructor(NumberOfCircles) {
    this.TimePassed = 0;
    this.Circles = [];
    this.MaxOffsetX = 750;
    this.MaxOffsetY = 25;
    this.MaxSize = 50;
    this.MaxColor = 25;
    this.MaxIndex = 20;
    this.Colors = ['#fff1e9', '#e0c3b3', '#bfa79a', '#e0c3b3', '#e0c3b3', '#e0c3b3', '#e0c3b3', '#e0c3b3', '#e0c3b3', '#e0c3b3', '#e0c3b3', '#bfa79a', '#bfa79a', '#bfa79a', '#e0b9a5', '#e0c3b3', '#e0c3b3', '#e0c3b3'];
    for (var i = 0; i < NumberOfCircles - 10; i++) {
      let SmokeCircle = document.createElement("div");
      SmokeCircle.className = "SmokeCircle";
      SmokeCircle.offsetX = Math.round(Math.random() * Math.floor(this.MaxOffsetX)) - (this.MaxOffsetX / 2);
      SmokeCircle.offsetY = 150 + Math.floor(Math.random() * Math.floor(this.MaxOffsetY));
      SmokeCircle.Size = Math.round(Math.random() * Math.floor(this.MaxSize)) + 50;
      SmokeCircle.Color = this.Colors[Math.floor(Math.random() * Math.floor(this.Colors.length - 1))];
      SmokeCircle.Index = Math.round(Math.random() * Math.floor(this.MaxIndex)) + (this.MaxIndex);
      SmokeCircle.style.left = "calc(50% + " + (SmokeCircle.offsetX - SmokeCircle.Size / 2) + "px)";
      SmokeCircle.style.bottom = "calc(50px + " + (SmokeCircle.offsetY - SmokeCircle.Size / 2 - 100) + "px)";
      SmokeCircle.style.width = SmokeCircle.Size + 'px';
      SmokeCircle.style.height = SmokeCircle.Size + 'px';
      SmokeCircle.style.borderRadius = SmokeCircle.Size + 'px';
      SmokeCircle.style.zIndex = SmokeCircle.Index;
      SmokeCircle.style.backgroundColor = SmokeCircle.Color;
      SmokeCircle.style.opacity = 0;
      SmokeCircle.setAttribute('x', (SmokeCircle.offsetX - SmokeCircle.Size / 2));
      SmokeCircle.setAttribute('y', (SmokeCircle.offsetY - SmokeCircle.Size / 2));
      document.getElementById('space').appendChild(SmokeCircle);
      this.Circles.push(SmokeCircle);
    }
    this.MaxOffsetX = 400;
    this.MaxOffsetY = 200;
    this.MaxSize = 200;
    for (var i = 0; i < NumberOfCircles / 2; i++) {
      let SmokeCircle = document.createElement("div");
      SmokeCircle.className = "SmokeCircle";
      SmokeCircle.offsetX = Math.round(Math.random() * Math.floor(this.MaxOffsetX)) - (this.MaxOffsetX / 2);
      SmokeCircle.offsetY = 100 + Math.floor(Math.random() * Math.floor(this.MaxOffsetY));
      SmokeCircle.Size = Math.round(Math.random() * Math.floor(this.MaxSize)) + 50;
      SmokeCircle.Color = this.Colors[Math.floor(Math.random() * Math.floor(this.Colors.length - 1))];
      SmokeCircle.Index = 10;
      SmokeCircle.style.left = "calc(50% + " + (SmokeCircle.offsetX - SmokeCircle.Size / 2) + "px)";
      SmokeCircle.style.bottom = "calc(50px + " + Math.abs(SmokeCircle.offsetY - SmokeCircle.Size / 2) / 2 + "px)";
      SmokeCircle.style.width = SmokeCircle.Size + 'px';
      SmokeCircle.style.height = SmokeCircle.Size + 'px';
      SmokeCircle.style.borderRadius = SmokeCircle.Size + 'px';
      SmokeCircle.style.zIndex = SmokeCircle.Index;
      SmokeCircle.style.backgroundColor = SmokeCircle.Color;
      SmokeCircle.style.opacity = 0;
      SmokeCircle.setAttribute('x', (SmokeCircle.offsetX - SmokeCircle.Size / 2));
      SmokeCircle.setAttribute('y', Math.abs(SmokeCircle.offsetY - SmokeCircle.Size / 2) / 2);
      document.getElementById('space').appendChild(SmokeCircle);
      this.Circles.push(SmokeCircle);
    }
  }

  wiggle() {
    this.MaxOffsetX = 1;
    this.MaxOffsetY = 0.1;
    for (var i = 0; i < this.Circles.length; i++) {
      let Circle = this.Circles[i];
      Circle.x = parseFloat(Circle.getAttribute('x'));
      Circle.y = parseFloat(Circle.getAttribute('y'));
      Circle.Size = parseFloat(Circle.style.width.split('px')[0]) + 0.25;
      Circle.offsetY = this.MaxOffsetY;
      if (Circle.x < -100) {
        Circle.offsetX = -this.MaxOffsetX;
      } else if (Circle.x > 100) {
        Circle.offsetX = this.MaxOffsetX;
      } else {
        Circle.offsetX = 0;
        Circle.offsetY = 0;
      }
      Circle.style.left = "calc(50% + " + (Circle.x + Circle.offsetX) + "px)";
      Circle.style.bottom = "calc(50px + " + (Circle.y + Circle.offsetY) + "px)";
      Circle.style.width = Circle.Size + 'px';
      Circle.style.height = Circle.Size + 'px';
      Circle.style.borderRadius = Circle.Size + 'px';
      Circle.style.opacity = parseFloat(Circle.style.opacity) + 0.1;
      Circle.setAttribute('x', (Circle.x + Circle.offsetX));
      Circle.setAttribute('y', (Circle.y + Circle.offsetY));
    }
  }

  moveDown() {
    for (var i = 0; i < this.Circles.length; i++) {
      let Circle = this.Circles[i];
      Circle.y = parseFloat(Circle.getAttribute('y'));
      Circle.offsetY = -25;
      Circle.style.bottom = "calc(50px + " + (Circle.y + Circle.offsetY) + "px)";
      Circle.setAttribute('y', (Circle.y + Circle.offsetY));
    }
  }
}

class RocketClass {
  constructor() {
    let Rocket = document.createElement('img');
    Rocket.src = 'rocket.svg';
    Rocket.id = 'rocket';
    Rocket.style.bottom = "200px";
    document.getElementById('space').prepend(Rocket);
  }

  rotate(event) {
    if (Timer.Time >= 150) {
      let mouseX = event.screenX;
      let rockt = document.getElementById('rocket');
      let rotation = mouseX / screen.width * 90 - 45;
      rockt.style.webkitTransform = "rotate(" + rotation + "deg)";
    }
  }
}

class GroundClass {
  constructor() {
    let Ground = document.createElement('div');
    Ground.id = 'ground';
    Ground.style.bottom = '0';
    document.getElementById('space').append(Ground);
    let Ground1 = document.createElement('img');
    Ground1.id = 'ground1';
    Ground1.style.bottom = '0';
    Ground1.src = 'ground1.svg';
    document.getElementById('space').append(Ground1);
    let Ground2 = document.createElement('img');
    Ground2.id = 'ground2';
    Ground2.style.bottom = '0';
    Ground2.src = 'ground2.svg';
    document.getElementById('space').append(Ground2);
  }

  moveDown() {
    let Grond = document.getElementById('ground');
    Grond.style.bottom = (parseFloat(Grond.style.bottom.split('px')[0]) - 25) + 'px';
    let Grond1 = document.getElementById('ground1');
    Grond1.style.bottom = (parseFloat(Grond1.style.bottom.split('px')[0]) - 30) + 'px';
    let Grond2 = document.getElementById('ground2');
    Grond2.style.bottom = (parseFloat(Grond2.style.bottom.split('px')[0]) - 20) + 'px';
  }

}

class TimerClass {
  constructor() {
    this.Time = 0;
  }
}

class SpaceClass {
  constructor(){
    let Space = document.createElement('div');
    Space.id = 'space';
    Space.style.backgroundColor = "#01a7c3";
    document.body.append(Space);
  }

  brightness(){
    let Space = document.getElementById('space');
    Space.style.backgroundColor = '#020a2c';
  }

  stars(){
    if (Timer.Time%10 == 0){
      let Star = document.createElement('img');
      Star.className = 'star';
      Star.src = 'star' + Math.round(Math.random() + 1) + '.svg';
      Star.style.top = 0;
      Star.style.left = Math.round(Math.random()*(screen.width - 100)) + 50 + 'px';
      document.getElementById('space').append(Star);
    }
  }

  moveDown(){
    document.querySelectorAll('.star').forEach(function (star, index) {
      star.style.top = (parseFloat(star.style.top.split('px')[0]) + 10) + 'px';
      console.log(parseInt(star.style.top.split('px')[0]));
      if (parseInt(star.style.top.split('px')[0]) > $(document).height()){
        star.remove();
      }
    });
  }
}

$(document).ready(function() {
  Space = new SpaceClass();
  Smoke = new SmokeClass(50);
  Rocket = new RocketClass();
  Ground = new GroundClass();
  Timer = new TimerClass();
  //document.addEventListener('mousemove', Rocket.rotate);
});

document.addEventListener("keydown", function(event) {
  if (event.keyCode == 32) {
    if (Timer.Time < 100) {
      Smoke.wiggle();
    } else if (Timer.Time < 200) {
      Smoke.wiggle();
      Smoke.moveDown();
      Ground.moveDown();
    } else if (Timer.Time == 200) {
      $('#ground').remove();
      $('#ground1').remove();
      $('#ground2').remove();
      $('.SmokeCircle').remove();
      Space.brightness();
    }
    else if (Timer.Time > 400) {
      Space.stars();
      Space.moveDown();
    }
    Timer.Time += 1;
  }
});
