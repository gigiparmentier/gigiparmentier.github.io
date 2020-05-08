<?php
  $json = $_POST['json'];
  $ranks = file_get_contents('ranks.json');
  file_put_contents('ranks.json', $json);
  echo $ranks;
?>
