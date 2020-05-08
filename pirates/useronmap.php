<?php
$names = array();
$x = array();
$y = array();
$skin = array();
$map = $_REQUEST["map"];
$data = array();

$servername = "gigiparmdwrlitem.mysql.db";
$SQLusername = "gigiparmdwrlitem";
$password = "WiiHTML3";
$dbname = "gigiparmdwrlitem";

// Create connection
$conn = new mysqli($servername, $SQLusername, $password, $dbname);

$user = $conn->real_escape_string($user);
$map = $conn->real_escape_string($map);
$check = "SELECT * FROM Pirates WHERE map = '$map'";
$result = $conn->query($check);
if (!$result) {
    die('Query failed to execute for some reason' . $conn->error);
}
if ($result->num_rows > 0) {
  while($row = mysqli_fetch_assoc($result)) {
    array_push($names,$row['username']);
    array_push($x,$row['x']);
    array_push($y,$row['y']);
    array_push($skin,$row['skin']);
  }
  $data['names'] = $names;
  $data['x'] = $x;
  $data['y'] = $y;
  $data['skin'] = $skin;
  echo json_encode($data);
}
else{
  echo $map;
}
?>
