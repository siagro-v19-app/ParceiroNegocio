sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"idxtec/lib/fragment/ContaContabilHelpDialog",
	"idxtec/lib/fragment/ItemContabilHelpDialog",
	"idxtec/lib/fragment/PaisBacenHelpDialog",
	"idxtec/lib/fragment/MunicipiosHelpDialog",
	"br/com/idxtec/ParceiroNegocio/service/Parceiro"
], function(Controller, History, MessageBox, JSONModel, ContaContabilHelpDialog,
	ItemContabilHelpDialog, PaisBacenHelpDialog, MunicipiosHelpDialog, Parceiro) {
	"use strict";

	return Controller.extend("br.com.idxtec.ParceiroNegocio.controller.GravarParceiro", {
		
		onInit: function(){
			var oRouter = this.getOwnerComponent().getRouter();
			
			oRouter.getRoute("gravarparceiro").attachMatched(this._routerMatch, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			
			this._operacao = null;
			this._sPath = null;
			
			var oJSONModel = new JSONModel();
			this.getOwnerComponent().setModel(oJSONModel,"model");
		},

		getModel: function(sModel) {
				return this.getOwnerComponent().getModel(sModel);
		},
		
		itemContabilReceived: function() {
			this.getView().byId("itemcontabil").setSelectedKey(this.getModel("model").getProperty("/ItemContabil"));
		},
		
		paisBacenReceived: function() {
			this.getView().byId("pais").setSelectedKey(this.getModel("model").getProperty("/Pais"));
		},
		
		municipiosReceived: function() {
			this.getView().byId("municipio").setSelectedKey(this.getModel("model").getProperty("/Municipio"));
		},
		
		handleSearchConta: function(oEvent){
			var oHelp = new ContaContabilHelpDialog(this.getView(), "contacontabil");
			oHelp.getDialog().open();
		},
		
		handleSearchItem: function(oEvent){
			var oHelp = new ItemContabilHelpDialog(this.getView(), "itemcontabil");
			oHelp.getDialog().open();
		},
		
		handleSearchPais: function(oEvent){
			var oHelp = new PaisBacenHelpDialog(this.getView(), "pais");
			oHelp.getDialog().open();
		},
		
		handleSearchMunicipio: function(oEvent){
			var oHelp = new MunicipiosHelpDialog(this.getView(), "municipio");
			oHelp.getDialog().open();
		},
		
		handleSuggest: function(oEvent) {
			var sTerm = oEvent.getParameter("suggestValue");
			var aFilters = [];
			if (sTerm) {
				aFilters.push(new Filter("Nome", sap.ui.model.FilterOperator.StartsWith, sTerm));
			}
			oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
		},

		_routerMatch: function(){
			var oParam = this.getModel("parametros").getData();
			var oJSONModel = this.getModel("model");
			var oModel = this.getModel();
			var oViewModel = this.getModel("view");
			var oView = this.getView();
			
			this._operacao = oParam.operacao;
			this._sPath = oParam.sPath;
			
			oView.byId("pais").setValue(null);
			oView.byId("itemcontabil").setValue(null);
			oView.byId("contacontabil").setValue(null);
			oView.byId("municipio").setValue(null);

			oView.byId("uf").setSelectedKey("");

			if (this._operacao === "incluir"){
			
				oViewModel.setData({
					titulo: "Inserir Parceiro de Negócio"
				});
				
				oJSONModel.setData( new Parceiro() );
				
			} else if (this._operacao === "editar"){
			
				oViewModel.setData({
					titulo: "Editar Parceiro de Negócio"
				});
				
				oModel.read(oParam.sPath,{
					success: function(oData) {
						oJSONModel.setData(oData);
					},
					error: function(oError) {
						MessageBox.error(oError.responseText);
					}
				});
			}
		},
		
		onSalvar: function(){
			if (this._checarCampos(this.getView())) {
				MessageBox.information("Preencha todos os campos obrigatórios!");
				return;
			}
			
			if (this._operacao === "incluir") {
				this._createParceiro();
			} else if (this._operacao === "editar") {
				this._updateParceiro();
			}
		},
		
		_goBack: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			
			if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					oRouter.navTo("parceironegocio", {}, true);
				}
		},
	
		_getData: function(){
			var oJSONModel = this.getOwnerComponent().getModel("model");
			var oDados = oJSONModel.getData();
			
			oDados.ItemContabil = oDados.ItemContabil ? parseInt(oDados.ItemContabil, 0) : 0;
			oDados.Pais = oDados.Pais ? parseInt(oDados.Pais, 0) : 0;
			oDados.Uf = oDados.Uf ? parseInt(oDados.Uf, 0) : 0;
			oDados.Municipio = oDados.Municipio ? parseInt(oDados.Municipio, 0) : 0;

			oDados.PlanoContaDetails = {
				__metadata: {
					uri: "/PlanoContas('" + oDados.ContaContabil + "')"
				}
			};
			
			oDados.ItemContabilDetails = {
				__metadata: {
					uri: "/ItemContabils(" + oDados.ItemContabil + ")"
				}
			};
			
			oDados.PaisBacenDetails = {
				__metadata: {
					uri: "/PaisBacens(" + oDados.Pais + ")"
				}
			};
			
			oDados.UfDetails = {
				__metadata: {
					uri: "/Ufs(" + oDados.Uf + ")"
				}
			};
			
			oDados.MunicipioDetails = {
				__metadata: {
					uri: "/Municipios(" + oDados.Municipio + ")"
				}
			};
			
			return oDados;
		},
		
		_createParceiro: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel();
			
			oModel.create("/ParceiroNegocios", this._getData(), {
				success: function() {
					MessageBox.success("Parceiro de negócio inserido com sucesso!", {
						onClose: function(){
							that._goBack(); 
						}
					});
				},
				error: function(oError) {
					MessageBox.error(oError.responseText);
				}
			});
		},
		
		_updateParceiro: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel();
			
			oModel.update(this._sPath, this._getData(), {
					success: function() {
					MessageBox.success("Parceiro de negócio alterado com sucesso!", {
						onClose: function(){
							that._goBack();
						}
					});
				},
				error: function(oError) {
					MessageBox.error(oError.responseText);
				}
			});
		},
		
		_checarCampos: function(oView){
			if(oView.byId("razaosocial").getValue() === "" || oView.byId("cnpj").getValue() === ""){
				return true;
			} else{
				return false; 
			}
		},
		
		onVoltar: function(){
			this._goBack();
		}
	});

});