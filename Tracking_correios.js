var httprequest = false;
// var url = "http://gc.vialink.com.br/scripts/widget_correios_proxy.php?encomenda=SS123456789BR";
var url = "http://gc.vialink.com.br/scripts/widget_correios_proxy.php?encomenda=";
var gMyScrollArea, gMyScrollbar;

function setup() {
	document.getElementById("donePrefsButton").display = "none";
	gMyScrollbar = new AppleVerticalScrollbar(document.getElementById("myScrollbar"));
	gMyScrollArea = new AppleScrollArea(document.getElementById("myScrollArea"));
	gMyScrollArea.addScrollbar(gMyScrollbar);
}

function ajaxInit() {
	document.getElementById("front").style.backgroundImage = "url(Default_busca.png)";
	document.getElementById("myScrollbar").style.display = "block";
	document.getElementById("tracking").innerHTML = "A pesquisa pode demorar alguns segundos.<br />Aguarde...";
	http_request = new XMLHttpRequest();
	http_request.overrideMimeType("text/html");
	http_request.onreadystatechange = montaTracking;
	searchStr = url + document.getElementById("txtEncomenda").value;
	http_request.open("GET", searchStr, true);
	http_request.send(null);
}
	
function montaTracking()  {
	switch (http_request.readyState) {
		case 1:
			document.getElementById("tracking").innerHTML = "A pesquisa pode demorar alguns segundos.<br />Aguarde, consultando site dos Correios...";
			break;
		case 2:
			document.getElementById("tracking").innerHTML = "Consulta concluída!";
			break;
		case 3:
			document.getElementById("tracking").innerHTML = "Carregando informações...";
			break;
		case 4:
			if (http_request.status == 200) {
				document.getElementById("tracking").style.height = "auto";
				document.getElementById("tracking").innerHTML = http_request.responseText;
				gMyScrollbar.refresh();
			} else {
				document.getElementById("tracking").innerHTML = "O sistema dos correios esta fora do ar!<br />Por favor, tente mais tarde.";
			}
			break;
		default:
			document.getElementById("tracking").innerHTML = "A pesquisa pode demorar alguns segundos.<br />Aguarde...";
			break;
	}
	
	/*
	if (http_request.readyState == 4) {
		if (http_request.status == 200) {
			document.getElementById("tracking").style.height = "auto";
			document.getElementById("tracking").innerHTML = http_request.responseText;
			gMyScrollbar.refresh();
		} else {
			document.getElementById("tracking").innerHTML = "O sistema dos correios esta fora do ar!<br />Por favor, tente mais tarde.";
		}
	} else {
		document.getElementById("tracking").innerHTML = "A pesquisa pode demorar alguns segundos.<br />Aguarde...";
	}
	*/
}

// everything below here handles showing and flipping to the prefs on the back and back again...
function showPrefs() {
	var front = document.getElementById("front");
	var back = document.getElementById("back");

	if (window.widget)
	widget.prepareForTransition("ToBack");

	front.style.display="none";
	back.style.display="block";
	document.getElementById("donePrefsButton").display = "block";

	if (window.widget)
	setTimeout ('widget.performTransition();', 0);
}

function hidePrefs() {
	var front = document.getElementById("front");
	var back = document.getElementById("back");

	if (window.widget)
	widget.prepareForTransition("ToFront");

	back.style.display="none";
	document.getElementById("donePrefsButton").display = "none";
	front.style.display="block";

	if (window.widget)
	setTimeout ('widget.performTransition();', 0);
}

function enterflip(event) {
	document.getElementById('fliprollie').style.display = 'block';
}
function exitflip(event) {
	document.getElementById('fliprollie').style.display = 'none';
}

var flipShown = false;
var animation = {duration:0, starttime:0, to:1.0, now:0.0, from:0.0, firstElement:null, timer:null};
function mousemove (event) {
	if (!flipShown)
	{
	if (animation.timer != null)
	{
		clearInterval (animation.timer);
		animation.timer	 = null;
	}

	var starttime = (new Date).getTime() - 13;

	animation.duration = 500;
	animation.starttime = starttime;
	animation.firstElement = document.getElementById ('flip');
	animation.timer = setInterval ("animate();", 13);
	animation.from = animation.now;
	animation.to = 1.0;
	animate();
	flipShown = true;
	}
}
function mouseexit (event) {
	if (flipShown)
	{
	// fade in the info button
	if (animation.timer != null)
	{
		clearInterval (animation.timer);
		animation.timer	 = null;
	}

	var starttime = (new Date).getTime() - 13;

	animation.duration = 500;
	animation.starttime = starttime;
	animation.firstElement = document.getElementById ('flip');
	animation.timer = setInterval ("animate();", 13);
	animation.from = animation.now;
	animation.to = 0.0;
	animate();
	flipShown = false;
	}
}
function animate() {
	var T;
	var ease;
	var time = (new Date).getTime();


	T = limit_3(time-animation.starttime, 0, animation.duration);

	if (T >= animation.duration)
	{
	clearInterval (animation.timer);
	animation.timer = null;
	animation.now = animation.to;
	}
	else
	{
	ease = 0.5 - (0.5 * Math.cos(Math.PI * T / animation.duration));
	animation.now = computeNextFloat (animation.from, animation.to, ease);
	}

	animation.firstElement.style.opacity = animation.now;
}
function limit_3 (a, b, c) {
	return a < b ? b : (a > c ? c : a);
}
function computeNextFloat (from, to, ease) {
	return from + (to - from) * ease;
}
