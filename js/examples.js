document.addEventListener("DOMContentLoaded", () => {
	const body = document.body;
	
	//
	// Dinâmicos
	//

	// Função para mudar o texto do botão ao passar o mouse
	const hoverButton = document.getElementById("hover-button");
	hoverButton.addEventListener("mouseover", () => {
		hoverButton.textContent = "Você passou o mouse!";
	});
	// Função para restaurar o texto do botão ao sair o mouse
	hoverButton.addEventListener("mouseout", () => {
		hoverButton.textContent = "Passe o mouse aqui";
	});

	// Função para alternar o estado do toggle
	const toggleButton = document.getElementById("toggle-button");
	const toggleStatus = document.getElementById("toggle-status");
	toggleButton.addEventListener("change", () => {
		if (toggleButton.checked) {
			toggleStatus.textContent = "Ativado";
			body.classList.add("toggle-active");
		} else {
			toggleStatus.textContent = "Desativado";
			body.classList.remove("toggle-active");
		}
	});
	// Função para alternar o estado do toggle visualmente
	const toggleIndicator = document.getElementById("toggle-indicator");
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

	// Função para atualizar o texto do select ao selecionar uma opção
	const selectField = document.getElementById("select-field");
	const selectedOption = document.getElementById("selected-option");
	selectField.addEventListener("change", () => {
		if (selectField.value) {
			const selectedValue =
				selectField.options[selectField.selectedIndex].text;
			selectedOption.textContent = `Opção selecionada: ${selectedValue}`;
		} else {
			selectedOption.textContent = "Opção selecionada: nenhuma";
		}
	});

	// Função para mover o objeto dentro da área
	const movableArea = document.getElementById("movable-area");
	const movableObject = document.getElementById("movable-object");
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
	// Função para mover o objeto dentro da área com touch
	movableArea.addEventListener("touchstart", (event) => {
		if (event.target === movableObject) {
			const touch = event.touches[0];
			const offsetX =
				touch.clientX - movableObject.getBoundingClientRect().left;
			const offsetY =
				touch.clientY - movableObject.getBoundingClientRect().top;

			const moveAt = (pageX, pageY) => {
				movableObject.style.left = `${pageX - offsetX}px`;
				movableObject.style.top = `${pageY - offsetY}px`;
			};

			const onTouchMove = (event) => {
				moveAt(event.touches[0].pageX, event.touches[0].pageY);
			};

			document.addEventListener("touchmove", onTouchMove);

			document.addEventListener(
				"touchend",
				() => {
					document.removeEventListener("touchmove", onTouchMove);
				},
				{ once: true }
			);
		}
	});

	// Função para voltar ao topo da página
	const backToTopButton = document.getElementById("back-to-top");
	const backToExampleButton = document.getElementById("back-to-example");
	const exampleSection = document.getElementById("example-section");
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

	//
	// Metalinguísticos
	//

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
});
