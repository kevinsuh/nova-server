// this gets run in lender's frame
$(document).ready(function() {

	// const novaSource = "http://localhost:8080"; // local
	const novaSource = "https://kevins-nova-server.herokuapp.com"; // production

	// 1. find the script tag
	var script = function() {
		var e = document.getElementsByTagName("script");
		for (var i = 0; i < e.length; i++) {
			if (/passport-initialize[.]js$/.test(e[i].src)) {
				return e[i];
			}
		}
		throw new Error("Failed to find script");
	}();

	// get hostname
	var loc    = window.location;
	var origin = loc.origin ? loc.origin : loc.protocol + "//" + loc.hostname + (loc.port ? ":" + loc.port : "");

	// create an iframe
	var iframe = document.createElement('iframe');
	$(iframe).css({
		"display": "none",
		"border-width": "0",
		"height": "500px"
	});
	iframe.id = 'passport-iframe';
	iframe.width = "100%";
	iframe.src = novaSource;

	// get form information
	var country    = script.getAttribute("data-country");
	var key        = script.getAttribute("data-key");

	// postMessage to load up react app on iframe load
	// 1) on iframe load
	$(iframe).on('load', function() {
		iframe.style.display = "block";
		var message = {
			country: country,
			key: key,
			origin: origin
		}
		iframe.contentWindow.postMessage(JSON.stringify(message), novaSource);
	})

	// attach iframe
	document.body.appendChild(iframe);

	// set up listener for response message from Nova
	window.addEventListener("message", function(e) {
		var data = JSON.parse(e.data);
		$("#nova-response").append("<h1 style='color:green;text-align:center;'>"+data.message+"</h1>");
	});

});
