<?php

error_reporting(0);

// Данные формы
$name = $_POST['clientName'];
$mail = $_POST['clientMail'];
$request = $_POST['clientRequest'];

if (empty($name)) {
	echo 'Заполните имя';
} else if (empty($mail)) {
	echo 'Заполните почту';
} else {
	$date = date("d.m.Y");
	$time = date("h:i");

	// Данные для почты
	$to = 'info@itvectura.com';
	$from = "From: Заявка с сайта IT VECTURA\n\r";
	$page = 'i1 Consulting';
	$theme = 'Заявка с сайта itvectura.com';
	$headers = "Content-type: text/html; charset=utf-8\r\n";
	$headers .= $from;
	$message = '
	<html>
		<body>
			<center>	
				<table border=1 cellpadding=6 cellspacing=0 width=350 bordercolor="#01426A">
	 			<tr>
					<td colspan=2 align=center bgcolor="#E9F0F6">
						<b>Пользовательская информация</b>
					</td>
				</tr>
	 			<tr>
					<td><b>С сайта</b></td>
					<td>' . $page . '</td>
	 			</tr>
	 			<tr>
					<td><b>E-mail</b></td>
					<td><a href="mailto:' . $mail . '">' . $mail . '</a></td>
	 			</tr>
	 			<tr>
					<td><b>Имя</b></td>
					<td>' . $name . '</td>
	 			</tr>
	 			<tr>
					<td><b>Вопрос</b></td>
					<td>' . $request . '</td>
	 			</tr>
	 			<tr>
	 				<td><b>Дата</b></td>
	 				<td>' . $date . '</td>
				</tr>	
				<tr>
					<td><b>Время</b></td>
					<td>' . $time . '</td>
				</tr>
				<tr>
					<td><b>Версия сайта</b></td>
					<td> Русская </td>
				</tr>
				</table>
			</center>	
		</body>
	</html>';

	// Данные для телеграмма
	$token = "5612776289:AAG8VWNl8E8zB1MMOLE6Nxg_LAy91-MaHB4";
	$chat_id = "-813127054";
	$siteName = 'IT VECTURA';
	$langVersion = 'Русская';
	$arr = array(
		'С сайта: ' => $siteName,
		'Дата: ' => $date,
		'Время: ' => $time,
		'Имя: ' => $name,
		'E-mail: ' => $mail,
		'Вопрос: ' => $request,
		'Версия сайта: ' => $langVersion
	);
	foreach ($arr as $key => $value) {
		$txt .= "<b>" . $key . "</b>" . $value . "%0A";
	};

	// Отправка на почту
	$sendToMail = mail($to, $theme, $message, $headers);

	// Отправка в телеграмм
	$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}", "r");

	// Обработка ошибок
	if (!$sendToMail || !$sendToTelegram) {
		echo 'Ошибка сервера';
	} else {
		echo 'Заявка отправлена';
	}
}
