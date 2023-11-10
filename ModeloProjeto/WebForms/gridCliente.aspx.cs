using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using WebForm.ServiceReference;

namespace WebForm
{
    public partial class gridCliente : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                ClienteServiceClient service = new ClienteServiceClient();
                var cliente = service.GetAllCliente();
                
                
                if (cliente != null && cliente.Count() > 0)
                {
                    
                    this.grdDados.DataSource = cliente;
                    this.grdDados.DataBind();
                }
            }
        }

        protected void btnConsultar_Click(object sender, EventArgs e)
        {
            ClienteServiceClient service = new ClienteServiceClient();
            var cliente = service.GetClienteByName(txtNome.Text);


            if (cliente != null && cliente.Count() > 0)
            {

                this.grdDados.DataSource = cliente;
                this.grdDados.Visible = true;
                this.grdDados.DataBind();
                upAcao.Update();
            }
        }

        public Cliente PreencheValor(SqlDataReader reader)
        {
            var clientes = new Cliente();
            while (reader.Read())
            {
                clientes.nome =reader["Nome"].ToString();
                clientes.EnderecoCliente.logradouro = reader["Logradouro"].ToString();
                //modeloProdutos.UnitPrice = Convert.ToDecimal(reader["UnitPrice"].ToString());
                //modeloProdutos.UnitsInStock = Convert.ToInt16(reader["UnitsInStock"].ToString());
            }
            return clientes;
        }

        protected void grdDados_RowCommand(object sender, GridViewCommandEventArgs e)
        {
            if (e.CommandName.Equals("Editar"))
            {
                string idProduto = e.CommandArgument.ToString();
                if (!String.IsNullOrEmpty(idProduto))
                    this.Response.Redirect("DetalheProduto.aspx?IdProduto=" + idProduto);
            }
        }
    }
}