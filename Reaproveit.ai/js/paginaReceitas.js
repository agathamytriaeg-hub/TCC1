// =====================================================
// REAPROVEIT.AI - PÁGINA DE RECEITAS
// =====================================================
const API_URL = "http://localhost:3000/api";


// =====================================================
// ELEMENTOS DA PÁGINA
// =====================================================

const cards = document.querySelectorAll(".ingredient-card");

const placeholder = document.getElementById("placeholder");
const recipesContent = document.getElementById("recipesContent");
const selectedIngredient = document.getElementById("selectedIngredient");
const recipeList = document.getElementById("recipeList");
const closeRecipes = document.getElementById("closeRecipes");
const contador = document.getElementById("contador");


// =====================================================
// CONTADOR
// =====================================================

contador.textContent = `${cards.length} alimentos`;


// =====================================================
// CLIQUE NOS INGREDIENTES
// =====================================================

cards.forEach(card => {

    card.addEventListener("click", () => {

        // Remove seleção dos outros cards
        cards.forEach(item => {
            item.classList.remove("selected");
        });

        // Seleciona o card clicado
        card.classList.add("selected");

        // Pega os dados do HTML
        const nome = card.dataset.name;
        const ingredienteId = card.dataset.id;

        console.log("Ingrediente clicado:", nome);
        console.log("ID:", ingredienteId);

        // Busca as receitas
        buscarReceitas(nome, ingredienteId);
    });

});


// =====================================================
// BUSCAR RECEITAS
// =====================================================

async function buscarReceitas(nome, ingredienteId) {

    // Mostra o painel
    placeholder.style.display = "none";

    recipesContent.classList.add("active");

    // Mostra o nome do ingrediente
    selectedIngredient.textContent = nome;

    // Loading
    recipeList.innerHTML = `
        <div class="loading">

            <div class="loading-circle"></div>

            <span>
                Procurando receitas...
            </span>

        </div>
    `;

    try {

        console.log(
            "Buscando:",
            `${API_URL}/receitas/${ingredienteId}`
        );

        const resposta = await fetch(`${API_URL}/receitas/${ingredienteId}`);

        console.log("Status da API:", resposta.status);

        if (!resposta.ok) {

            throw new Error(
                `Erro HTTP: ${resposta.status}`
            );

        }

        const dados = await resposta.json();

        console.log("Receitas recebidas:", dados);

        if (!dados || dados.length === 0) {

            mostrarSemReceitas();

            return;
        }

        mostrarReceitas(dados);

    } catch (erro) {

        console.error(
            "Erro ao buscar receitas:",
            erro
        );

        recipeList.innerHTML = `
            <div class="no-recipes">

                <div class="no-recipes-icon">
                    🍽️
                </div>

                <strong>
                    Não foi possível carregar as receitas.
                </strong>

                <p>
                    Verifique se a API está funcionando.
                </p>

            </div>
        `;
    }

}


// =====================================================
// MOSTRAR TODAS AS RECEITAS
// =====================================================

function mostrarReceitas(receitas) {

    if (!receitas || receitas.length === 0) {

        mostrarSemReceitas();

        return;
    }

    // IMPORTANTE:
    // Não limita para 6 receitas.
    // Mostra todas as receitas retornadas pela API.

    recipeList.innerHTML = receitas.map(receita => {

        const imagem =
            receita.imagem ||
            "/imagens/logoicone.png";

        return `

            <article class="recipe-card">

                <img
                    class="recipe-image"
                    src="${imagem}"
                    alt="${receita.nome}"
                    onerror="this.src='/imagens/logoicone.png'"
                >

                <div class="recipe-info">

                    <h3>
                        ${receita.nome}
                    </h3>

                    <button
                        class="recipe-button"
                        type="button"
                        onclick="verReceita(${receita.id})"
                    >
                        Ver modo de preparo
                    </button>

                </div>

            </article>

        `;

    }).join("");

}


// =====================================================
// MOSTRAR QUANDO NÃO EXISTIREM RECEITAS
// =====================================================

function mostrarSemReceitas() {

    recipeList.innerHTML = `

        <div class="no-recipes">

            <div class="no-recipes-icon">
                🍽️
            </div>

            <strong>
                Nenhuma receita encontrada.
            </strong>

            <p>
                Ainda não existem receitas cadastradas
                para este ingrediente.
            </p>

        </div>

    `;

}


// =====================================================
// ABRIR UMA RECEITA
// =====================================================

