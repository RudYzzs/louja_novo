// frontend/js/self-destruct.js - Módulo de Auto Destruição

(function () {
  let isDestructing = false;

  window.iniciarAutoDestruicao = function () {
    if (isDestructing) return;
    isDestructing = true;

    // 1. Criar overlay de emergência de auto destruição
    const overlay = document.createElement('div');
    overlay.id = 'self-destruct-overlay';
    overlay.className = 'self-destruct-overlay';
    overlay.innerHTML = `
      <div class="destruct-box">
        <div class="destruct-icon">🚨</div>
        <h1 class="destruct-title">PROTOCOLO DE AUTO DESTRUIÇÃO</h1>
        <p class="destruct-warning">TODOS OS DADOS E INTERFACE SERÃO ELIMINADOS</p>
        <div id="destruct-timer" class="destruct-timer">05</div>
        <div class="destruct-bar-container">
          <div id="destruct-progress" class="destruct-progress"></div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    let tempo = 5;
    const timerEl = document.getElementById('destruct-timer');
    const progressEl = document.getElementById('destruct-progress');

    // Reproduzir bipe de alarme via som sintetizado nativo
    const emitirAlarme = () => {
      if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance("Warning. Self destruction sequence initiated.");
        msg.lang = 'en-US';
        msg.rate = 1.2;
        window.speechSynthesis.speak(msg);
      }
    };
    emitirAlarme();

    const interval = setInterval(() => {
      tempo--;
      if (timerEl) timerEl.textContent = tempo < 10 ? `0${tempo}` : tempo;
      if (progressEl) progressEl.style.width = `${((5 - tempo) / 5) * 100}%`;

      if (tempo <= 0) {
        clearInterval(interval);
        executarDestruicaoTotal();
      }
    }, 1000);
  };

  function executarDestruicaoTotal() {
    // Efeito de Flash Branco/Sinal Corrompido antes de apagar tudo
    document.body.innerHTML = `
      <div class="glitch-screen"></div>
    `;

    setTimeout(() => {
      // Esvazia completamente a tela (DOM)
      document.body.innerHTML = `
        <div class="destroyed-terminal">
          <div class="terminal-text">
            <p>[ SYSTEM PURGED ]</p>
            <p>> A estrutura foi completamente destruída.</p>
            <p>> Recarregue a página (F5) para reconstruir a GeekZone.</p>
          </div>
        </div>
      `;
      document.body.style.backgroundColor = '#000000';
      document.body.style.margin = '0';
      document.body.style.overflow = 'hidden';
    }, 800);
  }
})();