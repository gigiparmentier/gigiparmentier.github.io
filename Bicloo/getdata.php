<?php
// Method: POST, PUT, GET etc
// Data: array("param" => "value") ==> index.php?param=value

$array = array("contract" => "Nantes",
              "apiKey" => "9cfd194a4f758ac9d8899eb27835b6a0c1bbee53")

CallAPI("GET","https://api.jcdecaux.com/vls/v1/stations",$array)

function CallAPI($method, $url, $data = false)
{
    $curl = curl_init();

    if ($data)
      $url = sprintf("%s?%s", $url, http_build_query($data));

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($curl);

    curl_close($curl);

    return $result;
}
?>