async function verReceita(id) {

    recipeList.innerHTML = `

        <div class="loading">

            <div class="loading-circle"></div>

            <span>
                Carregando receita...
            </span>

        </div>

    `;

    try {

        console.log(
            "Buscando receita ID:",
            id
        );

        const resposta = await fetch(
            `${API_URL}/receita/${id}`
        );

        console.log(
            "Status receita:",
            resposta.status
        );

        if (!resposta.ok) {

            throw new Error(
                `Erro HTTP: ${resposta.status}`
            );

        }

        const receita = await resposta.json();

        console.log(
            "Receita recebida:",
            receita
        );

        if (!receita) {

            throw new Error(
                "Receita não encontrada."
            );

        }

        // =================================================
        // INGREDIENTES
        // =================================================

        let ingredientesHTML = "";

        if (
            Array.isArray(receita.ingredientes) &&
            receita.ingredientes.length > 0
        ) {

            ingredientesHTML =
                receita.ingredientes
                    .map(ingrediente => {

                        return `
                            <div class="recipe-ingredient">
                                ${ingrediente}
                            </div>
                        `;

                    })
                    .join("");

        } else if (
            typeof receita.ingredientes === "string" &&
            receita.ingredientes.trim() !== ""
        ) {

            ingredientesHTML =
                receita.ingredientes
                    .split(/\r?\n/)
                    .filter(item => item.trim() !== "")
                    .map(ingrediente => {

                        return `
                            <div class="recipe-ingredient">
                                ${ingrediente}
                            </div>
                        `;

                    })
                    .join("");

        } else {

            ingredientesHTML = `
                <div class="recipe-ingredient">
                    Ingredientes não informados.
                </div>
            `;

        }


        // =================================================
        // MODO DE PREPARO
        // =================================================

        let modoPreparoHTML = "";

        if (Array.isArray(receita.modoPreparo)) {

            modoPreparoHTML =
                receita.modoPreparo
                    .map((passo, index) => {

                        return `
                            <p>
                                <strong>
                                    ${index + 1}.
                                </strong>

                                ${passo}
                            </p>
                        `;

                    })
                    .join("");

        } else if (
            typeof receita.modoPreparo === "string"
        ) {

            modoPreparoHTML = `

                <p>
                    ${receita.modoPreparo}
                </p>

            `;

        } else {

            modoPreparoHTML = `

                <p>
                    Modo de preparo não informado.
                </p>

            `;

        }


        // =================================================
        // IMAGEM
        // =================================================

        const imagem =
            receita.imagem ||
            "/imagens/logoicone.png";


        // =================================================
        // EXIBIR DETALHES
        // =================================================

        recipeList.innerHTML = `

            <article class="recipe-detail">

                <button
                    type="button"
                    class="back-recipes"
                    onclick="voltarParaReceitas()"
                >
                    ← Voltar para receitas
                </button>


                <img
                    class="recipe-detail-image"
                    src="${imagem}"
                    alt="${receita.nome}"
                    onerror="this.src='/imagens/logoicone.png'"
                >


                <h3>
                    ${receita.nome}
                </h3>


                <div class="recipe-detail-section">

                    <h4>
                        Ingredientes
                    </h4>

                    <div class="recipe-ingredients">

                        ${ingredientesHTML}

                    </div>

                </div>


                <div class="recipe-detail-section">

                    <h4>
                        Modo de preparo
                    </h4>

                    <div class="recipe-instructions">

                        ${modoPreparoHTML}

                    </div>

                </div>

            </article>

        `;

        // Volta o scroll do painel para o topo
        recipeList.scrollTop = 0;

    } catch (erro) {

        console.error(
            "Erro ao carregar receita:",
            erro
        );

        recipeList.innerHTML = `

            <div class="no-recipes">

                <div class="no-recipes-icon">
                    ⚠️
                </div>

                <strong>
                    Não foi possível carregar esta receita.
                </strong>

                <p>
                    Verifique se a rota da API está funcionando.
                </p>

                <button
                    type="button"
                    class="back-recipes"
                    onclick="voltarParaReceitas()"
                >
                    ← Voltar para receitas
                </button>

            </div>

        `;
    }

}


// =====================================================
// VOLTAR PARA A LISTA DE RECEITAS
// =====================================================

function voltarParaReceitas() {

    // Descobre o ingrediente selecionado
    const cardSelecionado =
        document.querySelector(
            ".ingredient-card.selected"
        );

    if (!cardSelecionado) {

        return;

    }

    const nome =
        cardSelecionado.dataset.name;

    const ingredienteId =
        cardSelecionado.dataset.id;

    // Busca novamente as receitas
    buscarReceitas(
        nome,
        ingredienteId
    );

}


// =====================================================
// FECHAR PAINEL
// =====================================================

closeRecipes.addEventListener(
    "click",
    () => {

        recipesContent.classList.remove(
            "active"
        );

        placeholder.style.display = "flex";

        cards.forEach(card => {

            card.classList.remove(
                "selected"
            );

        });

    }
);