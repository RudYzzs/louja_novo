// frontend/js/chat-ui.js

function falar(texto) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

function adicionarMensagemNaTela(remetente, texto) {
  const chatMessages = document.getElementById("chat-messages");
  if (!chatMessages) return null;

  const msgId = 'msg-' + Date.now();
  const div = document.createElement("div");
  div.id = msgId;
  div.className = `chat-message ${remetente}`;
  div.textContent = `${remetente === 'user' ? 'Mortal: ' : '🐙 Cthulhu: '}${texto}`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return msgId;
}

async function enviarMensagem() {
  const inputField = document.getElementById("user-input");
  if (!inputField) return;

  const textoUsuario = inputField.value.trim();
  if (!textoUsuario) return;

  adicionarMensagemNaTela('user', textoUsuario);
  inputField.value = "";

  const idTemp = adicionarMensagemNaTela('bot', 'A consultar o abismo...');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 segundos timeout

  try {
    // Tenta primeiro a API Flask em Python
    const resposta = await fetch("http://127.0.0.1:5000/api/cerebro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensagem: textoUsuario }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (resposta.ok) {
      const dados = await resposta.json();
      const elTemp = document.getElementById(idTemp);
      if (elTemp) elTemp.remove();

      adicionarMensagemNaTela('bot', dados.resposta_agente);
      falar(dados.resposta_agente);

      if (dados.comando_tela === "abrir_whatsapp") {
        const numeroWhatsapp = "5512992247428";
        const msgPronta = "Olá, vim através da GeekZone e preciso de suporte.";
        const linkWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(msgPronta)}`;
        setTimeout(() => { window.open(linkWhatsapp, "_blank"); }, 2000);
      }
    } else {
      throw new Error("Servidor retornou erro");
    }
  } catch (erro) {
    clearTimeout(timeoutId);
    // Fallback gracioso para a API Cthulhu Gemini
    if (typeof cthulhuBotInstance !== 'undefined' && cthulhuBotInstance) {
      const respostaGemini = await cthulhuBotInstance.conversar(textoUsuario);
      const elTemp = document.getElementById(idTemp);
      if (elTemp) elTemp.remove();

      adicionarMensagemNaTela('bot', respostaGemini);
      falar(respostaGemini);

      if (typeof updateCartUI === 'function') {
        updateCartUI();
      }
    } else {
      const elTemp = document.getElementById(idTemp);
      if (elTemp) elTemp.remove();
      const msgErro = "O abismo está temporariamente inacessível. Verifique o servidor Python.";
      adicionarMensagemNaTela('bot', msgErro);
      falar(msgErro);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const chatToggleBtn = document.getElementById('chat-toggle-btn');
  const chatWindow = document.getElementById('chat-window');
  const closeChatBtn = document.getElementById('close-chat');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const inputField = document.getElementById('user-input');
  const micBtn = document.getElementById('mic-btn');
  const micStatus = document.getElementById('mic-status');

  if (chatToggleBtn && chatWindow) {
    chatToggleBtn.addEventListener('click', () => chatWindow.classList.toggle('open'));
  }

  if (closeChatBtn && chatWindow) {
    closeChatBtn.addEventListener('click', () => chatWindow.classList.remove('open'));
  }

  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', enviarMensagem);
  }

  if (inputField) {
    inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') enviarMensagem();
    });
  }

  // Reconhecimento de Voz via Web Speech API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition && micBtn) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;

    micBtn.addEventListener('click', () => {
      try {
        recognition.start();
        if (micStatus) {
          micStatus.style.display = 'block';
          micStatus.textContent = 'A escutar invocação por voz...';
        }
      } catch (err) {
        console.warn("Reconhecimento de voz já ativo.");
      }
    });

    recognition.onresult = (e) => {
      const transcricao = e.results[0][0].transcript;
      if (inputField) inputField.value = transcricao;
      if (micStatus) micStatus.style.display = 'none';
      enviarMensagem();
    };

    recognition.onerror = () => {
      if (micStatus) {
        micStatus.textContent = 'Erro ao capturar voz.';
        setTimeout(() => { micStatus.style.display = 'none'; }, 2000);
      }
    };

    recognition.onend = () => {
      if (micStatus) micStatus.style.display = 'none';
    };
  } else if (micBtn) {
    micBtn.style.display = 'none';
  }
});