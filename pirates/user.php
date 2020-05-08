<?php
$text = $_POST['text'] . "\n";
$open = fopen ( "users.txt", "a" );
fwrite ( $open , $text );
fclose ( $open );
?>
