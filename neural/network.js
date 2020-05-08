biases = [];
weights = [];

class Network {
  constructor(sizes) {
    this.sizes = sizes;
    this.num_layers = sizes.length;
    this.biases = [];
    for (var i = 0; i < sizes.slice(1).length; i++) {
      y = sizes.slice(1)[i];
      this.biases.push(randarray(1, y));
    };
    this.weights = [];
    for (var i = 0; i < sizes.slice(1).length; i++) {
      var y = sizes.slice(1)[i];
      var x = sizes.slice(0, -1)[i];
      this.weights.push(randarray(x, y));
    };

  }

  feedforward(a) {
    for (var i = 0; i < this.biases.length; i++) { //loop layers
      var w = this.weights[i];
      var b = this.biases[i];
      var arr = [];
      for (var j = 0; j < b.length; j++) { //loop neurons in the layer i
        var output = 0;
        for (var k = 0; k < a.length; k++) { //loop inputs for the neuron j of the layer i
          output += a[k] * w[j][k];
        }
        output += b[j];
        output = sigmoid(output);
        arr.push(output);
      }
      a = arr;
    }
    return a;
  }

  setvalues(biases,weights){
    this.biases = biases;
    this.weights = weights;
  }
}
InitThis()
let net = new Network([784, 30, 10]);
var pic = randarray(1, 784);

load_data(net);

function load_data(network) {
  for (var i = 0; i < network.biases.length; i++) {
    NumpyLoader.ajax('biases-' + i + '.npy', getbiasdata, network);
  }
  NumpyLoader.ajax('weights-0.npy', getweightsdata, network);
}

function getbiasdata(npy, network) {
  biases.push([].slice.call(npy.data));

}

function getweightsdata(npy, network) {
  sarr = []
  var chunk = network.sizes[weights.length];
  for (var i=0; i<npy.data.length; i+=chunk) {
      temparray = npy.data.slice(i,i+chunk);
      sarr.push([].slice.call(temparray));
  }
  weights.push(sarr);
  if (weights.length == 1){
    NumpyLoader.ajax('weights-1.npy', getweightsdata, network);
  }
  if (weights.length == network.sizes.length - 1){

    network.setvalues(biases,weights);
    tr = document.createElement('tr');
    $('#table').append(tr);
    for (var i = 0; i <= 9; i++){
      td = document.createElement('td');
      canvas = document.createElement('canvas');
      canvas.id = 'canvas-' + i;
      $(td).append(canvas);
      $(tr).append(td);
    }
    tr = document.createElement('tr');
    $('#table').append(tr);
    for (var i = 0; i <= 9; i++){
      td = document.createElement('td');
      result = document.createElement('p');
      result.id = 'result-' + i;
      $(td).append(result);
      $(tr).append(td);
    }
    test_image(0);
  }
}

function test_image(index){
  canvas = document.getElementById('canvas-'+index);
  ctx = canvas.getContext("2d");
  ctx.canvas.width  = 28;
  ctx.canvas.height = 28;
  base_image = new Image();
  base_image.src = 'imgs/'+index+'.png';
  base_image.onload = function(){
    ctx.drawImage(base_image, 0, 0);
    imgData = ctx.getImageData(0, 0, 28, 28);
    imgarr = [];
    for (var i = 0; i < imgData.data.length; i += 4){
      imgarr.push(imgData.data[i]/255)
    }
    result = net.feedforward(imgarr);
    document.getElementById('result-'+index).innerHTML = max(result)[0];
    if (index < 9){
      index += 1;
      test_image(index);
    }
  }

}

function max(arr) {
  maxvalue = Math.max(...arr);
  return [arr.indexOf(maxvalue),maxvalue];
}

function sigmoid(z) {
  return 1.0 / (1.0 + Math.exp(-z));
}

function randarray(x, y) {
  arr = []
  for (var i = 0; i < y; i++) {
    if (x > 1) {
      arr2 = []
      for (var j = 0; j < x; j++) {
        arr2.push(Math.random() * 2 - 1)
      }
      arr.push(arr2)
    } else {
      arr.push(Math.random() * 2 - 1)
    }
  }
  return arr
}

function submit(network){
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext("2d");
  imgData = ctx.getImageData(0, 0, 28, 28);
  imgarr = [];
  for (var i = 0; i < imgData.data.length; i += 4){
    imgarr.push(imgData.data[i]/255)
  }
  result = network.feedforward(imgarr);
  console.log(max(result)[0]);
  $('#guess').html(max(result)[0] + '(sûr à ' + (max(result)[1]*100).toFixed(2) + '%)');
}

var mousePressed = false;
var lastX, lastY;
var ctx;

function InitThis() {
    ctx = document.getElementById('canvas').getContext("2d");
    ctx.fillStyle = 'black';
    ctx.globalAlpha = 0.2;
    ctx.fillRect(0,0,$('#canvas').attr('width'),$('#canvas').attr('width'));
    ctx.globalAlpha = 1;
    $('#canvas').mousedown(function (e) {
        mousePressed = true;
        x = (e.pageX - $(this).offset().left)/10;
        y = (e.pageY - $(this).offset().top)/10;
        Draw(x, y, false);
    });

    $('#canvas').mousemove(function (e) {
        if (mousePressed) {
          x = (e.pageX - $(this).offset().left)/10;
          y = (e.pageY - $(this).offset().top)/10;
          Draw(x,y, true);
        }
    });

    $('#canvas').mouseup(function (e) {
        mousePressed = false;
    });
	    $('#canvas').mouseleave(function (e) {
        mousePressed = false;
    });
}

function Draw(x, y, isDown) {
    ctx = document.getElementById('canvas').getContext("2d");
    if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = '#ffd6bf';
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }
    lastX = x; lastY = y;
}

function clearArea() {
    ctx = document.getElementById('canvas').getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'black';
    ctx.globalAlpha = 0.2;
    ctx.fillRect(0,0,$('#canvas').attr('width'),$('#canvas').attr('width'));
    ctx.globalAlpha = 1;
}
