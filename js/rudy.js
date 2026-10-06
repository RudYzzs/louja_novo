const API_URL = "http://127.0.0.1:5000/api/chat";

// Estado do Carrinho
let carrinho = [];

document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chat-form");
    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        await enviarMensagemChat();
    });
});

// --- LÓGICA DO CARRINHO EM TEMPO REAL ---

function adicionarAoCarrinho(nome, preco) {
    const itemExistente = carrinho.find(item => item.nome === nome);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ nome, preco, quantidade: 1 });
    }

    atualizarDOMCarrinho();
}

function atualizarDOMCarrinho() {
    const lista = document.getElementById("lista-carrinho");
    const totalElemento = document.getElementById("total-valor");

    lista.innerHTML = "";

    if (carrinho.length === 0) {
        lista.innerHTML = '<li class="carrinho-vazio">Seu carrinho está vazio.</li>';
        totalElemento.textContent = "R$ 0,00";
        return;
    }

    let total = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;

        const li = document.createElement("li");
        li.className = "item-carrinho";
        li.innerHTML = `
            <span>${item.nome} x${item.quantidade}</span>
            <strong>R$ ${subtotal.toFixed(2).replace('.', ',')}</strong>
        `;
        lista.appendChild(li);
    });

    totalElemento.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("Adicione itens ao carrinho antes de finalizar a ordem galáctica!");
        return;
    }
    alert("🚀 Pedido transmitido com sucesso via sinal subespacial!");
    carrinho = [];
    atualizarDOMCarrinho();
}

// --- LÓGICA DO CHATBOT FLUTUANTE (XENOMORFO) ---

function alternarChat() {
    const chatWidget = document.getElementById("chat-widget");
    chatWidget.classList.toggle("escondido");
}

async function enviarMensagemChat() {
    const input = document.getElementById("user-input");
    const texto = input.value.trim();

    if (!texto) return;

    adicionarMensagemDOM(texto, "user");
    input.value = "";

    const resposta = await chamarServidorNuvem(texto);
    adicionarMensagemDOM(resposta, "bot");
}

function adicionarMensagemDOM(texto, tipo) {
    const chatMessages = document.getElementById("chat-messages");
    const divMessage = document.createElement("div");
    divMessage.className = `message ${tipo}`;
    divMessage.textContent = texto; // Proteção contra XSS
    chatMessages.appendChild(divMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function chamarServidorNuvem(textoUsuario) {
    try {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mensagem: textoUsuario })
        });

        if (!resposta.ok) {
            throw new Error(`Erro na API: ${resposta.status}`);
        }

        const dados = await resposta.json();
        return dados.resposta_agente || "Ssiss... *Sinal corrompido*";

    } catch (erro) {
        console.error("Erro na comunicação:", erro);
        return "🚨 *Gorgolejo de Ácido* - Comunicação interrompida com a espaçonave!";
    }
}