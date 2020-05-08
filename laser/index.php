<?php
$hash = "b938b141c59812aa5c0dbe6ee7327bb4aa4a1bd2dd6a1cd87c2de9ea732a7dae";
$password = htmlspecialchars($_GET['password']);
$data = file_get_contents('php://input');
if (hash('sha256', $password) == $hash){
    $file = fopen('reservs.json', 'w');
    fwrite($file, $data);
    fclose($file);
    $data = json_decode($data);
    echo $data;
}
else{
  echo hash('sha256', $password);
}
?>
