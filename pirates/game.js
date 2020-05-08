//variables
w = 50;
h = 30;
x = 5;
y = 5;
type = $('input[name=type]:checked', '#type').val();
meranim = 0;
terrecoord = [];
herbecoord = [];
sablecoord = [];
pierrecoord = [];
pontoncoord = [];
ilescoord = [];
map = "map1";
compteur = 0;
user = getCookie('username');
usersOnMap = [];
xOnMap = [];
yOnMap = [];
colorOnMap = [];
bateauSkin = null;
HoverPonton = true;
gold = 0;
ammaré = false;
mapArray = ['map1', 'map2', 'map3', 'map4', 'map5', 'map6', 'map7', 'map8', 'map9'];
var xPonton;
var yPonton;


$(document).ready(function() {
  initialize();
});

//----------------------------------

//fonctions

//initialisation
function initialize() {
  loading();
  //création du tableau
  for (var i = 0; i < h; i++) {
    $('#game').append("<tr></tr>");
    for (var j = 0; j < w; j++) {
      $('tr').eq(i).append("<td></td>");
      $('tr').eq(i).find('td').eq(j).attr('y', i).attr('x', j).addClass('mer');
    }
  }
  getUser();
  //bateau();

}

//----------------------------------

//bg de loading
function loading() {
  $("#loading").show();
  setTimeout(function() {
    $("#loading").hide("clip", {
      duration: 1000,
      easing: 'swing'
    });
  }, 1000);
}

//----------------------------------

//remplir le monde avec les données
function world() {
  var filecontent = "";
  $("td").css("background-image", "");
  $.get(("maps/" + map + ".txt"), function(data) {
    var contents = data.split('_');
    terrecoord = contents[0].split(",");
    herbecoord = contents[1].split(",");
    sablecoord = contents[2].split(",");
    pierrecoord = contents[3].split(",");
    pontoncoord = contents[4].split(",");
    ilescoord = contents[5].split(",");
  }).done(function() {
    //terre
    for (var i = 0; i < terrecoord.length; i++) {
      var terreXY = terrecoord[i].split("/");
      $('tr').eq(terreXY[1]).find('td').eq(terreXY[0]).removeClass();
      $('tr').eq(terreXY[1]).find('td').eq(terreXY[0]).html("");
      $('tr').eq(terreXY[1]).find('td').eq(terreXY[0]).addClass('terre');
    }
    //Herbe
    for (var i = 0; i < herbecoord.length; i++) {
      var herbeXY = herbecoord[i].split("/");
      $('tr').eq(herbeXY[1]).find('td').eq(herbeXY[0]).removeClass();
      $('tr').eq(herbeXY[1]).find('td').eq(herbeXY[0]).html("");
      $('tr').eq(herbeXY[1]).find('td').eq(herbeXY[0]).addClass('herbe');
    }
    //Sable
    for (var i = 0; i < sablecoord.length; i++) {
      var sableXY = sablecoord[i].split("/");
      $('tr').eq(sableXY[1]).find('td').eq(sableXY[0]).removeClass();
      $('tr').eq(sableXY[1]).find('td').eq(sableXY[0]).html("");
      $('tr').eq(sableXY[1]).find('td').eq(sableXY[0]).addClass('sable');
    }
    //Pierre
    for (var i = 0; i < pierrecoord.length; i++) {
      var pierreXY = pierrecoord[i].split("/");
      $('tr').eq(pierreXY[1]).find('td').eq(pierreXY[0]).removeClass();
      $('tr').eq(pierreXY[1]).find('td').eq(pierreXY[0]).html("");
      $('tr').eq(pierreXY[1]).find('td').eq(pierreXY[0]).addClass('pierre');
    }
    //pontons
    for (var i = 0; i < pontoncoord.length; i++) {
      var pontonXY = pontoncoord[i].split("/");
      $('tr').eq(pontonXY[1]).find('td').eq(pontonXY[0]).removeClass();
      $('tr').eq(pontonXY[1]).find('td').eq(pontonXY[0]).html("");
      $('tr').eq(pontonXY[1]).find('td').eq(pontonXY[0]).addClass('ponton');
      $('tr').eq(pontonXY[1]).find('td').eq(pontonXY[0]).attr('ile', ilescoord[i]);
    }
    if (ammaré) {
      xPonton = parseInt($(".ponton").attr('x'));
      yPonton = parseInt($(".ponton").attr('y'));
      BateauPonton();
      $('tr').eq(y).find('td').eq(x).addClass('bateau');
      $(".bateau").css("background-image", "url('persos/persoG.png')");
    } else {
      $('tr').eq(y).find('td').eq(x).css('background-image', 'url("bateaux/bateauG_' + bateauSkin + '.png")');
      $('tr').eq(y).find('td').eq(x).removeClass();
      $('tr').eq(y).find('td').eq(x).addClass('bateau');
    }
  });
  updateUsers();
}

//----------------------------------

//animation mer
function mer() {
  if (meranim == 0) {
    $('td[class="mer"]').html("~");
    meranim = 1;
  } else {
    $('td[class="mer"]').html("^");
    meranim = 0;
  }
}
setInterval(mer, 500);

//----------------------------------

//changement type
function changetype(el) {
  el.removeClass();
  el.addClass(type);
  el.html("");
}

//----------------------------------

//editeur

