class CthulhuBot {
  constructor() {
    this.appliedDiscountType = null;
    this.initUI();
  }

  initUI() {
    this.chatToggleBtn = document.getElementById('chat-toggle-btn');
    this.chatWindow = document.getElementById('chat-window');
    this.closeChatBtn = document.getElementById('close-chat');
    this.chatMessages = document.getElementById('chat-messages');
    this.chatInput = document.getElementById('chat-input');
    this.chatSendBtn = document.getElementById('chat-send-btn');

    this.chatToggleBtn.addEventListener('click', () => this.toggleChat());
    this.closeChatBtn.addEventListener('click', () => this.toggleChat(false));
    this.chatSendBtn.addEventListener('click', () => this.handleSendMessage());
    this.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSendMessage();
    });

    this.addBotMessage("Ph'nglui mglw'nafh... Eu sou Cthulhu, o guardião dos preços cósmicos! Deseja barganhar descontos das profundezas?");
  }

  toggleChat(forceState) {
    if (forceState !== undefined) {
      this.chatWindow.classList.toggle('open', forceState);
    } else {
      this.chatWindow.classList.toggle('open');
    }
  }

  addBotMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'msg bot';
    msg.innerHTML = text;
    this.chatMessages.appendChild(msg);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'msg user';
    msg.textContent = text;
    this.chatMessages.appendChild(msg);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  getCartSubtotal() {
    if (typeof cart === 'undefined') return 0;
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  calculateDiscounts() {
    const subtotal = this.getCartSubtotal();
    let discountAmount = 0;
    let finalShippingCost = typeof currentShippingCost !== 'undefined' ? currentShippingCost : 0;

    if (subtotal >= 300) {
      this.appliedDiscountType = 'ten_percent';
      discountAmount = subtotal * 0.10;
    } else if (subtotal >= 200) {
      this.appliedDiscountType = 'free_shipping';
      finalShippingCost = 0;
    } else {
      this.appliedDiscountType = null;
    }

    return { subtotal, discountAmount, finalShippingCost, type: this.appliedDiscountType };
  }

  handleSendMessage() {
    const input = this.chatInput.value.trim();
    if (!input) return;

    this.addUserMessage(input);
    this.chatInput.value = '';

    setTimeout(() => {
      this.processQuery(input.toLowerCase());
    }, 400);
  }

  processQuery(text) {
    const subtotal = this.getCartSubtotal();

    if (text.includes('desconto') || text.includes('frete') || text.includes('promo') || text.includes('carrinho') || text.includes('valor')) {
      if (subtotal === 0) {
        this.addBotMessage("Mortal imprudente... Seu carrinho está *VAZIO*! Adicione relíquias à sua oferenda antes de invocar meus favores.");
        return;
      }

      if (subtotal >= 300) {
        this.addBotMessage(`Ia! Ia! Sua oferenda é digna! Por ultrapassar R$ 300,00 (Subtotal atual: R$ ${subtotal.toFixed(2).replace('.', ',')}), concedo-lhe o **Bônus das Profundezas: 10% DE DESCONTO** em toda a compra!`);
      } else if (subtotal >= 200) {
        this.addBotMessage(`Os ventos de R'lyeh sopram a seu favor! Por ultrapassar R$ 200,00 (Subtotal atual: R$ ${subtotal.toFixed(2).replace('.', ',')}), invocarei a bênção do **FRETE GRÁTIS** para sua entrega!`);
      } else {
        const faltaPara200 = (200 - subtotal).toFixed(2).replace('.', ',');
        const faltaPara300 = (300 - subtotal).toFixed(2).replace('.', ',');
        this.addBotMessage(`Humano insignificante... Seu subtotal é R$ ${subtotal.toFixed(2).replace('.', ',')}.<br><br>• Adicione mais **R$ ${faltaPara200}** para libertar o **FRETE GRÁTIS**!<br>• Adicione mais **R$ ${faltaPara300}** para obter **10% DE DESCONTO TOTAL**!`);
      }
    } else if (text.includes('oi') || text.includes('olá') || text.includes('cthulhu')) {
      this.addBotMessage(`Saudações da cidade submersa! Eu contemplo seu carrinho acumulando R$ ${subtotal.toFixed(2).replace('.', ',')}. Peça por 'desconto' ou 'frete' e revelarei suas recompensas!`);
    } else {
      this.addBotMessage(`Sua sanidade fraqueja ao falar '${text}'? Fale sobre **desconto**, **frete** ou consulte o valor do seu **carrinho**!`);
    }

    if (typeof updateCartUI === 'function') {
      updateCartUI();
    }
  }
}

let cthulhuBotInstance = null;
document.addEventListener('DOMContentLoaded', () => {
  cthulhuBotInstance = new CthulhuBot();
});