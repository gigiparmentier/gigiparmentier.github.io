<?php
$map = $_POST['map'];
$x = $_POST['x'];
$y = $_POST['y'];
$skin = $_POST['skin'];
$user = $_POST['user'];
$gold = $_POST['gold'];

$servername = "gigiparmdwrlitem.mysql.db";
$SQLusername = "gigiparmdwrlitem";
$password = "WiiHTML3";
$dbname = "gigiparmdwrlitem";

// Create connection
$conn = new mysqli($servername, $SQLusername, $password, $dbname);

$user = $conn->real_escape_string($user);
$x = $conn->real_escape_string($x);
$y = $conn->real_escape_string($y);
$map = $conn->real_escape_string($map);
$skin = $conn->real_escape_string($skin);
$gold = $conn->real_escape_string($gold);
$check = "UPDATE Pirates SET x='$x', y='$y', map='$map',skin='$skin',gold='$gold' WHERE username='$user'";
if ($conn->query($check) === TRUE) {
    echo "Record updated successfully";
} else {
    echo "Error updating record: " . $conn->error;
}
$conn->close();
?>
