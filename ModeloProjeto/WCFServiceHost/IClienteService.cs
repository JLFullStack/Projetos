using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;

namespace WCFServiceHost
{
    // OBSERVAÇÃO: Você pode usar o comando "Renomear" no menu "Refatorar" para alterar o nome da interface "IClienteService" no arquivo de código e configuração ao mesmo tempo.
    [ServiceContract]
    public interface IClienteService
    {
        [OperationContract]
        void DoWork();
        [OperationContract]
        void Update(Cliente cliente);
        [OperationContract]
        Cliente GetById(int id);
        [OperationContract]
        List<Cliente> GetAllCliente();
        [OperationContract]
        void Delete(Cliente cliente);
        [OperationContract]
        Cliente Insert(Cliente cliente);
        [OperationContract]
        EnderecoCliente GetAllEndereco();
        [OperationContract]
        List<Cliente> GetClienteByName(string nome);


    }
}
