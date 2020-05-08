function load_grid() {
  unprompt_word();
  $.ajax({
    type: 'GET',
    url: 'empty_data.php'
  });
  last_word = "";
  last_letter = "";
  create_grid();
  grid_number = $('#number_grid').val();
  max_width = 0;
  max_height = 0;
  var request = new XMLHttpRequest();
  request.open("GET", 'grids/' + grid_number + '.grid', false);
  request.send(null);
  grid_content = JSON.parse(request.responseText);
  words = grid_content['words'];
  if (grid_content['theme'] != grid_content['theme'].toUpperCase()) {
    $('h2').html(grid_content['theme']);
  } else {
    $('h2').html('');
  }
  letters = grid_content['letters'];
  for (var i = 0; i < words.length; i++) {
    word = Object.values(words[i]);
    wordentries = Object.keys(words[i]);
    word_values = [];
    for (var j = 0; j < word.length; j++) {
      word_values[wordentries[j]] = word[j];
    }
    if (word_values['direction'] == 'V') {
      place_cases(word_values['col'], word_values['line'], word_values['mot'], word_values['def1'], 'V');
      word_width = parseInt(word_values['col']);
      word_height = parseInt(word_values['line']) + word_values['mot'].length;
    } else {
      place_cases(word_values['col'], word_values['line'], word_values['mot'], word_values['def1'], 'H');
      word_width = parseInt(word_values['col']) + word_values['mot'].length;
      word_height = parseInt(word_values['line']);
    }
    if (word_width > max_width) {
      max_width = word_width;
    }
    if (word_height > max_height) {
      max_height = word_height;
    }
  }
  reduce_grid(max_width, max_height);
  $('.start_word').click(function() {
    if (!$(this).hasClass('case_pleine')) {
      current_word = $(this);
      prompt_word($(this));
    }
  });
  var audio = new Audio('audio/apparitionGrilleM1M2.mp3');
  audio.volume = 0.3;
  audio.play();
  $('#grille').fadeIn(2000);
  ready_state = true;
}

function place_cases(col, line, mot, def, type) {
  if (type == 'V') {
    line = parseInt(line) - 1;
  } else {
    col = parseInt(col) - 1;
  }
  $('td[x=' + col + '][y=' + line + ']').addClass('start_word');
  if ($('td[x=' + col + '][y=' + line + '][def]').length > 0) {
    $('td[x=' + col + '][y=' + line + ']').attr('def2', def);
  } else {
    $('td[x=' + col + '][y=' + line + ']').attr('def', def);
  }
  if ($('td[x=' + col + '][y=' + line + '][word]').length > 0) {
    $('td[x=' + col + '][y=' + line + ']').attr('word2', mot);
  } else {
    $('td[x=' + col + '][y=' + line + ']').attr('word', mot.toLowerCase());
  }
  if ($('td[x=' + col + '][y=' + line + '][direction]').length > 0) {
    $('td[x=' + col + '][y=' + line + ']').attr('direction2', type);
  } else {
    $('td[x=' + col + '][y=' + line + ']').attr('direction', type);
  }
  if (type == 'V') {
    line = parseInt(line) + 1;
  } else {
    col = parseInt(col) + 1;
  }
  for (var i = 0; i < mot.length; i++) {
    $('td[x=' + col + '][y=' + line + ']').attr('letter', mot.charAt(i));
    $('td[x=' + col + '][y=' + line + ']').attr('empty', 'false');
    if (type == 'V') {
      line = parseInt(line) + 1;
    } else {
      col = parseInt(col) + 1;
    }
  }
}

function place_word(col, line, mot, type) {
  last_word = mot;
  $('td[x=' + col + '][y=' + line + ']').attr('def', $('td[x=' + col + '][y=' + line + ']').attr('def2'));
  $('td[x=' + col + '][y=' + line + ']').attr('word', $('td[x=' + col + '][y=' + line + ']').attr('word2'));
  $('td[x=' + col + '][y=' + line + ']').attr('direction', $('td[x=' + col + '][y=' + line + ']').attr('direction2'));
  $('td[x=' + col + '][y=' + line + ']').removeAttr('def2');
  $('td[x=' + col + '][y=' + line + ']').removeAttr('word2');
  $('td[x=' + col + '][y=' + line + ']').removeAttr('direction2');
  $('td[x=' + col + '][y=' + line + ']').removeClass('start_word');
  $('td[x=' + col + '][y=' + line + ']').prop("onclick", null).off("click");
  if (type == 'V') {
    line = parseInt(line) + 1;
  } else {
    col = parseInt(col) + 1;
  }
  for (var i = 0; i < mot.length; i++) {
    $('td[x=' + col + '][y=' + line + ']').html(mot.charAt(i).toUpperCase());
    $('td[x=' + col + '][y=' + line + ']').addClass('case_pleine');
    if (type == 'V') {
      line = parseInt(line) + 1;
    } else {
      col = parseInt(col) + 1;
    }
    var index_letter = letters.indexOf(mot.charAt(i).toUpperCase());
    if (index_letter !== -1) {
      letters.splice(index_letter, 1);
    }
    letters = letters.unique();
  }
  $.ajax({
    type: 'POST',
    url: 'push_word.php',
    data: {
      user: user,
      word: mot,
      letter: last_letter
    }
  });
}

