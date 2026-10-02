class CthulhuBot {
  constructor() {
    this.appliedDiscountType = null;
    this.isListening = false;
    this.initUI();
    this.initSpeechRecognition();
  }

  initUI() {
    this.chatToggleBtn = document.getElementById('chat-toggle-btn');
    this.chatWindow = document.getElementById('chat-window');
    this.closeChatBtn = document.getElementById('close-chat');
    this.chatMessages = document.getElementById('chat-messages');
    this.chatInput = document.getElementById('chat-input');
    this.chatSendBtn = document.getElementById('chat-send-btn');
    this.micBtn = document.getElementById('mic-btn');
    this.micStatus = document.getElementById('mic-status');
    this.themeToggleBtn = document.getElementById('theme-toggle');

    if (this.chatToggleBtn) {
      this.chatToggleBtn.addEventListener('click', () => this.toggleChat());
    }
    if (this.closeChatBtn) {
      this.closeChatBtn.addEventListener('click', () => this.toggleChat(false));
    }
    if (this.chatSendBtn) {
      this.chatSendBtn.addEventListener('click', () => this.handleSendMessage());
    }
    if (this.chatInput) {
      this.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleSendMessage();
      });
    }
    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
    }

    this.addBotMessage("Ph'nglui mglw'nafh... Eu sou Cthulhu, o guardião dos preços cósmicos! Deseja barganhar descontos das profundezas?");
  }

  // Configuração da Web Speech API (Entrada por Voz)
  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      if (this.micStatus) this.micStatus.textContent = "Microfone não suportado neste navegador.";
      if (this.micBtn) this.micBtn.disabled = true;
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'pt-BR';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    if (this.micBtn) {
      this.micBtn.addEventListener('click', () => this.toggleMic());
    }

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.micBtn) this.micBtn.classList.add('recording');
      if (this.micStatus) this.micStatus.textContent = "Escutando os sussurros cósmicos...";
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.micBtn) this.micBtn.classList.remove('recording');
      if (this.micStatus) this.micStatus.textContent = "Aguardando áudio...";
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      this.addUserMessage(transcript);
      this.processQuery(transcript);
    };

    this.recognition.onerror = () => {
      if (this.micStatus) this.micStatus.textContent = "Erro na captura de áudio. Tente novamente.";
    };
  }

  toggleMic() {
    if (!this.recognition) return;
    if (this.isListening) {
      this.recognition.stop();
    } else {
      this.recognition.start();
    }
  }

  toggleChat(forceState) {
    if (!this.chatWindow) return;
    if (forceState !== undefined) {
      this.chatWindow.classList.toggle('open', forceState);
    } else {
      this.chatWindow.classList.toggle('open');
    }
  }

  toggleTheme(targetTheme) {
    if (targetTheme === 'light') {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    } else if (targetTheme === 'dark') {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.toggle('light-theme');
    }
  }

  addBotMessage(text) {
    if (!this.chatMessages) return;
    const msg = document.createElement('div');
    msg.className = 'msg bot';
    msg.innerHTML = text;
    this.chatMessages.appendChild(msg);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

    // Resposta por voz (Text-To-Speech)
    this.speakText(text.replace(/<[^>]*>?/gm, ''));
  }

  addUserMessage(text) {
    if (!this.chatMessages) return;
    const msg = document.createElement('div');
    msg.className = 'msg user';
    msg.textContent = text;
    this.chatMessages.appendChild(msg);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }

  getCartSubtotal() {
    if (typeof cart === 'undefined' || !Array.isArray(cart)) return 0;
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
    if (!this.chatInput) return;
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

    // 1. Comando de Voz: Mudar Tema
    if (text.includes('modo claro') || text.includes('tema claro') || text.includes('mudar para claro')) {
      this.toggleTheme('light');
      this.addBotMessage("O abismo se ilumina! Modo claro ativado.");
      return;
    }

    if (text.includes('modo escuro') || text.includes('tema escuro') || text.includes('mudar para escuro')) {
      this.toggleTheme('dark');
      this.addBotMessage("As trevas de R'lyeh retornaram! Modo escuro ativado.");
      return;
    }

    // 2. Resposta de Dúvidas sobre Frete e Desconto por Voz
    if (text.includes('frete') || text.includes('entrega') || text.includes('envio') || text.includes('motoboy')) {
      this.addBotMessage("Entregamos a partir do centro de Pindamonhangaba via Motoboy Express para um raio de até 100 km por R$ 4,00 por quilômetro! Nas compras acima de R$ 200,00 o frete é totalmente grátis!");
      return;
    }

    if (text.includes('desconto') || text.includes('promo') || text.includes('carrinho') || text.includes('valor')) {
      if (subtotal === 0) {
        this.addBotMessage("Mortal imprudente... Seu carrinho está vazio! Adicione itens para liberar os descontos das profundezas.");
        return;
      }

      if (subtotal >= 300) {
        this.addBotMessage(`Sua oferenda é digna! Com R$ ${subtotal.toFixed(2).replace('.', ',')} no carrinho, você tem 10% DE DESCONTO TOTAL na sua compra!`);
      } else if (subtotal >= 200) {
        this.addBotMessage(`Invocarei a bênção do FRETE GRÁTIS para sua entrega por atingir R$ ${subtotal.toFixed(2).replace('.', ',')}!`);
      } else {
        const faltaPara200 = (200 - subtotal).toFixed(2).replace('.', ',');
        const faltaPara300 = (300 - subtotal).toFixed(2).replace('.', ',');
        this.addBotMessage(`Seu subtotal é R$ ${subtotal.toFixed(2).replace('.', ',')}. Adicione mais R$ ${faltaPara200} para FRETE GRÁTIS ou mais R$ ${faltaPara300} para 10% DE DESCONTO!`);
      }
      return;
    }

    if (text.includes('oi') || text.includes('olá') || text.includes('cthulhu')) {
      this.addBotMessage("Saudações! Pode me perguntar sobre o frete, pedir descontos ou solicitar a mudança do tema do site!");
    } else {
      this.addBotMessage(`Não compreendi '${text}'. Fale sobre frete, desconto ou peça para mudar para o modo claro ou escuro!`);
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