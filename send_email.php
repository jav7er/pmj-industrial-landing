<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Obtener datos del formulario
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

$nombre = strip_tags($input['nombre']);
$empresa = strip_tags($input['empresa']);
$producto = strip_tags($input['producto']);
$mercado = strip_tags($input['mercado']);
$volumen = strip_tags($input['volumen']);
$email = strip_tags($input['email']);
$mensaje = strip_tags($input['mensaje']);

// Configuración de Zeptomail
$url = "https://api.zeptomail.com/v1.1/email";
$apiKey = "Zoho-enczapikey wSsVR613rBOlC6h5nDL+crsxyggDBQv3ERh10FCnunavS6qQ/cdvkhWdAASkSqdOFWNhFzQVp7wsmU8F12IK3N0onF9UXSiF9mqRe1U4J3x17qnvhDzJXWpZmxGNK4sPwARrmWliEs8l+g==";

$htmlBody = "
<h2>Nuevo prospecto de PMJ Industrial</h2>
<p><b>Nombre:</b> {$nombre}</p>
<p><b>Empresa:</b> {$empresa}</p>
<p><b>Producto de interés:</b> {$producto}</p>
<p><b>Industria/Mercado:</b> {$mercado}</p>
<p><b>Volumen estimado:</b> {$volumen}</p>
<p><b>Email corporativo:</b> {$email}</p>
<p><b>Mensaje:</b><br>{$mensaje}</p>
";

$data = [
    "from" => ["address" => "noreply@newemage.com.mx"],
    "to" => [
        ["email_address" => ["address" => "jcarrasco@newemage.com", "name" => "Javier"]]
    ],
    "subject" => "Nuevo Lead PMJ: " . $empresa,
    "htmlbody" => $htmlBody
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Accept: application/json",
    "Content-Type: application/json",
    "Authorization: $apiKey"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode >= 200 && $httpCode < 300) {
    echo json_encode(['success' => true]);
} else {
    http_response_code($httpCode);
    echo json_encode(['error' => 'Error al enviar el correo', 'details' => json_decode($response)]);
}
