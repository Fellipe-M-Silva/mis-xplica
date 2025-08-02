document.addEventListener("DOMContentLoaded", () => {
	const body = document.body;
	// Select ALL theme radio buttons, both desktop and mobile
	const themeRadioButtonsDesktop = document.querySelectorAll(
		'input[name="theme"]'
	);
	const themeRadioButtonsMobile = document.querySelectorAll(
		'input[name="theme-mobile"]'
	);

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
				const headerOffset = getHeaderOffsetHeight();
				const elementPosition =
					targetElement.getBoundingClientRect().top;
				const offsetPosition =
					elementPosition + window.scrollY - headerOffset;

				window.scrollTo({
					top: offsetPosition,
					behavior: "smooth",
				});

				// Close mobile summary sidebar if open after clicking a link
				// closeAllMobileMenus();
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

	// Função para abrir o modal de Sobre
	const aboutButton = document.getElementById("open-about-button");
	const aboutButtonDialog = document.getElementById("about-dialog-content");
	const aboutButtonOverlay = document.getElementById("about-dialog-overlay");

	aboutButton.addEventListener("click", () => {
		if (aboutButtonDialog) {
			aboutButtonDialog.classList.add("active");
			aboutButtonOverlay.classList.add("active");
			body.classList.add("no-scroll"); // Prevent scrolling when modal is open
		}
	});
	// Função para fechar o modal de Sobre
	const closeAboutButton = document.getElementById("close-about-button");

	closeAboutButton.addEventListener("click", () => {
		if (aboutButtonDialog) {
			aboutButtonDialog.classList.remove("active");
			aboutButtonOverlay.classList.remove("active");
			body.classList.remove("no-scroll"); // Allow scrolling when modal is closed
		}
	});

	// Função para fechar o modal de Sobre ao clicar fora do conteúdo
	aboutButtonOverlay.addEventListener("click", (event) => {
		if (
			aboutButtonDialog &&
			aboutButtonDialog.classList.contains("active")
		) {
			aboutButtonDialog.classList.remove("active");
			aboutButtonOverlay.classList.remove("active");
			body.classList.remove("no-scroll"); // Allow scrolling when modal is closed
		}
	});

	// Função para fechar o modal de Sobre ao pressionar a tecla Escape
	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			if (
				aboutButtonDialog &&
				aboutButtonDialog.classList.contains("active")
			) {
				aboutButtonDialog.classList.remove("active");
				aboutButtonOverlay.classList.remove("active");
				body.classList.remove("no-scroll"); // Allow scrolling when modal is closed
			}
		}
	});

	// Seleciona todos os botões que devem ter scroll suave para seções MIS
	document.querySelectorAll(".scroll-to-mis-section").forEach((button) => {
		button.addEventListener("click", (event) => {
			event.preventDefault(); // Impede o comportamento padrão do link

			const targetId = button.dataset.target; // Pega o ID do alvo do atributo data-target
			const targetElement = document.querySelector(targetId); // Encontra o elemento alvo

			if (targetElement) {
				const headerHeight =
					document.querySelector("header").offsetHeight; // Pega a altura do seu cabeçalho dinamicamente
				const offset = 20; // Espaçamento extra em pixels

				// Calcula a posição para rolar
				const elementPosition =
					targetElement.getBoundingClientRect().top + window.scrollY;
				const offsetPosition = elementPosition - headerHeight - offset;

				// Rola para a nova posição
				window.scrollTo({
					top: offsetPosition,
					behavior: "smooth",
				});

				// Opcional: Atualizar a URL sem recarregar a página
				history.pushState(null, "", targetId);
			}
		});
	});

	// fechamento do DOMContentLoaded. Não apagar
});
