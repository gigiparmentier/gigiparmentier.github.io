class Noeud {
  constructor(x, y, cout, heuristique, voisins) {
    this.cout = cout;
    this.heuristique = heuristique;
    this.voisins = [];
    this.x = x;
    this.y = y;
  }
}

$(document).ready(function() {
  objectif = new Noeud(26, 26, 0, 0);
  depart = new Noeud(2, 2, 0, 0);
  obstacles = new Array();
  bonuses = [new Noeud(20,10,0,0),new Noeud(2,10,0,0)];
  grid;
  noeudsChemin = new Array();
  editMode = null;
  genererGrid(31, 31,depart, objectif,obstacles);
  $('#grid').css('width',window.innerHeight - 200);
  $('#grid').css('height',window.innerHeight - 200);
});

$(document).on('mousedown','td',function(){
  if (editMode == 'obstacles'){
    if (!$(this).hasClass('depart') && !$(this).hasClass('arrivee')){
      obstacleNoeud = new Noeud(parseInt($(this).attr('x')),parseInt($(this).attr('y')),0,0);
      if ($(this).hasClass('obstacle')){
        $(this).removeClass();
        obstacles.pop(obstacleNoeud);
      }
      else{
        obstacles.push(obstacleNoeud);
        $(this).removeClass();
        $(this).addClass('obstacle');
      }
    }
  }
  else if (editMode == "départ"){
    if (!$(this).hasClass('arrivee') && !$(this).hasClass('depart')){
      departNoeud = new Noeud(parseInt($(this).attr('x')),parseInt($(this).attr('y')),0,0);
      $(this).removeClass();
      $('.depart').removeClass();
      $(this).addClass('depart');
      depart = departNoeud;
    }
  }
  else if (editMode == "arrivée"){
    if (!$(this).hasClass('depart') && !$(this).hasClass('arrivee')){
      arriveeNoeud = new Noeud(parseInt($(this).attr('x')),parseInt($(this).attr('y')),0,0);
      $(this).removeClass();
      $('.arrivee').removeClass();
      $(this).addClass('arrivee');
      objectif = arriveeNoeud;
    }
  }
  else if (editMode == "bonus"){
    if (!$(this).hasClass('depart') && !$(this).hasClass('arrivée') && !$(this).hasClass('bonus')){
      bonusNoeud = new Noeud(parseInt($(this).attr('x')),parseInt($(this).attr('y')),0,0);
      $(this).removeClass();
      $(this).addClass('bonus');
      bonuses.push(bonusNoeud);
    }
  }
});

function viderChemins(){
  $('.closed').removeClass('closed');
  $('.voisins').removeClass('voisins');
  $('.chemin').removeClass('chemin');
}

function genererGrid(x, y, depart, objectif,obstacles) {
  if (x == 0 && y == 0){
    x = $('#x').val();
    y = $('#y').val();
  }
  grid.x = x;
  grid.y = y;
  $('#grid').empty();
  for (var i = 0; i < y; i++) {
    var ligne = document.createElement("tr");
    document.getElementById('grid').appendChild(ligne);
    for (var j = 0; j < x; j++) {
      var colonne = document.createElement("td");
      colonne.setAttribute('x', j);
      colonne.setAttribute('y', i);
      for (var bonus in bonuses){
        bonus = bonuses[bonus];
        if (bonus.x == j && bonus.y == i){
          $(colonne).removeClass();
          $(colonne).addClass('bonus');
        }
      }
      for (var obstacle in obstacles){
        obstacle = obstacles[obstacle];
        if (obstacle.x == j && obstacle.y == i){
          $(colonne).removeClass();
          $(colonne).addClass('obstacle');
        }
      }
      ligne.appendChild(colonne);
    }
  }
  noeudHTML = $('td[x=' + depart.x + '][y=' + depart.y + ']');
  noeudHTML.addClass('depart');
  noeudHTML = $('td[x=' + objectif.x + '][y=' + objectif.y + ']');
  noeudHTML.addClass('arrivee');
}

function voisinsDuNoeud(x, y) {
  voisins = new Array();
  voisinGauche = $('td[x=' + (x - 1) + '][y=' + (y) + ']');
  voisinDroite = $('td[x=' + (x + 1) + '][y=' + (y) + ']');
  voisinHaut = $('td[x=' + (x) + '][y=' + (y - 1) + ']');
  voisinBas = $('td[x=' + (x) + '][y=' + (y + 1) + ']');
  voisinGH = $('td[x=' + (x - 1) + '][y=' + (y - 1) + ']');
  voisinGB = $('td[x=' + (x - 1) + '][y=' + (y + 1) + ']');
  voisinDH = $('td[x=' + (x + 1) + '][y=' + (y - 1) + ']');
  voisinDB = $('td[x=' + (x + 1) + '][y=' + (y + 1) + ']');
  if (voisinGH.length && !voisinGH.hasClass('obstacle')) {
    voisins.push(new Noeud(x - 1, y - 1));
  }
  if (voisinGB.length && !voisinGB.hasClass('obstacle')) {
    voisins.push(new Noeud(x - 1, y + 1));
  }
  if (voisinDH.length && !voisinDH.hasClass('obstacle')) {
    voisins.push(new Noeud(x + 1, y - 1));
  }
  if (voisinDB.length && !voisinDB.hasClass('obstacle')) {
    voisins.push(new Noeud(x + 1, y + 1));
  }
  if (voisinGauche.length && !voisinGauche.hasClass('obstacle')) {
    voisins.push(new Noeud(x - 1, y));
  }
  if (voisinDroite.length && !voisinDroite.hasClass('obstacle')) {
    voisins.push(new Noeud(x + 1, y));
  }
  if (voisinHaut.length && !voisinHaut.hasClass('obstacle')) {
    voisins.push(new Noeud(x, y - 1));
  }
  if (voisinBas.length && !voisinBas.hasClass('obstacle')) {
    voisins.push(new Noeud(x, y + 1));
  }
  return voisins;
}

