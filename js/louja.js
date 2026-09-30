let produtos = [];

let imagemSelecionada = "";


/* CARREGAR PRODUTOS SALVOS */

const produtosSalvos = localStorage.getItem("geekzoneProdutos");

if (produtosSalvos) {
    produtos = JSON.parse(produtosSalvos);
}


/* ESCOLHER IMAGEM */

document.getElementById("imagem").addEventListener("change", function () {

    const arquivo = this.files[0];

    if (!arquivo) {
        return;
    }

    const leitor = new FileReader();

    leitor.onload = function (evento) {

        imagemSelecionada = evento.target.result;

        document.getElementById("previewImagem").src =
            imagemSelecionada;

    };

    leitor.readAsDataURL(arquivo);

});


/* CADASTRAR PRODUTO */

function cadastrarProduto() {

    const nome =
        document.getElementById("nome").value.trim();

    const categoria =
        document.getElementById("categoria").value.trim();

    const preco =
        Number(document.getElementById("preco").value);

    const estoque =
        Number(document.getElementById("estoque").value);


    if (
        nome === "" ||
        categoria === "" ||
        preco <= 0 ||
        estoque < 0
    ) {

        alert("Preencha todos os campos corretamente.");

        return;
    }


    if (imagemSelecionada === "") {

        alert("Escolha uma imagem para o produto.");

        return;
    }


    const produto = {

        id: Date.now(),

        nome: nome,

        categoria: categoria,

        preco: preco,

        estoque: estoque,

        imagem: imagemSelecionada

    };


    produtos.push(produto);

    salvarProdutos();

    limparCampos();

    mostrarProdutos();

    atualizarDashboard();


    alert("Produto cadastrado com sucesso!");
}


/* MOSTRAR PRODUTOS */

function mostrarProdutos() {

    const lista =
        document.getElementById("listaProdutos");

    const pesquisa =
        document
            .getElementById("pesquisa")
            .value
            .toLowerCase();


    lista.innerHTML = "";


    const produtosFiltrados = produtos.filter(
        produto =>
            produto.nome
                .toLowerCase()
                .includes(pesquisa)
    );


    produtosFiltrados.forEach(produto => {

        const linha =
            document.createElement("tr");


        let status = "";

        let classeStatus = "";


        if (produto.estoque === 0) {

            status = "Sem estoque";

            classeStatus = "status-sem";

        } else if (produto.estoque <= 5) {

            status = "Estoque baixo";

            classeStatus = "status-baixo";

        } else {

            status = "Disponível";

            classeStatus = "status-ok";
        }


        linha.innerHTML = `

            <td>

                <img
                    class="produto-imagem"
                    src="${produto.imagem}"
                    alt="${produto.nome}"
                >

            </td>


            <td>
                <strong>${produto.nome}</strong>
            </td>


            <td>
                ${produto.categoria}
            </td>


            <td>
                R$ ${produto.preco.toFixed(2)}
            </td>


            <td>
                ${produto.estoque}
            </td>


            <td>

                <span class="status ${classeStatus}">
                    ${status}
                </span>

            </td>


            <td>

                <button
                    class="btn-editar"
                    onclick="editarProduto(${produto.id})"
                >
                    Editar
                </button>


                <button
                    class="btn-excluir"
                    onclick="excluirProduto(${produto.id})"
                >
                    Excluir
                </button>

            </td>

        `;


        lista.appendChild(linha);

    });

}


/* EDITAR PRODUTO */

function editarProduto(id) {

    const produto =
        produtos.find(
            produto => produto.id === id
        );


    if (!produto) {
        return;
    }


    const novoNome =
        prompt(
            "Nome do produto:",
            produto.nome
        );


    if (novoNome === null) {
        return;
    }


    const novaCategoria =
        prompt(
            "Categoria:",
            produto.categoria
        );


    if (novaCategoria === null) {
        return;
    }


    const novoPreco =
        prompt(
            "Preço:",
            produto.preco
        );


    if (novoPreco === null) {
        return;
    }


    const novoEstoque =
        prompt(
            "Estoque:",
            produto.estoque
        );


    if (novoEstoque === null) {
        return;
    }


    produto.nome = novoNome;

    produto.categoria = novaCategoria;

    produto.preco = Number(novoPreco);

    produto.estoque = Number(novoEstoque);


    salvarProdutos();

    mostrarProdutos();

    atualizarDashboard();


    alert("Produto alterado com sucesso!");
}


/* EXCLUIR PRODUTO */

function excluirProduto(id) {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir este produto?"
        );


    if (!confirmar) {
        return;
    }


    produtos =
        produtos.filter(
            produto => produto.id !== id
        );


    salvarProdutos();

    mostrarProdutos();

    atualizarDashboard();


    alert("Produto excluído com sucesso!");
}


/* DASHBOARD */

function atualizarDashboard() {

    const total =
        produtos.length;


    const estoqueBaixo =
        produtos.filter(
            produto =>
                produto.estoque > 0 &&
                produto.estoque <= 5
        ).length;


    const semEstoque =
        produtos.filter(
            produto =>
                produto.estoque === 0
        ).length;


    const valorEstoque =
        produtos.reduce(
            (total, produto) =>
                total +
                (produto.preco * produto.estoque),
            0
        );


    document.getElementById(
        "totalProdutos"
    ).textContent = total;


    document.getElementById(
        "estoqueBaixo"
    ).textContent = estoqueBaixo;


    document.getElementById(
        "semEstoque"
    ).textContent = semEstoque;


    document.getElementById(
        "valorEstoque"
    ).textContent =
        valorEstoque.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
}


/* SALVAR */

function salvarProdutos() {

    localStorage.setItem(
        "geekzoneProdutos",
        JSON.stringify(produtos)
    );
}


/* LIMPAR CAMPOS */

function limparCampos() {

    document.getElementById("nome").value = "";

    document.getElementById("categoria").value = "";

    document.getElementById("preco").value = "";

    document.getElementById("estoque").value = "";

    document.getElementById("imagem").value = "";


    imagemSelecionada = "";


    document.getElementById("previewImagem").src =
        "https://via.placeholder.com/180x180?text=Produto";
}


/* INICIAR SISTEMA */

mostrarProdutos();

atualizarDashboard();