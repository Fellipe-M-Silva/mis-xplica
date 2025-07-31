document.addEventListener("DOMContentLoaded", () => {
	// Existing desktop menu toggles (ensure they are only active on desktop via CSS media queries)
	const summarySidebar = document.getElementById("summary-sidebar");
	const controlsSidebar = document.getElementById("controls-sidebar");
	const body = document.body;

	// Mobile menu elements
	const openSummaryButton = document.getElementById("open-summary-button");
	const openControlsButton = document.getElementById("open-controls-button");
	const mobileSummaryOverlay = document.getElementById(
		"mobile-summary-overlay"
	);
	const mobileControlsOverlay = document.getElementById(
		"mobile-controls-overlay"
	);
	const closeMobileMenuButtons =
		document.querySelectorAll(".close-mobile-menu"); // For both mobile menus

	// Function to close all mobile menus and overlays
	function closeAllMobileMenus() {
		mobileSummaryOverlay.classList.remove("active");
		mobileSummaryOverlay
			.querySelector(".mobile-summary")
			.classList.remove("active");
		mobileControlsOverlay.classList.remove("active");
		mobileControlsOverlay
			.querySelector(".mobile-controls")
			.classList.remove("active");
		body.classList.remove("no-scroll"); // Remove no-scroll if you add it
	}

	// Toggle Mobile Summary Menu
	if (openSummaryButton && mobileSummaryOverlay) {
		openSummaryButton.addEventListener("click", () => {
			closeAllMobileMenus(); // Close any other open menus first
			mobileSummaryOverlay.classList.add("active");
			mobileSummaryOverlay
				.querySelector(".mobile-summary")
				.classList.add("active");
			// Optional: Prevent scrolling on body when menu is open
			body.classList.add("no-scroll");
		});
	}

	// Toggle Mobile Controls Menu
	if (openControlsButton && mobileControlsOverlay) {
		openControlsButton.addEventListener("click", () => {
			closeAllMobileMenus(); // Close any other open menus first
			mobileControlsOverlay.classList.add("active");
			mobileControlsOverlay
				.querySelector(".mobile-controls")
				.classList.add("active");
			// Optional: Prevent scrolling on body when menu is open
			body.classList.add("no-scroll");
		});
	}

	// Close Mobile Menus via X button or overlay click
	closeMobileMenuButtons.forEach((button) => {
		button.addEventListener("click", closeAllMobileMenus);
	});

	// Close when clicking the transparent overlay
	mobileSummaryOverlay.addEventListener("click", (event) => {
		if (event.target === mobileSummaryOverlay) {
			// Only close if clicking the overlay itself
			closeAllMobileMenus();
		}
	});

	mobileControlsOverlay.addEventListener("click", (event) => {
		if (event.target === mobileControlsOverlay) {
			// Only close if clicking the overlay itself
			closeAllMobileMenus();
		}
	});

	// --- Adapt existing nav link and Intersection Observer for mobile nav links ---
	// Make sure to select both desktop and mobile nav links for smooth scroll and highlighting
	const allNavLinks = document.querySelectorAll(
		"#summary-sidebar ul li a, .mobile-summary ul li a"
	);
	const headerHeight = document.querySelector("header").offsetHeight;

	allNavLinks.forEach((link) => {
		link.addEventListener("click", function (e) {
			e.preventDefault();

			const targetId = this.getAttribute("href");
			const targetElement = document.querySelector(targetId);

			if (targetElement) {
				const elementPosition =
					targetElement.getBoundingClientRect().top;
				const offsetPosition =
					elementPosition + window.scrollY - headerHeight;

				window.scrollTo({
					top: offsetPosition,
					behavior: "smooth",
				});

				// Close the mobile summary sidebar if open after clicking a link
				closeAllMobileMenus();
			}
		});
	});

	// Adapt the Intersection Observer
	const sections = document.querySelectorAll("main .content section");

	const options = {
		root: null,
		rootMargin: `-${headerHeight}px 0px 0px 0px`,
		threshold: 0.1,
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
	}, options);

	sections.forEach((section) => {
		observer.observe(section);
	});

	// Smooth Scroll for "Ver Exemplos" Buttons (no changes needed here, as they target sections directly)
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
					const elementPosition =
						targetElement.getBoundingClientRect().top;
					const offsetPosition =
						elementPosition + window.scrollY - headerHeight;

					window.scrollTo({
						top: offsetPosition,
						behavior: "smooth",
					});
				}
			}
		});
	});

	// Add CSS to prevent scrolling when mobile menu is open (optional but recommended)
	// You'll need to add this CSS to your main.css or equivalent:
	// body.no-scroll {
	//     overflow: hidden;
	// }
});
