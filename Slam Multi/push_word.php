<?php
  $mot = $_POST["word"];
  $user = $_POST["user"];
  $letter = $_POST["letter"];
  $file = 'last_found_word.txt';

  $content = $user . '/' . $mot . '/' . $letter;
  file_put_contents($file, $content);
 ?>
