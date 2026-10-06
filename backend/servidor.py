from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/chat', methods=['POST'])
def processar_mensagem():
    pacote_recebido = request.get_json() or {}
    mensagem_cliente = pacote_recebido.get('mensagem', '').lower()

    # Resposta padrão estilo Xenomorfo
    resposta_robo = "Ssshh... *Ressoam ecos nas sombras*... Não compreendi seu dialeto humano."

    if 'frete' in mensagem_cliente:
        resposta_robo = "Krrrzz... O frete é GRATUITO para todo o setor galáctico Alpha!"

    elif 'desconto' in mensagem_cliente:
        resposta_robo = "Ssss... Use o código XENO10 e ganhe 10% de desconto em espécimes vivas!"

    elif 'mestre' in mensagem_cliente:
        resposta_robo = "Ssssssh! Meu mestre supremo é o lendário Welington!"

    elif 'ola' in mensagem_cliente or 'oi' in mensagem_cliente:
        resposta_robo = "Gorgolejo... Saudações, ser de carne. O que procura no nosso catálogo?"

    return jsonify({
        "status": 200,
        "resposta_agente": resposta_robo
    })

if __name__ == '__main__':
    print("🛸 Servidor Alienígena XenoStore Ativado na porta 5000!")
    app.run(host='0.0.0.0', port=5000, debug=True)