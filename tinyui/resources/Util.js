var oFirstDialog;

function openFirstDialog() {
	if (oFirstDialog) {
		oFirstDialog.open();
	} else {
		oFirstDialog = new sap.m.Dialog({
			width: "400px",
			height: "550px",
			title: "Country Details",
			modal: true,
			content: [
				new sap.ui.layout.form.SimpleForm({
					content: [
						new sap.m.Title({
							text: "Country Name"
						}),
						new sap.m.Label({
							text: "name"
						}),
						new sap.m.Input({
							value: "",
							id: "name"
						}),
						new sap.m.Label({
							text: "partof"
						}),
						new sap.m.Input({
							value: "",
							id: "partof"
						})
					]
				})
			],
			buttons: [
				new sap.m.Button({
					text: "OK",
					press: function() {
						var name = sap.ui.getCore().byId("name").getValue();

						var partof = sap.ui.getCore().byId("partof").getValue();

						var payload = {
							name: name,
							partof: partof
						};

						var insertData = JSON.stringify(payload);

						$.ajax({
							type: "POST",
							url: "country/country.xsjs",
							data: insertData,
							crossDomain: true,
							success: function(data) {
								oFirstDialog.close();
								sap.ui.getCore().byId("tinytab").getModel().refresh(true);
								sap.m.MessageToast.show("Data inserted successfully", {});
							},
							error: function(data) {
								var message = JSON.stringify(data);

								sap.m.MessageBox.show(
									message, {
										icon: sap.m.MessageBox.Icon.ERROR,
										title: "Error",
										actions: [sap.m.MessageBox.Action.OK],
										onClose: function(oAction) {}
									}
								);
							}
						});
					}
				})
			]
		});

		oFirstDialog.open();
	}
}

$(function() {
	// one time fetch of CSRF token
	$.ajax({
		type: "GET",
		url: "/",
		headers: {
			"X-Csrf-Token": "Fetch"
		},
		success: function(res, status, xhr) {
			var sHeaderCsrfToken = "X-Csrf-Token";

			var sCsrfToken = xhr.getResponseHeader(sHeaderCsrfToken);

			// for POST, PUT, and DELETE requests, add the CSRF token to the header
			$(document).ajaxSend(function(event, jqxhr, settings) {
				if (settings.type === "POST" || settings.type === "PUT" || settings.type === "DELETE") {
					jqxhr.setRequestHeader(sHeaderCsrfToken, sCsrfToken);
				}
			});
		}
	});
});