function compare2noeuds(n1, n2) {
  if (n1.heuristique < n2.heuristique) {
    return 1;
  } else if (n1.heuristique == n2.heuristique) {
    return 0;
  } else {
    return -1;
  }
}

function compareDistances(n1, n2) {
    if (n1.distance < n2.distance) {
      return -1;
    } else if (n1.distance > n2.distance) {
      return 1;
    } else {
      return 0;
    }
}

function lancerAlgo(){
  noeudsChemin = [];
  $('.voisins').css('transition','all 1s ease-in-out');
  noeudDepart = depart;
  bonuses.forEach(function(el){
    el.distance = distance(noeudDepart,el);
  });
  bonuses.sort((obj1, obj2) => obj1.distance - obj2.distance);
  $('.closed').removeClass('closed');
  $('.voisins').removeClass('voisins');
  $('.chemin').removeClass('chemin');
  for (bonus in bonuses){
    bonus = bonuses[bonus];
    cheminPlusCourt(noeudDepart,bonus);
    noeudDepart = bonus;
  }
  cheminPlusCourt(noeudDepart,objectif);
  retracerChemin();
}

function estMemeNoeud(liste,noeud) {
  return liste.find((element) => ((element.x == noeud.x) && (element.y == noeud.y)));
}

function distance(n1, n2) {
  x = Math.abs(n1.x - n2.x);
  y = Math.abs(n1.y - n2.y);
  return Math.sqrt((x * x) + (y * y));
}

function reconstituerChemin(depart,objectif,noeud) {
  chemin = new Array();
  while (noeud.x != depart.x || noeud.y != depart.y){
    noeudHTML = $('td[x=' + noeud.x + '][y=' + noeud.y + ']');
    noeudsChemin.push(noeudHTML);
    chemin.push(noeud);
    voisinsFaits = false;
    bestNoeud = null;
    noeud.voisins.forEach(function(v){
      if (noeudDansListe(closedList,v) && !noeudDansListe(chemin,v)){
        v = estMemeNoeud(closedList,v);
        if (bestNoeud == null){
          bestNoeud = v;
        }
        else if (bestNoeud.cout >= v.cout){
          bestNoeud = v;
        }
        else{
          closedList.pop(v);
        }
      }
    });
    noeud = bestNoeud;
  }
}

function retracerChemin(){
  noeudHTML = $('td[x=' + depart.x + '][y=' + depart.y + ']');
  noeudHTML = $('.bonus');
  noeudHTML = $('td[x=' + objectif.x + '][y=' + objectif.y + ']');
  $('.voisins').css('transition','none');
  for (let chemin in noeudsChemin){
    speed = 100/$('#speed').val()*3;
    setTimeout(function(){
      setTimeout(function(){
        noeudsChemin[chemin].removeClass('cheminmarqué');
        if (!noeudsChemin[chemin].hasClass('depart') && !noeudsChemin[chemin].hasClass('arrivee') && !noeudsChemin[chemin].hasClass('bonus')) {
          noeudsChemin[chemin].addClass('chemin');
        }
      }, speed);
      noeudsChemin[chemin].removeClass('voisins');
      noeudsChemin[chemin].removeClass('closed');
      noeudsChemin[chemin].addClass('cheminmarqué');
    }, (speed*chemin));
  }
}

function noeudDansListe(liste, noeud) {
  for (var i = 0; i < liste.length; i++) {
    noeudCompare = liste[i];
    if (noeudCompare.x == noeud.x && noeudCompare.y == noeud.y) {
      return true;
    }
  }
  return false;
}

