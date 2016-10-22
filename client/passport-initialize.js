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
	iframe.id = 'passport-iframe';
	iframe.width = "100%";
	iframe.src = "http://localhost:8080";
	// iframe.height = "100%";
	// iframe.style.position = "fixed";
	// iframe.style.top = "0";
	// iframe.style.left = "0";
	// iframe.style.right = "0";
	// iframe.style.bottom = "0";
	iframe.style.display = "none";
	iframe.style["z-index"] = "99999";
	iframe.style["background-color"] = "blue";
	iframe.style["border-width"] = "0";
	iframe.style["overflow-x"] = "hidden";
	iframe.style["overflow-y"] = "auto";

	// get form information
	var country = script.getAttribute("data-country");
	var formId = script.getAttribute("data-form-id");
	var form = document.getElementById(formId);

	// postMessage on 2 events:
	// 1) on iframe load
	// 2) on button click
	$(iframe).on('load', function() {
		var message = {
			country: country,
			key: "test-key"
		}
		sendMessage(message);
		console.log(`\n\n iframe loaded!`);
	})

	// attach iframe
	document.body.appendChild(iframe);

	// iframe load
	$('#nova-link-iframe').on('load', function() {
		return;
		$(this).css("display","block");
		document.body.style.overflow="hidden";
		document.documentElement.style.overflow = "hidden";
		$(this)[0].contentWindow.focus();
	});

	// original document styles
	var originalDocumentStyles= {
		body: document.body.style.overflow,
		html: document.documentElement.style.overflow
	};

	// create button to trigger the iframe
	var novaSimpleButton = document.createElement("button");
	novaSimpleButton.id = "nova-simple-button";
	novaSimpleButton.textContent = "Get your Nova Passport";
	$(novaSimpleButton).on('click', function(e) {
		e.preventDefault();
		// send message to open with client information
		iframe.style.display = "block";
		// document.style.overflow = "hidden";
		// document.documentElement.style.overflow = "hidden";
		// iframe[0].contentWindow.focus();
	});

	// postMessage to nova server
	// message is JSON obj to send
	function sendMessage(message) {
		console.log('message sent!');
		console.log(message);
		iframe.contentWindow.postMessage(JSON.stringify(message), "http://localhost:8080");
	}

	var hideIframe = function() {
		iframe.style.display = "none";
		document.body.style.overflow=originalDocumentStyles.body;
		document.documentElement.style.overflow=originalDocumentStyles.html;
		window.parent.focus();
	}

	hideIframe();
	form.appendChild(novaSimpleButton);

});