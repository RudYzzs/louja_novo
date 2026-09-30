// DADOS INICIAIS DA LOJA
let produtos = [
    { id: 1, nome: "Action Figure Cthulhu", preco: 180.00 },
    { id: 2, nome: "Teclado Mecânico RGB", preco: 350.00 },
    { id: 3, nome: "Mouse Gamer 16000 DPI", preco: 220.00 }
];

let carrinho = [];

// ELEMENTOS DO DOM
const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");
const cartList = document.getElementById("cartList");
const cartTotalValue = document.getElementById("cartTotalValue");
const clearCartBtn = document.getElementById("clearCartBtn");
const themeToggleBtn = document.getElementById("themeToggleBtn");

// INICIALIZAÇÃO
document.addEventListener("DOMContentLoaded", () => {
    renderizarProdutos();
    atualizarCarrinho();

    productForm.addEventListener("submit", cadastrarProduto);
    clearCartBtn.addEventListener("click", esvaziarCarrinho);
    themeToggleBtn.addEventListener("click", alternarTema);
});

// CADASTRO DE PRODUTO
function cadastrarProduto(e) {
    e.preventDefault();
    const nomeInput = document.getElementById("prodName");
    const precoInput = document.getElementById("prodPrice");

    const novoProduto = {
        id: Date.now(),
        nome: nomeInput.value.trim(),
        preco: parseFloat(precoInput.value)
    };

    produtos.push(novoProduto);
    renderizarProdutos();

    nomeInput.value = "";
    precoInput.value = "";
}

// RENDERIZAR VITRINE DE PRODUTOS
function renderizarProdutos() {
    productList.innerHTML = "";

    produtos.forEach((prod) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div>
                <h3>${prod.nome}</h3>
                <p class="product-price">R$ ${prod.preco.toFixed(2)}</p>
            </div>
            <button class="add-cart-btn" onclick="adicionarAoCarrinho(${prod.id})">Adicionar ao Carrinho</button>
        `;
        productList.appendChild(card);
    });
}

// ADICIONAR ITEM AO CARRINHO
window.adicionarAoCarrinho = function(id) {
    const produto = produtos.find((p) => p.id === id);
    if (produto) {
        carrinho.push(produto);
        atualizarCarrinho();
    }
};

// REMOVER ITEM DO CARRINHO
window.removerDoCarrinho = function(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
};

// ATUALIZAR INTERFACE DO CARRINHO
function atualizarCarrinho() {
    cartList.innerHTML = "";
    let total = 0;

    carrinho.forEach((item, index) => {
        total += item.preco;
        const li = document.createElement("li");
        li.className = "cart-item";
        li.innerHTML = `
            <span>${item.nome} - R$ ${item.preco.toFixed(2)}</span>
            <button class="remove-item-btn" onclick="removerDoCarrinho(${index})">✕</button>
        `;
        cartList.appendChild(li);
    });

    cartTotalValue.textContent = total.toFixed(2);
}

// ESVAZIAR CARRINHO
function esvaziarCarrinho() {
    carrinho = [];
    atualizarCarrinho();
}

// ALTERNAR MODO ESCURO / CLARO
function alternarTema() {
    document.body.classList.toggle("theme-dark");
    document.body.classList.toggle("theme-light");
}