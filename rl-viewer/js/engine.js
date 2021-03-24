bufferIndex = 0;
buffer = [];
newBuffer = [];
speed = 25;
file = "positions.txt";
lastupdate = "0";

function init() {
  $('#menu').fadeOut();
  $('.stats').fadeIn();
  lastupdate = "0";
  //SETUP SCENE
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = 200;
  camera.position.y = 200;
  camera.position.z = 200;

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setClearColor(0x456990, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  //CONTROLS
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.3;
  controls.enableZoom = true;
  controls.maxDistance = 500;
  controls.minDistance = 10;
  controls.enablePan = false;
  controls.rotateSpeed = .25;
  controls.maxPolarAngle = Math.PI / 2 - 0.1;

  //LIGHTING
  lighting = true;
  var directional = new THREE.AmbientLight(0xffffff, 1.5);
  directional.position.y = 50;

  scene.add(directional);
  var ambient = new THREE.DirectionalLight(0xffffff, .75);
  ambient.position.y = 5;

  scene.add(ambient);

  //ADD Stade
  var StadeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xf45b69),
    roughness: 1
  });
  var objLoader = new THREE.OBJLoader();
  objLoader.load('Stade.obj', function(object) {
    Stade = object;
    object.traverse((obj) => {
      if (obj instanceof THREE.Mesh) obj.material = StadeMat;
    });
    scene.add(object);
  });
  //ADD Decors
  var Decor1Mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xe4fde1),
    roughness: 1
  });
  var objLoader = new THREE.OBJLoader();
  objLoader.load('Decor1.obj', function(object) {
    Decor1 = object;
    object.traverse((obj) => {
      if (obj instanceof THREE.Mesh) obj.material = Decor1Mat;
    });
    scene.add(object);
  });
  var Decor21Mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x1f381c),
    roughness: 1
  });
  var Decor22Mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x735e4e),
    roughness: 1
  });
  var objLoader = new THREE.OBJLoader();
  objLoader.load('Decor2.obj', function(object) {
    Decor1 = object;
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        if (child.name == 'sapin_Circle.001_Material.016' || child.name == 'sapin.001_Circle.000_Material.016') {
          child.material = Decor21Mat;
        } else {
          child.material = Decor22Mat;
        }
      }
    });
    scene.add(object);
  });
  //ADD Plane
  var loader = new THREE.TextureLoader(),
    PlaneText = loader.load("shadowmap2.png");
  PlaneText.anisotropy = renderer.capabilities.getMaxAnisotropy();
  var PlaneMat = new THREE.MeshBasicMaterial({
    map: PlaneText
  });
  objLoader.load('plane.obj', function(object) {
    Plane = object;
    object.traverse((obj) => {
      if (obj instanceof THREE.Mesh) obj.material = PlaneMat;
    });
    scene.add(object);
  });
  //ADD Shadow car
  var loader = new THREE.TextureLoader(),
    ShadowText = loader.load("shadow.png");
  var ShadowMat = new THREE.MeshBasicMaterial({
    map: ShadowText,
    transparent: true,
    opacity: 0.2
  });
  objLoader.load('shadowplane.obj', function(object) {
    Shadow = object;
    object.traverse((obj) => {
      if (obj instanceof THREE.Mesh) obj.material = ShadowMat;
    });
    Shadow.position.set(0, 0.4, 0);
    scene.add(object);
  });
  //ADD Shadow ball
  objLoader.load('shadowplane.obj', function(object) {
    Shadow2 = object;
    object.traverse((obj) => {
      if (obj instanceof THREE.Mesh) obj.material = ShadowMat;
    });
    Shadow2.position.set(0, 0.4001, 0);
    scene.add(object);
  });
  //ADD Ball
  var BalleMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x028090),
    roughness: 1
  });
  var objLoader = new THREE.OBJLoader();
  objLoader.load('Balle.obj', function(object) {
    Balle = object;
    object.traverse((obj) => {
      if (obj instanceof THREE.Mesh) obj.material = BalleMat;
    });
    Balle.position.set(0, 0.7, 0);
    scene.add(object);
  });
  //ADD Car
  var loader = new THREE.TextureLoader(),
    VoitureText = loader.load("text_voiture.png");
  var VoitureMat = new THREE.MeshStandardMaterial({
    map: VoitureText,
    roughness: 1
  });
  var EngineMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x282c34)
  });
  objLoader.load('Voiture.obj', function(object) {
    Voiture = object;
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        if (child.name == '1') {
          child.material = VoitureMat;
        } else {
          child.material = EngineMat;
        }
      }
    });
    scene.add(object);
    //getData();
    //var t = setInterval(getData, 100);
    getBuffer(file);
    animate();
  });
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}


function getData() {
  $.ajax({
    url: `positions2.txt`,
    dataType: "text",
    cache: false,
    success: (data) => {
      ballpos = data.split(';')[1].split(',');
      bx = parseFloat(ballpos[0]);
      bz = parseFloat(ballpos[1]);
      by = parseFloat(ballpos[2]);
      carpos = data.split(';')[0].split(',');
      x = parseFloat(carpos[0]);
      z = parseFloat(carpos[1]);
      y = parseFloat(carpos[2]) + 1.15;
      rx = parseFloat(carpos[3]);
      rz = parseFloat(carpos[4]);
      ry = parseFloat(carpos[5]);
      teleportCar(x, y, z, rx, ry, rz);
      teleportBall(bx, by, bz);
    }
  });
}

function teleportCar(x, y, z, rx, ry, rz) {
  Voiture.position.set(x, y, z);
  Voiture.rotation.order = "YZX";
  Voiture.rotation.set(ry, -rz, rx);
  Shadow.position.set(x, 0.4, z);
}

