# -*- coding: utf-8 -*-
# Copyright 2024, Lucas Araujo.
# https://jlfullstack.github.io/Portifolio/

import MetaTrader5 as mt5
import socket
import pandas as pd
import json
import logging
import pyodbc

# Configura o logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


# ------------------------ Inicialização do Banco de Dados ------------------------
connectionString = (
    "Driver={SQL Server};"
    "Server=PCLUCAS\\SQLEXPRESS;"
    "Database=dbTraderBot;"
    "Trusted_Connection=yes;"    
)

try:
    dbTraderBot = pyodbc.connect(connectionString) # Conexão com o banco de dados SQL Server
    logging.info("Conectado ao banco")
except pyodbc.Error as e:
    logging.error(f"Erro de conexão: {e}")
 
    
# ------------------------ Inicialização do MetaTrader 5 ------------------------
# Inicializa o MetaTrader 5
if not mt5.initialize():
    logging.error("Falha na conexão com o MetaTrader 5: %s", mt5.last_error())
    quit()
    mt5.shutdown() 

# Popula a tabela "tbAtivo" com todos os ativos da corretora  
ativosCorretora = mt5.symbols_get() # Coleta todos os ativos da corretora
tbAtivo = pd.read_sql('SELECT * FROM tbAtivo', dbTraderBot)

for ativo in ativosCorretora:
    if ativo.name not in tbAtivo['ativo'].values:
        cursor = dbTraderBot.cursor()
        
        try:
            cursor.execute('INSERT INTO tbAtivo (ativo) VALUES (?)', ativo.name)
            dbTraderBot.commit()
        except pyodbc.Error as e:
            logging.error(f"Erro ao inserir ativo {ativo.name}: {e}")
        finally:
            cursor.close()


# ------------------------ Inicialização do Servidor para conexão entre o robô Python e robô MQL5 ------------------------
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM) # Criar o socket TCP
server_socket.settimeout(60) # Define um timeout para evitar conexões presas

# Define o endereço IP e a porta que o servidor irá ouvir
server_address = ('localhost', 65432)
server_socket.bind(server_address)

# Coloca o socket em modo de escuta
server_socket.listen(1)
logging.info("Servidor aguardando conexão...")


# ------------------------ Processamento de Conexões ------------------------
while True:
    connection = None  # Inicializa a variável connection    
    try:
        connection, client_address = server_socket.accept() # Aguarda a conexão de um cliente
        # logging.info(f"Conexão estabelecida com: {client_address}")
        
        connection.settimeout(30) # Define um timeout para conexões individuais
        data = connection.recv(1024) # Recebe dados do cliente
                
        if data:
            # logging.info(f"Dados recebidos: {data.decode()}")
            try:
                dados = json.loads(data.decode())
            except json.JSONDecodeError:
                logging.error("Erro ao decodificar JSON recebido.")
                connection.sendall(b"Erro: JSON invalido.")
                continue
            
        # Processa os dados recebidos e cria um DataFrame
        dados = pd.DataFrame(list(dados.items()), columns=['Chave', 'Valor'])
        # logging.info(f"Dados recebidos: {dados}")
            
        # Extração de dados com verificações adicionais
        ativo = dados[dados['Chave'] == 'ativo']['Valor'].values
        if len(ativo) == 0:
            raise ValueError("Chave 'ativo' ausente no JSON")

        ativo = ativo[0]
    
        recomendacao = "COMPRA"
        connection.sendall(recomendacao.encode()) # Envia a recomendação
        connection.shutdown(socket.SHUT_WR) # Sinaliza que não enviaremos mais dados

    # Timeout para desconectar conexões demoradas
    except socket.timeout:
        logging.warning("Timeout da conexão com o cliente.")
    
    except Exception as e:
        logging.error(f"Erro ao processar a conexão: {e}")
        
    finally:
        # Verifica se a conexão foi estabelecida antes de tentar fechá-la
        if connection:  
            connection.close()  # Fecha a conexão ao final da interação
            # logging.info("Conexão fechada.")
      
mt5.shutdown()
dbTraderBot.close()
logging.info("Conexão com MetaTrader 5 e banco de dados encerrada.")
