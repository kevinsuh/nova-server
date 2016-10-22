$(document).ready(function() {

	// 1. find the script tag
	var script = function() {
		// i know that i'm here now
		var e = document.getElementsByTagName("script");
		for (var i = 0; i < e.length; i++) {
			if (/demo-iframe[.]js$/.test(e[i].src)) {
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
	iframe.id = 'nova-link-iframe';
	iframe.width = "100%";
	iframe.src = "demo-iframe.html"; // this needs to be a separate server
	iframe.height="100%";
	iframe.style.position = "fixed";
	iframe.style.top = "0";
	iframe.style.left = "0";
	iframe.style.right = "0";
	iframe.style.bottom = "0";
	iframe.style["z-index"] = "99999";
	iframe.style["background-color"] = "blue";
	iframe.style.display = "none";
	iframe.style["border-width"] = "0";
	iframe.style["overflow-x"] = "hidden";
	iframe.style["overflow-y"] = "auto";

	// attach iframe
	document.body.appendChild(iframe);

	// get form information
	var country = script.getAttribute("data-country");
	var formId = script.getAttribute("data-form-id");
	var form = document.getElementById(formId);

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

	var hideIframe = function() {
		iframe.style.display = "none";
		document.body.style.overflow=originalDocumentStyles.body;
		document.documentElement.style.overflow=originalDocumentStyles.html;
		window.parent.focus();
	}

	hideIframe();
	form.appendChild(novaSimpleButton);



	 // = {
		// position: "fixed",
		// top: "0",
		// left:"0",
		// right: "0",
		// bottom: "0",
		// zIndex: "99999"

	// }


});

/*
[
  {
    name: "American Express",
    type: "amex",
    auth: !1,
    connect: !0,
    creditdetails: !1,
    income: !0,
    info: !1,
    risk: !0
  },
  {
    name: "Bank of America",
    type: "bofa",
    auth: !0,
    connect: !0,
    creditdetails: !0,
    income: !0,
    info: !0,
    risk: !0
  },
  {
    name: "BB&T",
    type: "bbt",
    auth: !0,
    connect: !0,
    creditdetails: !0,
    income: !1,
    info: !0,
    risk: !1
  },
  {
    name: "Citi",
    type: "citi",
    auth: !0,
    connect: !0,
    creditdetails: !1,
    income: !1,
    info: !1,
    risk: !1
  },
  {
    name: "CapitalOne 360",
    type: "capone360",
    auth: !0,
    connect: !0,
    creditdetails: !0,
    income: !0,
    info: !0,
    risk: !0
  },
  {
    name: "Chase",
    type: "chase",
    auth: !0,
    connect: !0,
    creditdetails: !0,
    income: !0,
    info: !0,
    risk: !0
  },
  {
    name: "Fidelity",
    type: "fidelity",
    auth: !0,
    connect: !1,
    creditdetails: !1,
    income: !1,
    info: !1,
    risk: !1
  },
  {
    name: "Navy Federal Credit Union",
    type: "nfcu",
    auth: !0,
    connect: !0,
    creditdetails: !1,
    income: !0,
    info: !0,
    risk: !0
  },
  {
    name: "PNC",
    type: "pnc",
    auth: !0,
    connect: !1,
    creditdetails: !0,
    income: !1,
    info: !0,
    risk: !1
  },
  {
    name: "Charles Schwab",
    type: "schwab",
    auth: !0,
    connect: !1,
    creditdetails: !1,
    income: !1,
    info: !1,
    risk: !1
  },
  {
    name: "SunTrust",
    type: "suntrust",
    auth: !0,
    connect: !0,
    creditdetails: !0,
    income: !0,
    info: !0,
    risk: !0
  },
  {
    name: "TD Bank",
    type: "td",
    auth: !0,
    connect: !0,
    creditdetails: !0,
    income: !0,
    info: !0,
    risk: !1
  },
  {
    name: "US Bank",
    type: "us",
    auth: !0,
    connect: !0,
    creditdetails: !0,
    income: !0,
    info: !0,
    risk: !0
  },
  {
    name: "USAA",
    type: "usaa",
    auth: !0,
    connect: !0,
    creditdetails: !1,
    income: !0,
    info: !0,
    risk: !0
  },
  {
    name: "Wells Fargo",
    type: "wells",
    auth: !0,
    connect: !0,
    creditdetails: !0,
    income: !0,
    info: !0,
    risk: !0
  }
]
 */