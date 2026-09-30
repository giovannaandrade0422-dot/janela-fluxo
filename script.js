let totalEntradas = 0;
let totalDespesas = 0;
let movimentacaoEditando = null;

function salvarMovimentacoes() {
    localStorage.setItem(
        "movimentacoes",
        document.getElementById("listaMovimentacoes").innerHTML
    );
}

function formatarMoeda(valor) {
   return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
   });
}

function excluirMovimentacao(botao, valor, tipo) {

   botao.parentElement.remove();

   if (tipo === "entrada") {
      totalEntradas -= valor;
   } else {
      totalDespesas -= valor;
   }

   document.getElementById("totalEntradas").textContent =
   "Entradas: " + formatarMoeda(totalEntradas);

   document.getElementById("totalDespesas").textContent = 
   "Despesas: " + formatarMoeda(totalDespesas);

   document.getElementById("saldo").textContent =
   "Saldo: " + formatarMoeda(totalEntradas - totalDespesas);

   salvarMovimentacoes();
}

function editarMovimentacao(botao) {

    const movimentacao = botao.parentElement;

    movimentacaoEditando = movimentacao;

    const descricao = movimentacao.children[0].textContent.trim();
    const valorTexto = movimentacao.children[1].textContent;
    const valor = Number(
    valorTexto.split("R$")[1].trim().replace(",", ".")
);

    const tipo = movimentacao.children[2].textContent.trim();

    const data = movimentacao.children[3].textContent
        .replace("Data: ", "")
        .trim();

    const dataMovimentacao = new Date(data + "T00:00:00");

    const dataInicial = filtroDataInicial
    ? new Date(filtroDataInicial + "T00:00:00")
    : null;

    const dataFinal = filtroDataFinal
    ? new Date(filtroDataFinal + "T00:00:00")
    : null;

    const categoria = movimentacao.children[4].textContent
        .replace("Categoria: ", "")
        .trim();

    document.getElementById("descricao").value = descricao;
    document.getElementById("valor").value = valor;
    document.getElementById("data").value = data;
    document.getElementById("tipo").value = tipo;
    document.getElementById("categoria").value = categoria;
}

document.addEventListener("click", function(event) {

    if (event.target.textContent.includes("Adicionar movimentação")) {


        const descricao = document.getElementById("descricao").value;

        if (descricao.trim() === "") {
            alert("Digite uma descrição. ");
            return;
        }

        const valor = Number(document.getElementById("valor").value);

        if (isNaN(valor) || valor <= 0) {
            alert("Digite um valor válido maior que zero.");
            return;
        }

        const data = document.getElementById("data").value;

        if (data === "") {
            alert("Selecione uma data.");
            return;
        }

        const tipo = document.getElementById("tipo").value;

        const categoria = document.getElementById("categoria").value;

        if (categoria === "Selecione") {
            alert("Selecione uma categoria.");
            return;
        }

        if (movimentacaoEditando !== null) {


   const valorAntigo = Number(
    movimentacaoEditando.children[1].textContent
        .split("R$")[1]
        .trim()
        .replace(",", ".")
);

    const tipoAntigo = movimentacaoEditando.children[2].textContent.trim();

    if (tipoAntigo === "entrada") {
        totalEntradas -= valorAntigo;
    } else {
        totalDespesas -= valorAntigo;
    }

    if (tipo === "entrada") {
        totalEntradas += valor;
    } else {
        totalDespesas += valor;
    }

    movimentacaoEditando.children[0].textContent = descricao;

    movimentacaoEditando.children[1].textContent =
        "Valor: " + formatarMoeda(valor);

    movimentacaoEditando.children[2].textContent = tipo;

    movimentacaoEditando.children[3].textContent =
        "Data: " + data;

    movimentacaoEditando.children[4].textContent =
        "Categoria: " + categoria;

    document.getElementById("totalEntradas").textContent =
        "Entradas: " + formatarMoeda(totalEntradas);

    document.getElementById("totalDespesas").textContent =
        "Despesas: " + formatarMoeda(totalDespesas);

    document.getElementById("saldo").textContent =
        "Saldo: " + formatarMoeda(totalEntradas - totalDespesas);

    movimentacaoEditando = null;

    salvarMovimentacoes();

    return;
}

        if (tipo === "entrada") {
            totalEntradas += valor;
        } else {
            totalDespesas += valor;
        }

        document.getElementById("totalEntradas").textContent =
           "Entradas: " + formatarMoeda(totalEntradas);

        document.getElementById("totalDespesas").textContent =
           "Despesas: " + formatarMoeda(totalDespesas);

        document.getElementById("saldo").textContent = 
           "Saldo: " + formatarMoeda(totalEntradas - totalDespesas);

        alert (
            "Descrição: " + descricao +
            "\nValor: R$ " + valor +
            "\nData: " + data +
            "\nTipo: " + tipo +
            "\nCategoria: " + categoria 
        );

        const lista = document.getElementById("listaMovimentacoes");

        lista.innerHTML += `
          <div>
          <p>${descricao}</p>
           <p>Valor: ${formatarMoeda(valor)}</p>
           <p class="tipo ${tipo}">${tipo}</p>
           <p>Data: ${data}</p>
           <p>Categoria: ${categoria}</p>
           <button type="button" onclick="editarMovimentacao(this)">Editar</button>
           <button onclick="excluirMovimentacao(this, ${valor}, '${tipo}')">Excluir</button>
        </div>
     `;

     salvarMovimentacoes();

  }

});

