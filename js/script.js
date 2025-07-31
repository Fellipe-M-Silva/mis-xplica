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
	// Select ALL theme radio buttons, both desktop and mobile
	const themeRadioButtonsDesktop = document.querySelectorAll(
		'input[name="theme"]'
	);
	const themeRadioButtonsMobile = document.querySelectorAll(
		'input[name="theme-mobile"]'
	);

	// Mobile menu elements
	const openSummaryButton = document.getElementById("open-summary-button");
	const openControlsButton = document.getElementById("open-controls-button");
	const mobileSummaryOverlay = document.getElementById(
		"mobile-summary-overlay"
	);
	const mobileControlsOverlay = document.getElementById(
		"mobile-controls-overlay"
	);
	const mobileSummaryContent = document.querySelector(
		"#mobile-summary-overlay .mobile-summary"
	);
	const mobileControlsContent = document.querySelector(
		"#mobile-controls-overlay .mobile-controls"
	);
	const closeMobileMenuButtons =
		document.querySelectorAll(".close-mobile-menu"); // For both mobile menus

	// Existing desktop menu toggles (ensure they are only active on desktop via CSS media queries)
	const summarySidebar = document.getElementById("summary-sidebar");
	const controlsSidebar = document.getElementById("controls-sidebar");

	// Function to apply the theme
	const applyTheme = (theme) => {
		if (theme === "default") {
			// Now "Padrão" option is "system"
			body.removeAttribute("data-theme"); // Remove attribute to revert to system preference
		} else {
			body.setAttribute("data-theme", theme); // Set manual theme (light or dark)
		}
		// Store user preference
		localStorage.setItem("user-theme", theme);

		// Update the checked state for ALL theme radio buttons (desktop and mobile)
		document
			.querySelectorAll('input[name="theme"], input[name="theme-mobile"]')
			.forEach((radio) => {
				if (radio.value === theme) {
					radio.checked = true;
				}
			});
	};

	// Function to load theme from localStorage or system preference
	const loadThemePreference = () => {
		const savedTheme = localStorage.getItem("user-theme");
		let themeToApply = savedTheme || "default"; // If no theme saved, 'default' (system)

		// Apply theme and update radio buttons
		applyTheme(themeToApply);
	};

	// Event listener to toggle theme when ANY desktop radio button changes
	themeRadioButtonsDesktop.forEach((radio) => {
		radio.addEventListener("change", (event) => {
			applyTheme(event.target.value);
		});
	});

	// Event listener to toggle theme when ANY mobile radio button changes
	themeRadioButtonsMobile.forEach((radio) => {
		radio.addEventListener("change", (event) => {
			applyTheme(event.target.value);
		});
	});

	// Load theme when the page loads
	loadThemePreference();

	// Optional: Listen for system preference changes (if theme is 'default')
	window
		.matchMedia("(prefers-color-scheme: dark)")
		.addEventListener("change", (event) => {
			if (localStorage.getItem("user-theme") === "default") {
				applyTheme("default"); // Re-apply system theme
			}
		});

	// Function to get total height of visible headers
	function getHeaderOffsetHeight() {
		const mainHeader = document.querySelector("header"); // Your main header
		const mobileNavHeader = document.getElementById(
			"mobile-navigation-header"
		); // Your second header for mobile

		let totalHeaderHeight = 0;

		// Check if main header is visible and add its height
		if (
			mainHeader &&
			mainHeader.offsetHeight > 0 &&
			getComputedStyle(mainHeader).display !== "none"
		) {
			totalHeaderHeight += mainHeader.offsetHeight;
		}

		// Check if mobile navigation header is visible and add its height
		if (
			mobileNavHeader &&
			mobileNavHeader.offsetHeight > 0 &&
			getComputedStyle(mobileNavHeader).display !== "none"
		) {
			totalHeaderHeight += mobileNavHeader.offsetHeight;
		}

		// Add a small extra padding if desired
		const extraPadding = 10; // Example: 10px extra
		return totalHeaderHeight + extraPadding;
	}

	// Function to close all mobile menus and overlays
	function closeAllMobileMenus() {
		mobileSummaryOverlay.classList.remove("active");
		mobileSummaryContent.classList.remove("active"); // Ensure content slides out
		mobileControlsOverlay.classList.remove("active");
		mobileControlsContent.classList.remove("active"); // Ensure content slides out
		body.classList.remove("no-scroll"); // Remove no-scroll
	}

	// Smooth Scrolling with Header Offset
	// Select ALL navigation links, both desktop and mobile
	const allNavLinks = document.querySelectorAll(
		"#summary-sidebar ul li a, .mobile-summary ul li a"
	);

	allNavLinks.forEach((link) => {
		link.addEventListener("click", function (e) {
			e.preventDefault();

			const targetId = this.getAttribute("href");
			const targetElement = document.querySelector(targetId);

			if (targetElement) {
				const headerOffset = getHeaderOffsetHeight(); // Get dynamic height
				const elementPosition =
					targetElement.getBoundingClientRect().top;
				const offsetPosition =
					elementPosition + window.scrollY - headerOffset;

				window.scrollTo({
					top: offsetPosition,
					behavior: "smooth",
				});

				// Close mobile summary sidebar if open after clicking a link
				closeAllMobileMenus();
			}
		});
	});

	// Dynamic link highlighting
	const sections = document.querySelectorAll("main .content section");

	// IntersectionObserver options also need dynamic offset
	const observerOptions = {
		root: null, // Use viewport as root
		rootMargin: `-${getHeaderOffsetHeight()}px 0px 0px 0px`, // Dynamic offset
		threshold: 0.1, // Trigger when 10% of section is visible
	};

	const observer = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			const id = entry.target.getAttribute("id");
			// Select both desktop and mobile corresponding links
			const correspondingLinks = document.querySelectorAll(
				`#summary-sidebar ul li a[href="#${id}"], .mobile-summary ul li a[href="#${id}"]`
			);

			correspondingLinks.forEach((link) => {
				if (link) {
					if (entry.isIntersecting) {
						// Remove active class from all links first (both desktop and mobile)
						allNavLinks.forEach((l) =>
							l.classList.remove("active-section")
						);
						// Add active class to the current link
						link.classList.add("active-section");
					}
				}
			});
		});
	}, observerOptions); // Use observerOptions here!

	sections.forEach((section) => {
		observer.observe(section);
	});

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
					const headerOffset = getHeaderOffsetHeight(); // Get dynamic height
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

	// fechamento do DOMContentLoaded. Não apagar
});
