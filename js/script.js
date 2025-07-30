document.addEventListener("DOMContentLoaded", () => {
	const body = document.body;
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
	const themeRadioButtons = document.querySelectorAll('input[name="theme"]');

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

	// Função para obter a altura total dos cabeçalhos visíveis
	function getHeaderOffsetHeight() {
		const mainHeader = document.querySelector("header"); // Seu header principal
		const mobileNavHeader = document.getElementById(
			"mobile-navigation-header"
		); // Seu segundo header para mobile

		let totalHeaderHeight = 0;

		// Verifica se o header principal está visível e adiciona sua altura
		if (mainHeader && mainHeader.offsetHeight > 0) {
			totalHeaderHeight += mainHeader.offsetHeight;
		}

		// Verifica se o header de navegação mobile está visível e adiciona sua altura
		// Geralmente, em telas maiores, ele terá offsetHeight = 0 ou será display: none;
		if (mobileNavHeader && mobileNavHeader.offsetHeight > 0) {
			totalHeaderHeight += mobileNavHeader.offsetHeight;
		}

		// Adicione um pequeno padding extra se desejar mais espaço
		const extraPadding = 10; // Exemplo: 10px a mais
		return totalHeaderHeight + extraPadding;
	}

	// Smooth Scrolling com Offset do Cabeçalho
	const navLinks = document.querySelectorAll("#summary-sidebar ul li a");

	navLinks.forEach((link) => {
		link.addEventListener("click", function (e) {
			e.preventDefault();

			const targetId = this.getAttribute("href");
			const targetElement = document.querySelector(targetId);

			if (targetElement) {
				const headerOffset = getHeaderOffsetHeight(); // Obtém a altura dinâmica
				const elementPosition =
					targetElement.getBoundingClientRect().top;
				const offsetPosition =
					elementPosition + window.scrollY - headerOffset;

				window.scrollTo({
					top: offsetPosition,
					behavior: "smooth",
				});

				const summarySidebar =
					document.getElementById("summary-sidebar");
				if (summarySidebar.classList.contains("active")) {
					summarySidebar.classList.remove("active");
				}
			}
		});
	});

	// Dynamic link highlighting
	const sections = document.querySelectorAll("main .content section");

	// As opções do IntersectionObserver também precisam do offset dinâmico
	const observerOptions = {
		root: null, // Usa a viewport como raiz
		rootMargin: `-${getHeaderOffsetHeight()}px 0px 0px 0px`, // Offset dinâmico
		threshold: 0.1, // Gatilho quando 10% da seção está visível
	};

	const observer = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			const id = entry.target.getAttribute("id");
			const correspondingLink = document.querySelector(
				`#summary-sidebar ul li a[href="#${id}"]`
			);

			if (correspondingLink) {
				if (entry.isIntersecting) {
					navLinks.forEach((link) =>
						link.classList.remove("active-section")
					);
					correspondingLink.classList.add("active-section");
				}
			}
		});
	}, observerOptions); // Use observerOptions aqui!

	sections.forEach((section) => {
		observer.observe(section);
	});

	// ... (Seu código existente para botões "Ver Exemplos") ...

	const verExemplosButtons = document.querySelectorAll(".sign-card .primary");

	verExemplosButtons.forEach((button) => {
		button.addEventListener("click", function () {
			let targetId = "";

			const parentCard = this.closest(".sign-card");
			if (parentCard) {
				if (parentCard.id === "static-sign") {
					targetId = "#signos-estaticos";
				} else if (parentCard.id === "dynamic-sign") {
					targetId = "#signos-dinamicos";
				} else if (parentCard.id === "metalinguistic-sign") {
					targetId = "#signos-metalinguisticos";
				}
			}

			if (targetId) {
				const targetElement = document.querySelector(targetId);

				if (targetElement) {
					const headerOffset = getHeaderOffsetHeight(); // Obtém a altura dinâmica
					const elementPosition =
						targetElement.getBoundingClientRect().top;
					const offsetPosition =
						elementPosition + window.scrollY - headerOffset;

					window.scrollTo({
						top: offsetPosition,
						behavior: "smooth",
					});
				}
			}
		});
	});

	//
	// Funções dos exemplos de signos
	//

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

	// Função para abrir tooltips ao passar o mouse no botão
	const tooltipButton = document.getElementById("tooltip-button");
	const tooltipContent = document.getElementById("tooltip-content");
	if (tooltipButton && tooltipContent) {
		tooltipButton.addEventListener("mouseover", () => {
			tooltipContent.classList.add("active");
		});

		tooltipButton.addEventListener("mouseout", () => {
			tooltipContent.classList.remove("active");
		});
	} else {
		console.warn(
			"Elemento tooltip-button ou tooltip-content não encontrado. Verifique o ID no HTML."
		);
	}

	// Função para abrir o diálogo ao clicar no botão
	const dialogButton = document.getElementById("dialog-button");
	const dialogButtonDialog = document.getElementById("dialog-button-dialog");
	const closeDialogButton = document.getElementById("close-dialog-button");

	if (dialogButton && dialogButtonDialog) {
		dialogButton.addEventListener("click", () => {
			console.log("Abrindo diálogo...");
			dialogButtonDialog.classList.add("active");
		});
	} else {
		console.warn(
			"Elemento dialog-button ou dialog-button-dialog não encontrado. Verifique o ID no HTML."
		);
	}

	// Função para fechar o diálogo ao clicar no botão de fechar ou fora do diálogo
	if (closeDialogButton && dialogButtonDialog) {
		closeDialogButton.addEventListener("click", () => {
			dialogButtonDialog.classList.remove("active");
		});

		dialogButtonDialog.addEventListener("click", (event) => {
			if (event.target === dialogButtonDialog) {
				dialogButtonDialog.classList.remove("active");
			}
		});
	} else {
		console.warn(
			"Elemento close-dialog-button ou dialog-button-dialog não encontrado. Verifique o ID no HTML."
		);
	}

	// Função para fechar o diálogo ao pressionar a tecla Escape
	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			dialogButtonDialog.classList.remove("active");
		}
	});

	// Função pra alterar o helper de senha
	const passwordField = document.getElementById("password-field");
	const passwordFieldHelper = document.getElementById(
		"password-field-helper"
	);
	if (passwordField && passwordFieldHelper) {
		passwordField.addEventListener("blur", () => {
			const value = passwordField.value;
			if (value === "") {
				passwordFieldHelper.textContent = "Campo obrigatório.";
				passwordFieldHelper.style.color = "red";
			} else if (value.length < 3 || value.length > 20) {
				passwordFieldHelper.textContent =
					"Senha inválida. Deve conter entre 3 e 20 caracteres.";
				passwordFieldHelper.style.color = "red";
			} else {
				passwordFieldHelper.textContent = "Senha válida.";
				passwordFieldHelper.style.color = "green";
			}
		});
	} else {
		console.warn(
			"Elemento password-field ou password-field-helper não encontrado. Verifique o ID no HTML."
		);
	}

	// Função para alternar o menu lateral
	const summaryButton = document.getElementById("open-summary-button");
	const summarySidebar = document.getElementById("summary-sidebar");
	if (summaryButton && summarySidebar) {
		summaryButton.addEventListener("click", () => {
			console.log("Abrindo menu lateral...");
			summarySidebar.classList.add("active");
		});

		// Fecha o menu lateral ao clicar fora dele
		document.addEventListener("click", (event) => {
			if (
				summarySidebar.classList.contains("active") &&
				!summarySidebar.contains(event.target) &&
				!summaryButton.contains(event.target)
			) {
				console.log("Fechando menu lateral...");
				summarySidebar.classList.remove("active");
			}
		});
	} else {
		console.warn(
			"Elemento open-summary-button ou summary-sidebar não encontrado. Verifique o ID no HTML."
		);
	}

	// Função para alternar o menu de controles
	const controlsButton = document.getElementById("open-controls-button");
	const controlsSidebar = document.getElementById("controls-sidebar");
	if (controlsButton && controlsSidebar) {
		controlsButton.addEventListener("click", () => {
			controlsSidebar.classList.toggle("active");
			body.classList.toggle("controls-active");
		});

		// Fecha o menu de controles ao clicar fora dele
		document.addEventListener("click", (event) => {
			if (
				controlsSidebar.classList.contains("active") &&
				!controlsSidebar.contains(event.target) &&
				!controlsButton.contains(event.target)
			) {
				controlsSidebar.classList.remove("active");
				body.classList.remove("controls-active");
			}
		});
	} else {
		console.warn(
			"Elemento open-controls-button ou controls-sidebar não encontrado. Verifique o ID no HTML."
		);
	}

	// fechamento do DOMContentLoaded. Não apagar
});