function place_word_online(mot) {
  unprompt_word();
  last_word = mot;
  case_word = $('td[word=' + mot.toLowerCase() + ']');
  case_word.attr('def', case_word.attr('def2'));
  case_word.attr('word', case_word.attr('word2'));
  case_word.attr('direction', case_word.attr('direction2'));
  case_word.removeAttr('def2');
  case_word.removeAttr('word2');
  case_word.removeAttr('direction2');
  case_word.removeClass('start_word');
  case_word.prop("onclick", null).off("click");
  type = case_word.attr('direction');
  col = case_word.attr('x');
  line = case_word.attr('y');
  if (type == 'V') {
    line = parseInt(line) + 1;
  } else {
    col = parseInt(col) + 1;
  }
  for (var i = 0; i < mot.length; i++) {
    $('td[x=' + col + '][y=' + line + ']').html(mot.charAt(i).toUpperCase());
    $('td[x=' + col + '][y=' + line + ']').addClass('case_pleine');
    if (type == 'V') {
      line = parseInt(line) + 1;
    } else {
      col = parseInt(col) + 1;
    }
    var index_letter = letters.indexOf(mot.charAt(i).toUpperCase());
    if (index_letter !== -1) {
      letters.splice(index_letter, 1);
    }
    letters = letters.unique();
  }
}

function reduce_grid(width, height) {
  to_remove = $('td').filter(function() {
    return $(this).attr("x") >= width;
  });
  to_remove.remove();
  to_remove = $('td').filter(function() {
    return $(this).attr("y") >= height;
  });
  to_remove.remove();
}

function ask_word() {
  el = current_word;
  if (el.attr('direction') == 'V') {
    direction = 'Vertical : ';
  } else {
    direction = 'Horizontal : ';
  }
  var answer = $('#prompt').val();
  if (answer.replace('é', 'e').replace('è', 'e').toLowerCase() == el.attr('word').toLowerCase()) {
    if (el.attr('direction') == 'V') {
      place_word(el.attr('x'), el.attr('y'), el.attr('word'), 'V');
    } else {
      place_word(el.attr('x'), el.attr('y'), el.attr('word'), 'H');
    }
    var audio = new Audio('audio/motTrouve.mp3');
    audio.volume = 0.3;
    audio.play();
    check_grid();
  } else {
    var audio = new Audio('audio/motPerdu.mp3');
    audio.volume = 0.3;
    audio.play();
    alert('Mauvaise réponse !');
  }
  unprompt_word();
}

function prompt_word(el) {
  $('#word_def').html(el.attr('def'));
  $('#word_def').fadeIn();
  $('#prompt_button').fadeIn();
  $('#prompt').fadeIn();
  $('#prompt').focus();
}

function unprompt_word() {
  $('#prompt_button').fadeOut();
  $('#prompt').fadeOut();
  $('#word_def').fadeOut();
  $('#prompt').val('');
}

function check_grid() {
  if ($('td[empty=false]:empty').length == '0') {
    var audio = new Audio('audio/grilleTerminee.mp3');
    audio.volume = 0.3;
    audio.play();
    alert('Grille terminée !');
    $('#number_grid').val(parseInt($('#number_grid').val()) + 1);
    $(grille).empty();
    load_grid();
  }
}

function random_letter() {
  selected_letter = letters[0];
  letters = letters.filter(element => ![selected_letter].includes(element)); //virer toutes les lettes pareilles que celle tirée
  return selected_letter;
}

function place_letter(letter) {
  $.ajax({
    type: 'POST',
    url: 'push_letter.php',
    data: {
      letter: letter
    }
  });
}

function place_letter_online(letter) {
  letters = letters.filter(element => ![letter].includes(element)); //virer toutes les lettes pareilles que celle tirée
  last_letter = letter;
  $('td[word]').each(function() {
    indices = getIndicesOf(letter.toLowerCase(), $(this).attr('word').toLowerCase());
    if (indices.length > 0) {
      word_start_x = parseInt($(this).attr('x'));
      word_start_y = parseInt($(this).attr('y'));
      for (var index in indices) {
        index = parseInt(indices[index]) + 1;
        if ($(this).attr('direction') == 'V') {
          letter_x = word_start_x;
          letter_y = word_start_y + index;
        } else {
          letter_x = word_start_x + index;
          letter_y = word_start_y;
        }
        if (!$('td[x=' + letter_x + '][y=' + letter_y + ']').hasClass('start_word')) {
          $('td[x=' + letter_x + '][y=' + letter_y + ']').addClass('case_pleine');
        }
        $('td[x=' + letter_x + '][y=' + letter_y + ']').html(letter.toUpperCase());
      }
    }
  });
}

function getIndicesOf(searchStr, str, caseSensitive) {
  var searchStrLen = searchStr.length;
  if (searchStrLen == 0) {
    return [];
  }
  var startIndex = 0,
    index, indices = [];
  if (!caseSensitive) {
    str = str.toLowerCase();
    searchStr = searchStr.toLowerCase();
  }
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
}

Array.prototype.unique = function() {
  return Array.from(new Set(this));
}

function enter_game() {
  $('#userdiv').fadeOut(600);
  user = document.getElementById('user').value;
  var player_score = document.createElement('p');
  player_score.setAttribute('user', user);
  player_score.innerHTML = user + ' : 0';
  document.getElementById('scoreboard').appendChild(player_score);
}

window.setInterval(function() {
  if (ready_state) {
    $.ajax({
      type: 'POST',
      cache: false,
      url: 'last_found_word.txt',
      data: {
        last_word: last_word
      },
      complete: function(data) {
        if (data != last_word){
          username = data.responseText.split('/')[0];
          word = data.responseText.split('/')[1];
          letter = data.responseText.split('/')[2];
          if (username != "" && username != user && word != last_word) {
            var audio = new Audio('audio/motTrouve.mp3');
            audio.volume = 0.3;
            audio.play();
            alert(username + " a trouvé le mot " + word);
            place_word_online(word);
            check_grid();
          }
          if (data.responseText != '' && letter != last_letter) {
            place_letter_online(letter);
          }
        }
      },
    });
  }
}, 1000);
