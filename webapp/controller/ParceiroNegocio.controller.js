sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function(Controller, MessageBox, JSONModel) {
	"use strict";

	return Controller.extend("br.com.idxtec.ParceiroNegocio.controller.ParceiroNegocio", {
		onInit: function(){
			var that = this;
			var oModel = this.getOwnerComponent().getModel();
			var oParamModel = new JSONModel();
			
			this.getOwnerComponent().setModel(oParamModel, "parametros"); 
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			
			oModel.attachRequestSent(function() {
				that.getView().setBusy(true);
			});
			
			oModel.attachRequestCompleted(function() {
				that.getView().setBusy(false);	
			});
		},
		
		onRefresh: function(e){
			var oModel = this.getOwnerComponent().getModel();
			oModel.refresh(true);
		},
		
		onIncluir: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oTable = this.byId("tableParceiro"); 
			
			var oParModel = this.getOwnerComponent().getModel("parametros");
			oParModel.setData({operacao: "incluir"});
			
			oRouter.navTo("gravarparceiro");
			oTable.clearSelection();
		},
		
		onEditar: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oTable = this.byId("tableParceiro");
			var nIndex = oTable.getSelectedIndex();
			
			if (nIndex === -1){
				MessageBox.information("Selecione um parceiro da tabela.");
				return;
			}
			
			var sPath = oTable.getContextByIndex(nIndex).sPath;
			var oParModel = this.getOwnerComponent().getModel("parametros");
			oParModel.setData({sPath: sPath, operacao: "editar"});
			
			oRouter.navTo("gravarparceiro");
			oTable.clearSelection();
		},
		
		onRemover: function(e){
			var that = this;
			var oTable = this.byId("tableParceiro");
			var nIndex = oTable.getSelectedIndex();
			
			if (nIndex === -1){
				MessageBox.information("Selecione um parceiro da tabela.");
				return;
			}
			
			MessageBox.confirm("Deseja remover este parceiro?", {
				onClose: function(sResposta){
					if(sResposta === "OK"){
						that._remover(oTable, nIndex);
						MessageBox.success("Parceiro removido com sucesso!");
					}
				}
			});
		},
		
		_remover: function(oTable, nIndex){
			var oModel = this.getOwnerComponent().getModel();
			var oContext = oTable.getContextByIndex(nIndex);
			
			oModel.remove(oContext.sPath, {
				success: function(){
					oModel.refresh(true);
					oTable.clearSelection();
				},
				error: function(oError){
					MessageBox.error(oError.responseText);
				}
			});
		}
	});
});