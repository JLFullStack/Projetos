using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;

namespace WCFServiceHost
{
    // OBSERVAÇÃO: Você pode usar o comando "Renomear" no menu "Refatorar" para alterar o nome da classe "ClienteService" no arquivo de código, svc e configuração ao mesmo tempo.
    // OBSERVAÇÃO: Para iniciar o cliente de teste do WCF para testar esse serviço, selecione ClienteService.svc ou ClienteService.svc.cs no Gerenciador de Soluções e inicie a depuração.
    public class ClienteService : IClienteService
    {
        TesteGTIEntities4 db = new TesteGTIEntities4();
        public void Delete(Cliente cliente)
        {
            throw new NotImplementedException();
        }

        public void DoWork()
        {
        }

        public EnderecoCliente GetAll()
        {
            var teste = db.Cliente.Select(x => x.EnderecoCliente).First();
            return teste;
        }

        public List<Cliente> GetAllCliente()
        {
            using (TesteGTIEntities4 db = new TesteGTIEntities4())
            {
             var teste = db.Cliente.Include("EnderecoCliente").ToList();
                return db.Cliente.Include("EnderecoCliente").ToList();
            }

            
         
        }

        public EnderecoCliente GetAllEndereco()
        {
            var teste = db.Cliente.Select(x => x.EnderecoCliente).First();
            return teste;
        }

        public Cliente GetById(int id)
        {
            var cliente = db.Cliente.Include("EnderecoCliente").Where(x => x.Id == id).First();
           
            

            return cliente;
        }

        public Cliente GetClienteByName()
        {
            throw new NotImplementedException();
        }

        public Cliente Insert(Cliente cliente)
        {

            db.Cliente.Add(cliente);
            db.SaveChanges();
            return cliente;
        }

        public List<Cliente> GetClienteByName(string nome)
        {
            return db.Cliente.Include("EnderecoCliente").Where(x => x.nome.Contains(nome)).ToList();
        }

        public void Update(Cliente cliente)
        {
            throw new NotImplementedException();
        }
    }
}
