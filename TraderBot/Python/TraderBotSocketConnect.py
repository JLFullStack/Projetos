# -*- coding: utf-8 -*-
# Copyright 2024, Lucas Araujo.
# https://jlfullstack.github.io/Portifolio/

# ------------------------ Inicialização ------------------------
import MetaTrader5 as mt5
import socket
import pandas as pd
import json

if not mt5.initialize():
    print("Falha na conexão com o MetaTrader 5", mt5.last_error())
    quit()
    mt5.shutdown() 

# Criar o socket TCP
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_address = ('localhost', 65432)
server_socket.bind(server_address)

# Colocar o socket em modo de escuta
server_socket.listen(1)
print("Servidor aguardando conexão...")

while True:
    connection, client_address = server_socket.accept()
    
    try:
        print(f"Conexão estabelecida em: {client_address}")
        
        # Receber dados do cliente
        data = connection.recv(1024)
                
        # Processar dados e enviar resposta
        if data:
            jsonData = json.loads(data.decode())
            infoAtivo = pd.DataFrame(list(jsonData.items()), columns=['Chave', 'Valor'])
            
            # Extrair o preço do DataFrame
            preco = infoAtivo[infoAtivo['Chave'] == 'preco']['Valor'].values[0]
            
            if preco is None:
                raise ValueError("Chave 'preco' ausente no JSON")
                
            print(f"Dados recebidos: {infoAtivo}")
            
            # Lógica de recomendação simples
            recomendacao = "COMPRA" if preco < 100 else "VENDA"
            
            connection.sendall(recomendacao.encode()) # Envia a recomendação
            connection.shutdown(socket.SHUT_WR) # Fecha o lado de escrita do socket para indicar que a mensagem está completa
            
    except Exception as e:
        print(f"Erro ao processar a conexão: {e}")
        
    finally:
        connection.close()
      
mt5.shutdown()
print("Conexão com o MetaTrader 5 finalizada")