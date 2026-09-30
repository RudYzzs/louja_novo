// AVATAR SVG PERSONALIZADO DO CTHULHU
const CTHULHU_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%230d1a13'/><circle cx='35' cy='40' r='6' fill='%232cf48d'/><circle cx='65' cy='40' r='6' fill='%232cf48d'/><circle cx='35' cy='40' r='2' fill='%23000'/><circle cx='65' cy='40' r='2' fill='%23000'/><path d='M 35 60 Q 30 75 25 80 M 43 60 Q 42 78 40 85 M 50 60 Q 50 80 50 88 M 57 60 Q 58 78 60 85 M 65 60 Q 70 75 75 80' stroke='%232cf48d' stroke-width='4' fill='none' stroke-linecap='round'/></svg>";

document.addEventListener("DOMContentLoaded", function () {
    criarWidgetChat();
});

function criarWidgetChat() {
    // 1. Botão Flutuante
    const btnToggle = document.createElement("button");
    btnToggle.className = "cthulhu-chat-toggle";
    btnToggle.id = "btnCthulhuToggle";
    btnToggle.setAttribute("title", "Falar com Cthulhu Bot");
    btnToggle.innerHTML = `<img src="${CTHULHU_AVATAR}" alt="Mascote Cthulhu" class="cthulhu-avatar-icon">`;

    // 2. Janela do Chat
    const chatWindow = document.createElement("div");
    chatWindow.className = "cthulhu-chat-window";
    chatWindow.id = "cthulhuChatWindow";

    chatWindow.innerHTML = `
        <div class="cthulhu-chat-header">
            <img src="${CTHULHU_AVATAR}" alt="Cthulhu" class="cthulhu-header-avatar">
            <div class="cthulhu-header-info">
                <h3>Cthulhu Bot</h3>
                <p>Assistente do Abismo Geek 🐙</p>
            </div>
            <button class="cthulhu-btn-close" id="btnCthulhuClose">✕</button>
        </div>
        <div class="cthulhu-chat-messages" id="cthulhuMessages">
            <div class="cthulhu-msg bot">
                Saudações, mortal! Sou Cthulhu, o guardião da GeekZone. Como posso guiar suas compras hoje?
            </div>
        </div>
        <div class="cthulhu-chat-input-area">
            <input type="text" id="cthulhuInput" placeholder="Pergunte sobre produtos, frete...">
            <button class="cthulhu-btn-send" id="btnCthulhuSend">Enviar</button>
        </div>
    `;

    document.body.appendChild(btnToggle);
    document.body.appendChild(chatWindow);

    // 3. Eventos
    btnToggle.addEventListener("click", toggleChat);
    document.getElementById("btnCthulhuClose").addEventListener("click", toggleChat);
    document.getElementById("btnCthulhuSend").addEventListener("click", enviarMensagem);
    document.getElementById("cthulhuInput").addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            enviarMensagem();
        }
    });
}

function toggleChat() {
    const chatWindow = document.getElementById("cthulhuChatWindow");
    chatWindow.classList.toggle("active");
    
    if (chatWindow.classList.contains("active")) {
        document.getElementById("cthulhuInput").focus();
    }
}

function enviarMensagem() {
    const input = document.getElementById("cthulhuInput");
    const texto = input.value.trim();

    if (texto === "") return;

    adicionarBalao(texto, "user");
    input.value = "";

    setTimeout(() => {
        responderCthulhu(texto);
    }, 600);
}

function adicionarBalao(texto, tipo) {
    const container = document.getElementById("cthulhuMessages");
    const msgDiv = document.createElement("div");
    msgDiv.className = `cthulhu-msg ${tipo}`;
    msgDiv.textContent = texto;

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

function responderCthulhu(mensagemUsuario) {
    const termo = mensagemUsuario.toLowerCase();
    let resposta = "";

    if (termo.includes("estoque") || termo.includes("produto")) {
        resposta = "Nossos colecionáveis e eletrônicos são atualizados em tempo real no formulário do topo!";
    } else if (termo.includes("frete") || termo.includes("entrega")) {
        resposta = "Enviamos nossos tesouros geek para todo o Brasil via entregas rápidas das profundezas!";
    } else if (termo.includes("preço") || termo.includes("valor") || termo.includes("desconto")) {
        resposta = "Confira o valor total atualizado em tempo real no seu carrinho de compras!";
    } else if (termo.includes("oi") || termo.includes("olá") || termo.includes("mortal")) {
        resposta = "Saudações! O que busca nas profundezas da GeekZone hoje?";
    } else {
        resposta = "Curioso... Para essa questão específica, recomendo consultar os sábios administradores da GeekZone!";
    }

    adicionarBalao(resposta, "bot");
}