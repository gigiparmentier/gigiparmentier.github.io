var x, y; //player location
var ym1; //not sure?
var cell; //player cell
var ar0 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
var ar1 = [0, 9, 18];
var ar2 = [0, 2, 3, 5, 6, 7, 9, 11, 12, 13, 15, 16, 18];
var ar3 = [0, 18];
var ar4 = [0, 2, 3, 5, 7, 8, 9, 10, 11, 13, 15, 16, 18];
var ar5 = [0, 5, 9, 13, 18];
var ar6 = [0, 1, 2, 3, 5, 6, 7, 9, 11, 12, 13, 15, 16, 17, 18];
var ar7 = [3, 5, 13, 15];
var ar8 = [0, 1, 2, 3, 5, 7, 8, 10, 11, 13, 15, 16, 17, 18];
var ar9 = [7, 11];
var ar10 = [0, 1, 2, 3, 5, 7, 8, 9, 10, 11, 13, 15, 16, 17, 18];
var ar11 = [3, 5, 13, 15];
var ar12 = [0, 1, 2, 3, 5, 7, 8, 9, 10, 11, 13, 15, 16, 17, 18];
var ar13 = [0, 9, 18];
var ar14 = [0, 2, 3, 5, 6, 7, 9, 11, 12, 13, 18, 16, 15];
var ar15 = [0, 3, 15, 18];
var ar16 = [18, 15, 17, 3, 1, 0, 5, 7, 8, 9, 10, 11, 13];
var ar17 = [18, 13, 9, 0, 5];
var ar18 = [0, 18, 16, 13, 14, 15, 11, 12, 7, 6, 5, 3, 4, 2, 9];
var ar19 = [18, 0];
var ar20 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
var w = 19; //width of td
var h = 21; //height of td
var xp = 9; //player x spawn
var yp = 19; //player y spawn
var move; //interval for player movement
var inter = 300; //time of said interval
var wakka = new Audio('wakka.mp3'); //self explanatory
var yg1 = 7; //spawn x of 1st ghost
var xg1 = 9; //spawn y of 1st ghost
var xtar = 1; //x target of 1st ghost
var ytar = 1; //y target of 1st ghost
var intersection = 0; //variable for knowing if ghost is on n intersection or not
var moveg; //interval for ghost movement
var gxp1 = 999; //distance between target and x position of ghost +1
var gxm1 = 999; //distance between target and x position of ghost -1
var gyp1 = 999; //distance between target and y position of ghost +1
var gym1 = 999; //distance between target and y position of ghost -1
var corner = false;//if ghost in corner or not


function init() {
    //creer cases
    for (var i = 0; i < h; i++) {
        $('#jeu').append("<tr></tr>");
        for (var j = 0; j < w; j++) {
            $('#jeu').find('tr').eq(i).append("<td onclick='target(this)'></td>");
            $('#jeu').find('tr').eq(i).find('td').eq(j).attr('y', i).attr('x', j);
            y = $('#jeu').find('tr').eq(i).find('td').eq(j).attr('y');
            x = $('#jeu').find('tr').eq(i).find('td').eq(j).attr('x');
            ym1 = $('#jeu').find('tr').eq(i - 1).find('td').eq(j).attr('y');
            if (window["ar" + i].includes(parseInt(x))) {
                $('#jeu').find('tr').eq(i).find('td').eq(j).addClass('mur');
            }
            if (y == '9' && (x == '0')) {
                $('#jeu').find('tr').eq(i).find('td').eq(j).addClass('tp0');
            }
            if (y == '9' && (x == '18')) {
                $('#jeu').find('tr').eq(i).find('td').eq(j).addClass('tp18');
            }
        }
    }

    //bordures cases
    for (var i = 0; i < h; i++) {
        for (var j = 0; j < w; j++) {
            cell = $('#jeu').find('tr').eq(i).find('td').eq(j);
            ym1 = $('#jeu').find('tr').eq(i).next().find('td').eq(j);
            if (cell.next().hasClass('mur') && cell.hasClass('mur')) {
                cell.css('border-right', 'none');
                cell.next().css('border-left', 'none');
            }
            if (ym1.hasClass('mur') && cell.hasClass('mur')) {
                cell.css('border-bottom', 'none');
                ym1.css('border-top', 'none');
            }
        }
    }
    //spawn
    $("td[x=" + xp + "][y=" + yp + "]").toggleClass('pacR');
    $("td[x=" + xg1 + "][y=" + yg1 + "]").toggleClass('ghost1');
    $("td[x=" + xtar + "][y=" + ytar + "]").toggleClass('red');
    mouvementg(xtar,ytar,1, 0, 'ghost1');
}

