# backend/servidor.py - Servidor Flask Completo com Todas as Intenções e Comandos

from flask import Flask, request, jsonify
from flask_cors import CORS
from thefuzz import process

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Vocabulário para análise de sentimento
palavras_positivas = [
    "bom", "otimo", "legal", "amei", "incrivel", "adoro", "perfeito", "top", 
    "cthulhu", "stars", "resident", "excelente", "maravilha", "satisfeito", "recomendo"
]
palavras_negativas = [
    "caro", "horrivel", "ruim", "odeio", "lixo", "demora", "pessimo", "raiva", 
    "absurdo", "procon", "virus", "infectado", "defeito", "quebrado", "cancelar", "fraude"
]

def analisar_humor(frase: str) -> int:
    pontuacao = 0
    palavras = frase.lower().split()
    for palavra in palavras:
        if palavra in palavras_positivas:
            pontuacao += 1
        elif palavra in palavras_negativas:
            pontuacao -= 1
    return pontuacao


# Matriz de Intenções Completa
matriz_de_intencoes = {
    "saudacao": {
        "treino": ["ola", "oi", "bom dia", "boa tarde", "boa noite", "fala ai", "saudacoes", "hey", "coe", "opa"],
        "resposta_feliz": "Ph'nglui mglw'nafh! O abismo e a GeekZone saúdam você. 🐙",
        "resposta_neutra": "Saudações das profundezas! Bem-vindo à GeekZone. Como posso ajudar?"
    },
    "frete": {
        "treino": ["qual o valor do frete", "entrega em casa", "frete gratis", "demora a entrega", "prazo de entrega", "envio", "calculo de frete", "transportadora"],
        "resposta_feliz": "Nossos tentáculos entregam com frete grátis para compras acima de R$ 200! 🚀",
        "resposta_neutra": "O frete é calculado pela distância (até 100km). Compras acima de R$ 200 ganham frete grátis."
    },
    "catalogo": {
        "treino": ["o que voces vendem", "tem sabre de luz", "produtos", "reliquias", "action figure", "teclado", "headset", "estoque", "artefatos"],
        "resposta_feliz": "Possuímos relíquias incríveis! Sabres de Luz, Figures do Goku, Headsets e Teclados Mecânicos. 🗡️",
        "resposta_neutra": "Nosso catálogo conta com eletrônicos e colecionáveis geek de alta qualidade."
    },
    "desconto": {
        "treino": ["tem desconto", "tem promocao", "tem cupom", "posso ter desconto", "rito", "codigo promocional", "oferta", "liquidacao"],
        "resposta_feliz": "Invoque 'Cthulhu' no chat para 15% OFF ou acione 'STARS' para 20% OFF! 👁️",
        "resposta_neutra": "Utilize cupons especiais durante a conversa para liberar descontos no carrinho."
    },
    "pagamento": {
        "treino": ["formas de pagamento", "aceita pix", "cartao de credito", "boleto", "como posso pagar", "parcelamento", "dividir em vezes", "dinheiro"],
        "resposta_feliz": "Aceitamos Pix instantâneo com desconto, boleto bancário e cartão de crédito em até 12x sem juros! 💳",
        "resposta_neutra": "Aceitamos PIX, Cartão de Crédito e Boleto Bancário."
    },
    "garantia": {
        "treino": ["tem garantia", "e se quebrar", "troca de produto", "politica de devolucao", "produto com defeito", "estragou"],
        "resposta_feliz": "Todos os artefatos possuem 90 dias de garantia blindada contra maldições e defeitos de fábrica! 🛡️",
        "resposta_neutra": "Oferecemos 90 dias de garantia contratual para todos os produtos."
    },
    "rastreio": {
        "treino": ["onde esta meu pedido", "rastrear encomenda", "codigo de rastreio", "status da entrega", "localizar pacote"],
        "resposta_feliz": "Acompanhe sua encomenda em tempo real! Insira o código enviado no seu e-mail de confirmação. 📦",
        "resposta_neutra": "O código de rastreamento é enviado para o seu e-mail assim que o pedido é despachado."
    },
    "cancelamento": {
        "treino": ["quero cancelar", "reembolso", "devolucao de dinheiro", "estorno", "cancelar compra"],
        "resposta_feliz": "Processamos cancelamentos em até 7 dias após o recebimento com estorno total do valor.",
        "resposta_neutra": "Para cancelamentos e reembolsos, entre em contato com nosso suporte com o número do pedido."
    },
    "loja_fisica": {
        "treino": ["onde fica a loja", "endereco", "loja fisica", "posso retirar", "ponto de retirada", "horario de funcionamento"],
        "resposta_feliz": "Nossa matriz fica nas profundezas digitais, mas despachamos artefatos para todo o Brasil! 📍",
        "resposta_neutra": "Operamos 100% online com entregas via transportadora e correios."
    },
    "atendimento_humano": {
        "treino": ["falar com atendente", "falar com humano", "suporte humano", "whatsapp", "telefone", "sac"],
        "resposta_feliz": "Vou te conectar diretamente com nossos guardiões do suporte no WhatsApp! 📱",
        "resposta_neutra": "Estou direcionando seu atendimento para nossa equipe de suporte humano."
    },
    "cthulhu_lore": {
        "treino": ["quem e cthulhu", "hp lovecraft", "rlyeh", "chamado de cthulhu", "o que e cthulhu"],
        "resposta_feliz": "Ph'nglui mglw'nafh Cthulhu R'lyeh wgah'nagl fhtagn! O Grande Antigo desperta na GeekZone. 🐙",
        "resposta_neutra": "Cthulhu é a entidade cósmica ancestral criada por H.P. Lovecraft e guardião desta loja."
    },
    "brinde": {
        "treino": ["brinde", "quero brinde", "tem brinde", "ganhar brinde", "chaveiro", "mimo", "presente"],
        "resposta_feliz": "🎁 [O ABISMO PRESENTEIA]: Os deuses cósmicos concederam-lhe um Chaveiro Geek Exclusivo! Ele já foi adicionado ao seu carrinho.",
        "resposta_neutra": "🎁 Adicionamos um Chaveiro Geek de brinde ao seu carrinho de compras!"
    },
    "resident_evil": {
        "treino": [
            "umbrella", "t-virus", "raccoon city", "stars", "resident evil", 
            "leon", "nemesis", "hunk", "red queen"
        ],
        "resposta_feliz": "☣️ [UMBRELLA CORP]: Biohazard detectado! Utilize o código 'STARS' ou o cheat clássico para munição ilimitada.",
        "resposta_neutra": "☣️ [RED QUEEN]: Acesso ao laboratório de Raccoon City liberado. Cuidado com contaminações."
    },
    "fallout_necrotico": {
        "treino": [
            "fallout", "pipboy", "pip-boy", "necrotico", "necrótico", 
            "ghoul", "vault", "vault-tec", "wasteland", "bomba nuclear", "rads"
        ],
        "resposta_feliz": "☢️ [VAULT-TEC ALERT]: Protocolo Pip-Boy ativado! Sobreviva à Wasteland com o nosso cursor necrótico.",
        "resposta_neutra": "☢️ [SISTEMA PIP-BOY 3000]: Radiação detectada na interface."
    },
    "auto_destruicao": {
        "treino": [
            "autodestruicao", "autodestruição", "auto destruicao", "auto destruição", 
            "destruir site", "explodir", "purga", "self destruct"
        ],
        "resposta_feliz": "🚨 [ALERTA CRÍTICO]: Sequência de auto destruição iniciada! A interface será eliminada em 5 segundos.",
        "resposta_neutra": "🚨 Sequência de auto destruição ativada."
    }
}


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online", 
        "total_intencoes": len(matriz_de_intencoes)
    }), 200


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

    # Verificação de comandos e ações de tela
    if any(t in mensagem_cliente for t in ["autodestruicao", "autodestruição", "auto destruicao"]) or melhor_intencao == "auto_destruicao":
        acao_especial = "auto_destruicao"
    elif "brinde" in mensagem_cliente or melhor_intencao == "brinde":
        acao_especial = "adicionar_brinde"
    elif "necrotico" in mensagem_cliente or "necrótico" in mensagem_cliente or melhor_intencao == "fallout_necrotico":
        acao_especial = "ativar_fallout"
    elif any(termo in mensagem_cliente for termo in matriz_de_intencoes["resident_evil"]["treino"]) or melhor_intencao == "resident_evil":
        acao_especial = "mostrar_umbrella"
    elif melhor_intencao == "atendimento_humano" or polaridade < -1:
        acao_especial = "abrir_whatsapp"

    # Definição da resposta textual
    if acao_especial == "abrir_whatsapp":
        resposta_final = "Sinta a calma das profundezas. Estou a transferir o seu atendimento para o nosso suporte no WhatsApp."
    elif maior_pontuacao >= 48:
        if polaridade > 0:
            resposta_final = matriz_de_intencoes[melhor_intencao]["resposta_feliz"]
        else:
            resposta_final = matriz_de_intencoes[melhor_intencao]["resposta_neutra"]
    else:
        resposta_final = "Ph'nglui... Os meus circuitos ancestrais não compreenderam. Tente perguntar sobre produtos, frete, pagamentos, brindes ou segredos."

    return jsonify({
        "resposta_agente": resposta_final,
        "comando_tela": acao_especial,
        "intencao_identificada": melhor_intencao,
        "precisao_match": maior_pontuacao
    })


if __name__ == '__main__':
    print("🐙 SERVIDOR GEEKZONE ATIVO (PORTA 5000) - SISTEMAS CONSOLIDADOS!")
    app.run(host='127.0.0.1', port=5000, debug=True)