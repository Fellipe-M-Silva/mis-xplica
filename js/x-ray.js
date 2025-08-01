document.addEventListener("DOMContentLoaded", () => {
	console.log("DOM totalmente carregado. Iniciando x-ray.js");

	// --- X-Ray Toggle Logic ---
	document.querySelectorAll(".x-ray-toggle").forEach((button) => {
		console.log("Botão de Raio-X encontrado:", button.id);
		button.addEventListener("click", () => {
			const selectedSignType = button.dataset.signTypeButton;
			console.log(
				`Botão '${button.id}' clicado. Tipo de signo selecionado: ${selectedSignType}`
			);

			const isCurrentlyActive = document.body.classList.contains(
				`x-ray-active-${selectedSignType}`
			);

			// PASSO 1: Sempre LIMPE o estado anterior COMPLETO.
			document.body.classList.remove(
				"x-ray-active-estatico",
				"x-ray-active-dinamico",
				"x-ray-active-metalinguistico"
			);
			console.log("Classes 'x-ray-active' removidas do body.");

			document.querySelectorAll(".x-ray-toggle").forEach((btn) => {
				btn.classList.remove("active");
			});
			console.log(
				"Classe 'active' removida de todos os botões de Raio-X."
			);

			// Importante: Limpar indicadores *antes* de decidir ativar um novo
			hideAllXrayIndicators();
			console.log(
				"Indicadores e data-xray-active removidos de todos os elementos."
			);

			closeSignExplanationModal();
			console.log("Modal de explicação fechado.");

			// PASSO 2: DECIDE o que fazer AGORA com base no clique
			if (!isCurrentlyActive) {
				document.body.classList.add(`x-ray-active-${selectedSignType}`);
				console.log(
					`Lente de Raio-X ativada: Adicionado 'x-ray-active-${selectedSignType}' ao body.`
				);
				button.classList.add("active");
				console.log(
					`Classe 'active' adicionada ao botão '${button.id}'.`
				);
				showXrayIndicators(selectedSignType);
			} else {
				console.log(
					`Lente '${selectedSignType}' estava ativa e foi desativada.`
				);
			}
		});
	});

	// --- Functions for X-Ray Indicators ---
	function showXrayIndicators(activeSignType) {
		console.log(
			`showXrayIndicators chamado para o tipo: ${activeSignType}`
		);

		const elementsToConsider = document.querySelectorAll(
			"[data-static-explanation], [data-dynamic-explanation], [data-metalinguistic-explanation]"
		);

		console.log(
			`Total de elementos com explicações encontradas: ${elementsToConsider.length}`
		);
		if (elementsToConsider.length === 0) {
			console.log(
				"Nenhum elemento com atributos de explicação encontrado. Verifique seu HTML."
			);
		}

		elementsToConsider.forEach((element, index) => {
			const explanationKeyKebabCase = `data-${activeSignType}-explanation`; // Nome completo do atributo

			// *** NOVO CÓDIGO DE DEPURAÇÃO CRÍTICO AQUI ***
			const rawAttributeValue = element.getAttribute(
				explanationKeyKebabCase
			);
			const explanationText =
				rawAttributeValue === null ? null : rawAttributeValue.trim(); // Garante que é null se não existir, e remove espaços se existir

			console.log(
				`--- Elemento ${index + 1} (${element.tagName}, ID: ${
					element.id || "N/A"
				}):`
			);
			console.log(
				`  Procurando por atributo HTML: ${explanationKeyKebabCase}`
			);
			console.log(
				`  Valor LIDO por getAttribute ANTES do trim:`,
				rawAttributeValue
			);
			console.log(
				`  Valor FINAL de explanationText APÓS trim:`,
				explanationText
			);
			console.log(`  Tipo de 'explanationText':`, typeof explanationText);
			console.log(
				`  É Falsy (null, undefined, '', 0, false)?`,
				!explanationText
			);
			// *** FIM DO NOVO CÓDIGO DE DEPURAÇÃO ***

			// CRIE E ANEXE O INDICADOR APENAS SE A EXPLICAÇÃO EXISTIR E NÃO FOR UMA STRING VAZIA APÓS TRIM
			if (
				explanationText &&
				typeof explanationText === "string" &&
				explanationText.trim() !== ""
			) {
				console.log(
					`  Processando e destacando elemento ${
						index + 1
					} para '${activeSignType}':`,
					element
				);

				element.dataset.xrayActive = "true";
				element.dataset.xrayCategory = activeSignType;
				console.log(
					`  Atributos adicionados: data-xray-active='true', data-xray-category='${activeSignType}'`
				);

				const computedPosition = getComputedStyle(element).position;
				if (computedPosition === "static") {
					element.style.position = "relative";
					console.log(
						`  Posição do elemento alterada para 'relative'.`
					);
				}

				const indicator = document.createElement("button");
				indicator.classList.add("x-ray-indicator");
				indicator.innerHTML = `<span class="material-symbols-outlined">${getIconForSignType(
					activeSignType
				)}</span>`;
				console.log("  Indicador criado e configurado.");

				indicator.dataset.signName =
					element.dataset.signName || "Elemento sem nome";
				indicator.dataset.signCategory = activeSignType;
				indicator.dataset.signExplanation = explanationText;
				console.log(
					`  Dados do signo para o modal: Nome='${indicator.dataset.signName}', Categoria='${indicator.dataset.signCategory}'`
				);

				element.appendChild(indicator);
				console.log("  Indicador anexado ao elemento.");

				const rect = element.getBoundingClientRect();
				if (
					rect.left > window.innerWidth / 2 ||
					rect.right > window.innerWidth - 100
				) {
					indicator.classList.add("position-left");
					console.log(
						"  Adicionado classe 'position-left' ao indicador."
					);
				} else {
					indicator.classList.add("position-right");
					console.log(
						"  Adicionado classe 'position-right' ao indicador."
					);
				}

				indicator.addEventListener("click", (event) => {
					event.stopPropagation();
					console.log(
						"  Indicador clicado. Abrindo modal de explicação."
					);
					openSignExplanationModal(
						indicator.dataset.signName,
						indicator.dataset.signCategory,
						indicator.dataset.signExplanation,
						indicator
					);
				});
			} else {
				console.log(
					`  Elemento não tem explicação para '${activeSignType}' ou explicação vazia para este tipo:`,
					element
				);
			}
		});
	}

	function hideAllXrayIndicators() {
		console.log(
			"hideAllXrayIndicators: Iniciando limpeza de todos os destaques."
		);

		document
			.querySelectorAll(".x-ray-indicator")
			.forEach((indicator, idx) => {
				indicator.remove();
				console.log(`Indicador #${idx + 1} removido.`);
			});
		console.log("Todos os indicadores foram removidos.");

		const activeElements = document.querySelectorAll(
			'[data-xray-active="true"]'
		);
		console.log(
			`Total de elementos ativos para limpar: ${activeElements.length}`
		);

		activeElements.forEach((element, idx) => {
			delete element.dataset.xrayActive;
			delete element.dataset.xrayCategory;
			console.log(
				`Atributos data-xray-active e data-xray-category removidos de elemento #${
					idx + 1
				}.`
			);

			if (element.style.position === "relative") {
				element.style.position = "";
				console.log(
					`Posição de '${element.tagName}' resetada para padrão.`
				);
			}
		});
		console.log("Limpeza de destaques concluída.");
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

	function camelCase(kebabCase) {
		return kebabCase.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
	}

	const signExplanationModalOverlay = document.createElement("div");
	signExplanationModalOverlay.id = "sign-explanation-modal-overlay";
	signExplanationModalOverlay.classList.add("sign-explanation-modal-overlay");
	signExplanationModalOverlay.style.display = "none";
	document.body.appendChild(signExplanationModalOverlay);

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

	let lastScrollY = window.scrollY;

	window.addEventListener("scroll", () => {
		if (
			signExplanationModalOverlay.classList.contains("is-visible") &&
			Math.abs(lastScrollY - window.scrollY) > 5
		) {
			console.log("Página rolou. Fechando modal de explicação.");
			closeSignExplanationModal();
		}
		lastScrollY = window.scrollY;
	});

	document
		.getElementById("close-sign-explanation-modal-button")
		.addEventListener("click", closeSignExplanationModal);

	signExplanationModalOverlay.addEventListener("click", (event) => {
		if (event.target === signExplanationModalOverlay) {
			console.log("Clique no overlay do modal de explicação. Fechando.");
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

	function openSignExplanationModal(
		title,
		category,
		explanation,
		indicatorElement
	) {
		console.log("openSignExplanationModal chamado.");

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

		signExplanationModalOverlay.style.position = "absolute";
		signExplanationModalOverlay.style.top = `${modalTop}px`;
		signExplanationModalOverlay.style.left = `${modalLeft}px`;
		signExplanationModalOverlay.style.width = "auto";
		signExplanationModalOverlay.style.height = "auto";
		signExplanationModalOverlay.style.backgroundColor = "transparent";
		signExplanationModalOverlay.style.zIndex = "1001";

		signExplanationModalContent.style.position = "static";

		signExplanationModalOverlay.style.display = "flex";
		console.log("Modal display: flex definido.");

		requestAnimationFrame(() => {
			signExplanationModalOverlay.classList.add("is-visible");
			console.log(
				"Modal de explicação exibido e posicionado via classe 'is-visible' após requestAnimationFrame."
			);
		});
	}

	function closeSignExplanationModal() {
		console.log("Fechando modal de explicação.");
		signExplanationModalOverlay.classList.remove("is-visible");

		setTimeout(() => {
			signExplanationModalOverlay.style.display = "none";
			console.log("Modal display:none definido após transição.");
		}, 300);
	}
});
