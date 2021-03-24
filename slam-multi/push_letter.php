<?php
  $letter = $_POST['letter'];
  $file = 'last_found_word.txt';

  $content = file_get_contents($file);
  $contents = explode('/',$content);
  $content = $contents[0] . '/' . $contents[1] . '/' . $letter;
  file_put_contents($file, $content);
 ?>
