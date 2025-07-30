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
	

	let currentRayXMode = null; // 'metalinguistico', 'estatico', 'dinamico'

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
});
