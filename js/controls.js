document.addEventListener("DOMContentLoaded", () => {
	const body = document.body;
	const themeRadioButtonsDesktop = document.querySelectorAll(
		'input[name="theme"]'
	);
	const themeRadioButtonsMobile = document.querySelectorAll(
		'input[name="theme-mobile"]'
	);

	// Function to get the system's preferred theme
	const getSystemTheme = () => {
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	};

	// Function to apply the theme
	const applyTheme = (theme) => {
		let actualThemeToApply = theme; // This will be the theme stored in localStorage

		if (theme === "default") {
			// If "default" is chosen, determine the actual theme from system preference
			body.removeAttribute("data-theme"); // Remove attribute to revert to system preference
			// No need to explicitly set data-theme="light" or "dark" here,
			// as removing the attribute will make CSS use prefers-color-scheme.
			// We'll update the radio buttons based on the *system's* current state.
		} else {
			// For 'light' or 'dark' explicit selections
			body.setAttribute("data-theme", theme);
		}

		// Store the user's explicit preference ('default', 'light', or 'dark')
		localStorage.setItem("user-theme", actualThemeToApply);

		// Update the checked state for ALL theme radio buttons (desktop and mobile)
		document
			.querySelectorAll('input[name="theme"], input[name="theme-mobile"]')
			.forEach((radio) => {
				if (radio.value === actualThemeToApply) {
					radio.checked = true;
				} else if (actualThemeToApply === "default") {
					// Special handling for "default" option:
					// Check the "default" radio button if it's the saved preference.
					// This ensures the UI reflects that "default" is active.
					if (radio.value === "default") {
						radio.checked = true;
					} else {
						radio.checked = false; // Uncheck others
					}
				} else {
					radio.checked = false; // Uncheck others
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

	// Listen for system preference changes (if theme is 'default' in localStorage)
	// This listener ensures that if the user's system theme changes while 'default'
	// is selected, your site's theme will also update.
	window
		.matchMedia("(prefers-color-scheme: dark)")
		.addEventListener("change", () => {
			if (localStorage.getItem("user-theme") === "default") {
				// If the user's saved preference is "default", re-apply it
				// to ensure the UI updates according to the new system preference.
				applyTheme("default");
			}
		});
});