$(document).ready(function() {
  $('td').mousedown(function() {
    if ($(this).hasClass('ponton') == false && $(this).hasClass('bateau') == false) {
      type = $('input[name=type]:checked', '#type').val();
      if (type != null) {
        changetype($(this));
        coord = $(this).attr('x') + "/" + $(this).attr('y'); //var pour voir si bloc cliqué a deja un type
        if (terrecoord.indexOf(coord) > -1) {
          terrecoord.splice(terrecoord.indexOf(coord), 1);
        }
        if (herbecoord.indexOf(coord) > -1) {
          herbecoord.splice(herbecoord.indexOf(coord), 1);
        }
        if (sablecoord.indexOf(coord) > -1) {
          sablecoord.splice(sablecoord.indexOf(coord), 1);
        }
        if (pierrecoord.indexOf(coord) > -1) {
          pierrecoord.splice(pierrecoord.indexOf(coord), 1);
        }
        if (pontoncoord.indexOf(coord) > -1) {
          ilescoord.splice(pontoncoord.indexOf(coord), 1);
          pontoncoord.splice(pontoncoord.indexOf(coord), 1);
        }
        if (type == "terre") {
          terrecoord.push(coord);
        } else if (type == "herbe") {
          herbecoord.push(coord);
        } else if (type == "sable") {
          sablecoord.push(coord);
        } else if (type == "pierre") {
          pierrecoord.push(coord);
        } else if (type == "ponton") {
          ilescoord.push(prompt("Nom de l'ile"));
          pontoncoord.push(coord);
        }
      }
    }
  });
});


//----------------------------------

//touches
$(document).keydown(function(e) {
  if (e.keyCode == 77) {
    //tab pour map
    //y
    getCibleMap();
    $('#map').show();
    $('#marque').show();
  }
});

$(document).keyup(function(e) {
  if (e.keyCode == 77) {
    //tab pour map
    $('#marque').hide();
    $('#map').hide();
  }
  //canons
  /*
  else if ( e.keyCode == 17){
    if (($(".bateau").css("background-image").indexOf("bateauG") !== -1) || ($(".bateau").css("background-image").indexOf("bateauD") !== -1)){
      var direction = 'y';//les canons partent perpendiculairement donc en y
    }
    else{
      var direction = 'x';//les canons partent perpendiculairement donc en x
    }
    canon(direction);
  }
  */
});

$(document).keydown(function(e) {
  //e pour display les arrays
  if (e.keyCode == 13) {
    console.log("terre : " + terrecoord);
    console.log("herbe : " + herbecoord);
    console.log("sable : " + sablecoord);
    console.log("pierre : " + pierrecoord);
    console.log("ponton : " + pontoncoord);
    console.log("iles : " + ilescoord);
    $.post("mapping.php", {
      text: (terrecoord + "_" + herbecoord + "_" + sablecoord + "_" + pierrecoord + "_" + pontoncoord + "_" + ilescoord), //ajout position au fichier map
      map: map,
    }).done(function() {
      alert("sauvegardé");
    }).fail(function() {
      alert("fail");
    });
  }
  //detection flèches
  if (compteur == 0) {
    //up
    if (e.keyCode == 38) {
      move("up");
      décompte();
    }
    //down
    else if (e.keyCode == 40) {
      move("down");
      décompte();
    }
    //left
    else if (e.keyCode == 37) {
      move("left");
      décompte();
    }
    //right
    else if (e.keyCode == 39) {
      move("right");
      décompte();
    }
  }
});

//----------------------------------

