<?php
$text = $_POST['text'];
$map = $_POST['map'];
$open = fopen ( "maps/$map.txt", "w" );
fwrite ( $open , $text );
fclose ( $open );
?>
