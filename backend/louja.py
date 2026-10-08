from flask import Flask, request, jsonify
from flask_cors import CORS
from thefuzz import process

app = Flask(__name__)
# Habilita CORS para todas as origens e rotas
CORS(app, resources={r"/api/*": {"origins": "*"}})

palavras_positivas = ["bom", "otimo", "legal", "amei", "incrivel", "adoro", "perfeito", "top", "cthulhu"]
palavras_negativas = ["caro", "horrivel", "ruim", "odeio", "lixo", "demora", "pessimo", "raiva", "absurdo", "procon"]

def analisar_humor(frase: str) -> int:
    pontuacao = 0
    palavras = frase.lower().split()
    for palavra in palavras:
        if palavra in palavras_positivas:
            pontuacao += 1
        elif palavra in palavras_negativas:
            pontuacao -= 1
    return pontuacao

matriz_de_intencoes = {
    "saudacao": {
        "treino": ["ola", "oi", "bom dia", "boa tarde", "fala ai", "saudacoes"],
        "resposta_feliz": "Ph'nglui mglw'nafh! O abismo saúda você na GeekZone. 🐙",
        "resposta_neutra": "Saudações das profundezas! Bem-vindo à GeekZone. Como posso ajudar?"
    },
    "frete": {
        "treino": ["qual o valor do frete", "entrega em casa", "frete gratis", "demora a entrega"],
        "resposta_feliz": "Nossos tentáculos entregam com frete grátis acima de R$ 200! 🚀",
        "resposta_neutra": "Nossa entrega é gratuita para compras acima de R$ 200,00."
    },
    "catalogo": {
        "treino": ["o que voces vendem", "tem sabre de luz", "produtos", "reliquias"],
        "resposta_feliz": "Possuímos relíquias sombrias! Sabres de Luz (R$250) e Figures do Goku (R$150).",
        "resposta_neutra": "Temos Sabres de Luz (R$250) e Action Figures do Goku (R$150)."
    },
    "desconto": {
        "treino": ["tem desconto", "tem promocao", "tem cupom", "posso ter desconto", "rito"],
        "resposta_feliz": "Invoque a palavra 'Cthulhu' no chat para obter 15% de desconto cósmico! 👁️",
        "resposta_neutra": "Acesse nossos rituais para obter 15% de desconto usando o cupom de Cthulhu."
    }
}

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "online", "entidade": "Cthulhu está acordado"}), 200

@app.route('/api/cerebro', methods=['POST'])
def cerebro_do_robo():
    pacote = request.get_json(silent=True) or {}
    mensagem_cliente = pacote.get('mensagem', '').strip().lower()

    if not mensagem_cliente:
        return jsonify({
            "resposta_agente": "O abismo escutou apenas o silêncio... Fale novamente.",
            "comando_tela": "nenhuma"
        })

    melhor_intencao = "saudacao"
    maior_pontuacao = 0
    for intencao, dados in matriz_de_intencoes.items():
        match, pontuacao = process.extractOne(mensagem_cliente, dados["treino"])
        if pontuacao > maior_pontuacao:
            maior_pontuacao = pontuacao
            melhor_intencao = intencao

    polaridade = analisar_humor(mensagem_cliente)
    acao_especial = "nenhuma"

    if polaridade < 0:
        resposta_final = "Sinta a calma das profundezas. Estou transferindo o seu atendimento para o nosso suporte no WhatsApp."
        acao_especial = "abrir_whatsapp"
    elif maior_pontuacao >= 55:
        if polaridade > 0:
            resposta_final = matriz_de_intencoes[melhor_intencao]["resposta_feliz"]
        else:
            resposta_final = matriz_de_intencoes[melhor_intencao]["resposta_neutra"]
    else:
        resposta_final = "Ph'nglui... Meus circuitos ancestrais só compreendem sobre artefatos e cultura Geek."

    return jsonify({
        "resposta_agente": resposta_final,
        "comando_tela": acao_especial
    })

if __name__ == '__main__':
    print("🐙 SERVIDOR CTHULHU ATIVADO NA PORTA 5000!")
    app.run(host='127.0.0.1', port=5000, debug=True)