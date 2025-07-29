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

	let currentRayXMode = null; // 'metalinguistico', 'estatico', 'dinamico'

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