//mouvement bateau
function move(dir) {
  x = parseInt(x);
  y = parseInt(y);
  //up
  if (ammaré) { //si a pieds
    if (dir == "up" && ($('tr').eq(y - 1).find('td').eq(x).hasClass('mer') == false) && ($('tr').eq(y - 1).find('td').eq(x).hasClass('ammaré') == false)) {
      $('tr').eq(y).find('td').eq(x).removeClass("bateau");
      $('tr').eq(y).find('td').eq(x).css("background-image", "");
      y = y - 1;
      $('tr').eq(y).find('td').eq(x).addClass("bateau");
      $(".bateau").css("background-image", "url('persos/persoH.png')");
    }
    //down
    else if (dir == "down" && ($('tr').eq(y + 1).find('td').eq(x).hasClass('mer') == false) && ($('tr').eq(y + 1).find('td').eq(x).hasClass('ammaré') == false)) {
      $('tr').eq(y).find('td').eq(x).removeClass("bateau");
      $('tr').eq(y).find('td').eq(x).css("background-image", "");
      y = y + 1;
      $('tr').eq(y).find('td').eq(x).addClass("bateau");
      $(".bateau").css("background-image", "url('persos/persoB.png')");
    }
    //left
    else if (dir == "left" && ($('tr').eq(y).find('td').eq(x - 1).hasClass('mer') == false) && ($('tr').eq(y).find('td').eq(x - 1).hasClass('ammaré') == false)) {
      $('tr').eq(y).find('td').eq(x).removeClass("bateau");
      $('tr').eq(y).find('td').eq(x).css("background-image", "");
      x = x - 1;
      $('tr').eq(y).find('td').eq(x).addClass("bateau");
      $(".bateau").css("background-image", "url('persos/persoG.png')");
    }
    //right
    else if (dir == "right" && ($('tr').eq(y).find('td').eq(x + 1).hasClass('mer') == false) && ($('tr').eq(y).find('td').eq(x + 1).hasClass('ammaré') == false)) {
      $('tr').eq(y).find('td').eq(x).removeClass("bateau");
      $('tr').eq(y).find('td').eq(x).css("background-image", "");
      x = x + 1;
      $('tr').eq(y).find('td').eq(x).addClass("bateau");
      $(".bateau").css("background-image", "url('persos/persoD.png')");
    }
  } else { //Si en bateau
    $('tr').eq(y).find('td').eq(x).removeClass();
    bgimage = $('tr').eq(y).find('td').eq(x).css('background-image');
    $('tr').eq(y).find('td').eq(x).css('background-image', '');
    $('tr').eq(y).find('td').eq(x).addClass('mer');
    //up
    if (dir == "up" && ($('tr').eq(y - 1).find('td').eq(x).hasClass('mer') || $('tr').eq(y - 1).find('td').eq(x).hasClass('autres')) && y > 0) {
      y = y - 1;
      $('tr').eq(y).find('td').eq(x).html("");
      $('tr').eq(y).find('td').eq(x).removeClass();
      $('tr').eq(y).find('td').eq(x).addClass("bateau");
      $(".bateau").css("background-image", "url('bateaux/bateauH_" + bateauSkin + ".png')");
    }
    //down
    else if (dir == "down" && ($('tr').eq(y + 1).find('td').eq(x).hasClass('mer') || $('tr').eq(y + 1).find('td').eq(x).hasClass('autres')) && y < h) {
      y = y + 1;
      $('tr').eq(y).find('td').eq(x).html("");
      $('tr').eq(y).find('td').eq(x).removeClass();
      $('tr').eq(y).find('td').eq(x).addClass("bateau");
      $(".bateau").css("background-image", "url('bateaux/bateauB_" + bateauSkin + ".png')");
    }
    //left
    else if (dir == "left" && ($('tr').eq(y).find('td').eq(x - 1).hasClass('mer') || $('tr').eq(y).find('td').eq(x - 1).hasClass('autres')) && x > 0) {
      x = x - 1;
      $('tr').eq(y).find('td').eq(x).html("");
      $('tr').eq(y).find('td').eq(x).removeClass();
      $('tr').eq(y).find('td').eq(x).addClass("bateau");
      $(".bateau").css("background-image", "url('bateaux/bateauG_" + bateauSkin + ".png')");
    }
    //right
    else if (dir == "right" && ($('tr').eq(y).find('td').eq(x + 1).hasClass('mer') || $('tr').eq(y).find('td').eq(x + 1).hasClass('autres')) && x < w) {
      x = x + 1;
      $('tr').eq(y).find('td').eq(x).html("");
      $('tr').eq(y).find('td').eq(x).removeClass();
      $('tr').eq(y).find('td').eq(x).addClass("bateau");
      $(".bateau").css("background-image", "url('bateaux/bateauD_" + bateauSkin + ".png')");
    }
    //up changement map
    else if (dir == "up" && y == 0 && (map == "map1" || map == "map3" || map == "map5" || map == "map7" || map == "map8" || map == "map4")) {
      $("td").removeClass();
      $("td").html("");
      $("td").addClass("mer");
      if (map == "map1") {
        map = "map2";
        world();
      } else if (map == "map5") {
        map = "map6";
        world();
      } else if (map == "map3") {
        map = "map1";
        world();
      } else if (map == "map4") {
        map = "map9";
        world();
      } else if (map == "map7") {
        map = "map5";
        world();
      } else if (map == "map8") {
        map = "map4";
        world();
      }
      $('tr').eq(y).find('td').eq(x).removeClass();
      $('tr').eq(y).find('td').eq(x).addClass("mer");
      y = 29;
      $('tr').eq(y).find('td').eq(x).addClass('bateau');
      $(".bateau").css("background-image", "url('bateaux/bateauH_" + bateauSkin + ".png')");
      getCibleMap();
    }
    //down changement map
    else if (dir == "down" && y == 29 && (map == "map1" || map == "map2" || map == "map6" || map == "map5" || map == "map4" || map == "map9")) {
      $("td").removeClass();
      $("td").html("");
      $("td").addClass("mer");
      if (map == "map1") {
        map = "map3";
        world();
      } else if (map == "map2") {
        map = "map1";
        world();
      } else if (map == "map4") {
        map = "map8";
        world();
      } else if (map == "map5") {
        map = "map7";
        world();
      } else if (map == "map6") {
        map = "map5";
        world();
      } else if (map == "map9") {
        map = "map4";
        world();
      } else {
        return
      }
      $('tr').eq(y).find('td').eq(x).removeClass();
      $('tr').eq(y).find('td').eq(x).addClass("mer");
      y = 0;
      $('tr').eq(y).find('td').eq(x).addClass('bateau');
      $(".bateau").css("background-image", "url('bateaux/bateauB_" + bateauSkin + ".png')");
      getCibleMap();
    }
    //left changement map
    else if (dir == "left" && x == 0 && (map == "map1" || map == "map5" || map == "map6" || map == "map7" || map == "map3" || map == "map2")) {
      $("td").removeClass();
      $("td").html("");
      $("td").addClass("mer");
      if (map == "map1") {
        map = "map4";
        world();
      } else if (map == "map3") {
        map = "map8";
        world();
      } else if (map == "map5") {
        map = "map1";
        world();
      } else if (map == "map6") {
        map = "map2";
        world();
      } else if (map == "map7") {
        map = "map3";
        world();
      } else if (map == "map2") {
        map = "map9";
        world();
      } else {
        return
      }
      $('tr').eq(y).find('td').eq(x).removeClass();
      $('tr').eq(y).find('td').eq(x).addClass("mer");
      x = 49;
      $('tr').eq(y).find('td').eq(x).addClass('bateau');
      $(".bateau").css("background-image", "url('bateaux/bateauG_" + bateauSkin + ".png')");
      getCibleMap();
    }
    //right changement map
    else if (dir == "right" && x == 49 && (map == "map1" || map == "map4" || map == "map2" || map == "map3" || map == "map8" || map == "map9")) {
      $("td").removeClass();
      $("td").html("");
      $("td").addClass("mer");
      if (map == "map1") {
        map = "map5";
        world();
      } else if (map == "map2") {
        map = "map6";
        world();
      } else if (map == "map3") {
        map = "map7";
        world();
      } else if (map == "map4") {
        map = "map1";
        world();
      } else if (map == "map8") {
        map = "map3";
        world();
      } else if (map == "map9") {
        map = "map2";
        world();
      } else {
        return
      }
      $('tr').eq(y).find('td').eq(x).removeClass();
      $('tr').eq(y).find('td').eq(x).addClass("mer");
      x = 0;
      $('tr').eq(y).find('td').eq(x).addClass('bateau');
      $(".bateau").css("background-image", "url('bateaux/bateauD_" + bateauSkin + ".png')");
      getCibleMap();
    } else {
      $('tr').eq(y).find('td').eq(x).addClass('bateau');
      $(".bateau").css("background-image", bgimage);
    }
  }
  update();
}

