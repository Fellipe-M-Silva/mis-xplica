document.addEventListener("DOMContentLoaded", () => {
	const summaryToggle = document.getElementById("summary-toggle");
	const summarySidebar = document.getElementById("summary-sidebar");
	const body = document.body;
	const rayXToggleButtons = document.querySelectorAll(".ray-x-toggle");
	const rayXOverlay = document.getElementById("ray-x-overlay");
	const rayXDialog = document.getElementById("ray-x-dialog");
	const dialogTitle = document.getElementById("dialog-title");
	const dialogDescription = document.getElementById("dialog-description");
	const closeDialogButton = rayXDialog.querySelector(".close-dialog");
	const allSignos = document.querySelectorAll(".signo");
	const hoverButton = document.getElementById("hover-button");
	const toggleButton = document.getElementById("toggle-button");
	const toggleStatus = document.getElementById("toggle-status");
	const selectField = document.getElementById("select-field");
	const selectedOption = document.getElementById("selected-option");
	const toggleIndicator = document.getElementById("toggle-indicator");
	const movableArea = document.getElementById("movable-area");
	const movableObject = document.getElementById("movable-object");
	const backToTopButton = document.getElementById("back-to-top");
	const backToExampleButton = document.getElementById("back-to-example");
	const exampleSection = document.getElementById("example-section");
	const themeSwitch = document.getElementById("theme-switch");
	const themeRadioButtons = document.querySelectorAll('input[name="theme"]');

	let currentRayXMode = null; // 'metalinguistico', 'estatico', 'dinamico'

	// Função para aplicar o tema
	const applyTheme = (theme) => {
		if (theme === "default") {
			// Agora a opção "Padrão" é o "system"
			body.removeAttribute("data-theme"); // Remove o atributo para voltar à preferência do sistema
		} else {
			body.setAttribute("data-theme", theme); // Define o tema manual (light ou dark)
		}
		// Armazenar a preferência do usuário
		localStorage.setItem("user-theme", theme);
	};

	// Função para carregar o tema do localStorage ou da preferência do sistema
	const loadThemePreference = () => {
		const savedTheme = localStorage.getItem("user-theme");
		let themeToApply = savedTheme || "default"; // Se não houver tema salvo, 'default' (sistema)

		// Marcar o input de rádio correto
		const radioToSelect = document.getElementById(`${themeToApply}-theme`);
		if (radioToSelect) {
			radioToSelect.checked = true;
		}

		applyTheme(themeToApply);
	};

	// Event listener para alternar o tema quando QUALQUER rádio button de tema muda
	themeRadioButtons.forEach((radio) => {
		radio.addEventListener("change", (event) => {
			applyTheme(event.target.value);
		});
	});

	// Carregar o tema quando a página é carregada
	loadThemePreference();

	// Opcional: Escutar mudanças na preferência do sistema (se o tema for 'default')
	window
		.matchMedia("(prefers-color-scheme: dark)")
		.addEventListener("change", (event) => {
			if (localStorage.getItem("user-theme") === "default") {
				applyTheme("default"); // Re-aplica o tema do sistema
			}
		});

	// Função para mudar o texto do botão ao passar o mouse
	hoverButton.addEventListener("mouseover", () => {
		hoverButton.textContent = "Você passou o mouse!";
	});

	// Função para restaurar o texto do botão ao sair o mouse
	hoverButton.addEventListener("mouseout", () => {
		hoverButton.textContent = "Passe o mouse aqui";
	});

	// Função para alternar o estado do toggle
	toggleButton.addEventListener("change", () => {
		if (toggleButton.checked) {
			toggleStatus.textContent = "Ativado";
			body.classList.add("toggle-active");
		} else {
			toggleStatus.textContent = "Desativado";
			body.classList.remove("toggle-active");
		}
	});

	// Função para atualizar o texto do select ao selecionar uma opção
	selectField.addEventListener("change", () => {
		if (selectField.value) {
			const selectedValue =
				selectField.options[selectField.selectedIndex].text;
			selectedOption.textContent = `Opção selecionada: ${selectedValue}`;
		} else {
			selectedOption.textContent = "Opção selecionada: nenhuma";
		}
	});

	// Função para alternar o estado do toggle visualmente
	toggleIndicator.addEventListener("click", () => {
		if (toggleIndicator.classList.contains("active")) {
			toggleIndicator.classList.remove("active");
			toggleStatus.textContent = "Desativado";
			body.classList.remove("toggle-active");
		} else {
			toggleIndicator.classList.add("active");
			toggleStatus.textContent = "Ativado";
			body.classList.add("toggle-active");
		}
	});

	// Função para mover o objeto dentro da área
	movableArea.addEventListener("mousedown", (event) => {
		if (event.target === movableObject) {
			const offsetX =
				event.clientX - movableObject.getBoundingClientRect().left;
			const offsetY =
				event.clientY - movableObject.getBoundingClientRect().top;

			const moveAt = (pageX, pageY) => {
				movableObject.style.left = `${pageX - offsetX}px`;
				movableObject.style.top = `${pageY - offsetY}px`;
			};

			const onMouseMove = (event) => {
				moveAt(event.pageX, event.pageY);
			};

			document.addEventListener("mousemove", onMouseMove);

			document.addEventListener(
				"mouseup",
				() => {
					document.removeEventListener("mousemove", onMouseMove);
				},
				{ once: true }
			);
		}
	});

	// Função para voltar ao topo da página
	backToTopButton.addEventListener("click", () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
		backToExampleButton.classList.add("active"); // Mostra o botão para voltar ao exemplo
	});

	// Função para voltar ao exemplo. o botão só aparece quando o usuário clica no exemplo
	backToExampleButton.addEventListener("click", () => {
		window.scrollTo({
			top: exampleSection.offsetTop,
			behavior: "smooth",
		});
		backToExampleButton.classList.remove("active"); // Esconde o botão após voltar
	});

	// Função para alternar o sumário
	summaryToggle.addEventListener("click", () => {
		summarySidebar.classList.toggle("active");
		body.classList.toggle("summary-active"); // Adiciona classe ao body para ajustar main

		// Desativa qualquer modo Raio-X quando o sumário é aberto/fechado
		body.classList.remove("ray-x-mode");
		allSignos.forEach((signo) => {
			signo.classList.remove("metalinguistico", "estatico", "dinamico");
		});
		rayXToggleButtons.forEach((button) => {
			button.classList.remove("active"); // Desativa visualmente os botões Raio-X
		});
		currentRayXMode = null;
	});

	// Fechar sumário ao clicar fora (apenas para desktop, no mobile ele ocupa a tela toda)
	document.addEventListener("click", (event) => {
		if (
			window.innerWidth >= 769 &&
			!summarySidebar.contains(event.target) &&
			!summaryToggle.contains(event.target) &&
			summarySidebar.classList.contains("active")
		) {
			summarySidebar.classList.remove("active");
			body.classList.remove("summary-active");
		}
	});

	// Funcionalidade do "Raio-X"
	rayXToggleButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const type = button.dataset.signType;

			// Desativa o modo atual se o mesmo botão for clicado novamente
			if (currentRayXMode === type) {
				body.classList.remove("ray-x-mode");
				allSignos.forEach((signo) => {
					signo.classList.remove(
						"metalinguistico",
						"estatico",
						"dinamico"
					);
				});
				button.classList.remove("active"); // Desativa o botão clicado
				currentRayXMode = null;
			} else {
				// Desativa todos os botões Raio-X primeiro
				rayXToggleButtons.forEach((btn) =>
					btn.classList.remove("active")
				);

				// Ativa o novo botão
				button.classList.add("active");

				// Ativa o novo modo Raio-X
				body.classList.add("ray-x-mode");
				currentRayXMode = type;

				// Remove classes de todos os signos antes de aplicar as novas
				allSignos.forEach((signo) => {
					signo.classList.remove(
						"metalinguistico",
						"estatico",
						"dinamico"
					);
				});

				// Adiciona a classe do tipo de signo relevante
				allSignos.forEach((signo) => {
					if (signo.dataset.signoTipo === type) {
						signo.classList.add(type);
					}
				});
			}
		});
	});

	// Abrir o dialog ao clicar em um signo no modo Raio-X
	allSignos.forEach((signo) => {
		signo.addEventListener("click", () => {
			if (body.classList.contains("ray-x-mode")) {
				const type = signo.dataset.signoTipo;
				const description = signo.dataset.signoDescricao;

				dialogTitle.textContent = `Signo ${
					type.charAt(0).toUpperCase() + type.slice(1)
				}`;
				dialogDescription.textContent = description;

				// Aplica a cor da borda do dialog de acordo com o tipo de signo
				rayXDialog.style.borderColor = `var(--${type}-color)`;

				rayXOverlay.classList.add("active");
			}
		});
	});

	// Fechar o dialog
	closeDialogButton.addEventListener("click", () => {
		rayXOverlay.classList.remove("active");
	});

	// Fechar o dialog ao clicar fora dele
	rayXOverlay.addEventListener("click", (event) => {
		if (event.target === rayXOverlay) {
			rayXOverlay.classList.remove("active");
		}
	});

	const metacommunicationQuote = document.getElementById(
		"metacommunication-quote"
	);

	// Somente se o blockquote existir, processar suas palavras
	if (metacommunicationQuote) {
		const processQuote = () => {
			const text = metacommunicationQuote.innerText; // Pega o texto bruto
			// Divide o texto em palavras, mas mantém espaços e pontuações para não perder o layout
			const words = text.split(/(\s+)/); // Divide por espaços, mas mantém os espaços no array

			// Limpa o conteúdo atual do blockquote
			metacommunicationQuote.innerHTML = "";

			words.forEach((word, index) => {
				// Cria um span para cada palavra (e para os espaços)
				const span = document.createElement("span");
				span.textContent = word;
				span.dataset.index = index; // Para referência, se precisar
				metacommunicationQuote.appendChild(span);
			});
		};

		// Processa o blockquote assim que o DOM estiver carregado
		processQuote();

		// Agora, os listeners para o efeito de peso da fonte
		metacommunicationQuote.addEventListener("mousemove", (event) => {
			const mouseX = event.clientX;
			const mouseY = event.clientY;

			// Obtém todos os spans de palavras dentro do blockquote
			const wordSpans = metacommunicationQuote.querySelectorAll("span");

			wordSpans.forEach((span) => {
				const rect = span.getBoundingClientRect();

				// Calcula a distância do mouse para o centro da palavra
				const wordCenterX = rect.left + rect.width / 2;
				const wordCenterY = rect.top + rect.height / 2;

				// Distância euclidiana (aproximada, ou pode usar apenas em X para efeito linear)
				const distanceX = Math.abs(mouseX - wordCenterX);
				const distanceY = Math.abs(mouseY - wordCenterY);
				const distance = Math.sqrt(
					distanceX * distanceX + distanceY * distanceY
				);

				// Define a área de influência (em pixels)
				const maxDistance = 100; // Palavras até 100px de distância serão afetadas

				// Calcula o peso da fonte baseado na distância
				let fontWeight;
				if (distance < maxDistance) {
					// Mapeia a distância (0 a maxDistance) para o peso da fonte (900 a 300)
					// Quanto menor a distância, maior o peso
					const normalizedDistance = distance / maxDistance; // 0 a 1
					fontWeight = 900 - normalizedDistance * (900 - 300); // 900 - (0 a 600)
					fontWeight = Math.max(
						300,
						Math.min(900, Math.round(fontWeight / 100) * 100)
					); // Arredonda para múltiplos de 100
				} else {
					fontWeight = 300; // Peso padrão se estiver fora da área
				}

				span.style.fontWeight = fontWeight;
			});
		});

		metacommunicationQuote.addEventListener("mouseleave", () => {
			// Ao sair do blockquote, resetar todas as palavras para o peso base
			const wordSpans = metacommunicationQuote.querySelectorAll("span");
			wordSpans.forEach((span) => {
				span.style.fontWeight = 300;
			});
		});
	} else {
		console.warn(
			"Elemento #metacommunication-quote não encontrado. O efeito de peso da fonte não será aplicado."
		);
	}
});
