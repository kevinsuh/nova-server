// This is the js that runs in lender's window.
// Passed through via `script` tag.
$(document).ready(function() {

	// nova sources:
	// > - dev: `http://localhost:8080`
	// > - prod: `https://kevins-nova-server.herokuapp.com`
	const novaSource = "http://localhost:8080";

	// find script to take `data` attributes from
	// > - data-key
	// > - data-country
	var script = function() {
		var e = document.getElementsByTagName("script");
		for (var i = 0; i < e.length; i++) {
			if (/passport-initialize[.]js$/.test(e[i].src)) {
				return e[i];
			}
		}
		throw new Error("Failed to find script");
	}();

	var country = script.getAttribute("data-country");
	var key = script.getAttribute("data-key");

	// hostname allows us to respond back later
	// this will be lender source
	// > - dev: `http://localhost:3000`
	// > - prod: `https://kevins-lender-server.herokuapp.com`
	var loc    = window.location;
	var origin = loc.origin ? loc.origin : loc.protocol + "//" + loc.hostname + (loc.port ? ":" + loc.port : "");

	// this is iframe containing nova passport form
	var iframe = document.createElement('iframe');
	$(iframe).css({
		"display": "none",
		"border-width": "0",
		"height": "500px"
	});
	iframe.id = 'passport-iframe';
	iframe.width = "100%";
	iframe.src = novaSource;

	// react app only initializes after receiving this message
	$(iframe).on('load', function() {
		iframe.style.display = "block";
		var message = {
			country: country,
			key: key,
			origin: origin
		}
		iframe.contentWindow.postMessage(JSON.stringify(message), novaSource);
	});

	document.body.appendChild(iframe);

	// listener for later response message from nova source
	// > we make sure it is from `novaSource`
	window.addEventListener("message", function(e) {
		if (e.origin == novaSource) {
			var data = JSON.parse(e.data);
			$("#nova-response").append("<h1 style='color:green;text-align:center;'>"+data.message+"</h1>");
		}
	});

});