//----------------------------------

// fonction pour récupérer cookie
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

//----------------------------------

//placer bateau avec cookie
/*
function bateau() {
  var cookieposition = getCookie("position"); //get position coookie
  var cookiemap = getCookie("map"); //get position coookie
  var cookiecouleur = getCookie("couleur"); //get position coookie
  if (cookieposition != null && cookiemap != null) { //si il existe
    cookieposition = cookieposition.split("/"); //séparer x/y
    x = parseInt(cookieposition[0]);
    y = parseInt(cookieposition[1]);
    bateauSkin = cookiecouleur;
  }
  else{//si l'user est log mais qu'il n'a pas de cookies
    $.when(getpositions()).done(function(){//check si la fonction getpositions est finie
      x = ;
      y = ;
      document.cookie = "position="+x+"/"+y+"; expires=Wes, 18 Dec 2030 12:00:00 UTC";//cookie position
      document.cookie = "map="+map+"; expires=Wes, 18 Dec 2030 12:00:00 UTC";//cookie map
    });
  }
  if (mapArray.includes(cookiemap)) {
    $('tr').eq(y).find('td').eq(x).removeClass();
    $('tr').eq(y).find('td').eq(x).addClass('bateau');
  } else {
    ammaré = true;
    console.log(cookiemap);
  }

}*/

//----------------------------------

//set ou get username
function getUser() {
  if (user == null) { //si pas de cookie user
    var person = prompt("Nom de pirate", "Username"); //demander nom
    $.ajax({
      type: 'GET',
      contentType: "application/json",
      dataType: "json",
      url: 'getusers.php?user=' + person,
      success: function(data) {
        if (data['result'] === true) {
          bateauSkin = data['skin'];
          document.cookie = "username=" + person + "; expires=Wes, 18 Dec 2030 12:00:00 UTC";
          changerGold(data['gold']);
          x = parseInt(data['x']);
          y = parseInt(data['y']);
          map = data['map'];
          user = person;
          $("#name").html("Bienvenue, " + user + "."); //display nom
          world();
        } else {
          var couleur;
          do {
            couleur = prompt("Couleur", "(rouge, bleu, noir, blanc, jaune ou vert.)"); //demander couleur
          } while ($.inArray(couleur, ["rouge", "bleu", "noir", "blanc", "jaune", "vert"]) === -1);
          bateauSkin = couleur;
          document.cookie = "username=" + person + "; expires=Wes, 18 Dec 2030 12:00:00 UTC";
          user = person;
          changerGold(0);
          $("#name").html("Bienvenue, " + user + "."); //display nom
          world();
        }
      }
    });
  } else {
    $.ajax({
      type: 'GET',
      contentType: "application/json",
      dataType: "json",
      url: 'getusers.php?user=' + user,
      success: function(data) {
        bateauSkin = data['skin'];
        document.cookie = "username=" + user + "; expires=Wes, 18 Dec 2030 12:00:00 UTC";
        changerGold(data['gold']);
        x = parseInt(data['x']);
        y = parseInt(data['y']);
        map = data['map'];
        if (!mapArray.includes(map)){
          ammaré = true;
          console.log('ha');
        }
        $("#name").html("Bienvenue, " + user + "."); //display nom
        world();
      }
    });
  }
}

//----------------------------------

//hover bateau user
$(document).on('mouseenter', ".bateau", function() {
  if (HoverPonton) {
    var offset = $(".bateau").offset(); //position bateau
    $('#panneau').html(getCookie('username')); //remplir panneau avec nom
    $("#panneau").css({
      'top': offset.top - ($("#panneau").height()),
      'left': ($(".bateau").width() / 2) + offset.left - ($("#panneau").width() / 2)
    }).stop(true, true).fadeIn("fast"); //teleporter et faire apparaitre
  }
}).on('mouseleave', ".bateau", function() {
  if (HoverPonton) {
    $("#panneau").stop(true, true).fadeOut("fast"); //disparaitre
  }
});

//----------------------------------

