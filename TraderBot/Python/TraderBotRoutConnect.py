# -*- coding: utf-8 -*-

# ------------------------ Inicialização ------------------------

import MetaTrader5 as mt5
import pandas as pd
from flask import Flask, request, jsonify

app = Flask(__name__)

if not mt5.initialize():
    print("Falha na conexão com o MetaTrader 5", mt5.last_error())
    quit()
    mt5.shutdown() 
    
    
# ------------------------ Métodos ------------------------
@app.route('/')
def index():
    return "Bem-vindo ao TraderBot!"

@app.route('/recomendacao', methods=['POST'])
def recomendacao():
    try:
        dados = request.json  # Recebe os dados enviados pelo MQL5
        
        if dados is None:
            raise ValueError("Nenhum JSON recebido ou formato incorreto")
        print(f"Dados recebidos do MQL5: {dados}")  # Exibe os dados para verificação
        
        preco = dados.get('preco', None)
        if preco is None:
            raise ValueError("Chave 'preco' ausente no JSON")
        
        # Lógica de recomendação simples
        recomendacao = "COMPRA" if preco < 100 else "VENDA"
        
        # Retorna a recomendação para o MQL5
        return jsonify({"recomendacao": recomendacao}), 200
    
    except Exception as e:
        print(f"Erro ao processar recomendação: {str(e)}")
        return jsonify({"error": "Erro no servidor"}), 500  # Retorna erro 500 para erros inesperados

def adicionarAtivoEmObservacaoDeMercado(ativo):
    mt5.symbol_select(ativo, True)
    
def salvarDadosEmArquivoCSV(dados):
    pd.DataFrame(dados.T.to_csv('DADOS_PRECOS.csv', mode='a', header=False, index=False))


# ------------------------ Operações ------------------------
if __name__ == '__main__':
    try:
        app.run(port=5000)
    finally:
        mt5.shutdown()
        print("Conexão com o MetaTrader 5 finalizada")