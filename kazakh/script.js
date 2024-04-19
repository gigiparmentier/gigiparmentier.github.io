var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

var words_list = [];
var shuffled_list = [];
var guess_index = 0;
var alphabet = ["а","ә","б","в","г","ғ","д","е","ж","з","и","й","к","қ","л","м","н","ң","о","ө","п","р","с","т","у","ұ","ү","ф","х","һ","ц","ч","ш","щ","ы","і","э","ю","я"];
var nbs = ["нөл","бір","екі","үш","төрт","бес","алты","жеті","сегіз","тоғыз","он","жиырма","отыз","қырық","елу","алпыс","жетпіс","сексен","тоқсан","жүз"];
var letter_duration = new Array(alphabet.length).fill(0);
var correct_guesses = 0;
var total_guesses = 0;

var colors = [['#7db1db','#5092c8'],['#f2e269','#cba000'],['#e8766d','#d7544a'],['#c499e0','#a463ce']];
var titles = [
    '<i class="fa-solid fa-sun"></i>   My kazakh words   <i class="fa-solid fa-sun"></i>',
    '<i class="star"></i>   My russian words   <i class="star"></i>',
    '<i class="baguette"></i>   My french words   <i class="baguette"></i>',
    '<i class="flower"></i>   My korean words   <i class="flower"></i>'
];

var lang = 0;
var url_lang = getUrlParameter('lang');
if (url_lang == 'ru'){
    lang = 1;
}
else if (url_lang == 'fr'){
    lang = 2;
}
else if (url_lang == 'kr'){
    lang = 3;
}

$(document).ready(function(){
    //Change theme color depending on the language
    document.documentElement.style.setProperty("--primary-color", colors[lang][0]);
    document.documentElement.style.setProperty("--secondary-color", colors[lang][1]);
    $('#wave_top path').attr('style','stroke: none;fill: '+colors[lang][0]+';');
    $('#wave_bottom path').attr('style','stroke: none;fill: '+colors[lang][0]+';');
    $('#title').html(titles[lang]);
    //Get word list and populate words section
    var url = "https://gigiparmentier.github.io/kazakh/words.txt";
    $.get({url: url,cache: false}).then(function(data) {
        var lines = data.split("\n").reverse();
        var wordsDiv = $("#words");

        $('#search_bar').attr('placeholder', 'Search in ' + lines.length + ' words');
        $('#search_bar').val('');

        lines.forEach(function(line) {
            var parts = line.split(":");
            var type    = parts[0].trim();
            var k_words = parts[1].trim();
            var e_words = parts[2].trim();
            var f_words = parts[3].trim();
            var r_words = parts[4].trim();
            var ko_words = parts[5].trim();
            var e_words_display = e_words;
            if (type == 'v'){
                var len = e_words.split(",").length;
                for (var i = 0; i < len; i++){
                    var e_word = e_words.split(",")[i];
                    e_words_display = "to " + e_word;
                }
            }
            words_list.push({type:type, k_words: k_words, e_words: e_words, f_words: f_words, r_words: r_words, ko_words: ko_words});
            k_words = k_words.replace(/,/g,", ");
            e_words = e_words.replace(/,/g,", ");
            f_words = f_words.replace(/,/g,", ");
            r_words = r_words.replace(/,/g,", ");
            ko_words = ko_words.replace(/,/g,", ");
            
            all_words = [k_words,r_words,f_words,ko_words];
            var wordElement = $("<p>").text(all_words[lang] + ' : ' + e_words_display);
            wordElement.attr('type'   , type   );
            wordElement.attr('k_words', k_words);
            wordElement.attr('e_words', e_words);
            wordElement.attr('f_words', f_words);
            wordElement.attr('r_words', r_words);
            wordElement.attr('ko_words', ko_words);
            wordElement.addClass("word");
            wordElement.on("click", play_word_sound);

            wordsDiv.append(wordElement);
        });
        shuffled_list = shuffleArray(words_list);
        
        start_game();
    });

    //Populate alphabet section
    for (var i = 0; i < alphabet.length; i++) {
        var letter = $("<p>").text(alphabet[i]);
        letter.addClass("letter");
        letter.on("click", play_letter_sound);
        $("#letters_div").append(letter);
        var url = 'https://gigiparmentier.github.io/kazakh/word_sounds/' + alphabet[i] + '.mp3';
        var audio = new Audio(url);
        get_audio_duration(audio,i);
        audio.src = url;
    }

    //Populate number section
    for (var i = 0; i < 20;i++){
        var nb = i;
        if (i > 10){
            nb = (i - 10)*10+10;
        }

        var number = $("<div>");
        number.addClass("number");
        var number_p = $("<p>").text(nb);
        number.append(number_p);
        var number_p = $("<p>").text(nbs[i]);
        number.append(number_p);
        $("#numbers_div").append(number);
    }
});

