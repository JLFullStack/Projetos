using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using WebForm.ServiceReference;

namespace WebForm
{
    public partial class formCliente : System.Web.UI.Page
    {
        ClienteServiceClient service = new ClienteServiceClient();
        protected void Page_Load(object sender, EventArgs e)
        {
            ClienteServiceClient service = new ClienteServiceClient();
            var teste = service.GetById(2);
            service.Close();
        }

    }
}