// frontend/js/re-easter-egg.js

(function () {
  // Cheat RE2 (PS1): R1, R1, R1, R1, L1, L1, L1, L1, R2, L2
  const re2CheatSequence = ['r', 'r', 'r', 'r', 'l', 'l', 'l', 'l', '2', '1'];
  let cheatIndex = 0;
  let reModeActive = false;

  document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
      return;
    }

    const key = e.key.toLowerCase();
    const requiredKey = re2CheatSequence[cheatIndex];

    if (key === requiredKey) {
      cheatIndex++;
      if (cheatIndex === re2CheatSequence.length) {
        ativarResidentEvil2Mode();
        cheatIndex = 0;
      }
    } else {
      cheatIndex = 0;
    }
  });

  function ativarResidentEvil2Mode() {
    if (reModeActive) return;
    reModeActive = true;

    // 1. Reproduzir Música Tema / Efeito Sonoro de Resident Evil
    const reAudio = new Audio('audio/re-theme.mp3');
    reAudio.volume = 0.7; // Volume ajustado para 70%
    
    // Tenta tocar o áudio com suporte a promessas do navegador
    reAudio.play().catch(error => {
      console.warn("Reprodução automática de áudio bloqueada pelo navegador:", error);
    });

    // 2. Estilo Visual Umbrella Raccoon City
    document.body.classList.add('umbrella-mode');

    // 3. Banner Biohazard
    const banner = document.createElement('div');
    banner.id = 're-alert-banner';
    banner.innerHTML = `
      <div class="re-banner-content">
        <span class="biohazard-icon">☣️</span>
        <strong>RACCOON CITY OUTBREAK: INFINITE AMMO UNLOCKED</strong>
        <span class="biohazard-icon">☣️</span>
      </div>
    `;
    document.body.prepend(banner);

    // 4. Injetar itens lendários no catálogo
    if (typeof products !== 'undefined' && typeof renderProducts === 'function') {
      const reItems = [
        {
          id: 9998,
          name: "Rocket Launcher (Munição Infinita)",
          price: 1998.00,
          category: "colecionaveis",
          image: "https://via.placeholder.com/200/8b0000/ffffff?text=Infinite+Rocket+Launcher"
        },
        {
          id: 9999,
          name: "First Aid Spray (Umbrella Corp)",
          price: 50.00,
          category: "colecionaveis",
          image: "https://via.placeholder.com/200/006600/ffffff?text=First+Aid+Spray"
        }
      ];

      products.unshift(...reItems);
      renderProducts(products);
    }

    // 5. Atualizar o Chatbot para modo Red Queen
    if (typeof cthulhuBotInstance !== 'undefined') {
      cthulhuBotInstance.conversar = async function (userMessage) {
        return "☣️ [RED QUEEN]: 'You're all going to die down here.' Raccoon City infectada. Use o cupom 'STARS' para 20% de desconto.";
      };
    }
  }
})();