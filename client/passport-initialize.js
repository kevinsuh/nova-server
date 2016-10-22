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

	// get host name
	var loc    = window.location;
	var origin = loc.origin ? loc.origin : loc.protocol + "//" + loc.hostname + (loc.port ? ":" + loc.port : "");

	// create an iframe
	var iframe = document.createElement('iframe');
	$(iframe).css({
		"display": "none",
		"z-index": "999999",
		"border-width": "0",
		"overflow-x": "hidden",
		"overflow-y": "auto",
		"height": "100%",
		"position": "fixed",
		"top": "0",
		"left": "0",
		"right": "0",
		"bottom": "0"
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

	// postMessage on 2 events:
	// 1) on iframe load
	// 2) on button click
	$(iframe).on('load', function() {
		console.log(`\n\n iframe loaded!`);
	})

	// attach iframe
	document.body.appendChild(iframe);

	// create button to trigger the iframe
	var novaSimpleButton = document.createElement("button");
	novaSimpleButton.id = "nova-simple-button";
	novaSimpleButton.textContent = "Get your Nova Passport";
	$(novaSimpleButton).on('click', function(e) {
		e.preventDefault();
		// send message to open with client information
		iframe.style.display = "block";
		var message = {
			country: country,
			key: key,
			clientName: clientName,
			product: product,
			env: env,
			origin: origin
		}
		sendMessage(message);
	});

	// postMessage to nova server
	function sendMessage(message) {
		// this loads up Passport react app from Nova server
		iframe.contentWindow.postMessage(JSON.stringify(message), "http://localhost:8080");
	}

	// original document styles
	var originalDocumentStyles= {
		body: document.body.style.overflow,
		html: document.documentElement.style.overflow
	};

	var hideIframe = function() {
		iframe.style.display = "none";
		document.body.style.overflow=originalDocumentStyles.body;
		document.documentElement.style.overflow=originalDocumentStyles.html;
		window.parent.focus();
	}

	// hide iframe until we start with passport btn
	hideIframe();
	form.appendChild(novaSimpleButton);

});