function get_audio_duration(audio,i){
    $(audio).on("loadedmetadata", function(){
        letter_duration[i] = audio.duration;
    });
}

//Search bar behaviour
$("#search_bar").on("input", function() {
    var searchValue = $(this).val().toLowerCase();
    $(".word").each(function() {
        var type = $(this).attr("type");
        var kWords = $(this).attr("k_words").toLowerCase();
        var eWords = $(this).attr("e_words").toLowerCase();
        var fWords = $(this).attr("f_words").toLowerCase();
        var rWords = $(this).attr("r_words").toLowerCase();
        var koWords = $(this).attr("ko_words").toLowerCase();
        if (type == 'v'){
            var len = eWords.split(",").length;
            for (var i = 0; i < len; i++){
                var eWord = eWords.split(",")[i];
                eWords = eWords + "," + "to " + eWord;
            }
        }
        if (kWords.includes(searchValue) || eWords.includes(searchValue) || fWords.includes(searchValue)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
});

//Guess input behaviour
$('#guess_input').on('keypress', function(e) {
    if(e.which != 13) {
        return;
    }
    var guess = $(this).val().toLowerCase();
    var e_words = $('#guess_word').attr('e_words').toLowerCase().split(",");
    var e_words_possible = e_words.slice();
    if ($('#guess_word').attr('type') == 'v'){
        var len = e_words.length;
        for (var i = 0; i < len; i++){
            var e_word = e_words[i];
            e_words_possible.push('to ' + e_word);
            e_words[i] = 'to ' + e_word;
        }
    }
    
    guess = guess.replace("?", "");
    e_words_possible = e_words_possible.map(word => word.replace("?", ""));

    $('#guess_result').css('opacity',1);
    var time = 500;
    if ((e_words_possible.includes(guess))){
        $("#guess_result").text("Correct!");
        correct_guesses++;
    } else {
        if (guess.length == 0) {
            $("#guess_result").text("It was " + e_words);
        }
        else{
            $("#guess_result").text("Nope, it was " + e_words);
        }
        time = 1500;
    }

    guess_index++;
    total_guesses++;
    update_progress_bar();
    start_game();
    setTimeout(function() {
        $('#guess_result').animate({ opacity: 0 });
    }, time);
});

function update_progress_bar() {
    var progress = correct_guesses / words_list.length * 100;
    var progress_total = total_guesses / words_list.length * 100;
    var good_guesses = correct_guesses / total_guesses * 100;
    $("#progress_div .progress").css("width", progress + "%");
    $("#progress_div .progress_total").css("width", progress_total + "%");
    $("#progress_div p").text(correct_guesses + " / " + total_guesses + " (" + good_guesses.toFixed(0) + "%)");
    $('#progress_div p').css('left', progress + '%');
    $('#progress_div p').css('opacity', 1);
    $('#progress_div').css('opacity', 1);
}

function play_audio_index(url,time){
    setTimeout(function() {
        var audio = new Audio(url);
        audio.play();
    }, time * 1000);
}

function play_word_sound(){
    var letters = $(this).attr('k_words').split("");
    var total_duration = 0;
    for (var i = 0; i < letters.length; i++) {
        if (letters[i] == " ") {
            total_duration += 0.25;
            continue;
        }
        else if (alphabet.indexOf(letters[i].toLowerCase()) == -1) {
            continue;
        }
        var letter = letters[i].toLowerCase();
        var url = 'https://gigiparmentier.github.io/kazakh/word_sounds/' + letter + '.mp3';
        var audio = new Audio(url);
        audio.src = url;
        play_audio_index(url,total_duration);
        total_duration += letter_duration[alphabet.indexOf(letter)];
    }
}

function play_letter_sound(){
    var audio = new Audio('https://gigiparmentier.github.io/kazakh/sounds/' + $(this).html() + '.mp3');
    audio.play();
}

function start_game() {
    if (guess_index >= words_list.length) {
        return;
    }
    var word = shuffled_list[guess_index];
    var words = [word.k_words,word.r_words,word.f_words,word.ko_words];
    $("#guess_word p").text(words[lang]);
    $('#guess_word').attr('type', word.type);
    $('#guess_word').attr('k_words', word.k_words);
    $('#guess_word').attr('e_words', word.e_words);
    $('#guess_word').attr('f_words', word.f_words);
    $('#guess_word').attr('r_words', word.r_words);
    $('#guess_word').attr('ko_words', word.ko_words);
    var col = $('.word[k_words="' + word.k_words + '"]').css('background-color');
    $("#guess_word").css("background-color", col);
    $("#guess_input").val("");
}

function shuffleArray(array) {
    var newArray = array.slice();
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}