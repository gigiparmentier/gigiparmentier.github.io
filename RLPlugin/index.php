<?php
  $position = strval($_GET['X']) . ',' . strval($_GET['Y']) . ',' . strval($_GET['Z']) . ',' . strval($_GET['Pitch']) . ',' . strval($_GET['Yaw']) . ',' . strval($_GET['Roll']) . ';' . strval($_GET['bx']) . ',' . strval($_GET['by']) . ',' strval($_GET['bz']);
  $file = fopen('positions.txt', 'w');
  fwrite($file, $position);
  fclose($file);
  echo $position;
?>
