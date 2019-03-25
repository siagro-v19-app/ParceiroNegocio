sap.ui.define([
	"sap/ui/base/Object"
], function(BaseObject) {
	return BaseObject.extend("br.com.idxtec.ParceiroNegocio.service.Parceiro", {
		
		constructor: function(){ 
			this.Id = 0;
			this.Codigo = "";
			this.RazaoSocial = "";
			this.Cnpj = "";
			this.Cpf = "";
			this.Rg = "";
			this.NomeFantasia = "";
			this.InsEstadual = "";
			this.Filial = "";
			this.ContaContabil =  "";
			this.ItemContabil = 0;
			this.Contato = "";
			this.Email = "";
			this.Pais = 0;
			this.Observacoes = "";
			this.Uf = 0;
			this.Municipio = 0;
			this.Cep = "";
			this.Bairro = "";
			this.Logradouro = "";
			this.Numero = "";
			this.Complemento = "";
			this.Telefone = "";
		}
		
	});
	
	
});