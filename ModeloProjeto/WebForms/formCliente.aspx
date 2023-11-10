<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="formCliente.aspx.cs" Inherits="WebForm.formCliente" %>

<!DOCTYPE html>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
</head>
<body>
   
  
<div class="container">    
     <form id="form1" runat="server">
         <br /><br />
         <span class="badge text-bg-info col-sm-1">Cliente</span>
         <br /><br /><br />
    <div class="row">
        <div class="col-md-2">
            <label for="cpf" class="form-label">CPF*</label>
            <input type="text" class="form-control" id="cpf">
        </div>
        <div class="col-md-10">
            <label for="nome" class="form-label">Nome</label>
            <input type="text" class="form-control" id="nome">
        </div>
    </div>
    <div class="row">
      <div class="col-md-3">
        <label for="rg" class="form-label">RG</label>
        <input type="text" class="form-control" id="rg" placeholder="rg">
      </div>
      <div class="col-md-3">
        <label for="dataExpedicao" class="form-label">Data Expedição</label>
        <input type="date" class="form-control" id="dataExpedicao" placeholder="">
      </div>
        <div class="col-md-3">
        <label for="orgaoExpedicao" class="form-label">Orgão Expedição</label>
        <select id="orgaoExpedicao" class="form-select">
          <option selected>Selecione</option>
          <option value="SSP">SSP</option>
          <option value="TJ">TJ</option>
          <option value="TSE">TSE</option>
        </select>
      </div>
      <div class="col-md-3">
        <label for="uf" class="form-label">UF</label>
        <select id="uf" class="form-select">
          <option selected>Selecione</option>
          <option value="AC">Acre</option>
          <option value="AL">Alagoas</option>
          <option value="AP">Amapá</option>
          <option value="AM">Amazonas</option>
          <option value="BA">Bahia</option>
          <option value="CE">Ceará</option>
          <option value="DF">Distrito Federal</option>
          <option value="ES">Espírito Santo</option>
          <option value="GO">Goiás</option>
          <option value="MA">Maranhão</option>
          <option value="MT">Mato Grosso</option>
          <option value="MS">Mato Grosso do Sul</option>
          <option value="MG">Minas Gerais</option>
          <option value="PA">Pará</option>
          <option value="PB">Paraíba</option>
          <option value="PR">Paraná</option>
          <option value="PE">Pernambuco</option>
          <option value="PI">Piauí</option>
          <option value="RJ">Rio de Janeiro</option>
          <option value="RN">Rio Grande do Norte</option>
          <option value="RS">Rio Grande do Sul</option>
          <option value="RO">Rondônia</option>
          <option value="RR">Roraima</option>
          <option value="SC">Santa Catarina</option>
          <option value="SP">São Paulo</option>
          <option value="SE">Sergipe</option>
          <option value="TO">Tocantins</option>
        </select>
      </div>

      

      
    </div>
       <div class="row">
        <div class="col-md-3">
            <label for="dataNascimento" class="form-label">Data Nascimento*</label>
            <input type="date" class="form-control" id="dataNascimento">
        </div>
        <div class="col-md-3">
            <label for="sexo" class="form-label">Sexo</label>
        <select id="sexo" class="form-select">
          <option selected>Selecione</option>
          <option value="Masculinmo">Masculino</option>
          <option value="Feminino">Feminino</option>
          <option value="Outro">Outro</option>
          
          
        </select>
        </div>
         <div class="col-md-3">
            <label for="estadoCivil" class="form-label">Estado Civil</label>
            <select id="estadoCivil" class="form-select">
           <option selected>Selecione</option>
            <option value="Solteiro">Solteiro</option>
            <option value="Casado">Casado</option>
            <option value="Separado">Separado</option>
            <option value="Divorciado">Divorciado</option>
            <option value="Viúvo">Viúvo</option>
        </select>
        </div>
    </div>
 <br />
      <div class="col-12">
        <button type="submit" class="btn btn-primary">Salvar</button>
      </div>
    </form>
 </div>

</body>
</html>
 