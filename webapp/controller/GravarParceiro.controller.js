sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"br/com/idxtec/ParceiroNegocio/helpers/ContaContabilHelpDialog",
	"br/com/idxtec/ParceiroNegocio/helpers/ItemContabilHelpDialog",
	"br/com/idxtec/ParceiroNegocio/helpers/PaisBacenHelpDialog",
	"br/com/idxtec/ParceiroNegocio/helpers/UfHelpDialog",
	"br/com/idxtec/ParceiroNegocio/helpers/MunicipiosHelpDialog",
	"br/com/idxtec/ParceiroNegocio/services/Session"
], function(Controller, History, MessageBox, JSONModel, ContaContabilHelpDialog,
	ItemContabilHelpDialog, PaisBacenHelpDialog, UfHelpDialog, MunicipiosHelpDialog, Session) {
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
		
		contaContabilReceived: function() {
			this.getView().byId("contacontabil").setSelectedKey(this.getModel("model").getProperty("/ContaContabil"));
		},
		
		itemContabilReceived: function() {
			this.getView().byId("itemcontabil").setSelectedKey(this.getModel("model").getProperty("/ItemContabil"));
		},
		
		paisBacenReceived: function() {
			this.getView().byId("pais").setSelectedKey(this.getModel("model").getProperty("/Pais"));
		},
		
		ufReceived: function() {
			this.getView().byId("uf").setSelectedKey(this.getModel("model").getProperty("/Uf"));
		},
		
		municipiosReceived: function() {
			this.getView().byId("municipio").setSelectedKey(this.getModel("model").getProperty("/Municipio"));
		},
		
		handleSearchConta: function(oEvent){
			var sInputId = oEvent.getParameter("id");
			ContaContabilHelpDialog.handleValueHelp(this.getView(), sInputId, this);
		},
		
		handleSearchItem: function(oEvent){
			var sInputId = oEvent.getParameter("id");
			ItemContabilHelpDialog.handleValueHelp(this.getView(), sInputId, this);
		},
		
		handleSearchPais: function(oEvent){
			var sInputId = oEvent.getParameter("id");
			PaisBacenHelpDialog.handleValueHelp(this.getView(), sInputId, this);
		},
		
		handleSearchUf: function(oEvent){
			var sInputId = oEvent.getParameter("id");
			UfHelpDialog.handleValueHelp(this.getView(), sInputId, this);
		},
		
		handleSearchMunicipio: function(oEvent){
			var sInputId = oEvent.getParameter("id");
			MunicipiosHelpDialog.handleValueHelp(this.getView(), sInputId, this);
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
			oView.byId("uf").setValue(null);
			oView.byId("municipio").setValue(null);

			if (this._operacao === "incluir"){
			
				oViewModel.setData({
					titulo: "Inserir Parceiro de Negócio"
				});
				
				var oNovoParceiro = {
					"Id": 0,
					"Codigo": "",
					"RazaoSocial": "",
					"Cnpj": "",
					"Cpf": "",
					"Rg": "",
					"NomeFantasia": "",
					"InsEstadual": "",
					"Filial": "",
					"ContaContabil": "",
					"ItemContabil": 0,
					"Contato": "",
					"Email": "",
					"Pais": 0,
					"Uf": 0,
					"Municipio": 0,
					"Cep": "",
					"Bairro": "",
					"Logradouro": "",
					"Numero": "",
					"Complemento": "",
					"Telefone": "",
					"Observacoes": "",
					"Empresa" : Session.get("EMPRESA_ID"),
					"Usuario": Session.get("USUARIO_ID"),
					"EmpresaDetails": { __metadata: { uri: "/Empresas(" + Session.get("EMPRESA_ID") + ")"}},
					"UsuarioDetails": { __metadata: { uri: "/Usuarios(" + Session.get("USUARIO_ID") + ")"}}
				};
				
				oJSONModel.setData(oNovoParceiro);
				
			} else if (this._operacao === "editar"){
			
				oViewModel.setData({
					titulo: "Editar Parceiro de Negócio"
				});
				
				oModel.read(oParam.sPath,{
					success: function(oData) {
						oJSONModel.setData(oData);
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
			
			oDados.ItemContabil = oDados.ItemContabil ? oDados.ItemContabil : 0;
			oDados.Pais = oDados.Pais ? oDados.Pais : 0;
			oDados.Uf = oDados.Uf ? oDados.Uf : 0;
			oDados.Municipio = oDados.Municipio ? oDados.Municipio : 0;

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
				}
			});
		},
		
		_checarCampos: function(oView){
			if(oView.byId("codigo").getValue() === "" || oView.byId("razaosocial").getValue() === ""
			|| oView.byId("filial").getValue() === ""){
				return true;
			} else{
				return false; 
			}
		},
		
		onVoltar: function(){
			this._goBack();
		},
		
		getModel: function(sModel) {
			return this.getOwnerComponent().getModel(sModel);
		}
	});
});