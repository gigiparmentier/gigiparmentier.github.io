<?php
$high = $_POST['score'];
//print($score);
//$high = "tristan*1";
$ex = explode("*",$high);
$newAuthor = $ex[0];
$newScore = $ex[1];
$file = file_get_contents('score.txt');
$records = explode(";", $file);
$txt = "";
date_default_timezone_set('Europe/Paris');
$date = date('d/m/y H:i:s');
print($date);
$added = false;
foreach($records as $record) {
  $pieces = explode("*",$record);
  $author = $pieces[0];
  $score = $pieces[1];
  if ($author == $newAuthor){
    if (intval($score) < intval($newScore)){
      $txt = $txt . $high . ";";
      $added = true;
    }
    else{
      $txt = $txt . $record . ";";
      $added = true;
    }
  }
  else{
    $txt = $txt . $record . ";";
  }
}
if ($added == false){
  $txt = $txt . $high . ";";
}
print("\n");
print($txt);
//file_put_contents('score.txt', $txt);
?>
