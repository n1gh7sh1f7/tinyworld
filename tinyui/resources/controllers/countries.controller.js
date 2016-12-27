sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/ODataModel',
	'sap/ui/model/json/JSONModel'
], function(jQuery, Controller, ODataModel, JSONModel) {
	"use strict";

	return Controller.extend("res.controllers.countries", {
		onInit: function() {
			this.countriesModel = new ODataModel("/countries.xsodata", true);

			this.continentsModel = new ODataModel("/continents.xsodata", true);
			
			this.countryDetailModel = new JSONModel();
		},
		onAfterRendering: function() {
			this.countriesModel.refresh();

			var oTable = this.getView().byId("countriesTable");

			oTable.setModel(this.countriesModel);

			// var oModel = new sap.ui.model.json.JSONModel(),
			// 	names = ['Holger', 'Volker', 'Jörg', 'Klaudia', 'Dirk', 'Thomas'],
			// 	oMsg = this.getView().byId("chatMsg"),
			// 	oSend = this.getView().byId("sendBtn");

			// oModel.setData({
			// 	user: names[Math.floor(names.length * Math.random())],
			// 	chat: ""
			// });

			// this.getView().byId("chatInfo").setModel(oModel);

			// var connection = new sap.ui.core.ws.WebSocket('wss://hxehost:64080');

			// // connection opened 
			// connection.attachOpen(function(oControlEvent) {
			// 	notify("onOpen", "connection opened", "success");
			// });

			// // server messages
			// connection.attachMessage(function(oControlEvent) {
			// 	var data = jQuery.parseJSON(oControlEvent.getParameter('data')),
			// 		msg = data.user + ': ' + data.text,
			// 		lastInfo = oModel.oData.chat;

			// 	if (lastInfo.length > 0){ lastInfo += "\r\n"; }
			// 	oModel.setData({
			// 		chat: lastInfo + msg
			// 	}, true);

			// 	// scroll to textarea bottom to show new messages
			// 	$('.chatInfo').scrollTop($('.chatInfo')[0].scrollHeight);

			// 	notify('onMessage', msg, 'information');
			// });

			// // error handling
			// connection.attachError(function(oControlEvent) {
			// 	notify('onError', 'Websocket connection error', 'error');
			// });

			// // onConnectionClose
			// connection.attachClose(function(oControlEvent) {
			// 	notify('onClose', 'Websocket connection closed', 'warning');
			// });

			// // send message
			// var sendMsg = function() {
			// 	var msg = oMsg.getValue();
			// 	if (msg.length > 0) {
			// 		connection.send(JSON.stringify({
			// 			user: oModel.oData.user,
			// 			text: msg
			// 		}));
			// 		notify('sendMessage', msg, 'alert');
			// 		oMsg.setValue(); // reset textfield
			// 		oMsg.focus(); // focus field
			// 	}
			// };

			// // notifier 
			// function notify(title, text, type) {
			// 	type = type || "information";
			// 	// [alert|success|error|warning|information|confirm]  
			// 	noty({
			// 		text: text,
			// 		template: '<div class="noty_message"><b>' + title +
			// 			':</b>&nbsp;<span class="noty_text"></span><div class="noty_close"></div></div>',
			// 		layout: "topRight",
			// 		type: type,
			// 		timeout: 4000
			// 	});
			// }
			
			// oSend.attachPress(function(){ sendMsg(); });
		},
		addCountry: function() {
			var oDialog = this.getView().byId("addCountryDialog");

			var continentSelect = this.getView().byId("dialogContinents");

			this.continentsModel.refresh();

			continentSelect.setModel(this.continentsModel);

			oDialog.open();
		},
		dialogSave: function() {
			var that = this;

			var oDialog = this.getView().byId("addCountryDialog");

			var name = this.getView().byId("dialogCountryName").getValue();

			var partof = this.getView().byId("dialogContinents").getSelectedKey();

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
					oDialog.close();
					that.countriesModel.refresh(true);
					sap.m.MessageToast.show("Data inserted successfully", {});
				},
				error: function(data) {
					oDialog.close();
					var message = JSON.stringify(data);
					sap.m.MessageToast.show(message, {});
				}
			});
		},
		dialogCancel: function() {
			this.getView().byId("addCountryDialog").close();
			this.getView().byId("dialogCountryName").setValue("");
			this.getView().byId("dialogContinents").getSelectedKey("");
		},
		onCountriesItemPress: function(oEvent){
			var item = oEvent.getParameter("listItem");
			
			var countryName = item.$().find(".countryName").first().text();
			var continentName = item.$().find(".continentName").first().text();
			
			var json = {
				name: countryName,
				partof_continent: continentName
			};
			
			this.countryDetailModel.setData(json);
			
			this.getView().byId("page-country-detail").setModel(this.countryDetailModel);
			
			this.byId("tinyworld-app").to("page-country-detail");
		}
	});
});