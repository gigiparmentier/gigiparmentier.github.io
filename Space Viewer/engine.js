var ISS, Earth, Atmosphere, pivot, Moon, Clouds, Lights, Sun, sunlight, Circle, lensflare, lensPivot, moonPivot;
var Pos,IPLon,IPLat;
var controls, camera, scene;
var renderer;
var sunlat,sunlon;
var Earthaxis = new THREE.Vector3(0.4067,0.917,0);
EarthRotation = 1/86400/10;
MoonRotation = 1/2332800/10;
CloudsRotation = 0.0001;
SunRotation = 1/31536000/10;

Multiplier = 1;
EarthRotation *= Multiplier;
MoonRotation *= Multiplier;
SunRotation *= Multiplier;

CurrentDate = new Date();
Hours = CurrentDate.getUTCHours();
Minutes = CurrentDate.getUTCMinutes();
CurrentMinutes = Hours * 60 + Minutes;
CorrectRotation = CurrentMinutes * 360 / 1440;

var LightRotationX, LightRotationY;
//create a blue LineBasicMaterial
var materialline = new THREE.LineBasicMaterial({
  color: 0x0000ff
});
var linegeo = new THREE.Geometry();
var line;

init();
animate();

function getSunPos(date) {
        const now = date || new Date();

        // The boilerplate: fiddling with dates
        const soy = (new Date(now.getFullYear(), 0, 0)).getTime();
        const eoy = (new Date(now.getFullYear() + 1, 0, 0)).getTime();
        const nows = now.getTime();
        const poy = (nows - soy) / (eoy - soy);

        const secs = now.getUTCMilliseconds() / 1e3
                + now.getUTCSeconds()
                + 60 * (now.getUTCMinutes() + 60 * now.getUTCHours());
        const pod = secs / 86400; // leap secs? nah.

        // The actual magic
        sunlat = (-pod + 0.5) * Math.PI * 2;
        sunlon = Math.sin((poy - .22) * Math.PI * 2) * .41;
              moonPivot = new THREE.Group();
              scene.add(moonPivot);
              moonPivot.add(Moon);
              Moon.position.x = 150;
              moonPivot.rotation.y = THREE.Math.degToRad(-74) - 90  + sunlon;
              moonPivot.rotation.z = sunlat;
}

