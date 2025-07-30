document.addEventListener("DOMContentLoaded", () => {
	// função para scroll suave ao clicar em um .footnotes
	const footnotes = document.querySelectorAll(".footnote");
	footnotes.forEach((footnote) => {
		footnote.addEventListener("click", (event) => {
			event.preventDefault();
			const targetId = footnote.getAttribute("href").substring(1);
			const targetElement = document.getElementById(targetId);
			if (targetElement) {
				targetElement.scrollIntoView({ behavior: "smooth" });
			} else {
				console.warn(`Elemento com ID ${targetId} não encontrado.`);
			}
		});
	});
});
