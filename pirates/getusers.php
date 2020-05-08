<?php
$user = $_REQUEST["user"];
$data= array();

$servername = "gigiparmdwrlitem.mysql.db";
$SQLusername = "gigiparmdwrlitem";
$password = "WiiHTML3";
$dbname = "gigiparmdwrlitem";

// Create connection
$conn = new mysqli($servername, $SQLusername, $password, $dbname);

$user = $conn->real_escape_string($user);
$check = "SELECT * FROM Pirates WHERE username = '$user'";
$result = $conn->query($check);
if (!$result) {
    die('Query failed to execute for some reason' . $conn->error);
}
if ($result->num_rows > 0) {
  while($row = mysqli_fetch_assoc($result)) {
      $data['result'] = TRUE;
      $data['x'] = $row['x'];
      $data['y'] = $row['y'];
      $data['map'] = $row['map'];
      $data['skin'] = $row['skin'];
      $data['gold'] = $row['gold'];
      echo json_encode($data);
    }
}
else{
  $sql = "INSERT INTO Pirates (username,x,y,map,skin,gold) VALUES ('$user',5,5,'map1','rouge',0)";
  if ($conn->query($sql) === TRUE) {
      $data['result'] = FALSE;
      $data['x'] = 5;
      $data['y'] = 5;
      $data['map'] = 'map1';
      $data['skin'] = 'rouge';
      $data['gold'] = 0;
      echo json_encode($data);
    }
    else {
      die("Error creating row: " . $conn->error);
  }
}
$conn->close();
?>
