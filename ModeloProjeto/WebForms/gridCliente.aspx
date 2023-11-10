<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="gridCliente.aspx.cs" Inherits="WebForm.gridCliente" %>

 <style>
                table.table_class tbody  tr th  
                {
                 text-align:center !important;
                }

 </style>


<!DOCTYPE html>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
</head>
<body>
<div class="container">
    <form id="form" runat="server">
        <br /><br />
            <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>
             <asp:UpdatePanel ID="upTxt" runat="server" UpdateMode="Conditional">
                <ContentTemplate>
                    <form>
  <div class="form-row align-items-center">
    <div class="col-auto">
      <label class="sr-only" for="inlineFormInput">Nome Cliente</label>
      <asp:TextBox id="txtNome" runat="server" placeholder="Nome do Cliente"></asp:TextBox>
    </div>

    <div class="col-auto">
      <asp:Button OnClick="btnConsultar_Click" runat="server" class="btn btn-primary mb-2" Text="Buscar"></asp:Button>
    </div>
  </div>
</form>
                     
                       
                    </table>
                </ContentTemplate>
            </asp:UpdatePanel>
 <asp:UpdatePanel ID="upAcao" runat="server" UpdateMode="Conditional">
    <ContentTemplate>
     <asp:GridView ID="grdDados" runat="server" AutoGenerateColumns="False" Visible="false" AllowPaging="True"
                Width="100%" SkinID="GridView" DataKeyNames="id"  CssClass="table table-striped table-bordered table_class"
               >
<%--                OnRowDataBound="gvMaterialEntrada_RowDataBound" 
                OnRowUpdating="gvMaterialEntrada_RowUpdating">--%> 
                <Columns>
                    <asp:TemplateField HeaderText="Ação">
                        <ItemTemplate>
                            <asp:ImageButton ID="ImgEditar" runat="server"
                                CommandName="Baixa" CommandArgument='<%# Eval("id") %>' />
                        </ItemTemplate>
                        <ItemStyle HorizontalAlign="Center"/>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Nome">
                        <ItemTemplate>
                            <asp:Label ID="lblNumeroMaterial" runat="server" Text='<%# Eval("Nome") %>' />
                        </ItemTemplate>
                         <ItemStyle HorizontalAlign="Center" />
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Endereço"> 
                        <ItemTemplate>
                            <asp:Label ID="lblEndereco" runat="server" Text='<%# Eval("EnderecoCliente.logradouro") %>'
                                ToolTip='<%#Eval("EnderecoCliente.logradouro")%>' />
                        </ItemTemplate>
                         <ItemStyle HorizontalAlign="Center" />
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="CPF">
                       
                        <ItemTemplate>
                            <asp:Label ID="lblCpf" runat="server" Text='<%# Eval("cpf") %>'/>
                        </ItemTemplate>
                         <ItemStyle HorizontalAlign="Center" />
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Data Nascimento">
                            
                        <ItemTemplate>
                            <asp:Label ID="lblDataNascimento" runat="server" Text='<%# Eval("dataNascimento", "{0:d}") %>'/>
                        </ItemTemplate>
                         <ItemStyle HorizontalAlign="Center" />
                    </asp:TemplateField>

                </Columns>
         
            </asp:GridView>
         </ContentTemplate>
        </asp:UpdatePanel>  
     </form>
    </div>
</body>
</html>
