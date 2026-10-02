// cthulhu-bot.js

class CthulhuBot {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
    this.activeDiscountPercentage = 0; // Porcentagem de desconto concedida pelo Cthulhu
  }

  /**
   * Envia uma mensagem para a API do Gemini com o contexto do Cthulhu.
   * @param {string} userMessage - Mensagem/enigma enviado pelo usuário.
   */
  async conversar(userMessage) {
    const systemPrompt = `Você é o Cthulhu, uma entidade cósmica e mascote da loja GeekZone. 
Sua personalidade é sombria, misteriosa, mas prestativa e bem-humorada.
Se o usuário responder a um enigma ou disser palavras mágicas como "Cthulhu", "Invocação" ou "Rituais", conceda 15% de desconto.
Responda sempre em português de forma concisa.`;

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\nUsuário: ${userMessage}` }]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Erro API Gemini: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;

      // Exemplo de regra: se o usuário citar palavras-chave ou a IA aprovar, ativa o desconto cósmico de 15%
      if (userMessage.toLowerCase().includes("cthulhu") || userMessage.toLowerCase().includes("desconto")) {
        this.activeDiscountPercentage = 0.15; // 15% de desconto
      }

      return text;
    } catch (error) {
      console.error("Erro ao comunicar com o Cthulhu Bot:", error);
      return "As profundezas do oceano estão silenciosas no momento... Tente novamente mais tarde.";
    }
  }

  /**
   * Método chamado pelo louja.js para aplicar regras de desconto no carrinho.
   */
  calculateDiscounts() {
    // Pega o subtotal atual a partir do array 'cart' global
    const subtotal = typeof cart !== 'undefined' 
      ? cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) 
      : 0;

    let discountAmount = subtotal * this.activeDiscountPercentage;
    let finalShippingCost = typeof currentShippingCost !== 'undefined' ? currentShippingCost : 0;

    // Regras adicionais de frete ou desconto por valor de compra
    if (subtotal >= 300 && this.activeDiscountPercentage === 0) {
      discountAmount = subtotal * 0.10; // 10% padrão se não tiver desconto do Cthulhu
    } else if (subtotal >= 200) {
      finalShippingCost = 0; // Frete grátis para compras acima de R$ 200
    }

    return {
      discountAmount,
      finalShippingCost
    };
  }
}

// Instancia a classe globalmente para o louja.js utilizar
// IMPORTANTE: Subsitua pela sua chave de API gerada no Google AI Studio
const GEMINI_API_KEY = "AQ.Ab8RN6K9Sf0G_y670AcBmeYQAp4t7A1TgOV6LrmfNXI62C3aJQ";
const cthulhuBotInstance = new CthulhuBot(GEMINI_API_KEY);