function intersec() {
    intersection = 0;
    corner = false;
    if ($("td[x=" + (xg1 + 1) + "][y=" + yg1 + "]").hasClass('mur') == false) {
        intersection++;
    }
    if ($("td[x=" + (xg1 - 1) + "][y=" + yg1 + "]").hasClass('mur') == false) {
        intersection++;
    }
    if ($("td[x=" + xg1 + "][y=" + (yg1 + 1) + "]").hasClass('mur') == false) {
        intersection++;
    }
    if ($("td[x=" + xg1 + "][y=" + (yg1 - 1) + "]").hasClass('mur') == false) {
        intersection++;
    }
    if (intersection == 2){
        if (((($("td[x=" + (xg1 + 1) + "][y=" + yg1 + "]").hasClass('mur') == false)&&($("td[x=" + (xg1 - 1) + "][y=" + yg1 + "]").hasClass('mur') == true)) 
            || (($("td[x=" + (xg1 + 1) + "][y=" + yg1 + "]").hasClass('mur') == true)&&($("td[x=" + (xg1 - 1) + "][y=" + yg1 + "]").hasClass('mur') == false)))
           || ((($("td[x=" + xg1 + "][y=" + (yg1 + 1) + "]").hasClass('mur') == false)&&($("td[x=" + xg1 + "][y=" + (yg1 - 1) + "]").hasClass('mur') == true))
            || (($("td[x=" + xg1 + "][y=" + (yg1 + 1) + "]").hasClass('mur') == true)&&($("td[x=" + xg1 + "][y=" + (yg1 - 1) + "]").hasClass('mur') == false)))
           ) {
            corner = true;
        }
    }
}


function touche(key) {
    if (key == "ArrowRight") {
        mouvement(1, 0, 'pacR');
    }
    if (key == "ArrowLeft") {
        mouvement(-1, 0, 'pacL');
    }
    if (key == "ArrowUp") {
        mouvement(0, -1, 'pacU');
    }
    if (key == "ArrowDown") {
        mouvement(0, 1, 'pacD');
    }
}

