<?php
$map = '';
$nom = '';
$des = '';
$data= array();
$files = scandir("./quetes");
unset($files[0]);
unset($files[1]);
$randomFile = array_rand($files,1);
$map = "quetes/$files[$randomFile]";
$nom = $files[$randomFile];
$nom = str_replace(".png", "", $nom);
$des = "Récompense : " . rand(50, 120) . "<div id='piece'></div>";
$data['map'] = $map;
$data['nom'] = $nom;
$data['description'] = $des;
$data['files'] = $files;
echo json_encode($data);
?>