function teleportBall(x, y, z) {
  Balle.position.set(x, y, z);
  Shadow2.position.set(x, 0.4001, z);
}

function getBuffer(file) {
  $.ajax({
    url: file,
    cache: false,
    dataType:'text',
    success: (data, status, xhr) => {
      if (xhr.getResponseHeader('Last-Modified') != lastupdate){
        console.log(lastupdate);
        lastupdate = xhr.getResponseHeader('Last-Modified');
        console.log(lastupdate);
        buffer = data.slice(0,-1).split(';');
        interpolateBuffer();
        intervalApplyBuffer(2,speed);
      }
      else{
        setTimeout(function() {
            getBuffer(file);
        }, speed);
      }
    }
  });
}

function intervalApplyBuffer(step,steptime){
  t = setInterval(function() {
    applyBuffer(step);
  }, steptime * step);
}

function applyBuffer(bufferStep) {
  $('#frames').html(bufferIndex/bufferStep + 1 + '/' + buffer.length/bufferStep);
  percent = (bufferIndex+1)/buffer.length*100;
  $('#timeline').css('width',percent + '%');
  ballpos = buffer[bufferIndex].split('/')[1].split(',');
  bx = parseFloat(ballpos[0]);
  bz = parseFloat(ballpos[1]);
  by = parseFloat(ballpos[2]) + 0.7;
  carpos = buffer[bufferIndex].split('/')[0].split(',');
  x = parseFloat(carpos[0]);
  z = parseFloat(carpos[1]);
  y = parseFloat(carpos[2]) + 1.15;
  rx = parseFloat(carpos[3]);
  rz = parseFloat(carpos[4]);
  ry = parseFloat(carpos[5]);
  teleportCar(x, y, z, rx, ry, rz);
  teleportBall(bx, by, bz);
  bufferIndex += bufferStep;
  if (bufferIndex >= buffer.length) {
    bufferIndex = 0;
    $('#timeline').css('transition','width ' + speed * 2 / bufferStep / 1000 + 's' );
    if (bufferStep == 1){
      bufferStep = 2;
      $('#interpolation').html('INTERPOLATION : OFF');
    }
    else if (bufferStep == 2){
      bufferStep = 1;
      $('#interpolation').html('INTERPOLATION : 2x');
    }
    clearInterval(t);
    intervalApplyBuffer(bufferStep,speed);
    /*if (file == 'positions.txt'){
      getBuffer('positions2.txt');
      file = 'positions2.txt';
    }
    else{
      getBuffer('positions.txt');
    }*/
    getBuffer(file);
  }
}

function interpolateBuffer() {
  step = 0;
  length = buffer.length - 2;
  for (frame = 0; frame < length; frame++) {
    currentFrame = buffer[frame + step];
    nextFrame = buffer[frame + step + 1];
    //car
    //positions
    cx = parseFloat(nextFrame.split('/')[0].split(',')[0]);
    nx = parseFloat(currentFrame.split('/')[0].split(',')[0]);
    cy = parseFloat(nextFrame.split('/')[0].split(',')[1]);
    ny = parseFloat(currentFrame.split('/')[0].split(',')[1]);
    cz = parseFloat(nextFrame.split('/')[0].split(',')[2]);
    nz = parseFloat(currentFrame.split('/')[0].split(',')[2]);
    //rotations
    limit = -Math.PI/2;
    crx = parseFloat(nextFrame.split('/')[0].split(',')[3]);
    if (crx < limit){
      crx = Math.PI*2 + crx;
    }
    nrx = parseFloat(currentFrame.split('/')[0].split(',')[3]);
    if (nrx < limit){
      nrx = Math.PI*2 + nrx;
    }
    cry = parseFloat(nextFrame.split('/')[0].split(',')[5]);
    if (cry < limit){
      cry = Math.PI*2 + cry;
    }
    nry = parseFloat(currentFrame.split('/')[0].split(',')[5]);
    if (nry < limit){
      nry = Math.PI*2 + nry;
    }
    crz = parseFloat(nextFrame.split('/')[0].split(',')[4]);
    if (crz < limit){
      crz = Math.PI*2 + crz;
    }
    nrz = parseFloat(currentFrame.split('/')[0].split(',')[4]);
    if (nrz < limit){
      nrz = Math.PI*2 + nrz;
    }
    //interpolation
    ix = (cx + nx) / 2;
    iy = (cy + ny) / 2;
    iz = (cz + nz) / 2;
    irx = (crx + nrx) / 2;
    iry = (cry + nry) / 2;
    irz = (crz + nrz) / 2;
    //ball
    //positions
    cbx = parseFloat(nextFrame.split('/')[1].split(',')[0]);
    nbx = parseFloat(currentFrame.split('/')[1].split(',')[0]);
    cby = parseFloat(nextFrame.split('/')[1].split(',')[1]);
    nby = parseFloat(currentFrame.split('/')[1].split(',')[1]);
    cbz = parseFloat(nextFrame.split('/')[1].split(',')[2]);
    nbz = parseFloat(currentFrame.split('/')[1].split(',')[2]);
    //interpolation
    ibx = (cbx + nbx) / 2;
    iby = (cby + nby) / 2;
    ibz = (cbz + nbz) / 2;
    //formatting
    betweenFrame = parse('%s,%s,%s,%s,%s,%s/%s,%s,%s', ix, iy, iz, irx, irz, iry, ibx, iby, ibz);
    buffer.splice((frame + step + 1), 0, betweenFrame);
    step++;
  }
}

function parse(str) {
  var args = [].slice.call(arguments, 1),
    i = 0;
  return str.replace(/%s/g, () => args[i++]);
}