function mouvementg(xt,yt,xx, yy, cl) {
    clearInterval(moveg);
    moveg = setInterval(function () {
        gxp1 = 999;
        gxm1 = 999;
        gyp1 = 999;
        gym1 = 999;
        intersec();
        if (intersection == 2 && corner == false) {
            if ($("td[x=" + (xg1 + xx) + "][y=" + (yg1 + yy) + "]").hasClass('tp0') == true) {
                $("td[x=" + xg1 + "][y=" + yg1 + "]").removeClass();
                xg1 = 17;
                $("td[x=" + xg1 + "][y=" + yg1 + "]").toggleClass(cl);
            } else if ($("td[x=" + (xg1 + xx) + "][y=" + (yg1 + yy) + "]").hasClass('tp18') == true) {
                $("td[x=" + xg1 + "][y=" + yg1 + "]").removeClass();
                xg1 = 1;
                $("td[x=" + xg1 + "][y=" + yg1 + "]").toggleClass(cl);
            } else if ($("td[x=" + (xg1 + xx) + "][y=" + (yg1 + yy) + "]").hasClass('mur') == false) {
                $("td[x=" + xg1 + "][y=" + yg1 + "]").removeClass();
                yg1 += yy;
                xg1 += xx;
                $("td[x=" + xg1 + "][y=" + yg1 + "]").toggleClass(cl);
            }
        }
        else {
            clearInterval(moveg);
            if ($("td[x=" + (xg1 + 1) + "][y=" + yg1 + "]").hasClass('mur') == false) {
                gxp1 = (Math.max(xt, (xg1 + 1)) - Math.min(xt, (xg1 + 1))) + (Math.max(yt, yg1) - Math.min(yt, yg1));
            }
            if ($("td[x=" + (xg1 - 1) + "][y=" + yg1 + "]").hasClass('mur') == false) {
                gxm1 = (Math.max(xt, (xg1 - 1)) - Math.min(xt, (xg1 - 1))) + (Math.max(yt, yg1) - Math.min(yt, yg1));
            }
            if ($("td[x=" + xg1 + "][y=" + (yg1 + 1) + "]").hasClass('mur') == false) {
                gyp1 = (Math.max(xt, xg1) - Math.min(xt, xg1)) + (Math.max(yt, (yg1 + 1)) - Math.min(yt, (yg1 + 1)));
            }
            if ($("td[x=" + xg1 + "][y=" + (yg1 - 1) + "]").hasClass('mur') == false) {
                gym1 = (Math.max(xt, xg1) - Math.min(xt, xg1)) + (Math.max(yt, (yg1 - 1)) - Math.min(yt, (yg1 - 1)));
            }
            if (Math.min(gxp1, gxm1, gyp1, gym1) == gxp1 && xx != -1) {
                $("td[x=" + xg1 + "][y=" + yg1 + "]").removeClass();
                $("td[x=" + (xg1 + 1) + "][y=" + yg1 + "]").toggleClass(cl);
                xg1 = xg1 + 1;
                yg1 = yg1;
                mouvementg(xt,yt,1, 0, cl);
                return;
            }
            if (Math.min(gxp1, gxm1, gyp1, gym1) == gxm1 && xx != 1) {
                $("td[x=" + xg1 + "][y=" + yg1 + "]").removeClass();
                $("td[x=" + (xg1 - 1) + "][y=" + yg1 + "]").toggleClass(cl);
                xg1 = xg1 - 1;
                yg1 = yg1;
                mouvementg(xt,yt,-1, 0, 'ghost1');
                return;
            }
            if (Math.min(gxp1, gxm1, gyp1, gym1) == gyp1 && yy != -1) {
                $("td[x=" + xg1 + "][y=" + yg1 + "]").removeClass();
                $("td[x=" + xg1 + "][y=" + (yg1 + 1) + "]").toggleClass(cl);
                xg1 = xg1;
                yg1 = yg1 + 1;
                mouvementg(xt,yt,0, 1, cl);
                return;
            }
            if (Math.min(gxp1, gxm1, gyp1, gym1) == gym1 && yy != 1) {
                $("td[x=" + xg1 + "][y=" + yg1 + "]").removeClass();
                $("td[x=" + xg1 + "][y=" + (yg1 - 1) + "]").toggleClass(cl);
                xg1 = xg1;
                yg1 = yg1 - 1;
                mouvementg(xt,yt,0, -1, cl);
                return;
            }
        }
    }, inter);
}

function target(el){
    $('.red').toggleClass('red');
    $(el).toggleClass('red');
    xtar = $(el).attr('x');
    ytar = $(el).attr('y');
    clearInterval(moveg);
    mouvementg(0,-1,'ghost1');
}

function mouvement(xx, yy, cl) {
    clearInterval(move);
    move = setInterval(function () {
        if ($("td[x=" + (xp + xx) + "][y=" + (yp + yy) + "]").hasClass('tp0') == true) {
            $("td[x=" + xp + "][y=" + yp + "]").removeClass();
            xp = 17;
            $("td[x=" + xp + "][y=" + yp + "]").toggleClass(cl);
        } else if ($("td[x=" + (xp + xx) + "][y=" + (yp + yy) + "]").hasClass('tp18') == true) {
            $("td[x=" + xp + "][y=" + yp + "]").removeClass();
            xp = 1;
            $("td[x=" + xp + "][y=" + yp + "]").toggleClass(cl);
        } else if ($("td[x=" + (xp + xx) + "][y=" + (yp + yy) + "]").hasClass('mur') == false) {
            $("td[x=" + xp + "][y=" + yp + "]").removeClass();
            yp += yy;
            xp += xx;
            $("td[x=" + xp + "][y=" + yp + "]").toggleClass(cl);
            wakka.loop = true;
            wakka.volume = 0.002;
            wakka.play();
        } else {
            $("td[x=" + xp + "][y=" + yp + "]").removeClass();
            clearInterval(move);
            wakka.pause();
            wakka.currentTime = 0;
            $("td[x=" + xp + "][y=" + yp + "]").toggleClass(cl);
        }
    }, inter);
}

document.addEventListener('keydown', function (event) {
    var key = event.key;
    touche(key);
});

window.onload = init();

//FAIRE DU LOCAL SI TU SAIS PAS CODER(noob noob)