//hover bateau autres
$(document).on('mouseenter', ".autres", function() {
  if (HoverPonton) {
    var offset = $(this).offset(); //position bateau
    $('#panneau').html($(this).attr('user')); //remplir panneau avec nom
    $("#panneau").css({
      'top': offset.top - ($("#panneau").height()),
      'left': ($(".bateau").width() / 2) + offset.left - ($("#panneau").width() / 2)
    }).stop(true, true).fadeIn("fast"); //teleporter et faire apparaitre
  }
}).on('mouseleave', ".autres", function() {
  if (HoverPonton) {
    $("#panneau").stop(true, true).fadeOut("fast"); //disparaitre
  }
});

//----------------------------------

//hover pontons
$(document).on('mouseenter', ".ponton", function() {
  if (HoverPonton) {
    if (mapArray.includes($(this).attr('ile'))) {
      var offset = $(this).offset(); //position bateau
      $('#panneau').html("Ponton"); //remplir panneau avec nom
      $("#panneau").css({
        'top': offset.top - ($("#panneau").height()),
        'left': ($(".bateau").width() / 2) + offset.left - ($("#panneau").width() / 2)
      }).stop(true, true).fadeIn("fast"); //teleporter et faire apparaitre
    } else {
      var offset = $(this).offset(); //position bateau
      $('#panneau').html($(this).attr('ile')); //remplir panneau avec nom
      $("#panneau").css({
        'top': offset.top - ($("#panneau").height()),
        'left': ($(".bateau").width() / 2) + offset.left - ($("#panneau").width() / 2)
      }).stop(true, true).fadeIn("fast"); //teleporter et faire apparaitre
    }
  }
}).on('mouseleave', ".ponton", function() {
  if (HoverPonton) {
    $("#panneau").stop(true, true).fadeOut("fast"); //disparaitre
  }
});

//----------------------------------

//placer autres joueurs sur la map
function updateUsers() {
  if (mapArray.includes(map)){
    $.ajax({
      type: 'GET',
      url: 'useronmap.php?map=' + map,
      contentType: "application/json",
      dataType: "json",
      success: function(data) {
        usersOnMap = data['names'];
        xOnMap = data['x'];
        yOnMap = data['y'];
        colorOnMap = data['skin'];
        if (usersOnMap != null) {
          $('.autres').addClass('mer');
          $('.autres').html('');
          $('.autres').removeClass('autres');
          for (var i = 0; i < usersOnMap.length; i++) {
            if (usersOnMap[i].toLowerCase() != user.toLowerCase()) {
              $('tr').eq(yOnMap[i]).find('td').eq(xOnMap[i]).removeClass("autres");
              $('tr').eq(yOnMap[i]).find('td').eq(xOnMap[i]).removeClass("mer");
              $('tr').eq(yOnMap[i]).find('td').eq(xOnMap[i]).html("");
              $('tr').eq(yOnMap[i]).find('td').eq(xOnMap[i]).addClass("autres");
              $('tr').eq(yOnMap[i]).find('td').eq(xOnMap[i]).css('background-image', 'url("bateaux/bateauG_' + colorOnMap[i] + '.png")');
              $('tr').eq(yOnMap[i]).find('td').eq(xOnMap[i]).attr('user', usersOnMap[i].replace('.txt', ''));
            }
          }
        }
      }
    });
  }
}
setInterval(updateUsers, 1000);

//----------------------------------

//décompte pour mouvement
function décompte() {
  compteur = 1;
  setTimeout(function() {
    compteur = 0;
  }, 500);
}

//----------------------------------

//tir de canon
/*
function canon(dir){
  setTimeout(function(){
    iCanon++;
    if (dir == "x"){
      var coorX = [$('tr').eq(y).find('td').eq(x+iCannon),$('tr').eq(y).find('td').eq(x-iCannon)];
      if (coorX[1].hasClass("mer")){
          coorX[1].removeClass();
          coorX[1].html("o");
          coorX[1].addClass('canon');
      }
      if (coorX[0].hasClass("mer")){
          coorX[0].removeClass();
          coorX[0].html("o");
          coorX[0].addClass('canon');
      }
    }
    else if (dir == "y"){
      var coorY = [$('tr').eq(y+1).find('td').eq(x),$('tr').eq(y-1).find('td').eq(x)];
      if (coorY[1].hasClass("mer")){
        coorY[1].removeClass();
        coorY[1].html("o");
        coorY[1].addClass('canon');
      }
      if (coorY[0].hasClass("mer")){
        coorY[0].removeClass();
        coorY[0].html("o");
        coorY[0].addClass('canon');
      }
    }
      $('.canon').html("");
      $(".canon").addClass('mer');
      $('.canon').removeClass("canon");
  }, 1000);
}
*/

//----------------------------------

//click sur quete
$("#quete").click(function() {
  $("#quete").fadeOut();
});

//----------------------------------

//click sur bateau
$(document).on("click", ".bateau", function() {
  if (!ammaré) {
    HoverPonton = false;
    $("#panneau").html(user);
    $("#panneau").append("<div class='close panneauDiv'>X</div>");
    if (getCookie("quete") != null) {
      $("#panneau").append("<div class='panneauDiv'>Voir quête</div>");
    }
    $("#panneau").append("<div class='panneauDiv'>Changer de couleur (500<div id='piece'></div>)</div>");
    var offset = $(this).offset(); //position ponton
    $("#panneau").css({
      'top': offset.top - ($("#panneau").height()),
      'left': ($(this).width() / 2) + offset.left - ($("#panneau").width() / 2)
    });
  }
});

//----------------------------------

//get une quete
function getQuete() {
  $.ajax({
    type: 'GET',
    url: 'quete.php',
    contentType: "application/json",
    dataType: "json",
    success: function(data) {
      $('#quete_map').css('background-size', '100% 100%');
      $('#quete_map').css('background-image', 'url("' + data['map'] + '")');
      $('#quete_nom').html(data['nom']);
      $('#quete_des').html(data['description']);
      $('#quete').slideDown("slow");
    }
  });
}