function init() {
  const Shaders = {
    'earth': {
      uniforms: {
        'texture': {
          type: 't',
          value: null
        }
      },
      vertexShader: [
      'varying vec3 vNormal;',
      'varying vec2 vUv;',
      'void main() {',
      'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
      'vNormal = normalize( normalMatrix * normal );',
      'vUv = uv;',
      '}'
    ].join('\n'),
      fragmentShader: [
      'uniform sampler2D texture;',
      'varying vec3 vNormal;',
      'varying vec2 vUv;',
      'void main() {',
      'vec3 diffuse = texture2D( texture, vUv ).xyz;',
      'float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
      'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );',
      'gl_FragColor = vec4( diffuse + atmosphere, 1.0 );',
      '}'
    ].join('\n')
    },
    'atmosphere': {
      uniforms: {},
      vertexShader: [
      'varying vec3 vNormal;',
      'void main() {',
      'vNormal = normalize( normalMatrix * normal );',
      'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
      '}'
    ].join('\n'),
      fragmentShader: [
      'varying vec3 vNormal;',
      'void main() {',
      'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 8.0 );',
      'gl_FragColor = vec4( 0.5, 0.5, 0.8, 0.2 ) * intensity;',
      '}'
    ].join('\n')
    }
  };
  //SETUP SCENE
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100000);
  camera.position.x = 200;

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  //CONTROLS
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = .75;
  controls.enableZoom = true;
  controls.maxDistance = 1000;
  controls.minDistance = 37;
  controls.enablePan = false;
  controls.rotateSpeed = .25;
  //LIGHTING
  lighting = true;
  var ambient = new THREE.AmbientLight(0xffffff, .2);
  ambient.position.y = 50;
  scene.add(ambient);

  sunlight = new THREE.DirectionalLight(0xffeab1, 1.5, 200);
  sunlight.position.set(4900, 0, 0);
  sunlight.castShadow = true;
  //ADD LENSFLARE
  var textureLoader = new THREE.TextureLoader();
  var textureFlare = textureLoader.load("assets/lensflare.png");
  lensflare = new THREE.Lensflare();
  lensflare.addElement(new THREE.LensflareElement(textureFlare, 1250, 0));
  sunlight.add(lensflare);
  //ADD SKY SPHERE
  var skyGeo = new THREE.SphereGeometry(10000, 25, 25);
  var loader = new THREE.TextureLoader(),
    texture = loader.load("assets/space2.jpg");
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: .5
  });
  var sky = new THREE.Mesh(skyGeo, material);
  sky.material.side = THREE.BackSide;
  sky.scale.x = 10;
  sky.scale.y = 10;
  sky.scale.z = 10;
  scene.add(sky);

  var material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xaeacaf)
  });

  var geometry = new THREE.Geometry();
    geometry.vertices.push(
	     new THREE.Vector3( 0, 0, 0 ),
	     new THREE.Vector3(40.67,91.7,0)
  );

  var line = new THREE.Line( geometry, material );
  //scene.add(line)

  //ADD EARTH
  var earthText = new THREE.TextureLoader().load("assets/Earth4.jpg");
  earthText.anisotropy = renderer.capabilities.getMaxAnisotropy();
  earthText.minFilter = THREE.NearestFilter;
  var earthTextN = new THREE.TextureLoader().load("assets/EarthNormal.jpg");
  earthTextN.anisotropy = renderer.capabilities.getMaxAnisotropy();
  earthTextN.minFilter = THREE.NearestFilter;
  var earthTextS = new THREE.TextureLoader().load("assets/EarthSpec.jpg");
  earthTextS.anisotropy = renderer.capabilities.getMaxAnisotropy();
  earthTextS.minFilter = THREE.NearestFilter;
  var earthTextD = new THREE.TextureLoader().load("assets/Earth.jpg");
  earthTextD.anisotropy = renderer.capabilities.getMaxAnisotropy();
  earthTextD.minFilter = THREE.NearestFilter;
  var earthTextE = new THREE.TextureLoader().load("assets/EarthNight.jpg");
  earthTextE.anisotropy = renderer.capabilities.getMaxAnisotropy();
  earthTextE.minFilter = THREE.NearestFilter;
  var earthMat = new THREE.MeshStandardMaterial({
    map: earthText,
    roughness: 1,
    metalness: .25,
    roughnessMap: earthTextD,
    normalMap: earthTextN,
    bumpMap: earthTextN,
    displacementMap: earthTextN,
    displacementScale: 3,
    displacementBias: -1.55
  });
  var geometry = new THREE.SphereGeometry( 31.6926, 32, 32 );
  //geometry.rotateZ(THREE.Math.degToRad(-23.4));
  var sphere = new THREE.Mesh( geometry, earthMat );
  Earth = sphere;
  //Earth.rotation.z = THREE.Math.degToRad(-23.4);
  Earth.rotateY(THREE.Math.degToRad(-74) - 90  + THREE.Math.degToRad(CorrectRotation));
  scene.add(Earth);
  //ADD CLOUDS
  var cloudText = new THREE.TextureLoader().load("assets/Clouds2.jpg");
  cloudText.anisotropy = renderer.capabilities.getMaxAnisotropy();

  var cloudMat = new THREE.MeshStandardMaterial({
    alphaMap: cloudText,
    transparent: true,
    roughness: 1,
    metalness: 0
  });
  cloudMat.depthWrite = false;
  var geometry = new THREE.SphereGeometry( 31.8017, 32, 32 );
  //geometry.rotateZ(THREE.Math.degToRad(-23.4));
  var sphere = new THREE.Mesh( geometry, cloudMat );
  Clouds = sphere;
  //ADD LIGHTS
  var lightText = new THREE.TextureLoader().load("assets/EarthNight2.jpg");
  lightText.anisotropy = renderer.capabilities.getMaxAnisotropy();
  var lightMat = new THREE.MeshStandardMaterial({
    alphaMap: lightText,
    transparent: true,
    emissiveMap: lightText,
    emissiveIntensity: 1,
    emissive: new THREE.Color(0xfff9cf),
    displacementMap: earthTextN,
    displacementScale: 3,
    displacementBias: -1.55
  });
  lightMat.depthWrite = false;
  var geometry = new THREE.SphereGeometry( 31.6926, 32, 32 );
  //geometry.rotateZ(THREE.Math.degToRad(-23.4));
  var sphere = new THREE.Mesh( geometry, lightMat );
  Lights = sphere;
  //ADD MOON
  var moonText = new THREE.TextureLoader().load("assets/Moon2.jpg");
  moonText.anisotropy = renderer.capabilities.getMaxAnisotropy();
  var moonTextN = new THREE.TextureLoader().load("assets/MoonN.jpg");
  moonTextN.anisotropy = renderer.capabilities.getMaxAnisotropy();
  var moonMat = new THREE.MeshStandardMaterial({
    map: moonText,
    roughness: 1,
    metalness: 0,
    emissiveMap: moonText,
    emissiveIntensity: .25,
    emissive: new THREE.Color(0xe7feff),
    displacementMap: moonTextN,
    displacementScale: .25,
    displacementBias: -.1,
    //normalMap: moonTextN
  });
  var geometry = new THREE.SphereGeometry( 8.685, 32, 32 );
  var sphere = new THREE.Mesh( geometry, moonMat );
  Moon = sphere;
  //ADD SUN
  var sunText = new THREE.TextureLoader().load("assets/Sun.jpg");
  sunText.anisotropy = renderer.capabilities.getMaxAnisotropy();
  var sunMat = new THREE.MeshStandardMaterial({
    map: sunText,
    roughness: 0,
    metalness: 0,
    emissive: new THREE.Color(0xffc663),
    emissiveIntensity: .5
  });
  var objLoader = new THREE.OBJLoader();
  objLoader.setPath('assets/');
  objLoader.load('Sun.obj', function(object) {
    Sun = object;
    object.castShadow = true;
    object.receiveShadow = true;
    object.traverse((obj) => {
      if (obj instanceof THREE.Mesh) obj.material = sunMat;
    });
  });
  //ADD ATMOSPHERE
  var geometry = new THREE.SphereGeometry(37.75, 32, 32);
  const atmosphereMaterial = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone(Shaders['atmosphere'].uniforms),
    vertexShader: Shaders['atmosphere'].vertexShader,
    fragmentShader: Shaders['atmosphere'].fragmentShader,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  });
  const atm = new THREE.Mesh(geometry, atmosphereMaterial);
  scene.add(atm);
  Atmosphere = atm;
  //ADD ISS
  var ISSMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xaeacaf)
  });
  var objLoader = new THREE.OBJLoader();
  objLoader.setPath('assets/');
  objLoader.load('ISS2.obj', function(object) {
    //object.rotateZ(THREE.Math.degToRad(-23.4));
    ISS = object;
    object.traverse((obj) => {
      if (obj instanceof THREE.Mesh) obj.material = ISSMat;
    });
    moveISS();
  });
  //ADD ORBITAL CIRCLE
  var objLoader = new THREE.OBJLoader();
  objLoader.setPath('assets/');
  objLoader.load('orbite.obj', function(object) {
    Circle = object;
    object.castShadow = true;
    object.receiveShadow = true;
    object.traverse((obj) => {
      if (obj instanceof THREE.Mesh) obj.material = ISSMat;
    });
  });
  //ADD POSITION
  /*

  $.ajax({
  url: "https://api.ipgeolocation.io/ipgeo?apiKey=API_KEY",
  type: "GET",
  crossDomain: true,
  dataType: 'jsonp',
  success: function (resp) {
        var PosMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(0x992c34)
        });
        var objLoader = new THREE.OBJLoader();
        objLoader.setPath('assets/');
        objLoader.load('pos.obj', function(object) {
          //object.rotateZ(THREE.Math.degToRad(-23.4));
          Pos = object;
          IPLat = THREE.Math.degToRad(parseFloat(resp.split(',')[0]));
          IPLon = THREE.Math.degToRad(parseFloat(resp.split(',')[1]));
          object.traverse((obj) => {
            if (obj instanceof THREE.Mesh) obj.material = PosMat;
          });
        });
  },
  error: function (xhr, status) {
      console.log("Can't get position from IP.");
  }
});
*/
  var PosMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x992c34)
  });
  var objLoader = new THREE.OBJLoader();
  objLoader.setPath('assets/');
  objLoader.load('pos.obj', function(object) {
    //object.rotateZ(THREE.Math.degToRad(-23.4));
    Pos = object;
    IPLat = THREE.Math.degToRad(48.11);
    IPLon = THREE.Math.degToRad(-1.6744);
    object.traverse((obj) => {
      if (obj instanceof THREE.Mesh) obj.material = PosMat;
    });
  });
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  if (Earth != null) {
    if (ISS != null && Moon != null && Clouds != null && Lights != null && Sun != null && Circle != null && Pos != null && pivot == null) {
      earthPivot = new THREE.Group();
      Earth.add(earthPivot);
      earthPivot.add(ISS);
      PosPivot = new THREE.Group();
      Earth.add(PosPivot);
      PosPivot.add(Pos);
      Pos.rotation.y = IPLon;
      Pos.rotation.z = IPLat;
      Lights.rotation.y = Earth.rotation.y;
      cloudPivot = new THREE.Group();
      Earth.add(cloudPivot);
      cloudPivot.add(Clouds);
      Clouds.scale.x = 1.01;
      Clouds.scale.y = 1.01;
      Clouds.scale.z = 1.01;
      scene.add(Lights);
      getSunPos();
      Lights.scale.x = 1.0005;
      Lights.scale.y = 1.0005;
      Lights.scale.z = 1.0005;
      Lights.rotation.y = Earth.rotation.y;
      scene.add(Sun);
      lensPivot = new THREE.Object3D();
      Sun.add(lensPivot);
      lensflare.position.x = 4500;
      lensPivot.add(lensflare);
      lightPivot = new THREE.Object3D();
      Sun.add(lightPivot);
      sunlight.position.x = 4900;
      lightPivot.add(sunlight);
      scene.add(Circle);
      window.setInterval(function(){
          rotateAll();
      }, 100);
      pivot = 1;
    }
  }
  if (Lights != null && sunlight != null && Earth != null && lensPivot != null) {
    //Earth.rotateOnAxis(Earthaxis,EarthRotation);
    rotation = THREE.Math.radToDeg(Sun.rotation.y);
    if (rotation > 360) {
      rotation -= 360;
    }
    if (rotation < 90 && rotation > -90) {
      LightRotationX = -1 + Math.abs(rotation / 90);
    } else {
      LightRotationX = 1 - Math.abs((rotation - 180) / 90);
    }
    if (rotation > 0 && rotation < 180) {
      LightRotationY = 1 - Math.abs((rotation - 90) / 90);
    } else {
      LightRotationY = Math.abs((rotation - 270) / 90) - 1;
    }
    Lights.position.x = LightRotationX * 0.12;
    Lights.position.z = LightRotationY * 0.12;
  }
  renderer.render(scene, camera);
}