function aplicarFiltros() {

    const filtroTipo = document.getElementById("filtroTipo").value;
    const filtroCategoria = document.getElementById("filtroCategoria").value;

    const filtroDataInicial = document.getElementById("filtroDataInicial").value;
    const filtroDataFinal = document.getElementById("filtroDataFinal").value;

    if (filtroDataInicial !== "" && filtroDataFinal !== "" && filtroDataInicial > filtroDataFinal) {
        alert("A data inicial não pode ser maior que a data final.");
        return;
    }

    const movimentacoes = document.querySelectorAll("#listaMovimentacoes > div");

    movimentacoes.forEach(function(movimentacao) {

        const tipo = movimentacao.children[2].textContent.trim();

        const categoria = movimentacao.children[4].textContent
            .replace("Categoria: ", "")
            .trim();

        const data = movimentacao.children[3].textContent
            .replace("Data: ", "")
            .trim();

        const correspondeTipo =
            filtroTipo === "todos" || tipo === filtroTipo;

        const correspondeCategoria =
            filtroCategoria === "todas" || categoria === filtroCategoria;

        const correspondeDataInicial =
            filtroDataInicial === "" || data >= filtroDataInicial;

        const correspondeDataFinal =
            filtroDataFinal === "" || data <= filtroDataFinal;

        if (
            correspondeTipo &&
            correspondeCategoria &&
            correspondeDataInicial &&
            correspondeDataFinal
        ) {
            movimentacao.style.display = "block";
        } else {
            movimentacao.style.display = "none";
        }

    });

}

document.getElementById("filtroTipo").addEventListener("change", aplicarFiltros);

document.getElementById("filtroCategoria").addEventListener("change", aplicarFiltros);

document.getElementById("filtroDataInicial").addEventListener("change", aplicarFiltros);

document.getElementById("filtroDataFinal").addEventListener("change", aplicarFiltros);

function carregarMovimentacoes() {
    const movimentacoesSalvas = localStorage.getItem("movimentacoes");

    if (movimentacoesSalvas) {
        document.getElementById("listaMovimentacoes").innerHTML = movimentacoesSalvas;

        totalEntradas = 0;
        totalDespesas = 0;

        const movimentacoes = document.querySelectorAll("#listaMovimentacoes > div");

        movimentacoes.forEach(function(movimentacao) {

            const valor = Number(
                movimentacao.children[1].textContent
                    .split("R$")[1]
                    .trim()
                    .replace(".", "")
                    .replace(",", ".")
            );

            const tipo = movimentacao.children[2].textContent.trim();

            if (tipo === "entrada") {
                totalEntradas += valor;
            } else {
                totalDespesas += valor;
            }
        });

        document.getElementById("totalEntradas").textContent =
            "Entradas: " + formatarMoeda(totalEntradas);

        document.getElementById("totalDespesas").textContent =
            "Despesas: " + formatarMoeda(totalDespesas);

        document.getElementById("saldo").textContent =
            "Saldo: " + formatarMoeda(totalEntradas - totalDespesas);
    }
}

carregarMovimentacoes();