//----------------------------------

//click sur ponton
$(document).on("click", ".ponton", function() {
  xPonton = $(this).attr('x');
  yPonton = $(this).attr('y');
  //on check si on est pas trop loin
  if ((x == xPonton - (-1) && y == yPonton) || (x == xPonton - 1 && y == yPonton) || (y == yPonton - (-1) && x == xPonton) || (y == yPonton - 1 && x == xPonton)) {
    //on check si cest Crescent Isle
    if ($(this).attr('ile') == "Crescent Isle") {
      HoverPonton = false;
      $('#panneau').html($(this).attr('ile')); //remplir panneau avec nom
      $("#panneau").append("<div class='close panneauDiv'>X</div>");
      if (getCookie("quete") != null) {
        $("#panneau").append("<div class='panneauDiv'>Voir quête</div>");
        $("#panneau").append("<div class='panneauDiv'>Abandonner quête</div>");
      } else {
        $("#panneau").append("<div class='panneauDiv'>Reçevoir quête</div>");
      }
      var offset = $(this).offset(); //position ponton
      $("#panneau").css({
        'top': offset.top - ($("#panneau").height()),
        'left': ($(this).width() / 2) + offset.left - ($("#panneau").width() / 2)
      });
    }
    //Si cest pas Crescent Isle et qu'on a un cookie
    else if (getCookie('quete') != null) {
      //on check si cest lile de la quete en cours
      if ($(this).attr('ile') == getCookie('quete').split("_")[0]) {
        HoverPonton = false;
        $('#panneau').html($(this).attr('ile')); //remplir panneau avec nom
        $("#panneau").append("<div class='close panneauDiv'>X</div>");
        $("#panneau").append("<div class='panneauDiv'>Amarrer </div>");
        var offset = $(this).offset(); //position ponton
        $("#panneau").css({
          'top': offset.top - ($("#panneau").height()),
          'left': ($(this).width() / 2) + offset.left - ($("#panneau").width() / 2)
        });
      }
      //si ca l'est pas on ouvre l'ile normal
      else if (mapArray.includes($(this).attr('ile')) == false) {
        HoverPonton = false;
        $('#panneau').html($(this).attr('ile')); //remplir panneau avec nom
        $("#panneau").append("<div class='close panneauDiv'>X</div>");
        $("#panneau").append("<div class='panneauDiv' ile='" + $(this).attr('ile') + "'>Amarrer</div>");
        var offset = $(this).offset(); //position ponton
        $("#panneau").css({
          'top': offset.top - ($("#panneau").height()),
          'left': ($(this).width() / 2) + offset.left - ($("#panneau").width() / 2)
        });
      }
      //si on est dans une ile, juste a coté cest tjrs trop loin
      else {
        $("#panneau").html("Trop loin !");
        var offset = $(this).offset(); //position ponton
        $("#panneau").css({
          'top': offset.top - ($("#panneau").height()),
          'left': ($(this).width() / 2) + offset.left - ($("#panneau").width() / 2)
        });
      }
    }
    //si ya pas de cookie on check si on est sur la map ou sur lile
    else if (mapArray.includes($(this).attr('ile')) == false) {
      HoverPonton = false;
      $('#panneau').html($(this).attr('ile')); //remplir panneau avec nom
      $("#panneau").append("<div class='close panneauDiv'>X</div>");
      $("#panneau").append("<div class='panneauDiv' ile='" + $(this).attr('ile') + "'>Amarrer</div>");
      var offset = $(this).offset(); //position ponton
      $("#panneau").css({
        'top': offset.top - ($("#panneau").height()),
        'left': ($(this).width() / 2) + offset.left - ($("#panneau").width() / 2)
      });
    } else {
      $("#panneau").html("Trop loin !");
      var offset = $(this).offset(); //position ponton
      $("#panneau").css({
        'top': offset.top - ($("#panneau").height()),
        'left': ($(this).width() / 2) + offset.left - ($("#panneau").width() / 2)
      });
    }
  }
  //si on est pile collé au ponton on check si le ponton a un attribut qui renvoie vers une grande map
  else if (y == yPonton && x == xPonton && mapArray.includes($(this).attr('ile'))) {
    HoverPonton = false;
    $('#panneau').html("Ponton"); //remplir panneau avec nom
    $("#panneau").append("<div class='close panneauDiv'>X</div>");
    $("#panneau").append("<div class='panneauDiv' ile='" + $(this).attr('ile') + "'>Démarrer</div>");
    var offset = $(this).offset(); //position ponton
    $("#panneau").css({
      'top': offset.top - ($("#panneau").height()),
      'left': ($(this).width() / 2) + offset.left - ($("#panneau").width() / 2)
    });
  }
  //si cest trop loin, on le dit
  else if (HoverPonton) {
    $("#panneau").html("Trop loin !");
    var offset = $(this).offset(); //position ponton
    $("#panneau").css({
      'top': offset.top - ($("#panneau").height()),
      'left': ($(this).width() / 2) + offset.left - ($("#panneau").width() / 2)
    });
  }
});

//----------------------------------

//click sur close
$(document).on("click", ".close", function() {
  $("#panneau").stop(true, true).fadeOut("fast"); //disparaitre
  HoverPonton = true;
});

//----------------------------------

