// frontend/js/fallout-easter-egg.js

(function () {
  let typedBuffer = "";
  let falloutActive = false;

  // Detetor de digitação global no site para a palavra "necrotico"
  document.addEventListener('keydown', (e) => {
    // Permite digitação dentro de inputs, mas acumula o texto
    typedBuffer += e.key.toLowerCase();
    
    if (typedBuffer.length > 20) {
      typedBuffer = typedBuffer.substring(typedBuffer.length - 20);
    }

    if (typedBuffer.includes("necrotico") || typedBuffer.includes("necrótico")) {
      ativarFalloutMode();
      typedBuffer = "";
    }
  });

  // Função Global exportada para ser chamada também via Chatbot
  window.ativarFalloutMode = function () {
    if (falloutActive) return;
    falloutActive = true;

    // 1. Alterar a classe do corpo para aplicar o cursor e tema Pip-Boy
    document.body.classList.add('fallout-ghoul-mode');

    // 2. Criar a interface de Lançamento Nuclear
    const overlay = document.createElement('div');
    overlay.id = 'fallout-nuke-overlay';
    overlay.className = 'fallout-nuke-overlay';
    overlay.innerHTML = `
      <div class="pipboy-screen">
        <div class="crt-lines"></div>
        <div class="vault-tec-header">
          <span>VAULT-TEC DEFENSE SYSTEM</span>
          <span>WARNING: HIGH RADIATION LEVEL</span>
        </div>
        
        <div class="nuke-timer-container">
          <p class="nuke-status">TACTICAL NUKES LAUNCH AUTHORIZED</p>
          <div id="nuke-countdown" class="nuke-countdown">05</div>
          <p class="nuke-subtext">EVACUATE TO THE NEAREST VAULT IMMEDIATELY</p>
        </div>

        <div id="missile-container" class="missile-container">
          <div class="icbm-missile">🚀</div>
        </div>

        <div id="nuke-flash" class="nuke-flash"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    // 3. Contagem Regressiva e Lançamento do Míssil
    let tempo = 5;
    const countEl = document.getElementById('nuke-countdown');
    const missileContainer = document.getElementById('missile-container');
    const flashEl = document.getElementById('nuke-flash');

    const interval = setInterval(() => {
      tempo--;
      if (countEl) countEl.innerText = tempo < 10 ? `0${tempo}` : tempo;

      if (tempo === 2) {
        // Dispara a animação do míssil subindo na tela
        missileContainer.classList.add('launch');
      }

      if (tempo <= 0) {
        clearInterval(interval);
        // Explosão e flash radioativo
        flashEl.classList.add('explode');

        // Adiciona itens lendários da Wasteland ao catálogo
        injetarItensFallout();

        // Limpa o overlay após a explosão
        setTimeout(() => {
          overlay.remove();
        }, 2500);
      }
    }, 1000);
  };

  function injetarItensFallout() {
    if (typeof products !== 'undefined' && typeof renderProducts === 'function') {
      const falloutItems = [
        {
          id: 8881,
          name: "Pip-Boy 3000 Mark IV (Vault-Tec)",
          price: 3000.00,
          category: "colecionaveis",
          image: "https://via.placeholder.com/200/003300/00ff00?text=Pip-Boy+3000"
        },
        {
          id: 8882,
          name: "Nuka-Cola Quantum (Brilha no Escuro)",
          price: 45.00,
          category: "colecionaveis",
          image: "https://via.placeholder.com/200/002244/00ffff?text=Nuka+Quantum"
        }
      ];

      products.unshift(...falloutItems);
      renderProducts(products);
    }
  }
})();