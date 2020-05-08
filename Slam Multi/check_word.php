<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
$file = 'last_found_word.txt';
$last_word = $_POST['last_word'];

$file_content = file_get_contents($file);
if ($file_content != $last_word){
  print($file_content);
}
 ?>