//click sur une case du panneau
$(document).on("click", ".panneauDiv", function() {
  var div = $(this);
  switch ($(this).html()) {
    case "Voir quête":
      voirquete();
      break;
    case "Abandonner quête":
      break;
    case "Reçevoir quête":
      getQuete();
      break;
    case 'Changer de couleur (500<div id="piece"></div>)':
      if (gold >= 500) {
        var couleur;
        do {
          couleur = prompt("Couleur", "(rouge, bleu, noir, blanc, jaune ou vert.)"); //demander couleur
        } while ($.inArray(couleur, ["rouge", "bleu", "noir", "blanc", "jaune", "vert"]) === -1);
        bateauSkin = couleur;
        changerGold(-500);
        $(".bateau").css("background-image", "url('bateaux/bateauG_" + bateauSkin + ".png')");
      } else {
        alert("Pas assez de pièces d'or.");
      }
      break;
    case "Amarrer ": //avec un espace a la fin == quete
      $("#loading").show(0, function() {
        ammaré = true;
        setTimeout(function() {
          getCibleMap();
          $("td").removeClass();
          $("td").html("");
          $("td").addClass("mer");
          var oldmap = map;
          map = div.attr("ile");
          world();
          setTimeout(function() {
            x = xPonton;
            y = yPonton;
            getTresor();
            $('.bateau').html('');
            $('.bateau').css('background-image','');
            $('.bateau').removeAttr('user');
            $('.bateau').addClass('mer');
            $('.bateau').removeClass('bateau');
            $('tr').eq(y).find('td').eq(x).html("");
            $('tr').eq(y).find('td').eq(x).addClass('bateau');
            $('tr').eq(y).find('td').eq(x).css("background-image", "url('persos/persoG.png')");
            update();
          }, 500);
        }, 600);
      });
      setTimeout(function() {
        $("#loading").hide("clip", {
          duration: 1000,
          easing: 'swing'
        });
      }, 1000);
      winQuete();
      break;
    case "Amarrer": // ile normale
      $("#loading").show(0, function() {
        ammaré = true;
        setTimeout(function() {
          getCibleMap();
          $("td").removeClass();
          $("td").html("");
          $("td").addClass("mer");
          var oldmap = map;
          map = div.attr("ile");
          world();
          setTimeout(function() {
            x = xPonton;
            y = yPonton;
            $('.bateau').html('');
            $('.bateau').css('background-image','');
            $('.bateau').removeAttr('user');
            $('.bateau').addClass('mer');
            $('.bateau').removeClass('bateau');
            $('tr').eq(y).find('td').eq(x).html("");
            $('tr').eq(y).find('td').eq(x).addClass('bateau');
            $('tr').eq(y).find('td').eq(x).css("background-image", "url('persos/persoG.png')");
            update();
          }, 500);
        }, 600);
      });
      setTimeout(function() {
        $("#loading").hide("clip", {
          duration: 1000,
          easing: 'swing'
        });
      }, 1000);
      break;
    case "Démarrer":
      $("#loading").show(0, function() {
        ammaré = false;
        setTimeout(function() {
          getCibleMap();
          $("td").removeClass();
          $("td").html("");
          $("td").addClass("mer");
          var oldmap = map;
          map = div.attr("ile");
          world();
          setTimeout(function() {
            var xPonton = parseInt($(".ponton[ile='" + oldmap + "']").attr('x'));
            var yPonton = parseInt($(".ponton[ile='" + oldmap + "']").attr('y'));
            if ($('td[y="' + (yPonton - 1) + '"][x="' + xPonton + '"]').hasClass('mer')) {
              x = xPonton;
              y = yPonton - 1;
            } else if ($('td[y="' + (yPonton + 1) + '"][x="' + xPonton + '"]').hasClass('mer')) {
              x = xPonton;
              y = yPonton + 1;
            } else if ($('td[y="' + yPonton + '"][x="' + (xPonton - 1) + '"]').hasClass('mer')) {
              x = xPonton - 1;
              y = yPonton;
            } else if ($('td[y="' + yPonton + '"][x="' + (xPonton + 1) + '"]').hasClass('mer')) {
              x = xPonton + 1;
              y = yPonton;
            }
            $('.bateau').html('');
            $('.bateau').css('background-image','');
            $('.bateau').removeAttr('user');
            $('.bateau').addClass('mer');
            $('.bateau').removeClass('bateau');
            $('tr').eq(y).find('td').eq(x).removeClass();
            $('tr').eq(y).find('td').eq(x).html("");
            $('tr').eq(y).find('td').eq(x).addClass('bateau');
            $(".bateau").css("background-image", "url('bateaux/bateauG_" + bateauSkin + ".png')");
            update();
          }, 500);
        }, 600);
      });
      setTimeout(function() {
        $("#loading").hide("clip", {
          duration: 1000,
          easing: 'swing'
        });
      }, 1000);
      break;
  }
  $("#panneau").stop(true, true).fadeOut("fast"); //disparaitre
  HoverPonton = true;
});

//----------------------------------

//voir la quete actuelle a partir du cookie
function voirquete() {
  var quete = getCookie('quete');
  if (quete != null) {
    quete = quete.split("_");
    $('#quete_map').css('background-size', 'cover');
    $('#quete_map').css('background-image', 'url("' + quete[1] + '")');
    $('#quete_nom').html(quete[0]);
    $('#quete_des').html(quete[2]);
  } else {
    $('#quete_map').css('background-image', 'url("Crescent Isle.png")');
    $('#quete_nom').html("Aucune Quête");
    $('#quete_des').html("Rendez-vous sur à Crescent Isle pour obtenir une quête !");
  }
  $('#quete').slideDown("slow");
}

