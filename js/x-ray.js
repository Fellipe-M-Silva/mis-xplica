document.addEventListener("DOMContentLoaded", () => {
	console.log("DOM totalmente carregado. Iniciando script.js");

	// --- X-Ray Toggle Logic ---
	document.querySelectorAll(".x-ray-toggle").forEach((button) => {
		console.log("Botão de Raio-X encontrado:", button.id);
		button.addEventListener("click", () => {
			const selectedSignType = button.dataset.signType;
			console.log(
				`Botão '${button.id}' clicado. Tipo de signo selecionado: ${selectedSignType}`
			);

			// NOVO: Referência ao botão que foi clicado
			const clickedButton = button;

			// Verifica o estado ATUAL da lente correspondente ao botão clicado
			const isCurrentlyActive = document.body.classList.contains(
				`x-ray-active-${selectedSignType}`
			);

			// PASSO 1: Sempre LIMPE o estado anterior COMPLETO.
			// Remove QUALQUER classe de Raio-X do body.
			document.body.classList.remove(
				"x-ray-active-estatico",
				"x-ray-active-dinamico",
				"x-ray-active-metalinguistico"
			);
			console.log("Classes 'x-ray-active' removidas do body.");

			// NOVO: Remove a classe 'active' de *TODOS* os botões do Raio-X.
			// Isso garante que apenas o botão correto estará ativo no final.
			document.querySelectorAll(".x-ray-toggle").forEach((btn) => {
				btn.classList.remove("active");
			});
			console.log(
				"Classe 'active' removida de todos os botões de Raio-X."
			);

			// Remove TODOS os indicadores e data-xray-active dos elementos
			hideAllXrayIndicators();
			console.log(
				"Indicadores e data-xray-active removidos de todos os elementos."
			);

			// Fecha o modal de explicação, se estiver aberto
			closeSignExplanationModal();
			console.log("Modal de explicação fechado.");

			// PASSO 2: DECIDE o que fazer AGORA com base no clique
			// Se a lente clicada ESTAVA ativa (isCurrentlyActive é true), significa que o clique era para DESATIVÁ-LA.
			// Como já limpamos tudo, não precisamos fazer mais nada.
			if (isCurrentlyActive) {
				console.log(
					`Lente '${selectedSignType}' estava ativa e foi desativada.`
				);
			} else {
				// Se a lente clicada NÃO ESTAVA ativa (isCurrentlyActive é false), significa que o clique era para ATIVÁ-LA.
				document.body.classList.add(`x-ray-active-${selectedSignType}`);
				console.log(
					`Lente de Raio-X ativada: Adicionado 'x-ray-active-${selectedSignType}' ao body.`
				);
				showXrayIndicators(selectedSignType);

				// NOVO: Adiciona a classe 'active' APENAS ao botão que foi clicado,
				// pois sua lente correspondente foi ativada.
				clickedButton.classList.add("active");
				console.log(
					`Classe 'active' adicionada ao botão '${clickedButton.id}'.`
				);
			}
		});
	});

	// --- Functions for X-Ray Indicators ---
	function showXrayIndicators(signType) {
		console.log(`showXrayIndicators chamado para o tipo: ${signType}`);
		const elementsToHighlight = document.querySelectorAll(
			`[data-sign-type="${signType}"]`
		);

		if (elementsToHighlight.length === 0) {
			console.log(
				`Nenhum elemento encontrado com data-sign-type="${signType}"`
			);
		}

		elementsToHighlight.forEach((element, index) => {
			console.log(`Processando elemento ${index + 1}:`, element);

			// Mark element as currently highlighted for CSS
			element.dataset.xrayActive = "true";
			console.log(`data-xray-active='true' adicionado ao elemento.`);

			// Ensure parent has relative positioning if static, so absolute children are positioned correctly
			const computedPosition = getComputedStyle(element).position;
			if (computedPosition === "static") {
				element.style.position = "relative";
				console.log(
					`Posição do elemento alterada de '${computedPosition}' para 'relative'.`
				);
			} else {
				console.log(
					`Posição do elemento já é '${computedPosition}', não alterada.`
				);
			}

			const indicator = document.createElement("button");
			indicator.classList.add("x-ray-indicator");
			indicator.innerHTML = `<span class="material-symbols-outlined">${getIconForSignType(
				signType
			)}</span>`;
			console.log("Indicador criado:", indicator);

			// Store data attributes on the indicator itself for easy access
			indicator.dataset.signName = element.dataset.signName;
			indicator.dataset.signCategory = signType;
			indicator.dataset.signExplanation = element.dataset.signExplanation;
			console.log(
				"Dados do signo adicionados ao indicador:",
				indicator.dataset.signName,
				indicator.dataset.signCategory,
				indicator.dataset.signExplanation
			);

			// Append indicator to the element
			element.appendChild(indicator);
			console.log("Indicador anexado ao elemento.");

			// Determine preferred side based on element's horizontal position
			const rect = element.getBoundingClientRect();
			console.log("getBoundingClientRect do elemento:", rect);
			console.log("Largura da janela:", window.innerWidth);

			// If element is in the right half of the screen (or close to the right edge)
			if (
				rect.left > window.innerWidth / 2 ||
				rect.right > window.innerWidth - 100
			) {
				indicator.classList.add("position-left");
				console.log("Adicionado classe 'position-left' ao indicador.");
			} else {
				indicator.classList.add("position-right");
				console.log("Adicionado classe 'position-right' ao indicador.");
			}

			// Add click listener to the indicator
			indicator.addEventListener("click", (event) => {
				event.stopPropagation(); // Prevent parent clicks from interfering
				console.log("Indicador clicado. Abrindo modal de explicação.");
				openSignExplanationModal(
					indicator.dataset.signName,
					indicator.dataset.signCategory,
					indicator.dataset.signExplanation,
					indicator
				);
			});
		});
	}

	function hideAllXrayIndicators() {
		console.log(
			"hideAllXrayIndicators: Chamado para limpar todos os destaques."
		);

		// Etapa 1: Remover todos os botões indicadores visíveis
		document
			.querySelectorAll(".x-ray-indicator")
			.forEach((indicator, idx) => {
				console.log(
					`hideAllXrayIndicators: Removendo indicador #${
						idx + 1
					} do elemento:`,
					indicator.parentElement
				);
				indicator.remove(); // Remove o botão do DOM
			});
		console.log(
			"hideAllXrayIndicators: Todos os indicadores foram removidos."
		);

		// Etapa 2: Remover o atributo data-xray-active e resetar estilos de posição dos elementos
		// Seleciona QUALQUER elemento que tenha o atributo data-xray-active="true"
		const activeElements = document.querySelectorAll(
			'[data-xray-active="true"]'
		);
		if (activeElements.length === 0) {
			console.log(
				"hideAllXrayIndicators: Nenhum elemento com data-xray-active='true' encontrado para limpar."
			);
		}

		activeElements.forEach((element, idx) => {
			console.log(
				`hideAllXrayIndicators: Limpando elemento #${idx + 1}:`,
				element
			);

			// Remove o atributo data-xray-active do elemento.
			// Isso deve desativar o estilo de destaque do CSS.
			delete element.dataset.xrayActive;
			console.log(
				`hideAllXrayIndicators: data-xray-active removido de:`,
				element
			);

			// Se a posição foi definida como 'relative' pelo script, resete-a.
			// Verificar se element.style.position existe e foi definido por nós.
			// É mais seguro usar uma flag ou uma classe para saber se fomos nós que mudamos a posição.
			// Por enquanto, vamos manter a lógica atual, mas é um ponto a se observar.
			if (element.style.position === "relative") {
				element.style.position = ""; // Limpa o estilo inline
				console.log(
					`hideAllXrayIndicators: Posição de '${element.tagName}' resetada para padrão.`
				);
			}
		});
		console.log(
			"hideAllXrayIndicators: Atributos data-xray-active e posições resetadas."
		);
	}

	function getIconForSignType(type) {
		switch (type) {
			case "estatico":
				return "widgets";
			case "dinamico":
				return "magic_button";
			case "metalinguistico":
				return "info";
			default:
				return "help";
		}
	}

	// --- Dedicated Modal for Sign Explanations ---
	// Create the modal HTML structure dynamically (or you can add it directly to your HTML)
	const signExplanationModalOverlay = document.createElement("div");
	signExplanationModalOverlay.id = "sign-explanation-modal-overlay";
	signExplanationModalOverlay.classList.add("sign-explanation-modal-overlay"); // New class for this specific overlay
	signExplanationModalOverlay.style.display = "none"; // Hidden by default
	document.body.appendChild(signExplanationModalOverlay); // Append early for reference

	signExplanationModalOverlay.innerHTML = `
    <div class="dialog-content" id="sign-explanation-modal-content">
      <div class="dialog-header">
        <h4 class="dialog-title" id="sign-explanation-modal-title"></h4>
        <button class="close-dialog" id="close-sign-explanation-modal-button">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="dialog-body">
        <p class="dialog-text" id="sign-explanation-modal-category"></p>
        <p class="dialog-text" id="sign-explanation-modal-text"></p>
      </div>
    </div>
  `;

	// Get references to modal elements *after* they are added to the DOM
	const signExplanationModalContent = document.getElementById(
		"sign-explanation-modal-content"
	);
	const signExplanationModalTitle = document.getElementById(
		"sign-explanation-modal-title"
	);
	const signExplanationModalCategory = document.getElementById(
		"sign-explanation-modal-category"
	);
	const signExplanationModalText = document.getElementById(
		"sign-explanation-modal-text"
	);

	// --- NOVO: Fechar modal ao rolar a página ---
	// Adiciona um listener de rolagem à janela (window)
	window.addEventListener("scroll", () => {
		// Verifica se o modal está visível antes de tentar fechá-lo
		if (signExplanationModalOverlay.style.display === "flex") {
			console.log("Página rolou. Fechando modal de explicação.");
			closeSignExplanationModal();
		}
	});

	// Add event listener to close button inside the new modal (must be attached AFTER elements are in DOM)
	document
		.getElementById("close-sign-explanation-modal-button")
		.addEventListener("click", closeSignExplanationModal);

	// Close modal when clicking outside of the dialog content
	signExplanationModalOverlay.addEventListener("click", (event) => {
		if (event.target === signExplanationModalOverlay) {
			console.log("Cliquem no overlay do modal de explicação. Fechando.");
			closeSignExplanationModal();
		}
	});

	function getSignTypeDetails(type) {
		switch (type) {
			case "estatico":
				return { text: "Estático", class: "sign-type-estatico" };
			case "dinamico":
				return { text: "Dinâmico", class: "sign-type-dinamico" };
			case "metalinguistico":
				return {
					text: "Metalinguístico",
					class: "sign-type-metalinguistico",
				};
			default:
				return { text: "Desconhecido", class: "sign-type-unknown" };
		}
	}

	// openSignExplanationModal - AGORA COM ORDEM CORRETA PARA VISIBILIDADE
	function openSignExplanationModal(
		title,
		category,
		explanation,
		indicatorElement
	) {
		console.log("openSignExplanationModal chamado.");

		// Obtenção de referências (já deve estar ok, apenas para contexto)
		const signExplanationModalOverlay = document.getElementById(
			"sign-explanation-modal-overlay"
		);
		const signExplanationModalContent = document.getElementById(
			"sign-explanation-modal-content"
		);
		const signExplanationModalTitle = document.getElementById(
			"sign-explanation-modal-title"
		);
		const signExplanationModalCategory = document.getElementById(
			"sign-explanation-modal-category"
		);
		const signExplanationModalText = document.getElementById(
			"sign-explanation-modal-text"
		);

		signExplanationModalTitle.textContent = title;
		const categoryDetails = getSignTypeDetails(category);
		const categoryChip = document.createElement("span");
		categoryChip.classList.add("sign-category-chip", categoryDetails.class);
		categoryChip.textContent = categoryDetails.text;
		signExplanationModalCategory.innerHTML = "";
		signExplanationModalCategory.appendChild(categoryChip);
		signExplanationModalText.textContent = explanation;

		console.log(
			`Modal preenchido: Título="${title}", Categoria="${categoryDetails.text}", Explicação="${explanation}"`
		);

		const indicatorRect = indicatorElement.getBoundingClientRect();
		let modalContentWidth = signExplanationModalContent.offsetWidth;
		let modalContentHeight = signExplanationModalContent.offsetHeight;

		if (modalContentWidth === 0) modalContentWidth = 300;
		if (modalContentHeight === 0) modalContentHeight = 150;

		let modalTop = indicatorRect.bottom + window.scrollY + 10;
		let modalLeft = indicatorRect.left + window.scrollX;
		console.log(
			`Posição inicial calculada: Top=${modalTop}, Left=${modalLeft}`
		);

		if (modalLeft + modalContentWidth > window.innerWidth - 20) {
			modalLeft = window.innerWidth - modalContentWidth - 20;
		}
		if (modalLeft < 20) {
			modalLeft = 20;
		}

		if (
			modalTop + modalContentHeight >
			window.innerHeight + window.scrollY - 20
		) {
			modalTop =
				indicatorRect.top + window.scrollY - modalContentHeight - 10;
			if (modalTop < window.scrollY + 20) {
				modalTop = window.scrollY + 20;
			}
		}

		// Aplica os estilos de posicionamento
		signExplanationModalOverlay.style.position = "absolute";
		signExplanationModalOverlay.style.top = `${modalTop}px`;
		signExplanationModalOverlay.style.left = `${modalLeft}px`;
		signExplanationModalOverlay.style.width = "auto";
		signExplanationModalOverlay.style.height = "auto";
		signExplanationModalOverlay.style.backgroundColor = "transparent";
		signExplanationModalOverlay.style.zIndex = "1001";

		signExplanationModalContent.style.position = "static";

		// --- MUDANÇA CRÍTICA AQUI ---
		// 1. Define 'display: flex' primeiro para o navegador ver o elemento.
		signExplanationModalOverlay.style.display = "flex";
		console.log("Modal display: flex definido.");

		// 2. Aguarda um "tick" do navegador (muito breve, essencial para transições)
		//    antes de adicionar a classe 'is-visible' que inicia a transição de opacidade/visibilidade.
		//    Isso garante que o navegador registre a mudança de display antes de iniciar a transição.
		requestAnimationFrame(() => {
			signExplanationModalOverlay.classList.add("is-visible");
			console.log(
				"Modal de explicação exibido e posicionado via classe 'is-visible' após requestAnimationFrame."
			);
		});
	}

	// closeSignExplanationModal - Também ajustada para remover a classe 'is-visible'
	function closeSignExplanationModal() {
		console.log("Fechando modal de explicação.");
		// NOVO: Remove a classe 'is-visible' para iniciar a transição de saída
		signExplanationModalOverlay.classList.remove("is-visible");

		// Oculta o display APÓS a transição para garantir que ela ocorra.
		// Usamos um setTimeout para esperar a transição de opacidade/visibilidade.
		// A duração deve ser igual ou maior que a duração da transição no CSS.
		setTimeout(() => {
			signExplanationModalOverlay.style.display = "none";
			// Mantenha o console.log aqui para indicar que o display foi alterado
			console.log("Modal display:none definido após transição.");
		}, 300); // 300ms, igual à sua transição no CSS

		// Remove a classe 'active' de TODOS os botões do Raio-X
		document.querySelectorAll(".x-ray-toggle").forEach((btn) => {
			btn.classList.remove("active");
		});
		console.log(
			"Classe 'active' removida de todos os botões de Raio-X via closeSignExplanationModal."
		);
	}

	function closeSignExplanationModal() {
		console.log("Fechando modal de explicação.");
		signExplanationModalOverlay.style.display = "none";
	}
});