function cheminPlusCourt(objectif, depart) {
  closedList = new Array();
  openList = new Array();
  openList.push(depart);
  while (openList.length > 0) {
    openList = openList.sort(compare2noeuds);
    u = openList.pop();
    noeudHTML = $('td[x=' + u.x + '][y=' + u.y + ']');
    u.voisins = voisinsDuNoeud(u.x, u.y);
    if (u.x == objectif.x && u.y == objectif.y) {
      u.heuristique += 2;
      u.voisins.forEach(function(v){
        if (noeudDansListe(closedList,v)){
          v = estMemeNoeud(closedList,v);
        }
      });
      reconstituerChemin(depart,objectif,u);
      break;
    }
    u.voisins.forEach(function(v) {
      if (!noeudDansListe(closedList, v) && !(noeudDansListe(openList, v))) {  //if (!noeudDansListe(closedList, v) && !(noeudDansListe(openList, v))) {
        v.cout = u.cout + 1;
        v.heuristique = v.cout + distance(v, objectif);
        openList.push(v);
        noeudHTML = $('td[x=' + v.x + '][y=' + v.y + ']');
        if (!noeudHTML.hasClass('obstacle') && !noeudHTML.hasClass('depart') && !noeudHTML.hasClass('arrivee') && !noeudHTML.hasClass('bonus')) {
          noeudHTML.addClass('voisins');
          //noeudHTML.html(v.heuristique.toFixed(2));
        }
      }
      else{
        if (noeudDansListe(closedList,v)){
          v.cout = estMemeNoeud(closedList,v).cout;
          v.heuristique = estMemeNoeud(closedList,v).heuristique;
        }
        else{
          v.cout = estMemeNoeud(openList,v).cout;
          v.heuristique = estMemeNoeud(openList,v).heuristique;
        }
      }
    });
    closedList.push(u);
    noeudHTML = $('td[x=' + u.x + '][y=' + u.y + ']');
    if (!noeudHTML.hasClass('obstacle') && !noeudHTML.hasClass('depart') && !noeudHTML.hasClass('arrivee') && !noeudHTML.hasClass('bonus')){
      noeudHTML.addClass('closed');
    }
  }
}

function creerLabyrinthe(grid){
  $('.obstacle').removeClass();
  $('.voisins').removeClass();
  $('.chemin').removeClass();
  obstacles = new Array();
  waysIndex = 0;
  y = grid.y;
  x = grid.x;
  for (var i = 0; i < y; i++) {
    for (var j = 0; j < x; j++) {
      var colonne = $('td[x=' + j + '][y=' + i + ']');
      if(j  % 2 != 0 || i % 2 != 0){
        if (!colonne.hasClass('depart') && !colonne.hasClass('arrivee') && !colonne.hasClass('bonus')) {
          obstacles.push(new Noeud(j,i));
          $(colonne).addClass('obstacle');
        }
      }
      else{
        $(colonne).addClass('ways');
        $(colonne).attr('seq',waysIndex);
        waysIndex += 1;
      }
    }
  }
  ways = $('.ways');
  doneways = new Array();
  seqs = new Array();
  continueGen = true;
  while (continueGen){
    way = ways[Math.floor(Math.random()*ways.length)];
    way.x = parseInt($(way).attr('x'));
    way.y = parseInt($(way).attr('y'));
    way.seq = parseInt($(way).attr('seq'));
    doneways.push(way);
    rand = Math.floor(Math.random()*3);
    otherway = null;
    if (rand == 0 && (way.x-2 >= 0)){
      otherway = $('td[x=' + (way.x - 2) + '][y=' + way.y + ']');
      otherway.x = way.x - 2;
      otherway.x = way.y;
      otherway.seq = parseInt($(otherway).attr('seq'));
      wall = $('td[x=' + (way.x - 1) + '][y=' + way.y + ']');
    }
    else if (rand == 1 && (way.x+2 <= grid.x)){
      otherway = $('td[x=' + (way.x + 2) + '][y=' + way.y + ']');
      otherway.x = way.x + 2;
      otherway.x = way.y;
      otherway.seq = parseInt($(otherway).attr('seq'));
      wall = $('td[x=' + (way.x + 1) + '][y=' + way.y + ']');
    }
    else if (rand == 2 && (way.y - 2 >= 0)){
      otherway = $('td[x=' + way.x + '][y=' + (way.y - 2) + ']');
      otherway.x = way.x;
      otherway.x = way.y - 2;
      otherway.seq = parseInt($(otherway).attr('seq'));
      wall = $('td[x=' + way.x + '][y=' + (way.y - 1) + ']');
    }
    else if (rand == 3 && (way.y + 2 <= grid.y)){
      otherway = $('td[x=' + way.x + '][y=' + (way.y + 2) + ']');
      otherway.x = way.x;
      otherway.x = way.y + 2;
      otherway.seq = parseInt($(otherway).attr('seq'));
      wall = $('td[x=' + way.x + '][y=' + (way.y + 1) + ']');
    }
    if (otherway != null && way.seq != otherway.seq){
      $('td[seq='+otherway.seq+']').attr('seq',way.seq);
      wall.removeClass('obstacle');
    }
    continueGen = false;
    ways = $('.ways');
    ways.each(function(){
      if ($(this).attr('seq') != undefined){
        if (way.seq != $(this).attr('seq')){
          continueGen = true;
          return false;
        }
      }
    });
  }
}

function listways(){
  ways = $('.ways');
  ways.each(function(){
    if ($(this).attr('seq') != undefined){
      console.log($(this).attr('seq'));
    }
  });
}