//----------------------------------

//changer gold
function changerGold(num) {
  gold = parseInt(gold) + parseInt(num);
  $("#gold").html(gold + "<div id='piece'></div>");
}

//----------------------------------

//quete finie
function winQuete() {
  changerGold(getCookie('quete').split('_')[2].split(' ')[2]);
  $('#quete_map').css('background-image', 'url("coffre.png")');
  $('#quete_map').css('background-size', 'cover');
  $('#quete_nom').html("Quête accomplie !");
  $('#quete_des').html(getCookie('quete').split('_')[2] + "<br/><br/>Rendez-vous à Crescent Isle pour obtenir une nouvelle quête !");
  $('#quete').slideDown("slow");
}

//----------------------------------

//quete finie
function getTresor() {
  xTresor = Math.floor(Math.random() * 50);
  yTresor = Math.floor(Math.random() * 30);
  while ($('tr').eq(yTresor).find('td').eq(xTresor).hasClass('mer') == false) {
    xTresor = Math.floor(Math.random() * 50);
    yTresor = Math.floor(Math.random() * 30);
  }
  $('tr').eq(yTresor).find('td').eq(xTresor).css('background-color', 'red');
  $('#quete_map').css('background-image', 'url("coffre.png")');
  $('#quete_map').css('background-size', 'cover');
  $('#quete_nom').html("Trésor");
  $('#quete_des').html("<br/><br/>Trouver le trésor.<br/><br/>" + xTresor + ";" + yTresor);
  $('#quete').slideDown("slow");
}

//----------------------------------

//changer cible de la map  a la bonne place
function getCibleMap() {
  if (map == "map1" || map == "map5" || map == "map4") {
    $('#marque').css('top', (10 + 26.6 + (y * 0.89) + '%')); //10% de base + 26.6% pour milieu + f(y)
  } else if (map == "map6" || map == "map2" || map == "map9") {
    $('#marque').css('top', 10 + (y * 0.89) + '%'); //10% de base + f(y)
  } else if (map == "map8" || map == "map3" || map == "map7") {
    $('#marque').css('top', 10 + 53.2 + (y * 0.89) + '%'); //10% de base + 53.2% pour droite + f(y)
  }
  //x
  if (map == "map9" || map == "map4" || map == "map8") {
    $('#marque').css('left', 15 + (x * 0.47) + '%'); //15% de base + f(x)
  } else if (map == "map1" || map == "map2" || map == "map3") {
    $('#marque').css('left', 15 + 23.3 + (x * 0.47) + '%'); //15% de base + 23.3% pour milieu + f(x)
  } else if (map == "map7" || map == "map5" || map == "map6") {
    $('#marque').css('left', 15 + 46.6 + (x * 0.47) + '%'); //15% de base + 46.6% pour droite + f(x)
  }
}

//----------------------------------

//si on est ammaré, place le bateau a coté du ponton
function BateauPonton() {
  if ($('td[y="' + (yPonton - 1) + '"][x="' + xPonton + '"]').hasClass('mer')) {
    $('tr').eq(yPonton - 1).find('td').eq(xPonton).removeClass();
    $('tr').eq(yPonton - 1).find('td').eq(xPonton).addClass("ammaré");
    $('tr').eq(yPonton - 1).find('td').eq(xPonton).attr("user", user);
    $('tr').eq(yPonton - 1).find('td').eq(xPonton).css("background-image", "url('bateaux/bateauB_" + bateauSkin + ".png')");
  } else if ($('td[y="' + (yPonton + 1) + '"][x="' + xPonton + '"]').hasClass('mer')) {
    $('tr').eq(yPonton + 1).find('td').eq(xPonton).removeClass();
    $('tr').eq(yPonton + 1).find('td').eq(xPonton).addClass("ammaré");
    $('tr').eq(yPonton + 1).find('td').eq(xPonton).attr("user", user);
    $('tr').eq(yPonton + 1).find('td').eq(xPonton).css("background-image", "url('bateaux/bateauH_" + bateauSkin + ".png')");
  } else if ($('td[y="' + yPonton + '"][x="' + (xPonton - 1) + '"]').hasClass('mer')) {
    $('tr').eq(yPonton).find('td').eq(xPonton - 1).removeClass();
    $('tr').eq(yPonton).find('td').eq(xPonton - 1).addClass("ammaré");
    $('tr').eq(yPonton).find('td').eq(xPonton - 1).attr("user", user);
    $('tr').eq(yPonton - 1).find('td').eq(xPonton).html("");
    $('tr').eq(yPonton).find('td').eq(xPonton - 1).css("background-image", "url('bateaux/bateauD_" + bateauSkin + ".png')");
  } else if ($('td[y="' + yPonton + '"][x="' + (xPonton + 1) + '"]').hasClass('mer')) {
    $('tr').eq(yPonton).find('td').eq(xPonton + 1).removeClass();
    $('tr').eq(yPonton).find('td').eq(xPonton + 1).addClass("ammaré");
    $('tr').eq(yPonton).find('td').eq(xPonton + 1).attr("user", user);
    $('tr').eq(yPonton).find('td').eq(xPonton + 1).css("background-image", "url('bateaux/bateauG_" + bateauSkin + ".png')");
  }
  $('.ammaré').html("");
}

//----------------------------------

//Update la DB
function update() {
  $.post("position.php", {
    x: x,
    y: y,
    map: map,
    skin: bateauSkin,
    user: user,
    gold: gold
  });
}
