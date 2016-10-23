// this gets run in lender's frame
$(document).ready(function() {

	// 1. find the script tag
	var script = function() {
		// i know that i'm here now
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
	iframe.src = "http://localhost:8080";

	// get form information
	var country    = script.getAttribute("data-country");
	var formId     = script.getAttribute("data-form-id");
	var key        = script.getAttribute("data-key");
	var clientName = script.getAttribute("data-client-name");
	var product    = script.getAttribute("data-product");
	var env        = script.getAttribute("data-env");
	var form       = document.getElementById(formId);

	// postMessage to load up react app on iframe load
	// 1) on iframe load
	$(iframe).on('load', function() {
		iframe.style.display = "block";
		var message = {
			country: country,
			key: key,
			clientName: clientName,
			product: product,
			env: env,
			origin: origin
		}
		iframe.contentWindow.postMessage(JSON.stringify(message), "http://localhost:8080");
	})

	// attach iframe
	document.body.appendChild(iframe);

	// set up listener for response message from Nova
	window.addEventListener("message", function(e) {
		var data = JSON.parse(e.data);
		$("#nova-response").append("<h1 style='color:green;text-align:center;'>"+data.message+"</h1>");
		// $(iframe).hide();
	});

});
