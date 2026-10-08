// frontend/js/cthulhu-bot.js

class CthulhuBot {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
    this.activeDiscountPercentage = 0;
  }

  async conversar(userMessage) {
    const systemPrompt = `Você é Cthulhu, a entidade milenar das profundezas cósmicas e guardião da loja GeekZone.
Responda de forma sombria, enigmática e com humor geek.
Se a mensagem contiver as palavras "cthulhu", "desconto", "rito" ou "segredo", conceda 15% de desconto e avise o usuário.`;

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nO mortal diz: ${userMessage}` }] }]
        })
      });

      if (!response.ok) throw new Error(`Status API: ${response.status}`);

      const data = await response.json();
      const respostaTexto = data.candidates[0].content.parts[0].text;

      const msgLower = userMessage.toLowerCase();
      if (msgLower.includes("cthulhu") || msgLower.includes("desconto") || msgLower.includes("rito")) {
        this.activeDiscountPercentage = 0.15;
      }

      return respostaTexto;
    } catch (error) {
      console.warn("Fallback Cthulhu ativado:", error);
      const msgLower = userMessage.toLowerCase();
      if (msgLower.includes("cthulhu") || msgLower.includes("desconto") || msgLower.includes("rito")) {
        this.activeDiscountPercentage = 0.15;
        return "🐙 O ritual foi aceito! O abismo lhe concede 15% de desconto no carrinho.";
      }
      return "Ph'nglui mglw'nafh... As águas estão agitadas, mas eu ainda protejo seus desejos geek.";
    }
  }

  calculateDiscounts() {
    const subtotal = typeof cart !== 'undefined' 
      ? cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) 
      : 0;

    let discountAmount = subtotal * this.activeDiscountPercentage;
    let finalShippingCost = typeof currentShippingCost !== 'undefined' ? currentShippingCost : 0;

    if (subtotal >= 300 && this.activeDiscountPercentage === 0) {
      discountAmount = subtotal * 0.10;
    } else if (subtotal >= 200) {
      finalShippingCost = 0;
    }

    return { discountAmount, finalShippingCost };
  }
}

const GEMINI_API_KEY = "SUA_CHAVE_AQUI";
const cthulhuBotInstance = new CthulhuBot(GEMINI_API_KEY);