function moveISS() {
  $.getJSON('http://api.open-notify.org/iss-now.json?callback=?', function(data) {
    var lat = data['iss_position']['latitude'];
    var lon = data['iss_position']['longitude'];
    ISS.rotation.y = THREE.Math.degToRad(lon);
    ISS.rotation.z = THREE.Math.degToRad(lat);
  });
  setTimeout(moveISS, 2000);
}

function rotateAll(){
    if (moonPivot != null) {
      moonPivot.rotation.y += MoonRotation;
    }
    if (Clouds != null) {
      Clouds.rotation.y += CloudsRotation;
    }
    if (Sun != null) {
      Sun.rotation.y += SunRotation;
    }
    if (Circle != null && Sun != null) {
      Circle.rotation.y = Sun.rotation.y;
    }
    CurrentDate = new Date();
    Hours = CurrentDate.getUTCHours();
    Minutes = CurrentDate.getUTCMinutes();
    CurrentMinutes = Hours * 60 + Minutes;
    CorrectRotation = CurrentMinutes * 360 / 1440;
    Earth.rotation.y = THREE.Math.degToRad(-74) - 90  + THREE.Math.degToRad(CorrectRotation);
    Lights.rotation.y = Earth.rotation.y;
}

$(document.body.canvas).on("keypress", function(e) {
  if (e.which == 13) {
    if (EarthRotation != 0) {
      EarthRotation = 0.0002;
    } else {
      EarthRotation = 0;
    }
  }
});
