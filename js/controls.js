document.addEventListener("DOMContentLoaded", () => {
	const body = document.body;
	const themeRadioButtonsDesktop = document.querySelectorAll(
		'input[name="theme"]'
	);
	const themeRadioButtonsMobile = document.querySelectorAll(
		'input[name="theme-mobile"]'
	);

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
});
